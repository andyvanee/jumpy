import {jumpyFont} from './assets/jumpyFont'

const canvas = document.querySelector('#screen') as HTMLCanvasElement
if (!canvas) throw new Error('Canvas not found')
const ctx = canvas.getContext('2d')

const width = 480
const height = 270
Object.assign(canvas, {width, height})

const buffer = new OffscreenCanvas(width, height)
const bCtx = buffer.getContext('2d', {willReadFrequently: true})

const clear = () => {
    bCtx.clearRect(0, 0, width, height)
    ctx.clearRect(0, 0, width, height)
}

const text = (buffer: string) => {
    const chars = buffer.split('')
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

export const screen = {
    clear,
    text,
}
