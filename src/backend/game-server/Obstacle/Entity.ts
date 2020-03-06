export class Entity {
    public x: number
    public y: number
    public width: number
    public height: number

    public type: number = 0

    public killer: boolean = false

    toJson() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            killer: this.killer
        }
    }
}