import socketIo from "socket.io"
import ChanceJS from "chance"
import { Client } from "./Client"
import { Player } from "./Player"
import { Updater } from "./Updater"
import { SectionList } from "./Section"

const updatePlayerListSeconds = 1

export const Chance = new ChanceJS("seed :)")

export class GameServer {

    private static updatePerSecond = 60

    public clients: Client[]
    public players: Player[]

    public serverTimeUp: number

    public config: Config

    public updater: Updater

    public iLoopUpdatePlayerList: number

    public sections: SectionList

    constructor(public socket: socketIo.Server) {
        this.serverTimeUp = Date.now()

        this.iLoopUpdatePlayerList = updatePlayerListSeconds * GameServer.updatePerSecond

        this.config = {
            serverTimeUp: this.serverTimeUp,
            defaultBirdSpeed: 2,
            defaultVelocityJumpY: -8,
            gravity: 0.5,
            velocityMax: 10,
            startPosition: {
                x: 300,
                y: 480/2
            },
            groundY: 430,
            birdSize: {
                width: 34,
                height: 24
            },
            debug: true
        }

        this.clients = []
        this.players = []
        this.sections = new SectionList(this)
        this.updater = new Updater(this)
        this.createLoop()

        setInterval(() => {
            console.log("Clients nb:", this.clients.length)
            console.log("Sections nb:", this.sections.sections.length)
        }, 5000)
    }

    createLoop() {
        let loop = async () => {
            await this.update()
            setTimeout(loop, 1000/GameServer.updatePerSecond)
        }

        loop()
    }

    addClient(socket: socketIo.Socket) {
        let client = new Client(socket, this)
        this.clients.push(client)
        let player = new Player(this, client)
        client.player = player
        this.players.push(player)
    }

    async update() {

        let newClients = []
        let newPlayers = []

        for(let player of this.players) {
            let client = player.client
            let connected = client.connected

            if(connected) {
                newClients.push(client)
                newPlayers.push(player)
            } else {
                console.log("Remove client", client.socket.id)
            }
        }

        this.clients = newClients
        this.players = newPlayers
        
        await this.updater.update()

        if(this.iLoopUpdatePlayerList == 0) {
            this.updater.updatePlayerList()
            this.iLoopUpdatePlayerList = updatePlayerListSeconds * GameServer.updatePerSecond
        } else {
            this.iLoopUpdatePlayerList--
        }
    }
}

export type Config = {
    serverTimeUp: number,
    defaultBirdSpeed: number,
    gravity: number,
    velocityMax: number,
    defaultVelocityJumpY: number,
    birdSize: {
        width: number,
        height: number
    },
    startPosition: {
        x: number,
        y: number
    },
    groundY: number,
    debug: boolean
} 