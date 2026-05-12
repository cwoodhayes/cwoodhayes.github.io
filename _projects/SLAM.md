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

- **High-Performance SLAM**: In the video above (1 minute random drive), final position error of the SLAM estimate is *less than 4cm*, while the odometry error is >.3m (almost 2 feet).

## Algorithm highlight: SLAM pipeline

As seen in the demo videos (IRL is above, see below for simulation), this pipeline:
1. detects cylindrical obstacles
2. associates them to a consistent internal ID 
3. places them on an internal map (which is used to drive the association in step 2), and then
4. localizes the robot in this map.

It took a fair amount of good old fashioned fiddling, adding steps & tuning parameters, but the final algorithm performs very well in both simulation & deployment. In particular:
1. very rare for invalid landmarks to make it into the SLAM state
2. very rare for the landmark detector to miss real landmarks
3. EKF is tuned well enough to the respective landmark + odometry uncertainties to fuse the two into a very good estimate.

Here is how the pipeline works at a high level (diagram & text below):

<figure class="project-figure">
  <img src="/assets/msr/slam/pipeline.png" alt="Landmark Detection + Association + SLAM Pipeline" style="width: 100%;">
</figure>

1. **Cluster raw LIDAR points** — convert range readings to Cartesian, group consecutive points within `distance_threshold` (0.1m). A wrap-around check merges the last cluster with the first if they are close.
2. **Minimum size filter** — clusters with fewer than `min_cluster_size` (8) points are discarded.
3. **Algebraic circle fit** — fits a circle to each cluster via SVD + eigendecomposition (Taubin method). Produces a center, radius, and RMSE.
4. **Geometric filters** — rejects fits whose RMSE exceeds `rmse_threshold`, or whose radius falls outside the realistic cylinder range for the obstacles we're using (this second check is a bit of a cheat; the algorithm still performs pretty well without it, but it'd be nice if this worked for _any_ obstacles. However, I wanted to squeeze the best performance I could out of the real-world demo and so I put this in.)
5. **Inscribed angle check** — This includes 2 sub-checks, based on the property that inscribed angles of a perfect circle are always 90deg: (a) mean inscribed angle must fall within `inscribed_angle_mean_range_deg` (70, 140); (c) std dev of inscribed angles must be below `inscribed_angle_stddev_threshold_deg` (20).
6. **Concavity Check** -- I added this in response to the circle detector often detecting the (concave) corners of the arena wall as circles. Checks that interior points must be closer to the sensor than the endpoints of each clustered arc, controlled by `concavity_threshold`; 
7. **Mahalanobis data association** — for each surviving detected circle, compute Mahalanobis distance to every known landmark in the EKF state. This is a distance metric for distributions that's like a euclidean distance between means, but weighted by uncertainty. Best match below `slam_mahalanobis_association_threshold` associates with that landmark; otherwise a new landmark is created (up to `slam_n_max_landmarks`).
8. **Provisional gate** — new landmarks must accumulate `slam_mahalanobis_provisional_observation_count` observations before their measurements feed into the EKF, preventing brief mistaken detections from corrupting the map.
9. **EKF update** — confirmed measurements update the EKF state using measurement covariance `slam_R`.

## Summary of functionality:
- Custom forward + inverse kinematics implementation (`turtlelib`) for differential drive robot
- Custom simulator (`nusim`) with configurable arena and obstacles
- Visualization + tooling in RViz for real-time robot state display in both simulation and hardware
- EKF (Extended Kalman Filter) SLAM implementation using LiDAR data + odometry for mapping and localization
- Custom data association + lidar clustering & classification based on circle fitting for landmark extraction
- Deployment to real hardware (Turtlebot3 Burger) for testing in a physical environment 

<figure class="project-figure">
	<video width="720" height="405" controls preload="metadata">
		<source src="https://github.com/user-attachments/assets/ea1a8a6e-004b-4681-86aa-999a3f587f48" type="video/mp4">
		Your browser does not support the video tag.
	</video>
	<figcaption>Custom-built LiDAR SLAM simulator, with ground truth (red), odometry-only (blue), and SLAM (green) map & pose estimates shown, as well as obstacle detection in white. <br/>Note that when the robot collides with an obstacle, the odometry estimate drives through it while the SLAM estimate correctly locates due to the measurement update.</figcaption>
</figure>

## Tech Stack
- ROS 2 Kilted Kaiju
- C++23
- Turtlebot3 Burger


## Packages

**No external dependencies other than ROS2 and Armadillo**

- `nuslam`: SLAM nodes & configuration
- `nusim`: RViz-based simulator for SLAM development
- `turtle_control`: command and odometry pipeline for Turtlebot3
- `nuturtle_description`: URDF and RViz assets for multiple robot instances
- `turtlelib`: shared pure C++ libary for all other packages. Contains SE(2) math helpers, kinematics, SLAM, data association, etc.

## Check it out on GitHub!
<div class="project-button-row">
  {% include github-button.html url="https://github.com/ME495-Navigation/slam-cwoodhayes" %}
</div>