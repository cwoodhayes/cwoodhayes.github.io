---
name: PolyUMI - Touch + Vision + Audio Manipulation Data Collector
tools: [Tactile Sensing, Robotic Manipulation, Imitation Learning, Diffusion Policy, Raspberry Pi, Python, SLAM, ROS 2]
category: personal
preview_gif: /assets/msr/polyumi/umi_demo.mp4
description: A novel multi-modal data collection system for robot imitation learning.
permalink: /projects/polyumi/
date: 2026-02-01
---

<div style="width: 100%; margin: 1.5rem 0 0;">
  <video controls playsinline style="width: 100%; height: auto; border-radius: 0.5rem;">
    <source src="https://github.com/user-attachments/assets/ca8afcf6-e07f-4742-9793-6ca54265329d" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <video controls playsinline style="width: 100%; height: auto; border-radius: 0.5rem;">
    <source src="https://github.com/user-attachments/assets/6f7a2f8f-0ad8-4217-af69-94231b63fa67" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <p style="margin: 0.5rem 0 0; text-align: center; font-size: 0.95rem; color: #666;">Time to collect an episode with PolyUMI: 10secs. Time to collect an episode for the same task with teleoperation: 80secs (8x longer). PolyUMI enables collecting much richer, more dynamic manipulation trajectories at a much faster rate than teleoperations.</p>
</div>

TODO: franka teleop comparison
TODO: sensor surface demo

# PolyUMI: Visual+Auditory+Tactile Manipulation Data Collector for Imitation Learning

<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/polyumi" %}
</div>

**Authors**: Conor Hayes

This project combines the [Universal Manipulation Interface (UMI)](https://umi-gripper.github.io/) platform with the [PolyTouch optical tactile + audio sensor](https://polytouch.alanz.info/) (which I reverse-engineer and make open source as the PolyTouch CE).

### My Contributions:
- Reverse-engineering PolyTouch and redesigning UMI EE + collector to incorporate it and the required onboard compute (Raspberry Pi Zero 2 W).
- Adapting the UMI training + inference pipelines to work on our Franka Emika Panda arm (different gripper from original paper) in 2026 (some softwares are EOL, etc) with a new sensor/finger mechanism (requires new policies to be trained).
- Developed software data collection pipeline making it easy to record, organize, and visualize this multimodal data.


<div style="width: 100%; margin: 1.5rem 0;">
  <img src="/assets/msr/polyumi/ML_data_overview.drawio.png" alt="PolyUMI machine learning data overview" style="width: 100%; height: auto; border-radius: 0.5rem;" />
</div>

### Future Work
This project lays the groundwork for my master's thesis/capstone project beginning in the spring, which is to use the PolyUMI platform I've built to explore novel imitation learning strategies combining touch, vision, and audio data for robust manipulation.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/polyumi_gripper_cad.png" alt="PolyUMI Gripper CAD" style="width: 100%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/franka_ee.jpg" alt="Custom UMI EE for Franka Hand" style="width: 100%; height: auto;" /></a>
  <a href="#" class="lightbox-img"><img src="/assets/msr/polyumi/polyumi_internal_cam.jpg" alt="Internal finger camera view" style="width: 100%; height: auto;" /></a>
</div>

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