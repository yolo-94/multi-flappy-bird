import { Game } from "./game"

export class Camera {
    public x: number
    public y: number
    constructor (x: number, y: number) {
        this.x = x
        this.y = y
    }

    update (game: Game) {
        this.x = game.bird.x - (game.width/2) + (game.bird.width/2)
    }
}