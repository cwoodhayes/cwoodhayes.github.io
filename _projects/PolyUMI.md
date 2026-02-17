---
name: PolyUMI - Touch + Vision + Audio Manipulation Data Collector
tools: [Tactile Sensing, Robotic Manipulation, Imitation Learning, Diffusion Policy, Raspberry Pi, Python, SLAM, ROS 2]
category: personal
preview_gif: /assets/msr/polyumi/umi_demo.mp4
description: A novel multi-modal data collection system for robot imitation learning.
permalink: /projects/polyumi/
date: 2026-02-01
---

# PolyUMI: Visual+Auditory+Tactile Manipulation Data Collector for Imitation Learning

This project combines the [Universal Manipulation Interface (UMI)](https://umi-gripper.github.io/) platform with the [PolyTouch optical tactile + audio sensor](https://polytouch.alanz.info/) (which I reverse-engineer and make open source as the PolyTouch CE).

### My Contributions:
- Reverse-engineering PolyTouch and redesigning UMI EE + collector to incorporate it and the required onboard compute (Raspberry Pi Zero 2 W).
- Adapting the UMI training + inference pipelines to work on our Franka Emika Panda arm (different gripper from original paper) in 2026 (some softwares are EOL, etc) with a new sensor/finger mechanism (requires new policies to be trained).
- Developed software data collection pipeline making it easy to record, organize, and visualize this multimodal data.

### Future Work
This project lays the groundwork for my master's thesis/capstone project beginning in the spring, which is to use the PolyUMI platform I've built to explore novel imitation learning strategies combining touch, vision, and audio data for robust manipulation.

---

Here's a deck I update weekly to reflect my latest progress.

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQR-MULBLa4QTOi97m1QAagUZOOMOkp6oHEydoJPGzYtv5GeUqmyuLx2DniBYF2dP6ZISberjtdc6vv/pubembed?start=false&loop=true&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>