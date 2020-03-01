import { Game } from "./game"
import * as io from "socket.io-client"

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
  
    waitConnection() {
        return this.socket.waitConnection()
    }

    setListeners() {
        if(!this.listenersCreated) {
            let socket = this.socket
    
            socket.on("config", (config) => {
                this.handleConfig(config)
            })
    
            socket.on("test", (v) => {
                console.log(v)
            })

            this.listenersCreated = true
        }
    }

    handleConfig(config) {
        this.game.config = {
            serverTimeUp: config.serverTimeUp ?? 0
        }
        console.log(config)
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

    wait(message: string, arg2: any = undefined, arg3: any = undefined): Promise<any> {

        let messageSend = null
        let dataSend = null
        let messageOn = null

        if(arg2 !== undefined && arg3 === undefined) {
            messageSend = message
            messageOn = arg2
        } else if(arg2 !== undefined && arg3 !== undefined) {
            messageSend = message
            dataSend = arg2
            messageOn = arg3
        } else {
            messageOn = message
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