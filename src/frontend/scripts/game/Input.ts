/*
Adaptation d'une ancienne class d'un autre projet
*/
export class Input {

    keycode = {
        space: 32
    }

    touch: boolean = false
    space: boolean = false

    useTouch: boolean = false

    constructor () {
        document.addEventListener("keydown", (e) => { this.changeKey(e.keyCode, true) })
        document.addEventListener("keyup",   (e) => { this.changeKey(e.keyCode, false) })
        document.addEventListener("touchstart", (e) => { this.touch = true })
        document.addEventListener("touchend", (e) => { this.touch = false })
        document.addEventListener("touchcancel", (e) => {this.touch = false })
        document.addEventListener("touchleave", (e) => { this.touch = false })
    }
    
    changeKey(code, to) {
        Object.keys(this.keycode).map((key, index) => {
            if(this.keycode[key] && this.keycode[key] == code) {
                this[key] = to
            }
        })
    }

    jump() {
        if(this.touch == true) {
            this.useTouch = true
            return true
        } else if(this.space == true) {
            this.useTouch = false
            return true
        } else {
            return false
        }
    }
}