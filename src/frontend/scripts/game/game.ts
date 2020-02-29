import { FpsCounter } from "./FpsCounter"
import { GameDraw } from "./Draw"
import { Camera } from "./Camera"
import { Assets } from "./Assets"
import { Bird } from "./Bird"
import { Ground } from "./Ground"
import { Background } from "./Background"
import { PipesManager } from "./PipesManager"
import { Input } from "./Input"
import { Score } from "./Score"
import { Scene, SceneIntro, SceneBase } from "./Scene"
import { getPixelRatio } from "./utils"
import { Menu } from "./Menu"

export class Game extends GameDraw {
    public canvas: HTMLCanvasElement
    public ctx: CanvasRenderingContext2D
    public width: number = window.innerWidth
    public height: number = window.innerHeight
    public pixelRatio: number

    public fpsCounter: FpsCounter
    public input: Input
    public assets: Assets

    public menu: Menu
    public scene: Scene|SceneIntro

    public camera: Camera
    public bird: Bird
    public ground: Ground
    public background: Background
    public pipesManager: PipesManager
    public score: Score

    public speed: number = 2
    public defaultSpeed: number = 2
    public gravity: number = 0.5
    public velocityMax = 10

    constructor (public containerSelector: string) {
        super()
        this.canvas = document.createElement("canvas")
        this.fpsCounter = new FpsCounter()
        this.camera = new Camera(0, 0)
        this.assets = new Assets()
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled = false

        this.pixelRatio = getPixelRatio(this.ctx)
        this.changeSize(this.width, this.height)

        this.resizeEvent()
        document.querySelector(this.containerSelector).appendChild(this.canvas)
        this.load().then(() => this.start())
    }

    /*
    La fonction qui va être appelé 60 fois par seconde par le navigateur
    */
    requestAnimationFrame(timestamp: number) {
        this.update()
        this.draw()
        window.requestAnimationFrame((p) => {
            this.requestAnimationFrame(p)
        })
    }

    start() {
        this.menu = new Menu(this)

        this.menu.create(this.containerSelector)

        this.scene = new SceneBase(this)

        // this.score = new Score()
        // this.bird = new Bird()
        // this.ground = new Ground()
        // this.background = new Background(this)
        // this.pipesManager = new PipesManager(this)

        this.input = new Input()

        this.startIntro()
        this.requestAnimationFrame(null)
    }

    update() {
        // this.bird.update(this)
        // this.camera.update(this)
        // this.background.update(this)
        // this.ground.update(this)
        // this.pipesManager.update(this)
        // this.fpsCounter.update()
        this.scene?.update(this)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height)

        // this.background.draw(this)
        // this.pipesManager.draw(this)
        // this.ground.draw(this)
        // this.bird.draw(this)
        // this.score.draw(this)
        // this.fpsCounter.draw(this)
        this.scene?.draw(this)
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

    startIntro() {
        this.menu.home()
        this.scene = new SceneIntro(this)
    }

    startPlay() {
        this.menu.close()
        this.scene = new Scene(this)
    }
}

let game = new Game("#game-zone")