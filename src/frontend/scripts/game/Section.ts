import { Box } from "./Box2d"
import { Game } from "./game"
import { RectType } from "./Draw"
import { BirdBase } from "./Bird"
import { Obstacle } from "./Obstacle"

export enum ObjectType {
    default,
    pipe
}

export class Section {
    public id: number
    public x: number
    public y: number
    public width: number
    public height: number

    public scoreZone: Box = null
    public scoreAmount: number = 1

    public scoreZoneReached: boolean = false
    
    public objects: Obstacle[] = []

    constructor({id, x, width}: {id: number, x: number, width: number}, scoreZone: Box = null) {
        this.id = id
        this.x = x
        this.y = 0
        this.width = width
        this.height = 1000
        if(scoreZone !== null) {
            this.scoreZone = scoreZone
        }
    }

    update(game: Game) {
        this.height = game.height
    }

    draw(game: Game) {
        if(game.config.debug) {
            game.drawRect(this.x, 0, this.width, this.height, RectType.stroke, "rgba(0, 0, 0, 1)")
        }
        if(this.scoreZone !== null && game.config.debug) {
            game.drawRect(this.scoreZone.x, this.scoreZone.y, this.scoreZone.width, this.scoreZone.height, RectType.fill, "rgba(255, 0, 0, 0.5)")
        }
        for(let obj of this.objects) {
            obj.draw(game)
        }
    }

    touchScoreZone(bird: BirdBase) {
        if(this.scoreZone !== undefined && this.scoreZone !== null) {
            if(this.scoreZone.x < bird.x + bird.width &&
                this.scoreZone.x + this.scoreZone.width > bird.x &&
                this.scoreZone.y < bird.y + bird.height &&
                this.scoreZone.height + this.scoreZone.y > bird.y) {
                return true
            }
        }

        return false
    }

    reset(game: Game) {
        this.scoreZoneReached = false
    }
}

export class SectionList {
    public sections: Section[] = []

    exist(id: number) {
        for(let section of this.sections) {
            if(section.id == id) {
                return true
            }
        }
        return false
    }

    get(id: number) {
        for(let section of this.sections) {
            if(section.id == id) {
                return section
            }
        }
        return null
    }

    create({id, x, width}: {id: number, x: number, width: number}, scoreZone: Box = null) {
        let section = new Section({id, x, width}, scoreZone)
        this.sections.push(section)
        return section
    }

    update(game: Game) {
        for(let section of this.sections) {
            section.update(game)
        }
    }

    draw(game: Game) {
        for(let section of this.sections) {
            section.draw(game)
        }
    }

    currentSection(bird: BirdBase): Section {
        let result: Section = null
        for(let section of this.sections) {
            if(section.x < bird.x + bird.width &&
                section.x + section.width > bird.x &&
                section.y < bird.y + bird.height &&
                section.height + section.y > bird.y) {
                if(result === null || section.id > result.id) {
                    result = section
                }
            }
        }
        return result
    }

    reset(game: Game) {
        for(let section of this.sections) {
            section.reset(game)
        }
    }
}