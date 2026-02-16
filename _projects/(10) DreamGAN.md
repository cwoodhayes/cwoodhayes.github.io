---
name: DreamGAN
tools: [Visual Art, Python, Machine Learning, Video Generation, Prompt Engineering]
category: art
description: Narrative video generation from prompt sequences, inspired by dream journals.
permalink: /projects/dreamgan/
date: 2021-01-01
preview_gif: /assets/wj/dreamgan/for_cover.mp4
---

# DreamGAN

TODO put main video

In late 2021, I became curious about the GAN-generated images I had seen bouncing around online, and wondered if the same technique could produce narrative videos instead.

After a night or two spent hacking around, I managed to adjust an existing VQGAN-CLIP implementation to produce narrative videos based on a series of prompts. The paper is here: https://arxiv.org/abs/2204.08583

Inspired by the dream journal I was keeping at the time, I called it DreamGAN, and used it to make a number of renderings of my and others' dreams, as well as video accompaniments for my songs.

The (messy) repo is here: https://github.com/cwoodhayes/DreamGAN

## Videos

<div style="display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap;">
	<div style="display: flex; flex-direction: column; gap: 8px;">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/S6O-gWxELzc?si=eBGGfmy55P7ErJBl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
		<div style="font-size: 0.9rem; color: #666;">Visual accompaniment to my song Fall of Rome.</div>
	</div>
	<div style="display: flex; flex-direction: column; gap: 8px;">
		<!-- TODO: Replace VIDEO_URL_2 with the actual embed URL. -->
        <iframe width="560" height="315" src="https://www.youtube.com/embed/1vwQUll3j08?si=X0JpmU_JUexXsj8C" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
		<div style="font-size: 0.9rem; color: #666;">My first attempts were visualization of actual dreams I wrote down in a dream journal.</div>
	</div>
	<div style="display: flex; flex-direction: column; gap: 8px;">
		<!-- TODO: Replace VIDEO_URL_1 with the actual embed URL. -->
		<iframe width="560" height="315" src="https://www.youtube.com/embed/UtfAmx5YVrk?si=9Fc9mjg_6haY-Y3M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
		<div style="font-size: 0.9rem; color: #666;">A brief explanatory video for a DreamGAN video I made during a livestream, as an accompaniment to my song Marry Another Man.</div>
	</div>
</div>
