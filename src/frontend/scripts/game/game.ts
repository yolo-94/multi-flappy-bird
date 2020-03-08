import { FpsCounter } from "./FpsCounter"
import { GameDraw } from "./Draw"
import { Camera } from "./Camera"
import { Assets } from "./Assets"
import { Input } from "./Input"
import { Scene, SceneIntro, SceneBase, SceneEmpty } from "./Scene"
import { getPixelRatio } from "./utils"
import { Menu } from "./Menu"
import { Server } from "./Server"
import { Player } from "./Player"

export class Game extends GameDraw {
    public canvas: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D
    public width: number = window.innerWidth
    public height: number = window.innerHeight
    public pixelRatio: number

    public fpsCounter: FpsCounter
    public input: Input
    public assets: Assets
    public server: Server
    public config: Config
    public player: Player

    public menu: Menu
    public scene: Scene|SceneIntro|SceneEmpty|SceneBase

    public camera: Camera

    public speed: number = 2
    public defaultSpeed: number = 2
    public gravity: number = 0.5
    public velocityMax = 10

    public firstServerTimeUp: number = null

    constructor(public containerSelector: string) {
        super()
        this.canvas = document.createElement("canvas")
        this.fpsCounter = new FpsCounter()
        this.camera = new Camera(0, 0)
        this.assets = new Assets()
        this.server = new Server(this)
        this.config = new Config()
        this.ctx = this.canvas.getContext("2d")
        this.pixelRatio = getPixelRatio(this.ctx)
        this.changeSize(this.width, this.height)
        this.resizeEvent()
        document.querySelector(this.containerSelector).appendChild(this.canvas)
        this.ctx.imageSmoothingEnabled = false
        this.load().then(() => this.start())
    }

    /*
    La fonction qui va être appelé 60 fois par seconde
    */
    requestAnimationFrame(timestamp: number) {
        this.update()
        this.draw()
        window.requestAnimationFrame((p) => {
            this.requestAnimationFrame(p)
        })
    }

    start() {
        this.player = new Player(this)
        this.menu = new Menu(this)
        this.menu.create(this.containerSelector)
        this.scene = new SceneBase(this)

        this.input = new Input()
        this.startMainMenu()
        this.requestAnimationFrame(null)
    }

    update() {
        this.scene?.update(this)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height)

        this.scene?.draw(this)
        this.camera?.draw(this)
        this.fpsCounter.draw(this)

        if(game.config.debug) {
            this.drawText(this.server?.socket?.io.connected ? "Connecté" : "Déconnecté", this.width - 10, 62, 15, this.server?.socket?.io.connected ? "green" : "red", "right", true)
        }

        for(let c of this.onDrawEndCallbackList) {
            c(this)
        }

        this.onDrawEndCallbackList = []
    }

    async load(): Promise<void> {
        await this.assets.loadFile("menu.html", "/static/html/menu.html")
        await this.assets.loadImage("redbird-down", "/static/assets/redbird-downflap.png")
        await this.assets.loadImage("redbird-middle", "/static/assets/redbird-midflap.png")
        await this.assets.loadImage("redbird-up", "/static/assets/redbird-upflap.png")
        await this.assets.loadImage("bluebird-down", "/static/assets/bluebird-downflap.png")
        await this.assets.loadImage("bluebird-middle", "/static/assets/bluebird-midflap.png")
        await this.assets.loadImage("bluebird-up", "/static/assets/bluebird-upflap.png")
        await this.assets.loadImage("base", "/static/assets/base.png")
        await this.assets.loadImage("background-day", "/static/assets/background-day.png")
        await this.assets.loadImage("background-night", "/static/assets/background-night.png")
        await this.assets.loadImage("pipe-green", "/static/assets/pipe-green.png")
        await this.assets.loadImage("pipe-green-top-part", "/static/assets/pipe-green-top-part.png")
        await this.assets.loadImage("pipe-green-bottom-part", "/static/assets/pipe-green-bottom-part.png")
        await this.assets.loadImage("pipe-red", "/static/assets/pipe-red.png")
        for(let i = 0; i <= 9; i++) {
            await this.assets.loadImage("number-" + i, "/static/assets/" + i + ".png")    
        }
        await this.assets.loadAudio("audio:score", "/static/assets/audio/score.ogg")
        await this.assets.loadAudio("audio:jump", "/static/assets/audio/jump.ogg")
        await this.assets.loadAudio("audio:hit", "/static/assets/audio/hit.ogg")
        await this.assets.loadAudio("audio:lose", "/static/assets/audio/lose.ogg")
    }

    changeSize(width: number, height: number) {
        this.width = width > 1000 ? 1000 : width
        this.height = height > 480 ? 480 : height

        this.canvas.width = this.width * this.pixelRatio
        this.canvas.height = this.height * this.pixelRatio
        this.canvas.style.width = this.width + "px"
        this.canvas.style.height = this.height + "px"
        this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);

    }

    resizeEvent() {
        window.addEventListener("resize", () => this.changeSize(window.innerWidth, window.innerHeight))
    }

    startMainMenu() {
        this.menu.home()
        this.scene = new SceneIntro(this)
    }

    async startPlay(username: string) {
        this.menu.serverConnection()
        await this.server.connect()
        this.server.firstConnection()
        this.server.sendName(username)
        this.menu.close()
        this.scene = new Scene(this)
    }

    async reconnect() {
        this.scene = new SceneEmpty(game)
        this.menu.serverReconnection()
        await this.server.waitConnection()
        await this.server.needServerTimeUp()
        this.server.firstConnection()
        this.menu.close()
    }

    public onDrawEndCallbackList: CallableFunction[] = []
    onDrawEnd(c: CallableFunction) {
        this.onDrawEndCallbackList.push(c)
    }
}

export class Config {
    public serverTimeUp: number
    public defaultBirdSpeed: number
    public gravity: number
    public velocityMax: number
    public defaultVelocityJumpY: number
    public birdSize: {
        width: number,
        height: number
    }
    public startPosition: {
        x: number,
        y: number
    }
    public groundY: number
    public debug: boolean
    public debugBox2d: boolean
}

let game = new Game("#game-zone");

/* Pour le DEBUG */
(window as any).game = game