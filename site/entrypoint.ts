import {ScreenCommand} from './types'

if (!crossOriginIsolated) {
    throw new Error('Requires cross-origin isolation')
}

const worker = new Worker(new URL('worker.js', import.meta.url), {
    type: 'module',
})
const screen = new Worker(new URL('screen.js', import.meta.url), {
    type: 'module',
})

const bufferKey = 'luascript'
const buffers = {
    code: localStorage.getItem(bufferKey),
    output: ['Output'],
}

const codeWrapper = document.querySelector('#code') as HTMLTextAreaElement
const runWrapper = document.querySelector('#run') as HTMLButtonElement
const canvas = document.querySelector('#screen') as HTMLCanvasElement
const offscreen = canvas.transferControlToOffscreen()

const initCmd: ScreenCommand = {cmd: 'init', canvas: offscreen}
const clearCmd: ScreenCommand = {cmd: 'clear'}
const textCmd: (_: string) => ScreenCommand = (text: string) => ({
    cmd: 'text',
    text,
})
screen.postMessage(initCmd, [offscreen])

if (buffers.code) codeWrapper.value = buffers.code

worker.onmessage = (ev) => {
    const {cmd, output} = ev.data

    if (cmd === 'print') {
        buffers.output.push(output)
        screen.postMessage(clearCmd)
        screen.postMessage(textCmd(output))
    }

    if (cmd === 'printErr') {
        console.error(output)
    }
}

screen.postMessage(clearCmd)
screen.postMessage(textCmd('Ready...'))

const evaluate = () => {
    buffers.output = []
    const code = codeWrapper.value
    localStorage.setItem(bufferKey, code)
    worker.postMessage({cmd: 'evaluate', code: codeWrapper.value})
}

runWrapper.addEventListener('click', evaluate)

window.addEventListener('keyup', (e) => {
    if (e.ctrlKey && e.key === 'Enter') evaluate()
})

codeWrapper.addEventListener('keydown', function (e) {
    const {metaKey, shiftKey, ctrlKey} = e
    if (metaKey || shiftKey || ctrlKey) return

    if (e.key == 'Tab') {
        e.preventDefault()
        var start = this.selectionStart
        var end = this.selectionEnd

        // set textarea value to: text before caret + tab + text after caret
        this.value =
            this.value.substring(0, start) + '  ' + this.value.substring(end)

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 2
    }
})
