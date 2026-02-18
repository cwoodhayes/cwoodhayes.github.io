---
name: SLAM from Scratch
tools: [ROS 2, C++, SLAM, Turtlebot3, RViz, TF, LiDAR]
category: personal
preview_gif: https://github.com/user-attachments/assets/bab2ae6e-a6a7-44c5-8ed0-ffb4ad08dbb6
description: ROS 2-based lidar SLAM + control stack for Turtlebot3, with control, kinematics, geometry, and simulation tooling developed from scratch.
permalink: /projects/me495-slam/
date: 2026-01-15
---

<div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 1rem;">
	<figure class="project-figure" style="flex: 1; min-width: 300px; margin: 0;">
		<img src="https://github.com/ME495-Navigation/slam-cwoodhayes/raw/main/nusim/images/nusim1.png" alt="Custom-built SLAM simulator in RViz">
		<figcaption>Left: Custom-built LiDAR SLAM simulator. <p/> Right: Driving the Turtlebot3 in a circle using odometry via custom forward kinematics module. </figcaption>
	</figure>
	<video style="flex: 1; min-width: 300px;" controls>
		<source src="https://github.com/user-attachments/assets/bab2ae6e-a6a7-44c5-8ed0-ffb4ad08dbb6" type="video/mp4">
		Your browser does not support the video tag.
	</video>
</div>

# SLAM from Scratch: ROS 2 Navigation Stack for Turtlebot3

<div class="project-button-row">
  {% include github-button.html url="https://github.com/ME495-Navigation/slam-cwoodhayes" %}
</div>

**Authors**: Conor Hayes

In this project, I implement a full ROS 2 navigation stack for the [Turtlebot3 Burger](https://www.turtlebot.com/turtlebot3/) differential drive mobile robot, including LiDAR SLAM, control, and simulation components, all built from scratch in C++. This means no external SLAM or kinematics libraries, no Gazebo simulation, no Eiegen; just basic ROS 2 packages and my own implementations of the necessary algorithms and tools.

## Highlights

- EKF (Extended Kalman Filter) SLAM implementation using LiDAR data + odometry for mapping and localization
- Custom forward + inverse kinematics implementation (`turtlelib`) for differential drive robot
- Custom simulator (`nusim`) with configurable arena and obstacles
- Visualization + tooling in RViz for real-time robot state display in both simulation and hardware
- Deployment to real hardware (Turtlebot3 Burger) for testing in a physical environment 

## Tech Stack
- ROS 2 Kilted Kaiju
- C++23
- Turtlebot3 Burger


## Packages

- `turtle_control`: command and odometry pipeline for Turtlebot3
- `nuturtle_description`: URDF and RViz assets for multiple robot instances
- `turtlelib`: SE(2), diff-drive kinematics, and SVG helpers
- `nusim`: RViz-based simulator for SLAM development

## Acknowledgements

Big thanks to Dr. Matthew Elwin, who runs the MSR program at Northwestern, and teaches the course in which this project was developed ([ME495: Sensing, Navigation, and Machine Learning](https://nu-msr.github.io/navigation/index.html)).
