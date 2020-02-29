import { Game } from "./game";
import { Pipe, PipeRotation } from "./Pipe";

export class PipesManager {
    public pipes: Pipe[]

    private limits = {
        top: 0,
        bottom: 0
    }
    
    constructor (game: Game) {
        this.limits.bottom = game.height - game.ground.height
        this.pipes = []


        this.createNewPipes(game)
    }

    update (game: Game) {
        let newPipeList = []
        let crossed = false
        for(let i = 0; i < this.pipes.length; i++) {
            this.pipes[i].update(game)
            if(!this.pipes[i].dead) {
                crossed = this.pipes[i].crossed
                newPipeList.push(this.pipes[i])
            } else {
                this.pipes[i] = null
            }
        }

        this.pipes = newPipeList

        if(crossed) {
            this.createNewPipes(game)
            game.score.addScore()
        }
    }

    draw (game: Game) {
        for(let i = 0; i < this.pipes.length; i++) {
            this.pipes[i].draw(game)
        }
        // game.drawRotatedImage("pipe-green", game.camera.x + 100, game.camera.y + 100, game.camera.x % 360, null, null, false)
    }

    createNewPipes(game: Game) {
        let x = game.bird.x
        let minY = -130
        let maxY = 0
        let y = Math.floor(Math.random()*(maxY-minY+1)+minY)
        let voidSize = 125

        this.pipes.push(
            new Pipe(x + 300, y, PipeRotation.bottom),
            new Pipe(x + 300, y + 320 + voidSize, PipeRotation.top)
        );
    }

    reset(game: Game) {
        this.pipes = []
        this.createNewPipes(game)
    }
}