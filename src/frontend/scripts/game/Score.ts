import { Game } from "./game";

export class Score {
    x: number
    y: number

    points: number = 0

    imgWidth: number = 24
    imgHeight: number = 36

    constructor () {}

    update (game: Game) {}

    draw (game: Game) {
        let numbers = this.points.toString().split("")
        let w = this.imgWidth * numbers.length

        let x = (game.width / 2) - (w / 2)

        for(let i = 0; i < numbers.length; i++)
            game.drawImage("number-" + numbers[i], x + this.imgWidth * i, 100, null, null, true)
    }

}