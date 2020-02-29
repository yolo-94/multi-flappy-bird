import { Game } from "./game";
import { Box2d } from "./Box2d";
import { RectType } from "./Draw";
import { randomNumber } from "./utils";

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

export class Bird {
    color: string = "red"
    x: number = 0
    y: number = 0
    width: number = 34
    height: number = 24
    status: BirdStatus = BirdStatus.down

    // velocityX: number = 0
    velocityY: number = 0

    angle: number = -30

    jumped: boolean = false

    jumpY: number = 0

    isDead: boolean = false

    collideType: CollideType = CollideType.none

    box2d: Box2d

    collided: boolean

    defaultVelocityY: number = -8

    constructor () {
        this.box2d = new Box2d(0, 0, 34, 24)
        this.startAnimation()
    }

    update(game: Game) {
        if(this.x == 0 && this.y == 0) {
            // this.x = game.width
            // this.y = 300
            this.reset(game)
        } else {
            this.x += game.speed
        }

        this.velocityY += game.gravity
        this.velocityY = this.velocityY > game.velocityMax ? game.velocityMax : this.velocityY
        this.y += this.velocityY

        // Jump !
        if(this.collideType == CollideType.none && !this.isDead) {
            if(!this.jumped && game.input.space) {
                this.jumped = true
                this.jumpY = this.y
                this.velocityY = this.defaultVelocityY
            } else if (!game.input.space) {
                this.jumped = false
            }

        } else {
            this.y -= this.velocityY
        }

        if(this.collideType != CollideType.bottom) {
            if(0 > this.velocityY) {
                this.angle = -35
            } else if(this.angle <= 90) {
                this.angle += 5
            }
        }
        // --------

        this.collision(game)

        this.box2d.x = this.x
        this.box2d.y = this.y

        // if(this.collided && this.collideType == CollideType.bottom) {
        //     game.speed = 0
        // }
    }

    draw(game: Game) {
        game.drawRotatedImage(`${this.color}bird-${this.status}`, this.x, this.y, this.angle, this.width, this.height)

        this.box2d.draw(game)

        // if(this.collided) {
        //     game.drawText("Touché !!!!", 10, 50, 50, "red")
        // }

        // game.drawText("X " + this.x, 10, 400, 50, "green")
        // game.drawText("DEAD = " + (this.isDead ? "true" : "false"), 10, 500, 50, "blue")
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

    collision(game: Game) {
        this.collideType = CollideType.none
        if(this.y + this.height >= game.ground.y && game.ground.y != -1) {
            // console.log("ouch !", this.y, game.ground.y)
            this.collideType = CollideType.bottom
            this.collided = true
            this.kill(game)
            
            return
        }

        if(this.y < 0) {
            // console.log("aïe !", this.x, this.y)

            this.collideType = CollideType.other
            this.collided = true
            this.kill(game)

            return
        }

        let collided = false

        for(let i = 0; i < game.pipesManager.pipes.length; i++) {
            let pipe = game.pipesManager.pipes[i]
            
            if(
                (pipe.x >= this.x + this.width) // trop à droite
            ||  (pipe.x + pipe.width <= this.x) // trop à gauche
            ||  (pipe.y >= this.y + this.height) // trop en bas
            ||  (pipe.y + pipe.height <= this.y) // trop en haut
            ) {
                // Pas touché...
            } else {
                // console.log("Collided", Date.now())
                collided = true

                if(pipe.y >= this.y + this.height) {
                    this.collideType = CollideType.bottom
                } else {
                    this.collideType = CollideType.other
                }
            }
        }

        this.collided = collided

        if(this.collided) {
            this.kill(game)
        }
    }

    kill(game: Game) {
        if(!this.isDead) {
            this.isDead = true
            // game.background.deathAnimation()
            this.reset(game)
        }
    }

    reset(game: Game) {
        this.x = game.width
        this.y = 300
        this.velocityY = this.defaultVelocityY
        this.isDead = false
        this.collided = false
        this.collideType = CollideType.none
        game.speed = game.defaultSpeed
        game.score.reset()
        game.pipesManager.reset(game)
    }
}

export class BirdIntro extends Bird {

    mustJump: boolean = false

    constructor(game: Game) {
        super()

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
            this.velocityY = this.defaultVelocityY
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