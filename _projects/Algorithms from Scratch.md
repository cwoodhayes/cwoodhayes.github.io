---
name: ML/AI Algorithms from Scratch
tools: [Python, Deep Learning, Navigation, Path Planning, Sensor Fusion, Particle Filter, Support Vector Machines (SVM), Online A*, Neural Networks]
category: personal
image: /assets/msr/particle_filter.png
description: Collection of AI/ML algorithms for robotic navigation and perception, implemented from scratch in Python (just numpy & pandas).
date: 2025-12-01
---

# Algorithms from Scratch: AI/ML for Robotics

This page contains a collection of repos according to a general theme: implementing + deriving AI/ML algorithms from scratch (i.e. no high-level ML libraries, then applying them to some real problem.

Since these are all in Python, that specifically means using nothing higher-level than numerical computing libraries (`NumPy`, `Pandas`) and plotting libraries (`Matplotlib`, `Seaborn`). Some works do also include reference implementations using `sklearn`, `pytorch`, etc for comparison purposes.

Algorithms & topics are:
- Particle Filter for Robot Localization
- Heirarchical Planning & Control (Online A* + PID)
- Support Vector Machines (SVM) for Landmark Prediction on a Mobile Robot
- Deep Neural Networks from Scratch (applied to predict some basic nonlinear functions...nothing robotics-y here, but close enough)

## Particle Filter for Robot Localization
<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw0" label="Particle Filter for Robot Localization" %}
	{% include pdf-button.html url="https://github.com/cwoodhayes/cs469-hw0/blob/main/writeup.pdf" label="Writeup" %}
</div>

Implemented a particle filter from scratch for mobile robot localization, applied to real-world wheeled robot data from the [UTIAS Multi-Robot Cooperative Localization and Mapping Dataset](http://asrl.utias.utoronto.ca/datasets/mrclam/index.html). 

The filter combines a differential-drive motion model, a range/bearing measurement model using LiDAR data, and low-variance resampling to estimate the robot's 2D position and heading over time.

The filter estimates the robot's 2D position and heading over time by combining:
- A **motion model** based on differential-drive kinematics
- A **measurement model** that computes expected range and bearing to known landmarks given LiDAR-based heading data, weighted via Gaussian likelihood
- **Low-variance resampling** for particle set updates (Probabilistic Robotics §4.3)

**Key Results:** With tuned noise parameters, the particle filter tracked ground truth closely while dead reckoning diverged rapidly due to compounding control uncertainty. Control noise had the largest impact on accuracy, with performance degrading during periods of missing landmark measurements when the filter relied solely on motion propagation.

## Heirarchical Planning & Control (Online A* + PID)

<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw1" label="Heirarchical Planning & Control (Online A* + PID)" %}
	{% include pdf-button.html url="https://github.com/cwoodhayes/cs469-hw1/blob/main/writeup.pdf" label="Writeup" %}
</div>

Implemented A* path planning with closed-loop waypoint control for a differential-drive robot, applied to a real-world obstacle map from the UTIAS Multi-Robot Cooperative Localization and Mapping Dataset. The system combines offline and online planning strategies with low-level motion control.

The navigation stack combines:
- **Offline A* planning** on fully-known obstacle grids with an admissible diagonal-normalized heuristic
- **Online A*** that adapts in real time as obstacles are incrementally discovered during navigation
- **Dual P-controller** that drives the robot toward waypoints with configurable gains and acceleration limits
- **Robot simulator** that propagates control outputs through the differential-drive motion model with Gaussian noise

**Key Results:** Offline A* found optimal paths with full map knowledge, while online A* successfully adapted as obstacles were revealed, sometimes taking detours when initially-planned routes became blocked. Obstacle inflation by 0.3m was essential for safe execution under noise. The P-controller handled all test paths successfully at low-to-moderate noise levels, with simultaneous planning and driving handling control noise more gracefully than post-hoc control since deviations automatically triggered replanning.

## Support Vector Machines (SVM) for Landmark Prediction
<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw2" label="SVM for landmark prediction" %}
	{% include pdf-button.html url="https://github.com/cwoodhayes/cs469-hw2/blob/main/writeup.pdf" label="Writeup" %}
</div>


## Deep Neural Networks from Scratch
<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/MSAI437_homework" label="Deep Neural Network from Scratch" %}
</div>