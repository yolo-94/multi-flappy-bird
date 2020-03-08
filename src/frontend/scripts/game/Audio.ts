export class GameAudio {

    constructor(public element: HTMLAudioElement) {}

    play(t: number = 0) {
        this.element.currentTime = t
        this.element.play()
    }

    static load(src: string): Promise<GameAudio> {
        return new Promise((resolve, reject) => {
            let element = new Audio(src)
            let audio = new GameAudio(element)
            element.oncanplay = function () {
                resolve(audio)
            }
            element.onerror = function () {
                reject(audio)
            }
        })

    }
}