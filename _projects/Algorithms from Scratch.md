---
name: ML/AI Algorithms from Scratch
tools: [Python, Deep Learning, Navigation, Path Planning, Sensor Fusion, Particle Filter, Support Vector Machines (SVM), Online A*, Neural Networks]
category: personal
image: /assets/msr/particle_filter.png
description: Collection of AI/ML algorithms for robotic navigation and perception, implemented from scratch in Python (just numpy & pandas).
date: 2025-12-01
---

# Algorithms from Scratch: AI/ML for Robotics

<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw0" label="Particle Filter for Robot Localization" %}
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw1" label="Heirarchical Planning & Control (Online A* + PID)" %}
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw2" label="SVM for landmark prediction" %}
	{% include github-button.html url="https://github.com/cwoodhayes/MSAI437_homework" label="Deep Neural Network from Scratch" %}
</div>

## Particle Filter for Robot Localization
<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw0" label="Particle Filter for Robot Localization" %}
</div>

Implemented a particle filter from scratch for mobile robot localization, applied to real-world wheeled robot data from the UTIAS Multi-Robot Cooperative Localization and Mapping Dataset. The filter combines a differential-drive motion model, a range/bearing measurement model using LiDAR data, and low-variance resampling to estimate the robot's 2D position and heading over time.

**Key Results:** With tuned noise parameters, the particle filter tracked ground truth closely while dead reckoning diverged rapidly due to compounding control uncertainty. Control noise had the largest impact on accuracy, with performance degrading during periods of missing landmark measurements when the filter relied solely on motion propagation.
