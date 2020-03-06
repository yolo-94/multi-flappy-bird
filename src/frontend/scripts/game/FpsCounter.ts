import { Game } from "./game"

export class FpsCounter {
    public upsCount: number = 0
    public fpsCount: number = 0
    public drawPsCount: number = 0
    public serverUpdatePsCount: number = 0
    public ups: number = 0
    public fps: number = 0
    public drawPs: number = 0
    public serverUpdatePs: number = 0

    constructor () {
        setInterval(() => {
            this.ups = this.upsCount
            this.fps = this.fpsCount
            this.serverUpdatePs = this.serverUpdatePsCount
            this.upsCount = 0
            this.fpsCount = 0
            this.serverUpdatePsCount = 0
        }, 1000)
    }

    update() {
        this.upsCount++
    }

    draw(game: Game) {
        this.fpsCount++

        this.drawPsCount++

        if(game.config.debug) {
            game.drawText(`${this.fps} frames par seconde`, game.width - 10, 15, 15, "white", "right")
            game.drawText(`${this.drawPsCount} drawImage() par frame`, game.width - 10, 30, 15, "white", "right")
            game.drawText(`${this.serverUpdatePs} réponses reçues par seconde`, game.width - 10, 80, 15, "white", "right")
        }


        this.drawPsCount = 0
    }
}