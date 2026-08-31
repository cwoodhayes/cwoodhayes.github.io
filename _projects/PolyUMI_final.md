---
name: PolyUMI Part II - Policy Training & Deployment
tools: [Diffusion Policy, Imitation Learning, Docker, PyTorch, Cartesian Impedance Control, ROS 2, CycloneDDS, SLAM, Franka FR3, Python]
category: personal
preview_gif: /assets/msr/polyumi/PLACEHOLDER_inference_demo.mp4
description: Turning multimodal demonstrations into a trained diffusion policy running closed-loop on a real arm.
permalink: /projects/polyumi-policy/
date: 2026-08-30
mathjax: true
---

> **PLACEHOLDER — hero video:** the "main demo" cut — red-block-in-cup policy rollout, intercut with a gear pickup and a water-bottle-shake episode, chosen to make the modalities (touch, audio, vision, proprioception) legible at a glance. Should read clearly as "wireless demo on gripper" -> "trained policy running on arm."

# PolyUMI, Part II: Preprocessing, Training, and Deploying a Multimodal Manipulation Policy

This is the second half of the PolyUMI writeup. [Part 1](/projects/polyumi/) covers the hardware, firmware, and data-collection system: the gripper, the touch-sensing finger, and the pipeline that gets a clean, synchronized recording off the device and onto a PC. This post picks up from there — it's about what happens to that recording between "a folder of MP4s and WAV files" and "a policy moving a real robot arm," and about deploying that policy back onto hardware.

