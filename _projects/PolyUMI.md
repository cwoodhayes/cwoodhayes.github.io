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

## Architecture

<div style="width: 100%; margin: 1.5rem 0;">
  <img src="/assets/msr/polyumi/PolyUMI SW block diagram.png" alt="PolyUMI software block diagram" style="width: 100%; height: auto; border-radius: 0.5rem;" />
  <p style="margin: 0.5rem 0 0; text-align: center; font-size: 0.95rem; color: #666;">3 configurations of the polyumi system</p>
</div>

---

Here's a deck I update weekly to reflect my latest progress.

<div style="width: 100%; max-width: 960px; margin: 0 auto;">
	<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQR-MULBLa4QTOi97m1QAagUZOOMOkp6oHEydoJPGzYtv5GeUqmyuLx2DniBYF2dP6ZISberjtdc6vv/pubembed?start=false&loop=true&delayms=3000" frameborder="0" style="width: 100%; aspect-ratio: 960 / 569;" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>