---
name: Wesper - Sleep Lab at Home
tools: [Firmware, Cloud Architecture, Backend Development, Python, AWS, BLE, Embedded Systems, FDA Medical Device]
image: /assets/wesper/IMG_6207.jpeg
description: Firmware, cloud architecture, and backend development for a consumer sleep monitoring device. Led FDA clearance for sleep apnea diagnosis and enabled mass production.
permalink: /projects/wesper/
---

![Wesper branding](/assets/wesper/patches.jpeg)

# Wesper: Sleep Lab at Home

## Firmware, Cloud Architecture, and Backend Development

I arrived at [Wesper](https://wesper.co/) in 2020 as the 8th employee and first full-time software hire.

At that time, the company had a functioning demo device & app, but it was not FDA cleared, had no backend, and the product had yet to be sold to a customer.

### My Primary Contributions

- **Originated cloud architecture, backend API, and database schema/overall cloud dataflow** for ingesting & processing sleep data, enabling us to ship to our first customers
- **Added firmware support for new sensors, onboard algorithms** (i.e. live SpO2 and heart rate monitoring), and reporting capabilities over BLE, resulting in **FDA clearance for sleep apnea diagnosis in 2022**
- **Enabled mass production in China**—added firmware support for multiple boards & processors, wrote software for automated board programming, testing, and tracking by ID

<div style="display: flex; gap: 16px; align-items: flex-start;">
    <img src="/assets/wesper/IMG_6207.jpeg" alt="Wesper patches" width="300" height="auto">
    <img src="/assets/wesper/wesper_placement.jpeg" alt="Patch location" width="300" height="auto">
</div>

<p style="font-size: 0.9em; color: #666; margin-top: 8px;">Left: patches + v2.8 board; Right: 2 patches are adhered to the skin overnight as shown; this entirely replaces an in-lab sleep test for sleep apnea diagnosis.</p>

### Company Growth

When I left in 2022, Wesper had grown to 23 employees and raised a Series A. Now it's up to 30+ employees and several hundred patients per night.
### Tech Specs

**Patches:**
- NRF52-based custom boards
- Firmware written in bare-metal C with NRF SDK
- Streams data to phone app over BLE; phone relays data to cloud

**Cloud:**
- All services running on AWS—uses EC2, ECS, Lambda, S3, RDS, etc.
- All backend written in Python (API is in Flask), except the core algorithm suite written in Matlab

### Takeaways

- Learned cloud architecture, backend development, and some front-end development independently on the job
- Learned how to ship a consumer hardware product (design-for-manufacture, mass production, agile development & product management, working with designers & C-suite)
- Realized I wanted to change focus to algorithms & machine learning

### Links

- [Wesper Official Website](https://wesper.co/)
