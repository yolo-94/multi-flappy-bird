import { Game } from "./game";
import { Box2d } from "./Box2d";
import { RectType } from "./Draw";
import { randomNumber } from "./utils";
import { Scene } from "./Scene";

// BIRD BASE
enum BirdStatus {
    down = "down",
    middle = "middle",
    up = "up"
}

enum CollideType {
    none,
    bottom,
    other
}

enum BirdDirection {
    left,
    right
}

export abstract class BirdBase {
    protected _x: number
    protected _y: number
    protected _width: number
    protected _height: number
    public angle: number
    public velocityY: number
    public defaultVelocityY: number = 0
    public defaultJumpVelocityY: number = -8
    public status: BirdStatus = BirdStatus.down
    public speed: number = 0
    public direction: BirdDirection = BirdDirection.right
    public move: boolean = false
    public alive: boolean = true
    
    public name: string = ""
    public color: string = "red"
    public currentSectionId: number = 0
    public score: number = 0

    public debug = true

    constructor(game: Game) {
        this.x = 0
        this.y = 0
        this.angle = 0
        this.velocityY = 0
        this.setDefaultSize(game)
        this.startAnimation()
    }

    abstract update(game: Game): void

    draw(game: Game): void {
        game.drawRotatedImage(`${this.color}bird-${this.status}`, this.x, this.y, this.angle, this.width, this.height)

        if(this.name != "") {
            game.drawText(this.name, this.x + this.width / 2, this.y + this.height + 15, 15, "white", "center", false)
        }

        if(this.debug && game.config.debug) {
            game.drawText("move: " + (this.move ? "true" : "false"), this.x + this.width / 2, this.y + this.height + 35, 15, this.move ? "#82ff84" : "red", "center", false)
            game.drawText("section: " + this.currentSectionId, this.x + this.width / 2, this.y + this.height + 50, 15, "white", "center", false)
            game.drawText("score: " + this.score, this.x + this.width / 2, this.y + this.height + 65, 15, "white", "center", false)
        }
    }

    
    startAnimation() {
        setInterval(() => {
            switch(this.status) {
                case BirdStatus.down:
                    this.status = BirdStatus.middle
                    break
                case BirdStatus.middle:
                    this.status = BirdStatus.up
                case BirdStatus.up:
                    this.status = BirdStatus.down
            }
        }, 100)
    }

    setDefaultSize(game: Game) {
        this.width = game.config?.birdSize?.width ?? 34
        this.height = game.config?.birdSize?.height ?? 24
    }

    setStartPosition(game: Game) {
        this.setDefaultSize(game)
        this.x = game.config.startPosition.x - (this.width / 2)
        this.y = game.config.startPosition.y - (this.height / 2)
    }

    get x(): number {
        return this._x
    }

    get y(): number {
        return this._y
    }

    set x(v: number) {
        this._x = v
    }

    set y(v: number) {
        this._y = v
    }
    
    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    set width(width: number) {
        if(width != this._width) {
            this.changeSize(width, this._height)
        }
    }

    set height(height: number) {
        if(height != this._height) {
            this.changeSize(this._width, height)
        }
    }

    protected changeSize(width: number, height: number): void {
        this.x += (this.width - width) / 2
        this.y += (this.height - height) / 2
        this._width = width
        this._height = height
    }

    updateGravity(game: Game) {
        // Gravité
        if(!this.alive && this.velocityY < 0) {
            this.velocityY = 0
        }
        this.velocityY += game.gravity
        this.velocityY = this.velocityY > game.velocityMax ? game.velocityMax : this.velocityY
        this.y += this.velocityY

        // Angle
        if(0 > this.velocityY) {
            this.angle = -35
        } else if(this.angle <= 90) {
            this.angle += this.velocityY
            if(this.angle > 90) {
                this.angle = 90
            }
        }
    }

    updateXMoving(game: Game) {
        this.x += this.direction == BirdDirection.right ? this.speed : -this.speed
    }

    hit(game: Game, onPipe: boolean = false) {
        this.alive = false
        game.assets.getFile("audio:hit")?.play(0)
        if(onPipe) {
            setTimeout(() => {
                game.assets.getFile("audio:lose")?.play(0)
            }, 100)
        }
    }

    jump(game: Game) {
        this.velocityY = this.defaultJumpVelocityY
        game.assets.getFile("audio:jump")?.play(0)
    }
}


// --------------------------------------------------------------------
// Bird Player
// --------------------------------------------------------------------
export class Bird extends BirdBase {
    public box2d: Box2d

    public jumped: boolean = false

    public lastSectionId: number = null

    constructor(game: Game) {
        super(game)
        this.setStartPosition(game)
        this.box2d = new Box2d(this.x, this.y, this.width, this.height)
        this.speed = game.config.defaultBirdSpeed
        this.defaultJumpVelocityY = game.config.defaultVelocityJumpY
    }

