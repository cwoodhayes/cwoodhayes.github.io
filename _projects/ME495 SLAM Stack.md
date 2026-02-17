---
name: SLAM from Scratch
tools: [ROS2, C++, SLAM, Turtlebot3, RViz, TF]
category: personal
preview_gif: https://github.com/user-attachments/assets/bab2ae6e-a6a7-44c5-8ed0-ffb4ad08dbb6
description: ROS 2-based lidar SLAM + control stack for Turtlebot3, with control, kinematics, geometry, and simulation tooling developed from scratch.
permalink: /projects/me495-slam/
date: 2026-01-15
---

# ME495 SLAM Stack

<div class="project-button-row">
  {% include github-button.html url="https://github.com/ME495-Navigation/slam-cwoodhayes" %}
</div>

This project is my course repository for **ME495: Sensing, Navigation, and Machine Learning for Robotics**. It implements a full ROS 2 navigation stack for Turtlebot3, including simulation, control, and mapping components built from scratch.

## Highlights

- ROS 2 SLAM + control stack for Turtlebot3 (simulation + hardware)
- Custom simulator (`nusim`) with configurable arena and obstacles
- Core geometry and kinematics library (`turtlelib`) with SE(2) transforms
- Visualization + tooling in RViz

## Packages

- `turtle_control`: command and odometry pipeline for Turtlebot3
- `nuturtle_description`: URDF and RViz assets for multiple robot instances
- `turtlelib`: SE(2), diff-drive kinematics, and SVG helpers
- `nusim`: RViz-based simulator for SLAM development

## Links

- Code: https://github.com/ME495-Navigation/slam-cwoodhayes
- Course: https://nu-msr.github.io/ME495-Sensing-Navigation-and-Machine-Learning/
