import { Box2d } from "./Box2d"
import { Game } from "./game"
import { PipeRotation } from "./Pipe"
import { Bird } from "./Bird"

export enum ObstacleType {
    default,
    pipe,
    redPipe,
    block
}

export class Obstacle {
    public x: number
    public y: number
    public width: number
    public height: number
    public rotation: PipeRotation
    public box2d: Box2d
    public type: ObstacleType
    public killer: boolean

    // constructor(x: number, y: number, width: number, height: number, rotation: PipeRotation, type: ObstacleType = ObstacleType.pipe) {
    constructor(data: any) {
        this.x = data.x
        this.y = data.y
        this.width = data.width
        this.height = data.height
        this.type = data.type
        this.killer = data.killer
        this.box2d = new Box2d(this.x, this.y, this.width, this.height)
    }

    update(game: Game) {}

    draw(game: Game) {}

    touch(obj: any) {
        if(this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.height + this.y > obj.y) {
            return true
        }

        return false
    }
}