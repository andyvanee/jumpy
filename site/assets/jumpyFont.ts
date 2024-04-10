import {font} from './jumpy-font.json'

const canvas = new OffscreenCanvas(6, 8)
const ctx = canvas.getContext('2d', {willReadFrequently: true})

export const jumpyFont = font.map((glyph, index) => {
    const binaryString = atob(glyph)
    const bytes = new Uint8Array(binaryString.length)
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }

    const imageData = ctx.createImageData(6, 8)
    for (let i = 0; i < imageData.data.length; i += 4) {
        const index = i / 4
        const byte = bytes[Math.floor(index / 8)]
        const bit = (byte >> (7 - (index % 8))) & 1
        const alpha = bit * 255
        // Modify pixel data
        imageData.data[i + 0] = 201
        imageData.data[i + 1] = 220
        imageData.data[i + 2] = 201
        imageData.data[i + 3] = alpha
    }
    return imageData
})
