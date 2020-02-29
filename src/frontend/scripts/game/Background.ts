import { Game } from "./game";
import { RectType } from "./Draw";

export class Background {

    deadBg: boolean = false

    imgSize: {
        width: number,
        height: number,
        ratio: number
    }

    constructor (game: Game) {
        let img = game.assets.getFile("background-night") as HTMLImageElement
        this.imgSize = {
            width: img.width,
            height: img.height,
            ratio: img.width / img.height
        }
    }

    update (game: Game) {}

    draw (game: Game) {

        let w = game.height * this.imgSize.ratio
        let h = game.height

        for(let x = 0; x < game.width; x += w - 1) {
            game.drawImage("background-night", x, 0, w, h, true)
        }

    }
}