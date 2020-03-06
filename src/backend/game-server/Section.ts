import { Chance, GameServer } from "./GameServer"
import { Entity } from "./Obstacle/Entity"
import { Pipe, PipeRotation } from "./Obstacle/Pipe"

export type Box = {x: number, y: number, width: number, height: number}

export class Section {
    public id: number
    public x: number
    public width: number

    public scoreZone: Box
    public scoreAmount: number = 1

    public objects: Entity[]

    constructor({id, x, width}, scoreZone: Box = null) {
        this.id = id
        this.x = x
        this.width = width
        this.objects = []
        if(scoreZone !== null) {
            this.scoreZone = {
                x: scoreZone.x,
                y: scoreZone.y,
                width: scoreZone.width,
                height: scoreZone.height
            }
        }
    }
}

const arroundRange = 3

export class SectionList {
    public sections: Section[]

    constructor(server: GameServer) {
        this.sections = []

        let id = 0

        this.sections.push(new Section({
            id: id,
            x: 0,
            width: 600
        }, null))

        for(let i = 0; i < 1000; i++) {
            id++
            let x = 600 + i * 300
            let section = new Section({
                id: id,
                x: x,
                width: 300
            }, {
                x: x,
                y: 30,
                width: 100,
                height: 100
            })

            Pipe.generate(server, section, x, 100)

            this.sections.push(section)
        }
    }

    getArroundOf(id: number) {
        let sections: Section[] = []
        for(let section of this.sections) {
            if(section.id >= id - arroundRange && section.id <= id + arroundRange) {
                sections.push(section)
            }
        }
        return sections
    }
}