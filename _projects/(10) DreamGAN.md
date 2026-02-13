---
name: DreamGAN
tools: [Python, VQGAN-CLIP, GANs, CLIP]
image: /assets/wj/dreamgan/FOR_cover.jpg
description: Narrative video generation from prompt sequences, inspired by dream journals.
permalink: /projects/dreamgan/
---

# DreamGAN

In late 2021, I became curious about the GAN-generated images I had seen bouncing around online, and wondered if the same technique could produce narrative videos instead.

After a night or two spent hacking around, I managed to adjust an existing VQGAN-CLIP implementation to produce narrative videos based on a series of prompts. The paper is here: https://arxiv.org/abs/2204.08583

Inspired by the dream journal I was keeping at the time, I called it DreamGAN, and used it to make a number of renderings of my and others' dreams, as well as video accompaniments for my songs.

The (messy) repo is here: https://github.com/cwoodhayes/DreamGAN

## Videos

<div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
	<div style="display: flex; flex-direction: column; gap: 8px;">
		<!-- TODO: Replace VIDEO_URL_1 with the actual embed URL. -->
		<iframe width="560" height="315" src="VIDEO_URL_1" title="DreamGAN Video 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
		<div style="font-size: 0.9rem; color: #666;">TODO: Add caption for video 1.</div>
	</div>
	<div style="display: flex; flex-direction: column; gap: 8px;">
		<!-- TODO: Replace VIDEO_URL_2 with the actual embed URL. -->
		<iframe width="560" height="315" src="VIDEO_URL_2" title="DreamGAN Video 2" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
		<div style="font-size: 0.9rem; color: #666;">TODO: Add caption for video 2.</div>
	</div>
</div>
