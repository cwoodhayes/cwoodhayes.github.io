---
name: PolyUMI - Touch + Vision + Audio Manipulation Data Collector
tools: [Tactile Sensing, Robotic Manipulation, Imitation Learning, Diffusion Policy, Raspberry Pi, Python, SLAM, ROS 2]
category: personal
preview_gif: /assets/msr/polyumi/umi_demo.mp4
description: A novel multi-modal data collection system for robot imitation learning.
permalink: /projects/polyumi/
date: 2026-02-01
---

<figure class="project-figure">
<iframe width="720" height="405" src="https://www.youtube.com/embed/lprvheXONTs?autoplay=1&loop=1&playlist=lprvheXONTs&mute=1&showinfo=0&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</figure>

# PolyUMI: Visual + Auditory + Tactile Manipulation Platform for Imitation Learning

<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/polyumi" %}
  {% include github-button.html url="https://cad.onshape.com/documents/51445b7d15b8d189878323f1/w/358bf42f47b2b1f2a511decc/e/9a3e51ec7a29118eecf3283b" label="Gripper CAD" icon="onshape" %}
  {% include github-button.html url="https://cad.onshape.com/documents/e674950e5409bace1adf9ce3/w/92b242e38e2c65427b8cb5db/e/0ded13219a9c097fb326bd02" label="Franka Mount CAD" icon="onshape" %}
</div>

*(note - this page is still a work in progress)*

