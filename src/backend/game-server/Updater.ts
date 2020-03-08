import { GameServer } from "./GameServer";
import { BirdDirection } from "./Player";

export enum ServerDataType {
    BirdUpdate,
    SectionUpdate
}

export class Updater {

    public lastData: any

    constructor(public server: GameServer) {}

    async update() {
        for(let client of this.server.clients) {
            client.update()
        }
        for(let player of this.server.players) {
            player.update()
        }

        for(let {client} of this.server.players) {
            let data = ServerData()

            for(let player of this.server.players) {
                if(player.client.socket.id != client.socket.id) {
                    data.bird({
                        id: player.client.socket.id,
                        x: player.bird.x,
                        y: player.bird.y,
                        angle: player.bird.angle,
                        speed: player.bird.speed,
                        direction: player.bird.direction,
                        move: player.bird.move,
                        velocityY: player.bird.velocityY,
                        score: player.score
                    })
                }
                // if(player.needSectionUpdate) {
                if(true) {
                    player.needSectionUpdate = false
                    for(let section of this.server.sections.getArroundOf(player.bird.currentSectionId)) {
                        data.section({
                            id: section.id,
                            x: section.x,
                            width: section.width,
                            scoreZone: section.scoreZone,
                            scoreAmount: section.scoreAmount,
                            objects: section.objects
                        })
                    }                    
                }
            }


            client.socket.emit("serverUpdate", data.get())
        }
    }

    updatePlayerList() {
        console.log("updatePlayerList()", this.server.players.length)
        let data = []
        for(let player of this.server.players) {
            data.push({
                id: player.id,
                name: player.name,
                score: player.score
            })
        }
        this.server.socket.emit("updatePlayerList", data)
    }

}


function ServerData() {
    return new ServerDataObj()
}

class ServerDataObj {
    public data: {
        type: ServerDataType,
        data: any
    }[] = []

    get() {
        return this.data
    }

    bird(data: {
        id: string,
        x: number,
        y: number,
        angle: number,
        speed: number,
        direction: BirdDirection,
        move: boolean,
        velocityY: number,
        score: number
    }) {
        this.data.push({
            type: ServerDataType.BirdUpdate,
            data
        })
        return this
    }

    section(data: {
        id: number,
        x: number,
        width: number,
        scoreZone: {
            x: number,
            y: number,
            width: number,
            height: number
        },
        scoreAmount: number,
        objects: any[]
    }) {
        this.data.push({
            type: ServerDataType.SectionUpdate,
            data
        })
        return this
    }
}