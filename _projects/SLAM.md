---
name: SLAM from Scratch
tools: [ROS 2, C++, SLAM, Turtlebot3, RViz, TF, LiDAR]
category: personal
preview_gif: https://github.com/user-attachments/assets/a88a6b47-d4a2-44ce-9b25-b741a8d221df
description: ROS 2-based lidar SLAM + control stack for Turtlebot3, with control, kinematics, geometry, and simulation tooling developed from scratch.
permalink: /projects/me495-slam/
date: 2026-01-15
---

<figure class="project-figure">
	<video width="720" height="405" controls preload="metadata">
		<source src="https://github.com/user-attachments/assets/1179359c-8443-42d2-a3f8-9bd3460544c9" type="video/mp4">
		Your browser does not support the video tag.
	</video>
	<figcaption>Real-world deployment of the EKF-SLAM algorithm with landmark detection & association, run onboard the Turtlebot3 with real-time visualization in RViz. Key: Green/multicolored dots: LIDAR scan points. Green obstacles+robot+path = SLAM estimate. Blue robot+path = odometry-only estimate. White obstacles=landmarks detected by the `landmarks` node (see below), which feed into SLAM. SLAM's robot pose covariance is shown as the purple ellipse and yellow cone.</figcaption>
</figure>

# SLAM from Scratch: ROS 2 Navigation Stack for Turtlebot3

<div class="project-button-row">
  {% include github-button.html url="https://github.com/ME495-Navigation/slam-cwoodhayes" %}
</div>

**Authors**: Conor Hayes

In this project, I implement a full ROS 2 navigation stack for the [Turtlebot3 Burger](https://www.turtlebot.com/turtlebot3/) differential drive mobile robot, including LiDAR SLAM, control, and simulation components, all built from scratch in C++. This means no external SLAM or kinematics libraries, no Gazebo simulation, just basic ROS 2 packages, [armadillo](https://arma.sourceforge.net/) for linear algebra, and my own implementations of the necessary algorithms and tools.

## Highlights

- EKF (Extended Kalman Filter) SLAM implementation using LiDAR data + odometry for mapping and localization
- Custom data association + lidar clustering & classification based on circle fitting for landmark extraction
- Custom forward + inverse kinematics implementation (`turtlelib`) for differential drive robot
- Custom simulator (`nusim`) with configurable arena and obstacles
- Visualization + tooling in RViz for real-time robot state display in both simulation and hardware
- Deployment to real hardware (Turtlebot3 Burger) for testing in a physical environment 

<figure class="project-figure">
	<video width="720" height="405" controls preload="metadata">
		<source src="https://github.com/user-attachments/assets/ea1a8a6e-004b-4681-86aa-999a3f587f48" type="video/mp4">
		Your browser does not support the video tag.
	</video>
	<figcaption>Custom-built LiDAR SLAM simulator, with ground truth (red), odometry-only (blue), and SLAM (green) map & pose estimates shown, as well as obstacle detection in white.</figcaption>
</figure>

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
