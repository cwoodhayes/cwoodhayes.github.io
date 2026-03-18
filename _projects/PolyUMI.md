---
name: PolyUMI - Touch + Vision + Audio Manipulation Data Collector
tools: [Tactile Sensing, Robotic Manipulation, Imitation Learning, Diffusion Policy, Raspberry Pi, Python, SLAM, ROS 2]
category: personal
preview_gif: /assets/msr/polyumi/umi_demo.mp4
description: A novel multi-modal data collection system for robot imitation learning.
permalink: /projects/polyumi/
date: 2026-02-01
---

<iframe width="720" height="405" src="https://www.youtube.com/embed/9W4t_Zj5kCw?autoplay=1&loop=1&playlist=9W4t_Zj5kCw&mute=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

# PolyUMI: Visual+Auditory+Tactile Manipulation Data Collector for Imitation Learning

<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/polyumi" %}
  {% include github-button.html url="https://cad.onshape.com/documents/51445b7d15b8d189878323f1/w/358bf42f47b2b1f2a511decc/e/9a3e51ec7a29118eecf3283b" label="Gripper CAD" icon="onshape" %}
  {% include github-button.html url="https://cad.onshape.com/documents/e674950e5409bace1adf9ce3/w/92b242e38e2c65427b8cb5db/e/0ded13219a9c097fb326bd02" label="Franka Mount CAD" icon="onshape" %}
</div>

PolyUMI is a real-time data collection & control platform for robotic imitation learning, which unifies the following sensor modalities in a single end-effector:
- **touch** (via a custom optical tactile-sensing finger, based off of [PolyTouch](https://polytouch.alanz.info/)) - *10fps 540x480 MJPEG video (MP4)*
- **mechanical vibration** (via a contact microphone fixed to the finger housing) - *16kHz PCM audio (WAV)*
- **vision** (via GoPro camera on wrist + finger camera peripheral vision) - *60fps 1920x1080 MJPEG video (MP4) + 10fps 540x480 MJPEG video*
- **proprioception** (via monocular inertial SLAM from GoPro + IMU in gripper, or robot joint encoders + FK in embodiments)

It combines the [Universal Manipulation Interface (UMI)](https://umi-gripper.github.io/) platform with a custom touch-sensing finger inspired by the [PolyTouch tactile + audio sensor](https://polytouch.alanz.info/), with firmware and software for the above built from scratch for a modern robotics stack (ROS2 Kilted + Python 3.13 + Foxglove visualizer).

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

TODO - block diagram

### PolyUMI Gripper
  - Enables recording of manipulation demonstrations with the touch of a button
  - ~5hrs of battery life, cable free, no need for any external PC to record

### PolyUMI End-Effectors
  - Currently supports the [Franka Hand](https://franka.de/accessories) (novel design)
  - but can easily support other arms, humanoids, etc --- anything with a wrist.

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
The optical finger follows the same core sensing principle as [PolyTouch](https://polytouch.alanz.info/): a deformable sensing surface is observed by an internal camera through a curved mirror.  

The mechanical, electrical, and software design for the PolyUMI finger was done from the bottom up, to fit the new UMI-based system and enable easy experimentation to improve to PolyTouch's performance. Additionally, I do not have access to any source code, designs, or information for PolyTouch beyond the paper itself.

- **Sensing surface:** VHB tape for soft material, coated with aluminim powder + covered with medical tape on the outer surface for reflectivity + texture. Mounted on an acrylic plate, and detachable from finger assembly for easy replacement
- **Illumination:** [Flexible LED tube](https://www.digikey.com/en/products/detail/adafruit-industries-llc/6143/26250001) mounted in the rear of the sensing surface
- **Peripheral vision:** side windows provide a secondary view of the manipulation scene, similar to PolyTouch.
- **Output:** 10 fps MJPEG video at 540x480 (stored in the finger as JPEG frames for efficiency, and at rest as MP4 + MCAP)

Planned media for this section:
- Nail press demo clip with synchronized audio.
- Mirror-ray figure from the PolyTouch paper (with a caption comparing PolyTouch vs. PolyUMI).
- Sensing-surface layup documentation + fabrication clip.
- CAD section view and illuminated internal photo.
- Internal camera screenshot with side-view regions highlighted.

References: PolyTouch, GelSight, [DenseTact](https://techfinder.stanford.edu/technology/densetact-optical-tactile-sensor)

### Contact Microphone
The contact microphone is rigidly coupled to the finger housing, so it primarily captures mechanical vibration traveling through the sensor body, with relatively little airborne sound.

- **Output:** 16 kHz mono PCM audio (stored at rest as WAV container, MCAP)

References: PolyTouch, [ManiWAV](https://mani-wav.github.io/)

### Wrist Camera
This subsystem follows the UMI design with incremental hardware updates and software integration into the PolyUMI stack. It also preserves compatibility with the existing vision-only UMI workflow.

- GoPro Hero 12 + MAX Lens Mod 2.0 (approximately 177 deg FOV)
- Side mirrors provide a binocular view of the manipulated object.
- **Output:**: 60 fps video at rest as MP4 

Planned media for this section:
- Annotated image showing camera FOV and side-mirror sight lines.

References: UMI

### Proprioception
PolyUMI supports two complementary proprioception paths:

- **Embodiment-native path:** direct joint sensing (angles, velocities, efforts, etc.) followed by forward kinematics to compute end-effector pose.
- **Gripper-centric path:** visual-inertial SLAM estimates a 6-DoF pose trajectory, then an embodiment-specific inverse kinematics solver maps this trajectory to joint-space commands.

Conceptual flow:
- Embodiment: joint state -> FK -> 6-DoF pose
- Gripper: GoPro camera + IMU -> ORB-SLAM3 (monocular visual-inertial) -> 6-DoF pose trajectory -> IK -> joint state

References: UMI

## System Architecture and Design

### Mechanical
- CAD resources: gripper and Franka mount Onshape documents (linked above).
- Add breakdown of total part count and role of each component.
- Add per-part CAD renders.
- Add a short build log (video or slideshow) covering fabrication/assembly.

### Electrical
- Link full BOM.
- Add system-level block diagram.
- Add LED driver schematic.
- Add close-up photos of critical wiring/connectors.

### Software
- Source code: [PolyUMI GitHub](https://github.com/cwoodhayes/polyumi)
- Add software architecture diagram.
- Add CLI screenshots for both recording and postprocessing flows.
- Add Foxglove screenshots + shared visualization config.

<div style="width: 100%; margin: 1.5rem 0;">
  <img src="/assets/msr/polyumi/PolyUMI SW block diagram.png" alt="PolyUMI software block diagram" style="width: 100%; height: auto; border-radius: 0.5rem;" />
  <p style="margin: 0.5rem 0 0; text-align: center; font-size: 0.95rem; color: #666;">3 configurations of the polyumi system</p>
</div>


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

Here's a deck I update weekly to reflect my latest progress.

<div style="width: 100%; max-width: 960px; margin: 0 auto;">
	<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQR-MULBLa4QTOi97m1QAagUZOOMOkp6oHEydoJPGzYtv5GeUqmyuLx2DniBYF2dP6ZISberjtdc6vv/pubembed?start=false&loop=true&delayms=3000" frameborder="0" style="width: 100%; aspect-ratio: 960 / 569;" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>