PolyUMI is a real-time data collection & control platform for robotic imitation learning, which unifies the following sensor modalities in a single end-effector:
- **touch** (via a custom optical tactile-sensing finger, based off of [PolyTouch](https://polytouch.alanz.info/)) - *10fps 540x480 MJPEG video (MP4)*
- **mechanical vibration** (via a contact microphone fixed to the finger housing) - *16kHz PCM audio (WAV)*
- **vision** (via GoPro camera on wrist + finger camera peripheral vision) - *60fps 1920x1080 MJPEG video (MP4) + 10fps 540x480 MJPEG video*
- **proprioception** (via monocular inertial SLAM from GoPro + IMU in gripper, or robot joint encoders + FK in embodiments)

It combines the [Universal Manipulation Interface (UMI)](https://umi-gripper.github.io/) platform with a custom touch-sensing finger inspired by the [PolyTouch tactile + audio sensor](https://polytouch.alanz.info/), with hardware, firmware, and software for the above built from scratch for a modern robotics stack (ROS2 Kilted + Python 3.13 + Foxglove visualizer).

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/dataflow_overview.png" alt="PolyUMI platform overview" style="width: 100%; max-width: 80%; height: auto;" /></a>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/poly_plus_umi_eq.png" alt="PolyTouch + UMI =" /></a>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/both_cad.png" alt="Gripper + EE CAD" style="width: 100%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/both_irl.png" alt="Gripper + EE IRL" style="width: 100%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/foxglove_tripod.png" alt="Live visualization of gripper audiovisual data" style="width: 100%; height: auto;" /></a>
</div>

## System Overview

### PolyUMI Gripper
UMI-style gripper supporting the PolyUMI touch sensing finger (designed & manufactured by me, with UMI's open source gripper as a starting point)
  - Enables recording of manipulation demonstrations with the touch of a button
  - ~5hrs of battery life, cable free, no need for any external PC to record

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/system_block_diagram.png" alt="PolyUMI platform overview" style="width: 100%; max-width: 80%; height: auto;" /></a>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/gripper_cad.png" alt="PolyUMI gripper CAD" style="width: 100%; max-width: 80%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/gripper_irl.JPG" alt="PolyUMI gripper IRL" style="width: 100%; max-width: 80%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/finger_exploded.png" alt="PolyUMI finger exploded view" style="width: 100%; max-width: 80%; height: auto;" /></a>
</div>

TODO manufacturing compilation video + link to build docs.


### PolyUMI End-Effectors
#### Franka Hand
PolyUMI end-effector for the [Franka Hand](https://franka.de/accessories) (designed & manufactured by me)
- Maintains the same spatial relationships between sensors & fingers as the PolyUMI gripper to aid in policy transfer
- Separate gripper adapter parts (in pink) enable reuse of the Gripper's finger designs

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/franka_ee.jpg" alt="Franka EE IRL" style="width: 100%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/franka_ee_exploded.png" alt="Franka EE CAD Exploded View" style="width: 100%; height: auto;" /></a>
</div>

#### Others
System can easily support other arms, humanoids, etc --- anything with a wrist. Just need an end-effector hardware design for each.

### Data Pipeline
All firmware and software is written from scratch, with the following priorities:
1. **As close to turnkey as possible.** 
  - With this system, given a clean hardware setup, you can go from **0 to 1 in 20 minutes** (nothing is installed -> livestreaming data from the arm, recording data on the gripper, and postprocessing gripper data on PC)
2. **Data collection & processing is quick and easy**
  - a single button press starts & stops data collection, and a single command fetches all recorded episodes onto PC from the gripper over the network.
3. **Data is ready for training**
  - all data is timestamped and synchronized to the same clock
  - all sensors produce data at rates and resolutions standard for training robot policies (>10Hz, >540p)
4. **Data artifacts are well-organized**
  - the postprocessing pipeline gathers all data from the hardware and stores each episode at-rest in an MCAP file alongside comprehensive metadata, saving intermediate artifacts for traceability
  - built for robot policy training; pipeline extensions convert at-rest format to any common dataset format (Zarr, LeRobot Dataset, etc)
  - all demonstrations can be replayed or livestreamed to [Foxglove](https://foxglove.dev/)

## Sensors: Theory of Operation

### Optical Tactile Finger
The PolyUMI finger follows the same core sensing principle as [PolyTouch](https://polytouch.alanz.info/): a deformable sensing surface is observed by an internal camera through a curved mirror.  

The hardware & software for the PolyUMI finger are designed and built from scratch; however, the sensing approach and system architecture draw heavily from PolyTouch. No source code or design files from that work were available — only the published paper — so all implementation details were independently developed, and modifications were made as appropriate to fit the goals of rapid iteration and integration with a UMI-style gripper design.

- **Sensing surface:** VHB tape for conformability, coated with aluminim powder + covered with medical tape on the outer surface for reflectivity + texture & durability (following PolyTouch). Mounted on an acrylic plate which is detachable from finger assembly for easy replacement + iteration.
- **Illumination:** [Flexible LED tube](https://www.digikey.com/en/products/detail/adafruit-industries-llc/6143/26250001) mounted in the rear of the sensing surface
- **Peripheral vision:** side windows provide a secondary view of the manipulation scene, similar to PolyTouch.
- **Output:** 10 fps MJPEG video at 540x480 (stored in the finger as JPEG frames for efficiency, and at rest as MP4 + MCAP)

<figure class="project-figure">
<iframe width="720" height="405" src="https://www.youtube.com/embed/9J0HMS4kfYM?autoplay=0&loop=1&playlist=9J0HMS4kfYM&mute=0&showinfo=0&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<figcaption>The finger surface deformation is clearly visible in the color gradient when an object (such as this M3x30 screw) presses against it. Audio is from the finger's integrated contact microphone.</figcaption>
</figure>

TODO add these figures + videos:
- Mirror-ray figure from the PolyTouch paper (with a caption comparing PolyTouch vs. PolyUMI).
- Sensing-surface layup documentation + fabrication clip.
- CAD section view + irl pic to show LED placement.
- Internal camera still with windows & mirror highlighted & labeled

References: PolyTouch, [GelSight](https://www.gelsight.com/), [DenseTact](https://techfinder.stanford.edu/technology/densetact-optical-tactile-sensor)

### Contact Microphone
The contact microphone is rigidly coupled to the finger housing, so it primarily captures mechanical vibration traveling through the sensor body, with relatively little airborne sound.

- **Output:** 16 kHz mono PCM audio (stored at rest as WAV container, MCAP)

References: PolyTouch, [ManiWAV](https://mani-wav.github.io/)

### Wrist Camera
This sensing system follows the UMI design with minor hardware updates for a new GoPro version. PolyUMI also adds BLE-based control of the GoPro from the gripper's onboard SBC (Raspberry Pi Zero 2W), which is required to synchronize timestamps for all sensor datastreams & ensure that the sensors begin recording at the same time.

- GoPro Hero 12 + MAX Lens Mod 2.0 (approximately 177 deg FOV)
- Side mirrors provide a binocular view of the manipulated object.
- **Output:**: 60 fps video at rest as MP4 
- **Control:** via [Open GoPro's BLE API](https://gopro.github.io/OpenGoPro/) from the gripper's onboard Raspberry Pi

TODO figure: annotated image showing camera FOV and side mirrors.

References: UMI

### Proprioception
Proprioceptive data is available in two forms:
- 6DoF end-effector pose + gripper width; embodiment-agnostic
- Joint angles; embodiment-specific

TODO data flow diagram

#### End-Effector
When mounted to an arm or any other embodiment, joint angle data can be sourced directly from motor encoders, and EE pose can be trivially obtained through forward kinematics.
For the Franka arm, this data is all availble directly from the `libfranka` API.

#### PolyUMI Gripper
When data is collected from the gripper alone, proprioceptive information must be derived from other sensor data.
In particular, PolyUMI follows the original UMI paper in using [ORB-SLAM3](https://github.com/UZ-SLAMLab/ORB_SLAM3)'s monocular-inertial SLAM implementation to derive a 6DoF pose trajectory using the GoPro's video feed and integrated IMU.
Gripper width is calculated using the ArUco tags on the gripper fingers.

Then, an embodiment-specific IK solver can be used to map this pose trajectory to a trajectory in joint-space.

**References**: UMI

## System Architecture and Design
- Full BOM is [here](https://docs.google.com/spreadsheets/d/1tMQNNxZsd84y2yo-7dfs8auQ5Ptbd8Gklj7v1k_vXQo/edit?usp=sharing).

### Mechanical
- CAD resources: gripper and Franka mount Onshape documents (linked above).
- Add breakdown of total part count and role of each component.
- Add per-part CAD renders.
- Add a short build log (video or slideshow) covering fabrication/assembly.

### Electrical
- Add system-level block diagram.
- Add LED driver schematic.
- Add close-up photos of critical wiring/connectors.

### Software
- Source code: [PolyUMI GitHub](https://github.com/cwoodhayes/polyumi)
- Add software architecture diagram.
- Add CLI screenshots for both recording and postprocessing flows.
- Add Foxglove screenshots + shared visualization config.

<figure class="project-figure">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
    <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/PolyUMI SW block diagram.png" alt="PolyUMI software block diagram" style="width: 100%; height: auto;" /></a>
  </div>
  <figcaption>3 configurations of the software to support 3 use-cases: 1) recording on the gripper, 2) transferring recorded data from the gripper to PC, and 3) livestreaming data from the end-effector to ROS2 for inference/control and visualization.</figcaption>
</figure>

## Next Steps

  - hardware design improvements
	- add second LED strip at fingertip; design custom LED pcb 
		- need better illumination at front of sensor
		- better control over light orientation (the current tube gets twisted), more mechanical robustness, and smaller form factor
	- optimize mirror curvature + camera placement to minimize distortion, variation in effective sensing surface distance (so it all fits in the same depth-of-field), and blind spots (currently there's one at the rear of the sensor)
	- sensing surface stiffness - experiment with materials to make it softer
- slam pipeline robustness improvements
- implement inference + training infrastructure, and evaluate various policies! planning to explore
	- diffusion policy
	- ACT
	- various VLA's with SFT
	- RL-based fine-tuning of all for failure recovery
	- others TBD
- publish :)


---

Here's a deck I updated weekly for the first 9 weeks of the project (Jan-Feb 2026).

<div style="width: 100%; max-width: 960px; margin: 0 auto;">
	<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQR-MULBLa4QTOi97m1QAagUZOOMOkp6oHEydoJPGzYtv5GeUqmyuLx2DniBYF2dP6ZISberjtdc6vv/pubembed?start=false&loop=true&delayms=3000" frameborder="0" style="width: 100%; aspect-ratio: 960 / 569;" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>