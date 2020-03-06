import { RectType } from "./Draw";
import { Game } from "./game";

export class Box2d {
    constructor (
        public x: number,
        public y: number,
        public width: number,
        public height: number
    ) {}

    draw (game: Game) {
        if(game.config.debug && game.config.debugBox2d) {
            game.drawRect(this.x, this.y, this.width, this.height, RectType.fill, "#f009")
        }
    }
}

export type Box = {x: number, y: number, width: number, height: number}