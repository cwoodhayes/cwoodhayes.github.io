---
name: Robot as a Service (RaaS)
tools: [WebRTC, AWS Kinesis Video, TypeScript, Robotics]
category: personal
image: /assets/raas-demo.jpg
description: Browser-based robotic teleoperation platform using WebRTC and AWS Kinesis Video, with research plans for adaptive latency compensation via command forecasting.
permalink: /projects/raas/
date: 2025-01-01
---

<div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 2rem;">
	<figure class="project-figure" style="width: 300px; margin: 0;">
		<img src="/assets/raas-demo.jpg" alt="RaaS Client Screenshot">
	</figure>
	<figure class="project-figure" style="width: 300px; margin: 0;">
		<img src="/assets/elegoo%20car.jpeg" alt="ELEGOO Rover">
		<figcaption>Left: The RaaS user client streaming video from the ELEGOO Rover. Right: The ELEGOO Rover.</figcaption>
	</figure>
</div>


# Robot as a Service (RaaS)

<div class="project-button-row">
	{% include github-button.html url="https://github.com/raas-hybrid-lab/raas-web" label="Web Clients" %}
	{% include github-button.html url="https://github.com/raas-hybrid-lab/elegoo-raas" label="ELEGOO Rover Firmware" %}
</div>

I prototyped a robotic tele-operation platform that enables remote control of a simple robot from a browser app, using WebRTC peer-to-peer streaming and AWS Kinesis Video.

The platform consists of two browser-based WebRTC clients: the Lab Client, which captures video and control inputs from robots connected over BLE or WiFi, and the User Client, which receives the video stream and sends control commands back to the Lab Client. The Lab Client then relays these commands to the robot. WebRTC connections are facilitated by AWS Kinesis Video, which provides signaling and media relay services. 

Expanding support for control of the first testbed platform (the ELEGOO rover) was planned, but I set the project aside to focus on my MS in Robotics at Northwestern. 

Planned research directions based on the platform included exploring adaptive latency compensation techniques, such as command forecasting, to improve the teleoperation experience under varying network conditions.

## Hardware Testbed

Initial testbed platform: the [ELEGOO rover](https://www.elegoo.com/blogs/arduino-projects/elegoo-smart-robot-car-kit-v4-0-tutorial)

## Architecture

<figure class="project-figure">
	<img src="/assets/raas_networks_sketch.drawio.png" alt="RaaS Rough Block Diagram">
	<figcaption>Network block diagram for RAAS.</figcaption>
</figure>
<figure class="project-figure">
	<img src="/assets/raas_classdiagram.drawio.png" alt="RaaS Class Diagram">
	<figcaption>Class diagram for RAAS User & Lab clients.</figcaption>
</figure>

## Stuff I Learned

- Details of the WebRTC protocol and how to implement it in a browser app + the cloud + navigate the various networks involved properly. I anticipate using it more in the future.
- TypeScript monorepo architecture - this project uses a monorepo structure to manage the Lab Client and User Client codebases, which share some common utilities and types. I'm not typically making web apps, but I like to check in on best practices for web development from time-to-time for stuff like this, where the web is the most convenient interface/platform for something interesting in robotics/embedded systems.

