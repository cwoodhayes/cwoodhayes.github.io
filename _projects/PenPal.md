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

**Authors**: Conor Hayes, Amber Handal, Kyuwon Weon, Tianhao Zhang

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

## System Architecture
<figure style="width: 100%;">
  <img src="/assets/msr/penpal/system-architecture.png" alt="PenPal Block Diagram" style="width: 100%;">
</figure>


### Nodes
- `penpal.py`
    Top-level orchestrator + FSM. Watches for board visibility, triggers OCR/VLM via a Trigger service client, and sends generated text to the writing stack (planner + controller). Provides wake, sleep, grab_pen services and write_message action. Subscribes to board_info.
- `board_detector.py`
	Real board detector. Consumes AprilTag detections and produces penpal_interfaces/BoardInfo (board_info) containing board pose, dimensions, writable area, and detection metadata (e.g., tag count, sequence number).
- `ocr_node.py`
	Real OCR + QA node. Provides read_and_answer_board (example_interfaces/Trigger) which captures/uses the latest image and returns a JSON payload containing transcription + a concise answer (and raw debug fields).
- `mock_board_detector.py`
	Publishes a fixed/synthetic board_info for development when the camera/AprilTags aren’t running (useful for testing planning/writing).
- `mock_ocr_node.py`
	Mock Trigger-service implementation of OCR/QA. Always returns a static JSON payload for end-to-end testing of PenPal without VLM dependencies.


## My Contributions
- Led team of 4; project-managed & coordinated team effort to meet deadlines
- Designed system architecture and managed system integration, ensuring individual work came together into a working system
- Implemented `PenPal` top-level control node which integrates all system components, enabling the robot to perceive, reason, and write in a closed loop at runtime, as well as its compoments `ConvoFSM` and `FreespacePlanner`.
- Implemented `WritePlanner`, which chunks and projects 2D text trajectories onto the 3D board plane as it moves in real-time.
- Assisted Kyuwon with implementing `MoveItPPControl`, which sits below `WritePlanner` and executes its generated end-effector trajectories on the Franka arm using MoveIt.