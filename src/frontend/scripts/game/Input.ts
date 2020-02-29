/*
Adaptation d'une ancienne class d'un autre projet
*/
export class Input {

    keycode = {
        space: 32
    }

    space: boolean = false

    constructor () {
        document.addEventListener('keydown', (e) => { this.changeKey(e.keyCode, true) })
        document.addEventListener('keyup',   (e) => { this.changeKey(e.keyCode, false) })
    }
    
    changeKey(code, to) {
        Object.keys(this.keycode).map((key, index) => {
            if(this.keycode[key] && this.keycode[key] == code) {
                this[key] = to
            }
        })
    }
}