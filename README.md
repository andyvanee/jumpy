# Jumpy - A fantasy console

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Abstract

There is a simplicity of "Fantasy consoles" like pico-8 and virtual machines
that emulate simpler processors like the 6502 and the machines that used them
such as NES and Commodore 64. To attain this simplicity, there are always
tradeoffs to be made regarding hardware and software capabilities. This project
is an experiment with a different set of goals and tradeoffs.

## Goals

- [ ] Web based dev environment / runtime
- [ ] Target memory/cpu constrained platforms (ESP32 / Pi Pico / etc)
- [ ] Embedded Lua interpreter (possibly with processing-style setup/draw functions?)
- [ ] Graphics modes: Text / Sprite / Framebuffer

## Specifications

-   Screen size: 480w x 270h. 16/9 aspect ratio, rounded to fit device
-   Built in font: 6 x 8 (+ 4 line height)
-   Text mode: 70 characters wide (420px text + 60 / 30px gutter)
-   Text mode: 18 lines high (216px text + 54 / 27px gutter)
