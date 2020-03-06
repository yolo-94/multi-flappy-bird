import { Socket } from "socket.io"
import { GameServer } from "./GameServer"
import { Player } from "./Player"

const secondsBeforeDestroy = 5

export class Client {

    public socket: Socket
    public server: GameServer
    public connected: boolean

    public checkDisconnected: boolean = false

    public player: Player

    constructor(socket: Socket, server: GameServer) {
        this.socket = socket
        this.server = server
        this.connected = true
        this.setListeners()
        this.sendConnected()
        console.log("Create client", socket.id)
    }

    destroyIfNotConnected() {
        if(this.socket.disconnected && !this.checkDisconnected) {
            this.checkDisconnected = true
            let i = 0
            let f = () => {
                console.log("Reconnection attempt", this.socket.id)
                if(this.socket.connected) {
                    this.checkDisconnected = false
                    this.connected = true
                    return
                }
                if(i <= secondsBeforeDestroy) {
                    i++
                    setTimeout(f, 1000)
                } else {
                    this.socket.disconnect()
                    this.connected = false
                }
            }
            f()
        }
    }

    ping() {

    }

    setListeners() {
        this.socket.on("get:config", () => this.sendConfig())
        this.socket.on("set:name", (v) => this.setName(v))
        this.socket.on("get:name", () => this.sendName())
        this.socket.on("get:serverTimeUp", () => this.sendServerTimeUp())
        this.socket.on("set:birdPosition", ({x, y}) => {
            if(typeof x == "number" && typeof y == "number") {
                // ---
            }
        })
        this.socket.on("stopConnection", () => {
            this.checkDisconnected = true
            this.connected = false
        })
        this.socket.on("update", (data) => {
            this.player.handleClientUpdate(data)
        })
    }


    update() {
        this.destroyIfNotConnected()
        if(!this.checkDisconnected) {
            // ...
        }
    }

    // ------------------

    sendConnected() {
        this.socket.emit("connected", true)
    }

    sendConfig() {
        this.socket.emit("config", this.server.config)
    }

    setName(v: any) {
        if(typeof v == "string" && v != "") {
            this.player.name = v
        } else {
            this.player.name = "Guest"
        }
    }

    sendName() {
        this.socket.emit("name", this.player.name)
    }

    sendServerTimeUp() {
        this.socket.emit("serverTimeUp", this.server.serverTimeUp)
    }

    sendOk() {
        this.socket.emit("ok", true)
    }

}