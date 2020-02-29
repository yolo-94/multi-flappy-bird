import { Game } from "./game";
import { Box2d } from "./Box2d";

export enum PipeRotation {
    top,
    bottom
}

export class Pipe {

    dead: boolean = false

    width: number = 52
    
    height: number = 320

    crossed: boolean = false

    box2d: Box2d

    size = {
        topPart: 26,
        bottomPart: 20,
        width: 52
    }

    constructor (
        public x: number,
        public y: number,
        public rotation: PipeRotation = PipeRotation.top
    ) {
        this.box2d = new Box2d(x, y, this.width, this.height)
    }

    update (game: Game) {
        if(!this.dead) {
            if(!this.crossed && this.x < game.bird.x + (game.bird.width / 2)) {
                this.crossed = true
            }

            if(this.x < game.bird.x - game.width) {
                this.dead = true
            }
        }
    }

    draw (game: Game) {
        if(!this.dead) {
            // game.drawRotatedImage("pipe-green", this.x, this.y, this.rotation)

            game.drawRotatedImage("pipe-green-top-part", this.x, this.y, this.rotation == PipeRotation.bottom ? 180 : 0)

            if(this.rotation == PipeRotation.top) {
                for(let y = this.y + this.size.topPart; y < game.ground.y ; y += this.size.bottomPart) {
                    game.drawImage("pipe-green-bottom-part", this.x, y)
                }
            } else {
                
            }

            this.box2d.draw(game)
        }
    }
}