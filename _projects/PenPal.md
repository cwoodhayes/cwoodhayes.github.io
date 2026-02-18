---
name: PenPal - Conversational Arm
tools: [ROS 2, OpenCV, MoveIt, Robotic Arm, RealSense, Python]
category: personal
image: https://github.com/user-attachments/assets/f5e6d137-fe92-4fc8-8cc6-306117b42d30
description: Vision-guided robotic system which reads & writes text on a whiteboard held by a user. Built with a Franka Emika 7dof arm and a RealSense camera.
date: 2025-12-02
preview_gif: /assets/msr/penpal/penpal-cover.mp4
---

<div style="display: flex; gap-left: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 0rem;">
  <video min-width="300px" controls>
    <source src="https://github.com/user-attachments/assets/1dc29e68-c55d-410c-86aa-9ee042505e42" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  <video min-width="300px" controls>
    <source src="https://github.com/user-attachments/assets/3719fb87-1283-4ab4-acf1-3c977821e4f1" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

# PenPal: Vision-Guided Conversational Writing Robot
<div class="project-button-row">
  {% include github-button.html url="https://github.com/cwoodhayes/final-project-penpal" %}
</div>

**Authors**: Conor Hayes, Amber Handal, Tianhao Zhang

## Project Overview
PenPal is a vision-guided robotic system that can hold a written conversation. 
To do so, it detects a whiteboard in the environment, reads and generates answers to handwritten questions on the board using the Gemini vision-language model, and physically writes responses back onto the board using a Franka Emika arm.

The system integrates:

- Computer vision (AprilTag-based pose estimation, OpenCV preprocessing)
- Vision-language models (Gemini VLM for OCR + question answering)
- Robot motion planning (MoveIt Cartesian path planning)
- Frame-consistent spatial reasoning (TF trees and rigid-body transforms)
- Text rendering in arbitrary fonts, projected onto arbitrarily positioned planes in 3D space (custom-built in numpy + fontTools)


All perception, reasoning, and motion are performed dynamically at runtime, allowing the robot to adapt to changes in board position and orientation as they occur, such that the board can even be held by a human user as the robot writes.

## My Contributions
- Led team