    update(game: Game): void {
        this.width = game.config.birdSize.width
        this.height = game.config.birdSize.height
        this.name = game.player.name

        if(this.move) {

            // Jump
            if(this.alive) {
                if(!this.jumped && game.input.jump()) {
                    this.jumped = true
                    this.jump(game)
                } else if(!game.input.jump()) {
                    this.jumped = false
                }
            }

            this.updateGravity(game)

            if(this.alive) {
                this.updateXMoving(game)
            }

            if(this.y > 1000) {
                this.reset(game)
            }
        } else {
            this.alive = true
            if(game.input.jump()) {
                this.move = true
            }
        }

        this.box2d.x = this.x
        this.box2d.y = this.y
        this.box2d.width = this.width
        this.box2d.height = this.height

        this.collision(game)

        let needSectionUpdate = false

        if(this.currentSectionId !== this.lastSectionId) {
            this.lastSectionId = this.currentSectionId
            needSectionUpdate = true
        }

        game.server.sendUpdate([
            this.x,
            this.y,
            this.angle,
            this.speed,
            this.direction,
            this.move ? 1 : 0,
            this.velocityY,
            // needSectionUpdate ? this.currentSectionId : null
            this.currentSectionId,
            this.score
        ])

    }

    draw(game: Game) {
        super.draw(game)
        this.box2d.draw(game)
    }

    reset(game: Game) {
        this.move = false
        this.angle = 0
        this.velocityY = 0
        this.speed = game.config.defaultBirdSpeed
        this.alive = true
        this.setStartPosition(game)
    }

    collision(game: Game) {
        let section = (game.scene as Scene).sectionList.currentSection(this)
        let sectionBefore = section ? (game.scene as Scene).sectionList.get(section.id - 1) : null

        let alive = this.alive

        if(alive) {
            if(this.y < 0) {
                this.hit(game)
                return
            }
            if(this.y + this.height >= (game.scene as Scene).ground.y) {
                this.hit(game)
                return
            }
            if(sectionBefore) {
                for(let object of sectionBefore.objects) {
                    if(object.touch(this)) {
                        if(alive) {
                            this.hit(game, true)
                            return
                        }
                    }
                }
            }
            if(section) {
                for(let object of section.objects) {
                    if(object.touch(this)) {
                        if(alive) {
                            this.hit(game, true)
                            return
                        }
                    }
                }
            }
        } else {

        }
    }

    addScore(game: Game, amount: number): void {
        this.score += amount
        game.assets.getFile("audio:score")?.play(0)
    }

    resetScore() {
        this.score = 0
    }

}

// --------------------------------------------------------------------
// Bird controlled by other player
// --------------------------------------------------------------------

export class BirdClientList {
    public birds: BirdClient[] = []

    createBird(game: Game, playerId: string) {
        let bird = new BirdClient(game, playerId)
        this.birds.push(bird)
        return bird
    }

    exist(playerId) {
        for(let i = 0; i < this.birds.length; i++) {
            if(this.birds[i].playerId == playerId) {
                return true
            }
        }
        return false
    }

    getById(playerId: string): BirdClient {
        for(let bird of this.birds) {
            if(bird.playerId == playerId) {
                return bird
            }
        }
        return null
    }

    removeById(id: string) {
        this.birds = this.birds.filter((bird) => {
            return !(id === bird.playerId)
        })
    }
}

export class BirdClient extends BirdBase {
    public playerId: string
    
    constructor(game: Game, playerId: string) {
        super(game)
        this.color = "blue"
        this.playerId = playerId
    }

    update(game: Game): void {
        this.width = game.config.birdSize.width
        this.height = game.config.birdSize.height

        if(this.move) {
            this.updateGravity(game)
            this.updateXMoving(game)
        }
    }

    changePosition(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

// --------------------------------------------------------------------
// Bird with AI
// --------------------------------------------------------------------
export class BirdIntro extends BirdBase {

    mustJump: boolean = false

    debug: boolean = false

    constructor(game: Game) {
        super(game)

        if(randomNumber(0, 1) == 0) {
            this.color = "red"
        } else {
            this.color = "blue"
        }

        this.goBack(game)

        let r = () => {
            setTimeout(() => {
                this.mustJump = true
                r()
            }, randomNumber(400, 600))
        }

        r()
    }

    update(game: Game) {

        if((this.x + this.width > game.width + 100) || (this.y - 50 > game.height)) {
            this.goBack(game)
        }
 
        // Gravité
        this.velocityY += game.gravity
        this.velocityY = this.velocityY > game.velocityMax ? game.velocityMax : this.velocityY
        this.y += this.velocityY

        
        // Jump
        if(this.y < -10) {
            this.mustJump = false
        }
        if(this.mustJump) {
            this.velocityY = this.defaultJumpVelocityY
            this.mustJump = false
        }

        // Angle
        if(0 > this.velocityY) {
            this.angle = -35
        } else if(this.angle <= 90) {
            this.angle += 5
        }

        this.x ++
    }

    goBack(game: Game) {
        this.x = randomNumber(-game.width/2, -30)
        this.y = randomNumber(0, game.height)
    }
}