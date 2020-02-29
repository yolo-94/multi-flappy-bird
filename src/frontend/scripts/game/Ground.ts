import { Game } from "./game";

export class Ground {
    public width: number = 336
    public height: number = 112
    public y: number = -1
    constructor () {}

    update(game: Game) {
        this.y = game.height - 112
    }

    draw(game: Game) {
        let x = -(game.camera.x % this.width)
        do {
            game.drawImage("base", x, this.y, null, null, true)
            x += this.width
        } while(x <  game.width)

        // if((x+this.width) < game.width) {
        //     game.drawImage("base", x + this.width, y, null, null, true)
        // }
        
    }
}