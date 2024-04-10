import sharp from 'sharp'

const source = 'site/assets/jumpy-font.png'
const target = 'site/assets/jumpy-font.json'

const width = 16
const height = 10

const font = []

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const image = await sharp(source).raw()
        const i1 = await image
            .extract({left: x * 6, top: y * 8, width: 6, height: 8})
            .toBuffer({resolveWithObject: true})

        let pixels = ''

        for (let j = 0; j < i1.data.length; j += 3) {
            const i = j / 3
            const x = i % 6
            const y = Math.floor(i / 6)
            const r = i1.data[j + 0]
            const g = i1.data[j + 1]
            const b = i1.data[j + 2]
            pixels += r + g + b > 200 ? '1' : '0'
        }

        const bytes = []
        let byteIndex = 0
        while (true) {
            const byte = pixels.slice(byteIndex * 8, byteIndex * 8 + 8)
            if (byte.length === 0) break

            bytes[byteIndex] = parseInt(byte.padEnd(8, '0'), 2)
            byteIndex++
        }

        font.push(btoa(String.fromCharCode.apply(null, bytes)))
    }
}

await Bun.write(target, JSON.stringify({font}))
