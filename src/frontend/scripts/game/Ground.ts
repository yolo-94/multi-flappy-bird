import { Game } from "./game";

export class Ground {
    public width: number = 336
    public height: number = 112
    public y: number = -1
    constructor (game: Game) {
        let img = game.getImg("base")
        this.width = img.width
        this.height = img.height
    }

    update(game: Game) {
        this.y = game.config.groundY
    }

    draw(game: Game) {
        let x = -(game.camera.x % this.width)

        if(x > 0) {
            let x2 = x - this.width
            do {
                game.drawImage("base", x2, this.y, null, null, true)
                x2 -= this.width
            } while(x2 > 0)
        }

        do {
            game.drawImage("base", x, this.y, null, null, true)
            x += this.width
        } while(x <  game.width)
    }
}