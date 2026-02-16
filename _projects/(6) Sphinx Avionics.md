---
name: NASA JPL - Sphinx Deep-Space Avionics BSP
tools: [Avionics, FPGA, Board Bring-up, Embedded Systems, Deep Space, NASA, Hardware Testing]
image: /assets/space work/sphinx_lores.png
description: 1U avionics board for deep space missions. Created automated board validation test suite and firmware for memory controllers and communication buses. Flew on NASA's NEA Scout, Lunar Flashlight, and MarCO cubesat missions.
permalink: /projects/sphinx-avionics/
date: 2017-01-01
---

<img src="/assets/space work/sphinx_lores.png" alt="Sphinx Avionics Board" style="width: 100%; max-width: 500px; margin: 0 auto 2rem; display: block;">

# Sphinx - Novel 1U Avionics Board for Deep Space Missions

**Jan-July 2017** - Electronics Design, Validation, and Test Intern @ NASA Jet Propulsion Laboratory (JPL)

I helped bring up the [Sphinx Command & Data Handling Avionics Board](https://ieeexplore.ieee.org/document/7943885): the first deep-space capable cubesat avionics system.

### My Contributions

- **Created the automated board validation test suite** (still in use) — due to this, listed as inventor for *NASA Copyright of Invention NPO 51462-CP*
- **As part of the above, wrote firmware (for the [Gaisler GR712](https://www.gaisler.com/products/gr712rc) rad-hardened SPARC microprocessor) & Python test harnesses** for:
  - NOR & NAND flash memory controllers with EDAC
  - SPI, I2C, CAN, and SpaceWire buses

These contributions became the foundation for the official board support package (BSP) for Sphinx, which is still in use.

### Mission History

Sphinx has since traveled around the solar system on NASA's:
- **NEA Scout** - Near-Earth Asteroid Scout mission
- **Lunar Flashlight** - Lunar South Pole ice detection mission
- **MarCO** - Mars Cube One relay communications cubesats

### Takeaways

- Detailed knowledge of board bring-up, common components & protocols, and use of FPGAs in real-world systems
- General hardware debugging skills on high-cost equipment
- Specific knowledge of how the deep space environment (radiation, vacuum) affects electronics, and mitigation strategies for the issues involved (i.e. error detection & correction codes, triple fault mitigation, bus design, etc.)

NEA scout mission concept art, which flew with Sphinx as its primary compute hardware.
![NASA Lunar Flashlight](/assets/space%20work/Lunar_Flashlight_spaceprobe.jpeg)

### Links

- [Sphinx Board Paper](https://ieeexplore.ieee.org/document/7943885)
- [NASA JPL](https://www.jpl.nasa.gov/)
