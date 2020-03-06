import { Game } from "./game"
import * as io from "socket.io-client"
import { Scene } from "./Scene"

export class Server {

    public game: Game
    public socket: WSocket

    private listenersCreated: boolean = false

    constructor (game: Game) {
        this.game = game
    }

    connect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let socket = io.connect(window.location.protocol + "//" + window.location.host)

            socket.on("connected", async (value) => {
                if(value) {
                    console.log("Connected !!!!")

                    if(!this.socket) {
                        this.socket = new WSocket(socket)

                        let config = await this.socket.wait("get:config", "config")
                        this.handleConfig(config)
                        
                        this.setListeners()

                        socket.off("connected")
                        resolve(true)
                    }

                } else {
                    reject("Connexion impossible !")
                }
            })

            socket.on('disconnect', () => {
                this.disconnected(socket)
            })
        })
    }

    disconnected(socket: any) {
        console.log("Disconnected !!!!")
        this.game.reconnect()
    }
  
    waitConnection(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.socket.waitConnection().then(async (b) => {

                resolve(b)
            })
        })
    }

    setListeners() {
        if(!this.listenersCreated) {
            let socket = this.socket
    
            socket.on("config", config => {
                this.handleConfig(config)
            })
    
            socket.on("test", (v) => {
                console.log(v)
            })

            socket.on("name", name => {
                this.game.player.setName(name)
            })

            socket.on("serverUpdate", (data) => {
                if(this.game.scene?.needServerUpdate) {
                    (this.game.scene as Scene).onServerUpdate(this.game, data)
                    this.game.fpsCounter.serverUpdatePsCount++
                }
            })

            socket.on("updatePlayerList", (data) => {
                if(this.game.scene?.needServerUpdate) {
                    (this.game.scene as Scene).onPlayerListUpdate(data)
                }
            })

            this.listenersCreated = true
        }
    }

    handleConfig(config: any) {
        this.game.config = {
            serverTimeUp: config.serverTimeUp ?? this.game.config.serverTimeUp ?? 0,
            defaultBirdSpeed: config.defaultBirdSpeed ?? this.game.config.defaultBirdSpeed ?? 1,
            gravity: config.gravity ?? this.game.config.gravity ?? 1,
            velocityMax: config.velocityMax ?? this.game.config.velocityMax ?? 10,
            birdSize: config.birdSize ?? this.game.config.birdSize ?? {width: 34, height: 24},
            startPosition: config.startPosition ?? this.game.config.startPosition ?? {x: 1, y: 1},
            groundY: config.groundY ?? this.game.config.groundY ?? 420,
            defaultVelocityJumpY: config.defaultVelocityJumpY ?? this.game.config.defaultVelocityJumpY ?? -8,
            debug: config.debug ?? this.game.config.debug ?? false,
            debugBox2d: false
        }
        console.log(config)
    }

    async firstConnection() {
        if(this.game.firstServerTimeUp === null) {
            this.game.firstServerTimeUp = this.game.config.serverTimeUp
        } else {
            if(this.game.firstServerTimeUp != this.game.config.serverTimeUp) {
                this.sendClose()
                document.location.reload()
            }
        }
    }

    sendName(name: string): void {
        this.socket.emit("set:name", name)
    }

    getName(): Promise<string> {
        return this.socket.wait("get:name", "name")
    }
    
    sendClose() {
        this.socket.emit("stopConnection")
    }
    
    async needServerTimeUp() {
        this.game.config.serverTimeUp = await this.socket.wait("get:serverTimeUp", "serverTimeUp")
    }

    sendUpdate(data) {
        this.socket.emit("update", data)
    }

    needUpdateSection(currentSectionId: number) {

    }
}

export class WSocket {

    public io: SocketIOClient.Socket

    constructor (socketIo: any) {
        this.io = socketIo
    }

    on(message: string, callback: CallableFunction) {
        this.io.on(message, callback)
    }

    emit(message: string, data = undefined) {
        this.io.emit(message, data)
    }

    wait(messageOn: string): Promise<any> 
    wait(messageSend: string, messageOn: string): Promise<any>
    wait(messageSend: string, dataSend: object|string = null, messageOn: string = null): Promise<any>
    {
        if(dataSend !== null && messageOn === null) {
            messageOn = <string>dataSend
            dataSend = null
        }

        if(messageSend !== null) {
            this.emit(messageSend, dataSend)
        }

        return new Promise((resolve, reject) => {
            let cb = (data) => {
                this.io.off(messageOn, cb)
                resolve(data)
            }
            this.io.on(messageOn, cb)
        })
    }

    waitConnection(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let boucle = () => {
                if(this.io.connected) {
                    resolve(true)
                } else {
                    setTimeout(boucle, 300)
                }
            }
            boucle()
        })

    }

}