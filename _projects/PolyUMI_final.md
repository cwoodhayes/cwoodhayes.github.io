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

[Part 1](/projects/polyumi/) covers PolyUMI's hardware, firmware, and data collection system. This post covers the rest of the pipeline: preprocessing, dataset generation, training, and closed-loop deployment on a Franka FR3.

## Quick recap

PolyUMI is a handheld, wireless UMI-style gripper with an optical tactile finger (after [PolyTouch](https://polytouch.alanz.info/)) and a contact microphone, plus a matching end-effector for a Franka arm. One button press records four synchronized streams — vision (GoPro), touch (finger camera), vibration (contact mic), and proprioception (SLAM, or robot encoders on the arm) — with no external PC required at collection time.

## Data Pipeline: From Raw Session to Training-Ready Dataset

### The working format: `pzarr`

Recorded sessions are fetched and processed by `pingest`, PolyUMI's ingest CLI, into a zarr-based working format (`pzarr`). It is deliberately not a training format: it is a lossless, incrementally-writable store that each pipeline step reads from and writes back into, so re-running one step does not re-derive the others.

- No resampling at storage time; every stream keeps its own native-rate timestamps.
- Video and audio are kept at full fidelity. GoPro frames are decoded on demand from the source MP4 rather than re-encoded into the store — re-encoding inflated the store roughly 70x with no fidelity gain.
- Steps are tracked per scene and independently re-runnable, so partial and interrupted runs are recoverable.

Training and visualization formats — a UMI-compatible `ReplayBuffer`, MCAP, eventually LeRobot — are exports downstream of `pzarr`, not replacements for it.

> **PLACEHOLDER — diagram:** preprocessing pipeline flow, `pzarr` between raw ingest and the training/visualization exports. (candidate base: the existing `polyumi_working_format_schema.svg` / "ML data overview" diagrams, redrawn)

### The six preprocessing steps

Most of these resolve a clock or a reference frame that two data sources do not share.

1. **Chirp-based time alignment.** The finger camera and mic run on the Pi's clock, the GoPro on its own. At the start of each recording the Pi emits a linear frequency sweep from a piezo buzzer, captured by both the finger's air mic and the GoPro's mic. A matched filter recovers the chirp onset in both tracks; their difference is the offset between the two clock domains. No hardware sync line is required.
2. **Visual-inertial SLAM.** Following UMI, GoPro video and IMU are run through monocular-inertial [ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3) to recover a 6-DoF gripper trajectory, using a fork with fixes for the newer camera hardware and for pipeline integration.
3. **SLAM-to-OptiTrack alignment.** Where a scene has mocap coverage, an SE(3) transform between the SLAM and OptiTrack frames is fit by Horn's method, so the two trajectories can be compared or substituted.
4. **ArUco gripper width.** Fiducials on the fingers are detected in the GoPro footage and solved via fisheye-undistorted PnP to give a per-frame width signal.
5. **Canonical end-effector pose.** SLAM reports the GoPro's optical frame; OptiTrack reports a marker rigid-body frame. Neither is a frame a policy can train on. Policies train on poses relative to the episode's first, $$T_0^{-1}T_k$$, from which a shared world frame cancels — but a body-frame offset $$X$$ does not:

    $$
    \left(T_0 X\right)^{-1}\left(T_k X\right) = X^{-1}\left(T_0^{-1} T_k\right) X
    $$

    leaving a $$(R - I)x$$ term in the relative translation: roughly 4 cm of phantom motion for a 30° wrist rotation at the 7 cm GoPro-to-fingertip scale. Both sources are therefore re-expressed onto the fingertip midpoint via the GoPro, which is the only body the handheld gripper and the arm-mounted end-effector share.
6. **Contact-mic audio blocking.** The 16 kHz piezo signal is sliced into one block per GoPro frame, anchored on each frame's own timestamp rather than by a fixed sample-rate ratio (16000/59.94 is not an integer, so a fixed multiply walks off the audio over an episode). Blocks are at least as wide as the largest anchor gap, so concatenating them reconstructs a gapless waveform.

> **PLACEHOLDER — figure:** SLAM trajectory overlaid on the recorded scene (Foxglove 3D view with the GoPro image plane, if achievable).

> **PLACEHOLDER — figure:** contact-mic waveform sliced into per-frame blocks, illustrating step 6.

### Data organization

A local web UI (`polyumi-catalog`) indexes the recordings directory into SQLite and browses tasks, scenes, sessions, and exported datasets. It also fetches from the Pi, re-runs pipeline steps, and opens episodes in Foxglove. It is a thin layer over the pipeline scripts rather than part of them.

> **PLACEHOLDER — screenshot:** catalog UI browsing a scene / episode list.

## Model Training

`pingest export` produces a UMI-compatible `ReplayBuffer` (`.zarr.zip`) that the training code reads directly. Training runs in Docker, since the training fork (built on [UMI's diffusion policy codebase](https://github.com/real-stanford/universal_manipulation_interface)) needs a conda/CUDA environment that conflicts with a host ROS install. The same image serves both training and inference: checkpoints are `dill`-pickled and unpickle only against the dependency tree they were trained under. The image builds in two cached stages — the base UMI environment, then the shared inference-protocol library — so editing the wire protocol does not rebuild the conda environment.

The first policy brought up end-to-end was visuomotor (vision and proprioception only), to validate the path from data through training and serving to the arm. The multimodal policy adding touch and audio is in development with a collaborator working on the model architecture; because the inference protocol is a separate library from the training code, integrating a model revision is a checkpoint swap rather than a system change.

Adding the contact mic and finger camera as observations follows [ManiWAV](https://mani-wav.github.io/), with three deltas:

- The export stores raw waveform, not a precomputed spectrogram. Mel parameters stay hyperparameters, and ManiWAV's waveform-domain augmentations (background and robot-motor noise) remain possible.
- Audio blocks are causal — the frames *ending* at the observation instant. ManiWAV's forward convention would supply 33 ms of audio at our step rate that does not exist yet at inference.
- The finger camera has no ManiWAV counterpart. It exports at native crop resolution, leaving the encoder input size to the training config.

Neither modality is consumed by a policy yet; the data contract and exporter are complete, the architecture and training recipe are current work.

> **PLACEHOLDER — figure/screenshot:** training loss curves (visuomotor baseline) from Weights & Biases.

> **PLACEHOLDER — diagram:** model architecture — proprioception through an MLP, vision/touch/audio through pretrained ViT encoders (timm/AST), pooled and projected into a diffusion policy head predicting SE(3) EE pose + gripper width. (The ICRA poster figure covers this, if usable directly.)

## Model Deployment

### Inference system overview

Inference spans three machines:

- **A laptop**, running the ROS 2 node that ingests the camera streams, assembles observations, and previews commanded motion in Foxglove.
- **A NUC**, which owns the Franka control stack (`ros2_control`, the libfranka hardware interface) and runs the 1 kHz Cartesian impedance controller.
- **A GPU workstation**, which serves the policy and also runs the ROS client, so the observation payload never crosses the link between them.

The gripper is a FAULHABER-actuated CANopen mechanism (Anunth Ramaswami's driver), replacing the stock Franka Hand. The Hand cannot be servoed: libfranka exposes only a blocking `move()` that cannot be pre-empted, costing 363 ms even at zero travel, against a 5 Hz state stream. That bounds it to roughly 0.7–1.7 Hz against a 10 Hz setpoint stream, and makes transients shorter than about a second unrepresentable. The FAULHABER driver is a 200 Hz cyclic-synchronous-position tracker.

The three machines communicate over ROS 2, bridging a Kilted/Humble version gap through CycloneDDS on a dedicated link with unicast discovery. Each machine — including the gripper's Pi — stamps data on its own clock, and drift between them corrupts every derived latency silently and pushes NUC-stamped TF outside the laptop's buffer ("extrapolation into the past"). `chrony` on each machine, synced hierarchically to one reference host rather than to a public pool, holds them to sub-millisecond agreement.

> **PLACEHOLDER — diagram:** network and timing architecture across the four machines (Pi, laptop, NUC, GPU workstation), annotated with the chrony hierarchy and CycloneDDS domain boundaries.

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

In training data, every observation in a sample comes from the same GoPro frame grid. On the robot nothing is naturally synchronized, so live streams are aligned to the oldest measurement in the set. The pipeline is structured to support multi-rate streaming instead, for slow-fast architectures that do not sample every modality onto a common tick.

Latencies fall into three classes:

```
photon ──(latency.gopro)──> header.stamp ──(measured live)──> response ──(latency.arm_exec)──> motion
        CALIBRATE                          nothing to do                 CALIBRATE
```

`header.stamp` is the earliest instant the client can observe. Everything after it — color conversion, tick phasing, the POST, the network, the forward pass — is measured on every tick and converted directly into a count of leading actions to discard. Everything before it is calibrated offline: camera latency by filming a QR-encoded clock and differencing against the frame's stamp (UMI measures 0.125–0.17 s on the same GoPro-to-capture-card chain), arm execution latency by chirping the commanded pose and cross-correlating against where the TCP actually went. Proprioception latency is adopted rather than measured, at ~1 ms; isolating it would need external ground truth of the true pose, and UMI hardcodes the same constant for the same reason.

Gripper latency depends on which driver is running, and the two are not measured the same way. The FAULHABER tracker is a linear enough plant for cross-correlation against a chirp. The Franka Hand is not: its blocking moves are not a delayed linear echo of the command, and correlation against it returns phase lag rather than delay. The tell is that the estimate grows with how much of an accelerating sweep the probe sees (0.41 → 0.94 → 1.04 → 1.20 s), where a transport delay is invariant to that. The Hand path instead carries an explicit model of its trapezoidal move profile and schedules setpoints against it.

The binding constraint is that the chunk must outlast the latency budget:

$$
t_{\mathrm{obs\ age}} + t_{\mathrm{exec}} < n_{\mathrm{action\ steps}} \cdot \Delta t_{\mathrm{action}}
$$

If it does not hold, every action has already elapsed on arrival and the arm does not move at all, while every other indicator reads healthy.

Two runtime figures separate the common failure modes. The round trip is split into the forward pass (timed through the server's own sync point) and the remainder, which isolates GPU contention from link time. And the count of actions surviving the staleness trim per chunk tracks headroom directly — on this setup it exposed the laptop's USB Fast Ethernet adapter, whose 100 Mbit cap puts a ~24 ms floor under every inference. Sending frames as raw `uint8` rather than base64 `float32` cut the observation payload from 1.6 MB to 0.30 MB.

> **PLACEHOLDER — diagram:** end-to-end latency diagram, photon to motion, with each calibrated/measured/adopted segment labeled.

> **PLACEHOLDER — screenshot:** Foxglove latency-monitor plot during a live rollout.

## Evaluation

Evaluation is in progress and is the subject of an upcoming publication. Planned ablations target which modalities contribute under which conditions — in particular whether the contact mic supplies only a binary contact signal or also discriminates materials and state changes. The evaluation tasks are chosen to stress what camera-only imitation struggles with: contact-rich dexterous tasks (pipetting, threading a lid), dynamic tasks infeasible to teleoperate (tossing an object into a bin), and conditions that degrade one modality, such as lighting changes during a rollout.

> **PLACEHOLDER:** evaluation results — success rates per task and per ablation.

## Lessons Learned

*(Skeleton — claims and their supporting evidence. Editorial voice to be written.)*

**1. Latency is the hardest problem at inference, and scales with both modality count and node count.** The lower the total latency, the less the model must predict the future to cover it. This setup runs four modalities across four nodes at inference. Variance matters as much as the mean: prefer wired links, measure what is measurable at runtime, calibrate the rest offline.

**2. Control architecture is the unpublished part.** A well-tuned impedance controller, trajectory interpolation, and real-time-capable gripper control are load-bearing and largely absent from the papers. The stiffness/clip interaction above is the concrete example: it converts an unbounded spring into a 20 N ceiling without giving up free-space tracking accuracy. On the gripper, a driver that cannot track at the policy's rate caps what the policy can express, independent of the model.

**3. Fully embodiment-agnostic data collection does not hold at this scale.** Demonstrations must respect the target arm's kinematics — workspace limits, singularities, not bottoming out on the table. Operators must move slowly enough that the policy's control rate captures contact events; a handheld gripper can record trajectories faster than the arm can usefully reproduce. SLAM quality gates everything downstream, and is sensitive to details like masking the gripper hardware out of the camera view, since those pixels carry zero parallax and give every keyframe the same descriptor signature.

**4. The gripper/end-effector domain gap has to be designed out, not corrected afterward.** Both embodiments report the same physical point, reached through the GoPro, so poses are directly comparable without a learned correction. The same constraint recurs at smaller scale: the training and inference image transforms are pinned to identical output digests across two OpenCV versions in two Python environments, and the audio path augments with background and robot-motor noise to close the acoustic gap.

**5. Data organization and visualization are load-bearing infrastructure.** The catalog UI, Foxglove playback and livestream, and self-describing exports (each buffer records the calibration constants and preprocessing conventions it was built under) are what make the system inspectable. Symbolic reasoning tools handle a class of bugs well; system-level and physical-intuition debugging still depends on being able to see and hear what the system is doing.

**Biggest takeaway.** A working UMI-based imitation learning policy requires substantial systems and infrastructure investment, and each added modality compounds it. The system has to perform well in a conventional engineering sense before model-side improvements can be evaluated at all.

Timeline across five months: ~2 months hardware and systems bring-up, 1 month firmware and data organization (both in [Part 1](/projects/polyumi/)), then ~2 months preprocessing, ~2 months inference bring-up (half of it latency and control work), and ~1 month full-system iteration.

## Next Steps

- Wire the contact mic and finger camera into the live inference path; the data contract and exporter are done, the architecture and serving side are not.
- Run the ablations and evaluation tasks above.
- Continue on SLAM robustness.
- Publish.

---

## Citation

{% include citation.html bibtex="@inproceedings{hayes2026polyumi,
  title     = {PolyUMI: Visual + Auditory + Tactile Manipulation Platform for Imitation Learning},
  author    = {Hayes, Conor Wood},
  booktitle = {IEEE ICRA 2026 Workshop on Contact-Rich Robotic Manipulation (CR2)},
  year      = {2026},
  url       = {https://openreview.net/forum?id=Ou39QMiCMP}
}" %}
