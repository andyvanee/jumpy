import Module from './lua.js'

const buffers = {
    code: '',
    output: ['Output'],
}

const CustomModule = {
    print: function (text: string) {
        buffers.output.push(text)
        postMessage({cmd: 'print', output: text})
    },
    printErr: function (text: string) {
        postMessage({cmd: 'printErr', output: text})
    },
}

const module = await Module(CustomModule)

onmessage = (ev) => {
    const {cmd, code} = ev.data
    if (cmd === 'evaluate') {
        const ptr = module.stringToNewUTF8(code)
        console.log(`Status: ${module._runMain(ptr)}`)
    }
}
