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
        // game.drawRect(this.x, this.y, this.width, this.height, RectType.fill, "#f009")
    }
}