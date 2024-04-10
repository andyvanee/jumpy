import {jumpyFont} from './assets/jumpyFont'
import {ScreenCommand, DrawText, InitScreen, ScreenState} from './types'

const width = 480
const height = 270
const buffer = new OffscreenCanvas(width, height)
const bCtx = buffer.getContext('2d', {willReadFrequently: true})

const state: ScreenState = {
    canvas: null,
}

const init = (command: InitScreen) => {
    state.canvas = command.canvas
    Object.assign(state.canvas, {width, height})
}

const text = (command: DrawText) => {
    const ctx = state.canvas?.getContext('2d')
    if (!ctx) return

    const chars = command.text.split('')
    const margin = {x: 30, y: 27}
    const lineHeight = 12
    const horizAdvance = 6
    const currentOffset = {x: margin.x, y: margin.y}

    for (const char of chars) {
        // Break if we're out of bounds
        if (currentOffset.y > height - (margin.y + lineHeight)) break

        // Skip leading spaces
        if (currentOffset.x === margin.x && [' '].includes(char)) continue

        if (char === '\n') {
            currentOffset.x = margin.x
            currentOffset.y += lineHeight
            continue
        }

        if (char === '\t') {
            currentOffset.x += horizAdvance * 4
            continue
        }

        bCtx.putImageData(jumpyFont[char.charCodeAt(0)], currentOffset.x, currentOffset.y)

        currentOffset.x += horizAdvance

        if (currentOffset.x > width - (margin.x + horizAdvance)) {
            currentOffset.x = margin.x
            currentOffset.y += lineHeight
        }
    }

    ctx.putImageData(bCtx.getImageData(0, 0, width, height), 0, 0)
}

const clear = () => {
    const ctx = state.canvas?.getContext('2d')
    if (!ctx) return
    bCtx.clearRect(0, 0, width, height)
    ctx.clearRect(0, 0, width, height)
}

onmessage = (ev) => {
    const command = ev.data as ScreenCommand

    switch (command.cmd) {
        case 'init':
            init(command)
            break
        case 'text':
            text(command)
            break
        case 'clear':
            clear()
            break
    }
}
