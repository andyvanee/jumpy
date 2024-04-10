export interface ScreenState {
    canvas: OffscreenCanvas | null
}

export interface InitScreen {
    cmd: 'init'
    canvas: OffscreenCanvas
}

export interface DrawText {
    cmd: 'text'
    text: string
}

export interface Clear {
    cmd: 'clear'
}

export type ScreenCommand = InitScreen | DrawText | Clear
