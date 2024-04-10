import path from 'path'
import {type BuildConfig} from 'bun'
import {watch} from 'fs'

const siteDir = 'site'

const buildConfig: BuildConfig = {
    entrypoints: ['entrypoint.ts', 'worker.ts', 'screen.ts'].map((entry) =>
        path.join(siteDir, entry)
    ),
    minify: false,
    root: 'site/',
    sourcemap: 'inline',
    format: 'esm',
    splitting: true,
    publicPath: '/',
    external: ['./site/lua.js', './site/lua.ww.js', './site/lua.worker.mjs'],
}

let build = await Bun.build(buildConfig)

console.log({build})

// required for SharedArrayBuffer and Web Workers
const documentHeaders = {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
}

Bun.serve({
    port: 8080,
    async fetch(req) {
        const pathname = new URL(req.url).pathname.replace(/\/$/, '/index.html')
        const sitePath = path.join(siteDir, pathname)

        for (const output of build.outputs) {
            const buildPath = path.join(siteDir, output.path)
            if (buildPath === sitePath) {
                return new Response(output, {headers: documentHeaders})
            }
        }

        {
            const file = Bun.file(sitePath)
            if (await file.exists()) {
                return new Response(file, {headers: documentHeaders})
            }
        }
        return new Response('Bun!')
    },
})

watch(siteDir, {recursive: true}, async (event, filename) => {
    console.log(`File ${event}: ${filename}`)
    build = await Bun.build(buildConfig)
})

console.log('Bun is running on port 8080!')
