import { Game } from "./game"

export class Player {
    
    private game: Game

    public name: string

    constructor(game: Game) {
        this.game = game
        this.name = ""
    }

    setName(name: string) {
        this.name = name
    }
}