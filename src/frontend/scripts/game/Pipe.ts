import { Game } from "./game";
import { Box2d } from "./Box2d";
import { Obstacle } from "./Obstacle";

export enum PipeRotation {
    top,
    bottom
}

export class Pipe extends Obstacle {
    public rotation: PipeRotation
    constructor(data: any) {
        super(data)
        this.rotation = data.rotation
    }

    draw(game: Game) {
        if (this.rotation == PipeRotation.top) {
            let y = this.y
            game.drawImage("pipe-green-top-part", this.x, y)
            for(y += 26; y < this.y + this.height + 20; y += 20) {
                game.drawImage("pipe-green-bottom-part", this.x, y)
            }
        } else {
            let y = this.y + this.height - 26
            game.drawRotatedScalledImage("pipe-green-top-part", this.x, y, 180, [-1, 1])
            for(y -= 20; y > this.y - 20; y -= 20) {
                game.drawImage("pipe-green-bottom-part", this.x, y)
            }
        }

        this.box2d.draw(game)
    }

}