Framed a level up: PolyUMI is a platform for multimodal robot learning — data collection, preprocessing, training, and inference — built specifically so that iterating on a policy means iterating on more than just camera images. Touch and audio are first-class citizens in the data format from the start, even though (as you'll see below) actually training on them is still in progress.

## Quick recap

If you haven't read Part 1, the short version: PolyUMI is a handheld, fully wireless UMI-style gripper with an added optical tactile finger (based on [PolyTouch](https://polytouch.alanz.info/)) and a contact microphone, plus a matching end-effector for a Franka arm. A single button press records four synchronized data streams — vision (GoPro), touch (finger camera), vibration (contact mic), and proprioception (SLAM or robot encoders) — with no PC required until you're ready to pull the data off and process it.

That's where this post starts.

## Data Pipeline: From Raw Session to Training-Ready Dataset

### The working format: `pzarr`

Everything landing off the gripper (or streamed live from the arm) goes through `pingest`, PolyUMI's preprocessing CLI, into a zarr-based working format I call `pzarr`. The design goal here was specifically **not** to build a training-ready format — it's meant to be a lossless, incrementally-writable superset that every pipeline step reads from and writes back into, so that re-running one step doesn't mean re-deriving everything else. Concretely, that means:

- No resampling onto a common time grid at storage time — every stream keeps its own native-rate timestamps.
- Full-fidelity video and audio are preserved (GoPro frames are decoded on demand from the source MP4 rather than re-encoded into the store — early on I found that re-encoding inflated storage ~70x for zero fidelity gain).
- Each pipeline step is independently re-runnable and tracked, so a partial or interrupted run doesn't corrupt anything downstream.

Downstream, training-ready formats (a UMI-compatible `ReplayBuffer`/Zarr, MCAP for visualization, eventually LeRobot) are all *exports* off of this working format, not the format itself.

> **PLACEHOLDER — diagram:** preprocessing pipeline flow, `pzarr` sitting between raw ingest and the various training/visualization exports. (candidate base: the existing `polyumi_working_format_schema.svg` / "ML data overview" diagrams, redrawn for clarity)

### The six preprocessing steps

Each scene runs through six steps, most of which solve a "these two things were never in the same reference frame or clock" problem:

1. **Chirp-based time alignment.** The finger camera/mic (on the Pi's clock) and the GoPro (on its own clock) need to agree on time to better than a video frame. At the start of each recording, the Pi emits an audible chirp (a linear frequency sweep from a piezo buzzer); that chirp gets picked up by both the finger's air mic and the GoPro's onboard mic. In post-processing, a matched filter finds the chirp's onset in both audio tracks, and the offset between them becomes the precise time alignment between the two clock domains. This was one of the more satisfying novel bits of this project — cheap, robust, and doesn't need any special hardware sync line between the two cameras.
2. **Visual-inertial SLAM (ORB-SLAM3).** Following the original UMI paper, GoPro video + IMU goes through a monocular-inertial SLAM pipeline to recover a 6DoF pose trajectory for the gripper. I run a fork of [ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3) with fixes for newer camera hardware and integration with the rest of the pipeline. This step is finicky in ways I'll get into in "Lessons Learned" below.
3. **SLAM-to-OptiTrack alignment.** When a scene has OptiTrack mocap coverage (used for indoor scenes, both to validate SLAM and as an alternative/higher-quality pose source), an SE(3) transform between the SLAM and OptiTrack reference frames is computed via [Horn's method](https://en.wikipedia.org/wiki/Kabsch_algorithm) — least-squares optimal alignment between paired point sets — so the two trajectories can be directly compared or substituted for each other.
4. **ArUco-based gripper width.** Fiducial markers on the gripper fingers, visible in the GoPro footage, are detected and triangulated (fisheye-undistorted PnP) frame-by-frame to recover a continuous gripper-width signal.
5. **Canonical end-effector pose.** This step turns a raw pose source (SLAM or OptiTrack, whichever a scene has) into a policy-usable trajectory. It's a small piece of geometry that's easy to get wrong, so it's worth spelling out: SLAM reports the pose of the GoPro's own optical frame, and OptiTrack reports the pose of an arbitrary rigid-body frame wherever the mocap markers happen to be stuck. Neither is the frame a policy should train on. Since a diffusion policy trains on *relative* poses (`inv(T_0)·T_k`, this pose relative to the episode's start), a shared **world** frame conveniently cancels out of that expression — but a **body** frame offset does not; it conjugates the transform and leaks position error into the action (`inv(X)·(inv(T_0)·T_k)·X`, roughly `(R-I)·x` of phantom translation for an offset `x` and rotation `R`). So both sources are re-expressed onto one shared body frame — the fingertip midpoint — via the GoPro, which is the one physical point both the handheld gripper and the arm-mounted end-effector share.
6. **Contact-mic audio blocking.** The piezo contact mic (16kHz, Pi clock) gets sliced into one audio block per GoPro frame, anchored by timestamp (not by a fixed sample-rate ratio, since 16000/59.94 isn't an integer) so that concatenating blocks reconstructs a gapless waveform. This is prep work for the audio-conditioned policy described below.

> **PLACEHOLDER — figure:** SLAM trajectory overlaid on the recorded scene (Foxglove 3D view with the GoPro image plane, if that's achievable — worth checking whether Foxglove's 3D panel can render camera frustums against a mesh here).

> **PLACEHOLDER — figure:** contact-mic waveform sliced into per-frame blocks, illustrating step 6.

### Data organization

A postprocessing pipeline this deep produces a lot of derived artifacts per scene, so I built a small local web UI ("catalog") for browsing tasks, scenes, sessions, and exported datasets, backed by a SQLite index over the recordings directory. It's intentionally the lowest-rigor code in the whole repo — a thin, disposable UI layer over the "real" pipeline scripts — but it's been essential for staying oriented across a few hundred episodes, several scenes, and a handful of dataset export versions. It also gives one-click access to Foxglove playback and to re-running pipeline steps on a scene.

> **PLACEHOLDER — screenshot:** catalog UI browsing a scene / episode list.

## Model Training

Once a scene is preprocessed, `pingest export` produces a training-ready dataset: a UMI-compatible `ReplayBuffer` (Zarr) that the diffusion policy training code can read directly. Training itself runs inside Docker — deliberately, since the training fork (built on [UMI's diffusion policy codebase](https://github.com/real-stanford/universal_manipulation_interface)) wants a specific Conda/CUDA environment that actively fights a ROS install on the same machine. The same image serves both training and inference, which matters more than it sounds: checkpoints are `dill`-pickled, so they need to unpickle against the *exact* dependency tree they were trained with. Splitting image-build into two cached layers (base UMI environment, then the shared inference-protocol library layered on top) means editing the shared wire-protocol code doesn't force a 20+ minute rebuild of the whole conda environment.

The first model I brought up end-to-end was a standard visuomotor diffusion policy — vision + proprioception only — mostly to validate the full pipeline (data → training → serving → arm) before adding any complexity. From there, the plan is to bring up the full multimodal model (touch + audio + vision), which is being developed in collaboration with a colleague working on the model architecture side. One of the nicer outcomes of decoupling the inference protocol from the training code the way I did is that this collaboration is genuinely lightweight: a model update can be trained and running live on the arm with well under a half hour of integration work (plus the actual training run).

**Adding the contact mic and finger camera as observations** follows the recipe from [ManiWAV](https://mani-wav.github.io/), with a few deltas forced by our hardware:
- Raw waveform, not a precomputed spectrogram, is what gets stored and exported — this keeps waveform-domain data augmentation (background noise, robot-motor noise) possible at train time, and keeps mel-spectrogram parameters as a tunable hyperparameter rather than something baked into the dataset.
- Audio blocks are aligned *causally* (ending at, not starting at, the observation instant) rather than ManiWAV's forward-looking convention, since at our ~30Hz effective step rate their convention would require ~33ms of audio that doesn't exist yet at inference time.
- The finger camera is a modality with no ManiWAV analogue — it's exported at native crop resolution and needs its own resize/downsampling decisions at train time.

This part of the model is still in progress (data plumbing exists end-to-end; the audio+touch model architecture and training recipe are the current work), so I don't have policy comparisons to show yet.

> **PLACEHOLDER — figure/screenshot:** training loss curves (visuomotor baseline) from Weights & Biases.

> **PLACEHOLDER — diagram:** model architecture — proprioception through an MLP, vision/touch/audio through pretrained ViT-style encoders (timm/AST), pooled and projected into a diffusion policy head predicting SE(3) EE pose + gripper width. (This is well summarized already in the ICRA poster figure, if that's usable directly.)

## Model Deployment

### Inference system overview

Running the trained policy closed-loop on the Franka arm turned into its own small distributed systems project. The stack spans three machines:

- **A laptop**, running the ROS 2 node that ingests the GoPro/finger streams, packages observations, and previews planned motion in Foxglove.
- **The arm's control computer (a NUC)**, which owns the low-level Franka control stack (`ros2_control`, the hardware interface, safety limits) and runs a custom 1kHz Cartesian impedance controller that tracks the policy's output.
- **A GPU workstation**, which runs the diffusion policy inference server *and* (in the current setup) doubles as the ROS client that talks to the NUC — so the network hop between "observation ready" and "action requested" never leaves that box.

The gripper itself is driven by a FAULHABER-actuated, CANopen-controlled mechanism — a from-scratch replacement for the stock Franka Hand, built by a labmate (credit: Anunth Ramaswami). This mattered more than I expected going in: the stock Franka Hand can't be servoed at all — its firmware only exposes a blocking `move()` command that can't be pre-empted once issued, with ~360ms of fixed overhead even for zero travel and a state update rate of only 5Hz. That's fine for a fixed pick-and-place demo; it's a serious problem for a *learned, continuously-corrected* policy that wants to change its mind about gripper width every 100ms. The FAULHABER replacement is a proper 200Hz position tracker, which is what actually makes closed-loop gripper control from a learned policy feasible here.

**Network & timing architecture:** all three machines communicate over ROS 2 (bridging a Kilted/Humble version gap via CycloneDDS, on a dedicated point-to-point link with unicast discovery rather than relying on multicast). Getting this right surfaced a problem I hadn't fully appreciated going in: every one of these machines — laptop, NUC, GPU workstation, *and* the gripper's Raspberry Pi — stamps its own data with its own clock, and any drift between them silently corrupts every downstream latency measurement and, worse, can push TF lookups outside their buffer window ("extrapolation into the past" errors on the arm). The fix is boring but essential: `chrony` on every machine, synced in a strict hierarchy to one reference host, gets clock agreement to sub-millisecond — well below what NTP's default pool-syncing systemd-timesyncd achieves. This is the "chrony layout" I'd flagged as worth documenting: it's unglamorous infrastructure, but skipping it means every timing number downstream of it is quietly wrong.

> **PLACEHOLDER — diagram:** network/timing architecture across the four machines (Pi, laptop, NUC, GPU workstation), annotated with the chrony sync hierarchy and the CycloneDDS domain boundaries.

### Control: the Cartesian impedance controller

PolyUMI follows the two-layer hierarchy standard for this setting: the policy emits an action chunk of absolutely-timed end-effector waypoints at roughly 10 Hz, and a real-time controller tracks it at 1 kHz. The controller is a port of [SERL's Franka impedance controller](https://github.com/rail-berkeley/serl_franka_controllers) ([paper](https://arxiv.org/abs/2401.16013)), itself derived from `franka_ros`'s reference implementation, and closely related to the law polymetis runs for UMI.

Given measured joint state $$(q, \dot{q})$$, the base-frame Jacobian $$J \in \mathbb{R}^{6\times7}$$, and a reference pose from the interpolator, the pose error $$e \in \mathbb{R}^6$$ stacks the translation error with the vector part of the difference quaternion, hemisphere-corrected and rotated into the base frame. The commanded torque is

$$
\tau = J^\top\left(-K\bar{e} - D\,J\dot{q} - K_i e_I\right) + \left(I_7 - J^\top \left(J^\top\right)^{+}_{\lambda}\right)\left[K_n\left(q_n - q\right) - 2\sqrt{K_n}\,\dot{q}\right]
$$

where $$\bar{e}$$ is the per-axis clipped error and the second term resolves the arm's redundant seventh DOF through a damped pseudo-inverse ($$\lambda = 0.2$$). Joint 1 takes a stiffer nullspace tier (100 against 0.2) so base rotation is pinned while the elbow floats; $$K_i$$ is zero in our configuration. The result is rate-limited against the previous commanded torque at 1 Nm per cycle, which `libfranka` requires.

| Parameter | Value | |
|---|---|---|
| $$K_{\mathrm{trans}}$$ / $$D_{\mathrm{trans}}$$ | 2000 N/m / 89 Ns/m | $$D \approx 2\sqrt{K}$$, critically damped |
| $$K_{\mathrm{rot}}$$ / $$D_{\mathrm{rot}}$$ | 150 Nm/rad / 7 Nms/rad | under-damped, as in SERL and UMI |
| $$c_{\mathrm{trans}}$$ / $$c_{\mathrm{rot}}$$ | 0.01 m / 0.05 rad | error clip |
| $$K_n$$ / $$K_{n,1}$$ | 0.2 / 100 | nullspace |

Bounding interaction force is essential for contact-rich tasks, but lowering stiffness to achieve it costs tracking accuracy in free space. Following SERL, the error is instead clipped at the real-time layer, which caps commanded force at $$K_{\mathrm{trans}} c_{\mathrm{trans}} = 20$$ N regardless of how far the reference has run from the measured pose — a stalled chunk and a policy commanding a pose inside the table produce the same bounded push. UMI's spring is softer (750 N/m) but unbounded. $$c_{\mathrm{trans}}$$ is therefore the single knob for contact force, and the FR3's collision-reflex thresholds, which fire on estimated external force, must be raised alongside it.

The interpolator is a C++ port of UMI's `PoseTrajectoryInterpolator`: piecewise-linear in position, slerp in orientation, over absolutely-timed waypoints. Its essential function is splicing — merging an arriving chunk into a trajectory already being consumed, without discontinuity at the current instant — which is what allows 10 Hz chunks to drive a loop that never stops between them. Waypoint speed is capped at 1.0 m/s and $$\pi$$ rad/s, stretching a segment rather than letting the reference outrun the arm, since that lead distance sets contact force alongside the clip.

Finally, the policy's body frame is the fingertip midpoint, while the arm reports its Jacobian roughly 15 cm away at the hand frame. A spring anchored at the wrong point converts orientation error into fingertip translation, so the Jacobian is shifted onto the TCP column-wise, $$J_{v,i} \leftarrow J_{v,i} + J_{\omega,i} \times r$$, with the angular rows unchanged.

> **PLACEHOLDER — diagram:** control block diagram — action chunk → interpolator (with speed clamps) → pose error → clip → impedance law + nullspace projection → torque-rate saturation → FCI, with the 10 Hz / 1 kHz rate boundary marked.

### Latency and synchronization

**Sync approach:** the policy is trained on data where "simultaneous" observations really are simultaneous — everything in a training sample comes from the same GoPro frame grid. At inference, nothing is naturally synchronized, so the current approach aligns every live observation stream to the *oldest* one in a chunk (the classic diffusion-policy-style setup). The system is built so this is a strategy, not a hard assumption — it's set up to support multi-rate streaming down the line, for slow-fast model architectures that don't want everything sampled to a common tick.

**Latency:** getting a policy to run acceptably in real time meant treating latency as a first-class thing to measure, not just something to tolerate. Every real system has a version of this pipeline:

```
photon ──(gopro capture latency)──> observation timestamped ──(network + inference)──> response ──(execution latency)──> motion
        CALIBRATE OFFLINE                                    MEASURED LIVE               CALIBRATE OFFLINE
```

Some numbers can only be measured live (the actual network + GPU round trip, every tick); some have to be calibrated offline once per hardware setup (camera capture latency, via filming a clock encoded as a QR code and checking how far behind the frame's timestamp runs; arm execution latency, via cross-correlating a commanded sinusoidal chirp against the arm's actual measured motion); and a couple of latencies are effectively un-measurable with the equipment on hand and get a small adopted constant instead (proprioception latency, since libfranka timestamps at read and the residual is well under a millisecond).

One non-obvious fact that cost me real debugging time: **the gripper's own latency depends entirely on which gripper driver is running**, since the two have completely different response characteristics — a 200Hz position tracker (FAULHABER) is well-modeled by cross-correlation against a commanded chirp, while the stock Franka Hand's blocking, non-preemptable `move()` calls are not a "delayed linear echo" of the command at all, and trying to characterize it via cross-correlation gives you a number that looks plausible and is wrong (I found this out the hard way — the same probe run reported a "latency" that grew with how much of an accelerating test signal it saw, which is the signature of *phase lag*, not a fixed delay). The Franka Hand path ended up needing its own explicit kinematic model of the hand's trapezoidal-velocity move profile just to schedule setpoints sensibly, which was more engineering effort than I expected to spend on "make the gripper open and close."

The single most important correctness constraint, once everything above is measured: **the action chunk has to outlast the whole latency budget** — `observation age + execution latency < chunk duration`. If it doesn't, every action in the chunk has already logically "elapsed" by the time it would execute, and the arm does nothing at all, while every other system indicator looks perfectly healthy. This is the kind of failure mode that's silent enough to burn hours before you think to check it.

At the systems level, two runtime numbers turned out to matter most for actually debugging a live rollout: the split between GPU forward-pass time and pure network/serialization overhead (so a slow rollout can be diagnosed as "busy GPU" vs. "bad link" instead of guessed at), and a simple count of how many actions in each received chunk were too stale to use — which, when it climbs, is usually your first sign that the network link (in my case, a surprisingly low-bandwidth USB-ethernet adapter) is the actual bottleneck rather than the model.

> **PLACEHOLDER — diagram:** end-to-end system latency diagram, from photon to motion, with each calibrated/measured/adopted segment labeled.

> **PLACEHOLDER — screenshot:** Foxglove latency-monitor plot during a live rollout.

## Evaluation

Evaluation is ongoing as of this writing, and is the focus of the next phase of the project, leading toward a fuller publication in the coming months. The plan is a set of ablations targeted at the actual research question behind this whole platform: which sensor modalities matter, when, and how do they interact? (For instance: does the contact mic give the model a binary contact/no-contact signal, or can it learn to discriminate materials and contact state changes?) Alongside the ablations, I'm designing evaluation tasks specifically chosen to stress capabilities that camera-only imitation learning struggles with — contact-rich dexterous tasks (pipetting, screwing a lid onto a jar), dynamic tasks that are infeasible to teleoperate (tossing an object into a bin), and adversarial conditions where one modality degrades (lighting changes) to see whether the model can lean on the others.

> **PLACEHOLDER:** evaluation results, once available — success-rate tables/plots per task and per ablation.

## Lessons Learned

A few things stood out enough, across the full five months of this project, that I think they're worth stating plainly for anyone else bringing up a system like this.

**1. Latency is probably the hardest problem to solve at inference time, and it gets harder with every modality and every compute node you add.** The lower the total system latency, the less the model has to implicitly predict the future to compensate for it. I ended up with four simultaneous modalities and four compute nodes at inference (three at data collection time), and difficulty scaled with both. Nondeterminism is the enemy here more than raw latency — using wired connections where possible, measuring what you can at runtime, calibrating out what you can't with offline procedures (see the whole latency-calibration discussion above), and just generally working to reduce both the mean *and* the variance of every delay in the pipeline.

**2. The control architecture is the unglamorous, unpublished "secret sauce."** A well-tuned, fast Cartesian impedance controller for soft, compliant handling, with proper trajectory interpolation (and probably some smoothing for jittery raw policy outputs), matters enormously and is easy to under-invest in relative to the model itself. Almost none of this shows up in the papers, and the choices are not obvious from first principles — the stiffness/error-clip interaction described above, which converts an unbounded spring into one with a hard 20 N ceiling, is the difference between a policy that can safely explore contact and one that leans on the table with everything the arm has. On the gripper side specifically: real-time-capable control is not optional if you actually want a policy to control gripper width at the frequency it was trained to. Finding out the Franka Hand fundamentally could not do this was a genuinely useful (if expensive) lesson.

**3. Naive, fully embodiment-agnostic data collection is an ideal, not something that holds up at this scale.** In practice there are real tricks to collecting good UMI-style data: episodes need to respect the target arm's kinematics (workspace limits, avoiding singularities, not bottoming the gripper out on a surface), and the operator needs to move deliberately enough that the policy's control frequency actually captures the moments that matter — especially contact events. A UMI-style gripper can record *much* faster trajectories than it should, since nothing stops you from moving your hand faster than the arm can safely track; doing so usually produces worse policies, not more expressive ones. And good SLAM performance is essential and genuinely tricky — even after real effort on mask correctness (a wrongly- or un-masked view of the gripper's own rigid hardware breaks feature tracking and relocalization outright) and on where the SLAM step's compute time actually goes, it's a "you get the hang of it, but only through trial and error" kind of problem.

**4. Domain gap between the handheld gripper and the arm-mounted end-effector has to be designed out from day one, not patched afterward.** The single biggest lever here was making sure both embodiments share one physical reference point (the fingertip midpoint, reached identically through the GoPro on both) so that pose data collected on the gripper and pose data reported by the arm are directly comparable without a learned or hand-tuned correction. The same idea shows up smaller-scale everywhere: matching the exact pixel crop/resize pipeline between training-time and inference-time camera frames (down to pinning identical output digests across two different OpenCV versions in two different Python environments), and, for the audio-conditioned model, deliberately augmenting training data with background and robot-motor noise specifically to close the acoustic domain gap between a handheld recording and a robot-mounted one.

**5. Data organization and visualization work is not optional overhead — it's what makes everything else debuggable.** Between the catalog UI, Foxglove for both live streaming and episode playback, and self-describing exports (every trained checkpoint's metadata records exactly which calibration constants and preprocessing choices produced its training data), the ability to *look* at the system — visually, and sometimes acoustically — ended up being the most powerful debugging tool available. An LLM is genuinely excellent at symbolic reasoning and can help enormously with a certain class of bug, but it generally can't do the system-level, physical-intuition kind of reasoning this project needed most; that has to come from being able to see and hear what the system is actually doing.

**Biggest takeaway:** getting a UMI-based imitation learning policy working end-to-end requires a real investment in systems and infrastructure, and every modality you add makes that investment larger, not additive. It's tempting to treat this as overhead standing between you and "the actual ML," but it isn't — the system has to be performing *really well*, in a fairly old-fashioned engineering sense, before model-side improvements can even be evaluated fairly, let alone matter.

Roughly, the five months broke down as: ~2 months of hardware + systems bring-up (getting all four data signals in cleanly), 1 month of firmware + basic data organization (both covered in [Part 1](/projects/polyumi/)), then the work covered in this post — ~2 months of preprocessing/dataset pipeline work, ~2 months bringing up the inference system (about half of which was latency and control tuning to get to the first near-successful task attempt), and ~1 month of full-system iteration.

## Next Steps

- Finish wiring the contact-mic and finger-camera modalities into the live inference path (the data contract and exporter are done; the model architecture and the serving-side plumbing are the remaining work).
- Run the planned ablation studies and task-based evaluations described above.
- Continue iterating on SLAM robustness — it remains the trickiest link in the data pipeline.
- Publish :)

---

## Citation

{% include citation.html bibtex="@inproceedings{hayes2026polyumi,
  title     = {PolyUMI: Visual + Auditory + Tactile Manipulation Platform for Imitation Learning},
  author    = {Hayes, Conor Wood},
  booktitle = {IEEE ICRA 2026 Workshop on Contact-Rich Robotic Manipulation (CR2)},
  year      = {2026},
  url       = {https://openreview.net/forum?id=Ou39QMiCMP}
}" %}
