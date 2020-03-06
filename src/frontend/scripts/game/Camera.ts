import { Game } from "./game"

export class Camera {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    update(game: Game) {}

    draw(game: Game) {
        if(game.config.debug) {
            game.drawText(`Camera X:${game.camera.x} Y:${game.camera.y}`, game.width - 10, 45, 15, "white", "end")
        }
    }
}