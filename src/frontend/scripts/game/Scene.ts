import { Game } from "./game";
import { Background } from "./Background";
import { BirdIntro } from "./Bird";

export class SceneBase {
    constructor(game: Game) {}

    update(game: Game) {}

    draw(game: Game) {}
}

export class Scene extends SceneBase {

}

export class SceneIntro extends SceneBase {

    public background: Background
    public birds: BirdIntro[] = []

    constructor(game: Game) {
        super(game)
        this.background = new Background(game)

        for(let i = 0; i < 10; i++) {
            let bird = new BirdIntro(game)
            this.birds[i] = bird
        }
    }

    update(game: Game) {
        this.background.update(game)

        for(let bird of this.birds) {
            bird.update(game)
        }
    }

    draw(game: Game) {
        this.background.draw(game)

        for(let bird of this.birds) {
            bird.draw(game)
        }
    }
}