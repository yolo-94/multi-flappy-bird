import { Client } from "./Client";
import { GameServer } from "./GameServer";

export enum BirdDirection {
    left,
    right
}

export class Player {

    public id: string
    public name: string
    public score: number

    public bird: {
        x: number,
        y: number,
        angle: number,
        speed: number,
        direction: BirdDirection,
        move: boolean,
        velocityY: number,
        currentSectionId: number
    } = {
        x: 0,
        y: 0,
        angle: 0,
        speed: 0,
        direction: BirdDirection.right,
        move: false,
        velocityY: 0,
        currentSectionId: null
    }

    public needSectionUpdate: boolean = false

    constructor(
        public server: GameServer,
        public client: Client
    ) {
        this.id = client.socket.id
        this.name = "Guest"
        this.score = 0
        this.bird.x = server.config.startPosition.x - server.config.birdSize.width / 2
        this.bird.y = server.config.startPosition.y - server.config.birdSize.height / 2
    }

    update() {

    }

    handleClientUpdate(data: any) {
        if(
            Array.isArray(data) && 
            data.length && 
            typeof data[0] == "number" && 
            typeof data[1] == "number" &&
            typeof data[2] == "number" &&
            typeof data[3] == "number" &&
            typeof data[4] == "number" &&
            typeof data[5] == "number" &&
            typeof data[6] == "number" &&
            typeof data[8] == "number"
        ) {
            this.bird.x = data[0]
            this.bird.y = data[1]
            this.bird.angle = data[2]
            this.bird.speed = data[3]
            this.bird.direction = data[4]
            this.bird.move = data[5] == 1
            this.bird.velocityY = data[6]
            this.score = data[8]
        }

        if(data[7] !== null && typeof data[7] == "number" && data[7] >= 0) {
            this.bird.currentSectionId = data[7]
            this.needSectionUpdate = true
        }

        /* Temp */
        this.needSectionUpdate = true
    } 
}