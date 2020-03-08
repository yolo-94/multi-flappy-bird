import { Game } from "./game";
import { Background } from "./Background";
import { BirdIntro, Bird, BirdClientList } from "./Bird";
import { Camera } from "./Camera";
import { Obstacle, ObstacleType } from "./Obstacle";
import { SectionList } from "./Section";
import { RectType } from "./Draw";
import { Pipe } from "./Pipe";
import { Ground } from "./Ground";

export enum ServerDataType {
    BirdUpdate,
    SectionUpdate
}

export class SceneBase {
    public needServerUpdate: boolean = false

    constructor(game: Game) {}

    update(game: Game) {}

    draw(game: Game) {}
}

export class Scene extends SceneBase {
    public ground: Ground
    public background: Background
    public bird: Bird
    public birdClientList: BirdClientList
    public sectionList: SectionList
    public camera: Camera

    public playerList: {
        [id: string]: {
            name: string
        }
    }

    constructor(game: Game) {
        super(game)
        this.needServerUpdate = true
        this.playerList = {}
        this.camera = game.camera
        this.ground = new Ground(game)
        this.background = new Background(game)
        this.sectionList = new SectionList()
        this.bird = new Bird(game)
        this.birdClientList = new BirdClientList()

        game.server.getName().then((name) => this.bird.name = name)
    }

    update(game: Game) {

        this.sectionList.update(game)

        for(let bird of this.birdClientList.birds) {
            bird.update(game)
        }

        this.bird.update(game)
        
        this.background.update(game)

        this.ground.update(game)

        if(this.bird.move) {
            game.menu.close()
        } else {
            game.menu.waitForMoving()
            this.sectionList.reset(game)
            this.bird.resetScore()
        }



        let section = this.sectionList.currentSection(this.bird)
        
        if(section) {
            this.bird.currentSectionId = section.id
            if(!section.scoreZoneReached && section.touchScoreZone(this.bird)) {
                section.scoreZoneReached = true
                this.bird.addScore(game, section.scoreAmount)
            }
        }

        this.followEntity(game, this.bird)
    }

    draw(game: Game) {
        this.background.draw(game)

        this.sectionList.draw(game)

        this.ground.draw(game)

        for(let bird of this.birdClientList.birds) {
            bird.draw(game)
        }
        this.bird.draw(game)

        let i = game.config.debug ? 100 :  20
        game.drawText(`${Object.keys(this.playerList).length} joueur(s) en ligne`, game.width-10, i, 15, "white", "right", true)
        i += 20
        for(let id in this.playerList) {
            game.drawText(`${this.playerList[id].name} (0)`, game.width-10, i, 15, "white", "right", true)
            i += 20
        }
    }

    followEntity(game: Game, entity: any) {
        this.camera.x = entity.x - (game.width / 2) + (entity.width / 2)
        // On ne change pas le y
        if(this.camera.x < 0) {
            this.camera.x = 0
        }
    }

    onServerUpdate(game: Game, response: { type: ServerDataType, data: any }[]) {
        for(let {type, data} of response) {

            if(type == ServerDataType.BirdUpdate) {
                if(!this.birdClientList.exist(data.id)) {
                    this.birdClientList.createBird(game, data.id)
                }
                let bird = this.birdClientList.getById(data.id)
                bird.x = data.x
                bird.y = data.y
                bird.angle = data.angle
                bird.speed = data.speed
                bird.direction = data.direction
                bird.move = data.move == 1
                bird.velocityY = data.velocityY
            } else if(type == ServerDataType.SectionUpdate) {
                if(!this.sectionList.exist(data.id)) {
                    let section = this.sectionList.create({
                        id: data.id,
                        x: data.x,
                        width: data.width
                    }, data.scoreZone)
                    if(data.objects) {
                        for(let obj of data.objects) {
                            if(obj.type == ObstacleType.pipe) {
                                section.objects.push(new Pipe(obj))
                            }
                        }
                    }
                    if(typeof data.scoreAmount == "number" && data.scoreAmount > 0) {
                        section.scoreAmount = data.scoreAmount
                    }
                }
            }

        
        }
    }

    onPlayerListUpdate(data: {id: string, name: string}[]) {
        this.playerList = {}
        let noExists = this.birdClientList.birds.map(bird => {
            return bird.playerId
        })
        for(let dat of data) {
            this.playerList[dat.id] = {
                name: dat.name
            }

            noExists = noExists.filter((id) => {
                return !(id == dat.id)
            })

            if(this.birdClientList.exist(dat.id)) {
                this.birdClientList.getById(dat.id).name = dat.name
            }
        }

        for(let id of noExists) {
            this.birdClientList.removeById(id)
        }

    }
}

export class SceneIntro extends SceneBase {

    public background: Background
    public birds: BirdIntro[] = []

    constructor(game: Game) {
        super(game)
        this.background = new Background(game)

        for(let i = 0; i < 10; i++) {
            let bird = new BirdIntro(game)
            this.birds[i] = bird
        }
    }

    update(game: Game) {
        this.background.update(game)

        for(let bird of this.birds) {
            bird.update(game)
        }
    }

    draw(game: Game) {
        this.background.draw(game)

        for(let bird of this.birds) {
            bird.draw(game)
        }
    }
}

export class SceneEmpty extends SceneIntro {
    constructor (game: Game) {
        super(game)
        this.birds = []
    }
}