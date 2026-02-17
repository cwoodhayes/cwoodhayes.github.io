---
name: PenPal - Conversational Arm
tools: [ROS 2, OpenCV, MoveIt, Robotic Arm, RealSense, Python]
category: personal
image: https://github.com/user-attachments/assets/f5e6d137-fe92-4fc8-8cc6-306117b42d30
description: Vision-guided robotic system which reads & writes text on a whiteboard held by a user. Built with a Franka Emika 7dof arm and a RealSense camera.
date: 2025-12-02
preview_gif: /assets/msr/penpal-cover.mp4
---

# PenPal: Vision-Guided Conversational Writing Robot
<div class="project-button-row">
  {% include github-button.html url="https://github.com/cwoodhayes/final-project-penpal" %}
</div>

PenPal uses a vision-guided robotic system to detect a whiteboard in the environment, read handwritten questions from the board using the Gemini vision-language model, generate concise answers, and physically writes responses back onto the board using a Franka Emika arm.
