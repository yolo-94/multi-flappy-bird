import { Chance, GameServer } from "../GameServer"
import { Entity } from "./Entity";
import { Section } from "../Section";

export enum PipeRotation {
    top,
    bottom
}

export class Pipe extends Entity {

    public type: number = 1
    public rotation: number = PipeRotation.top
    public killer: boolean = true

    toJson() {
        let d = super.toJson() as any
        d.rotation = this.rotation
        return d
    }

    static generate(server: GameServer, section: Section, x: number, voidSize: number): [Pipe, Pipe] {
        let pipe1 = new Pipe()
        pipe1.rotation = PipeRotation.bottom
        pipe1.width = 52
        pipe1.height = 320
        pipe1.x = x + (section.width / 2 - pipe1.width / 2)

        let pipe2 = new Pipe()
        pipe2.rotation = PipeRotation.top
        pipe2.width = 52
        pipe2.height = 320
        pipe2.x = x + (section.width / 2 - pipe2.width / 2)

        let y = Chance.integer({min: -300, max: 0})

        pipe1.y = y
        pipe2.y = y + pipe1.height + voidSize

        section.scoreZone.x = pipe1.x + pipe1.width
        section.scoreZone.width = server.config.birdSize.width
        section.scoreZone.y = y + pipe1.height
        section.scoreZone.height = voidSize

        section.objects.push(pipe1, pipe2)

        return [pipe1, pipe2]
    }
}