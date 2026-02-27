---
name: ML/AI Algorithms from Scratch
tools: [Python, Deep Learning, Navigation, Path Planning, Sensor Fusion, Particle Filter, Support Vector Machines (SVM), Online A*, Neural Networks]
category: personal
image: /assets/msr/particle_filter.png
description: Collection of AI/ML algorithms for robotic navigation and perception, implemented from scratch in Python (just numpy & pandas).
date: 2025-12-01
---

# Algorithms from Scratch: AI/ML for Robotics

This page contains a collection of repos according to a general theme: implementing + deriving AI/ML algorithms from scratch (i.e. no high-level ML libraries, then applying them to some real problems.

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

The filter estimates the robot's 2D position and heading over time by combining:
- A **motion model** based on differential-drive kinematics
- A **measurement model** that computes expected range and bearing to known landmarks given LiDAR-based heading data, weighted via Gaussian likelihood
- **Low-variance resampling** for particle set updates (Probabilistic Robotics §4.3)

**Key Results:** With tuned noise parameters, the particle filter tracked the ground truth trajectory closely while dead reckoning diverged rapidly due to compounding control uncertainty. Control noise had the largest impact on accuracy, especially during periods of missing landmark measurements when the filter only had odometry to rely on.

### Plots

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; align-items: flex-start;">
  <img src="/assets/msr/fromscratch/hw0/500particles.png" alt="Particle Filter Visualization" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw0/Q3_figure.png" alt="Online A* Path Planning Results" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw0/pretty_short.png" alt="Robot Trajectory Tracking" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
</div>


## Heirarchical Planning & Control (Online A* + PID)

<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw1" label="Heirarchical Planning & Control" %}
	{% include pdf-button.html url="https://github.com/cwoodhayes/cs469-hw1/blob/main/writeup.pdf" label="Writeup" %}
</div>

Implemented A* path planning with closed-loop waypoint control for a differential-drive robot, applied in simulation to an arena with obstacles sourced from the [UTIAS Multi-Robot Cooperative Localization and Mapping Dataset](http://asrl.utias.utoronto.ca/datasets/mrclam/index.html) (same as above).

This repo builds up to the full implementation described above via the following components:

- Offline A* path planning on a fully-known obstacle grid.
- Online A* Wraps offline A* for path planning with incremental obstacle discovery (robot observes obstacles only when adjacent to them & recalculates path at each step).
- A dual P-controller that drives the robot toward waypoints with configurable gains, biases, and acceleration limits
- A robot navigation simulator (RobotNavSim) that propagates control outputs through the motion model with Gaussian noise

**Key Results:** Offline A* found optimal paths with full map knowledge, while online A* successfully adapted as obstacles were revealed, sometimes taking detours when initially-planned routes became blocked. Padding the collision region of obstacles by 0.3m was essential for safe execution under noise, due to the controller cutting corners. The P-controller handled all test paths successfully at low-to-moderate noise levels, with simultaneous planning and driving handling control noise more gracefully than post-hoc control since deviations automatically triggered replanning.

### Plots

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; align-items: flex-start;">
  <img src="/assets/msr/fromscratch/hw1/Q5.png" alt="Path Planning Visualization" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw1/Q8.png" alt="Control Performance" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw1/Q11.png" alt="Navigation Results" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
</div>

## Support Vector Machines (SVM) for Landmark Prediction
<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/cs469-hw2" label="SVM for landmark prediction" %}
	{% include pdf-button.html url="https://github.com/cwoodhayes/cs469-hw2/blob/main/writeup.pdf" label="Writeup" %}
</div>

This repo implements a Support Vector Machine (SVM) classifier with an RBF kernel to predict landmark visibility for a mobile wheeled robot, given the robot's current pose (x, y, θ). It is applied to real-world data from the [UTIAS Multi-Robot Cooperative Localization and Mapping Dataset](http://asrl.utias.utoronto.ca/datasets/mrclam/index.html) (same as above).

The SVM is implemented from scratch; `scikit-learn` is used only for evaluation utilities (confusion matrix display) and comparison experiments.

A full writeup including problem framing, algorithm derivation, and discussion of results is available in [writeup.pdf](writeup.pdf).

The implementation includes:
- A **from-scratch SVM classifier** with RBF kernel, solving the quadratic programming problem via the `clarabel` solver (through `qpsolvers`)
- A **dataset preprocessing pipeline** that generates binary visibility labels from raw range measurements using a 2-second sliding window
- A **multi-label classifier** that trains one SVM per landmark (N=15 landmarks) and aggregates results
- A **grid search** over hyperparameters C and σ to select the best model

**Key Results:**

- The **RBF kernel** was selected after an initial qualitative exploration of kernel types, motivated by the observation that visibility regions in (x, y, θ) space are not linearly separable.
- Robot orientation is encoded as **(sin θ, cos θ)** rather than raw θ to avoid angle-wrapping discontinuities in the input space.
- **Grid search** over C ∈ {0.1, 1, 10, 100} and σ ∈ {0.1, 0.5, 1, 2, 5} identified **(C=10, σ=0.1)** as the best configuration, balancing accuracy and recall while limiting overfitting risk.
- The final classifier achieves **97% accuracy** and **88% recall** on a held-out 20% test set (randomly shuffled to avoid trajectory-ordering bias).
- Recall is the more informative metric here, since the class imbalance (most landmarks are invisible most of the time) means a trivial all-negative classifier would score deceptively high on accuracy alone.

### Plots

<div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center; align-items: flex-start;">
  <img src="/assets/msr/fromscratch/hw2/A1 - example states.png" alt="Example States" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw2/A1 - landmarks over time.png" alt="Landmarks Over Time" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw2/A2 - 3dplot.png" alt="3D Visualization" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw2/B - mean recall grid.png" alt="Recall Grid Search" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
  <img src="/assets/msr/fromscratch/hw2/B_-_best_accuracy_ALL_3D_plot.png" alt="Best Accuracy 3D" style="flex: 1; min-width: 300px; max-width: 400px; height: auto;"/>
</div>

## Deep Neural Networks from Scratch
<div class="project-button-row">
	{% include github-button.html url="https://github.com/cwoodhayes/MSAI437_homework" label="Deep Neural Network from Scratch" %}
</div>

This repo contains various homework assignments for Northwestern's MSAI 437 Deep Learning course. 
Of particular relevance to the "from scratch" theme of this page is HW1, in which I implement a basic general-purpose MLP framework from scratch using `numpy` and `matplotlib`, taking the `pytorch` as inspiration for the API. I then apply it to learning a variety of toy classification problems on R2, achieving near-parity with a pytorch implementation with the same hyperparameter tuning for all 5 datasets.

After HW1, all assignments are implemented in `pytorch`, building up more complicated networks (autoencoder, diffusion model), so don't fit into the topic of this page.