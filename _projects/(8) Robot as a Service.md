---
name: Robot as a Service (RaaS)
tools: [Robotics, Teleoperation, WebRTC, AWS Kinesis Video, Browser App, Latency Compensation]
image: /assets/raas-demo.jpg
description: Browser-based robotic teleoperation platform using WebRTC and AWS Kinesis Video, with research plans for adaptive latency compensation via command forecasting.
permalink: /projects/raas/
---

<div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
	<img src="/assets/raas-demo.jpg" alt="RaaS Client Screenshot" width="320" />
	<img src="/assets/elegoo%20car.jpeg" alt="ELEGOO Rover" width="320" />
</div>


# Robot as a Service (RaaS)

GitHub Repos:
- [Web Clients](https://github.com/raas-hybrid-lab/raas-web)
- [ELEGOO Rover Firmware](https://github.com/raas-hybrid-lab/elegoo-raas)

I prototyped a robotic tele-operation platform that enables remote control of a simple robot from a browser app, using WebRTC peer-to-peer streaming and AWS Kinesis Video.

The platform consists of two browser-based WebRTC clients: the Lab Client, which captures video and control inputs from robots connected over BLE or WiFi, and the User Client, which receives the video stream and sends control commands back to the Lab Client. The Lab Client then relays these commands to the robot. WebRTC connections are facilitated by AWS Kinesis Video, which provides signaling and media relay services. 

Expanding support for control of the first testbed platform (the ELEGOO rover) was planned, but I set the project aside to focus on my MS in Robotics at Northwestern. 

Future research directions include exploring adaptive latency compensation techniques, such as command forecasting, to improve the teleoperation experience under varying network conditions.

## Hardware Testbed

Initial testbed platform: the [ELEGOO rover](https://www.elegoo.com/blogs/arduino-projects/elegoo-smart-robot-car-kit-v4-0-tutorial)

## Architecture

![RaaS Rough Block Diagram](/assets/raas_networks_sketch.drawio.png)
![RaaS Class Diagram](/assets/raas_classdiagram.drawio.png)

## Stuff I Learned

- Details of the WebRTC protocol and how to implement it in a browser app + the cloud + navigate the various networks involved properly. I anticipate using it more in the future.
- TypeScript monorepo architecture - this project uses a monorepo structure to manage the Lab Client and User Client codebases, which share some common utilities and types. I'm not typically making web apps, but I like to check in on best practices for web development from time-to-time for stuff like this, where the web is the most convenient interface/platform for something interesting in robotics/embedded systems.

<p class="text-center">
{% include elements/button.html link="https://github.com/raas-hybrid-lab/raas-web" text="View GitHub Repo" %}
</p>
