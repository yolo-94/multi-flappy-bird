import { Camera } from "./Camera"
import { Assets } from "./Assets"
import { FpsCounter } from "./FpsCounter"

export enum RectType {
    fill,
    stroke
}

export class GameDraw {
    ctx: CanvasRenderingContext2D
    camera: Camera
    width: number
    height: number
    CANVAS_TOLERANCE_EXCEEDED: number = 10
    assets: Assets
    fpsCounter: FpsCounter

    drawText(text: string, x: number, y: number, size: number = 5, color: string = "#000000", align: CanvasTextAlign = "left") {
        this.ctx.font = size+"px Consolas"
        this.ctx.fillStyle = color
        this.ctx.textAlign = align
        this.ctx.fillText(text,x,y)
    }

    getImg(imgArg) {
        let img
        if (typeof imgArg === 'string' || imgArg instanceof String) {
            img = this.assets.getFile(imgArg)
        } else {
            img = imgArg
        }
        return img
    }

    drawImage (imgArg, x: number, y: number, forcedWidth: number = null, forcedHeight: number = null, fixe: boolean = false) {
        this.fpsCounter.drawPsCount++
        
        let img = this.getImg(imgArg)

        let dx = !fixe ? x - this.camera.x : x
        let dy = !fixe ? y - this.camera.y : y
        let w = forcedWidth === null ? img.width : forcedWidth
        let h = forcedHeight === null ? img.height : forcedHeight

        if(!fixe) {
            if(dx > (this.width+this.CANVAS_TOLERANCE_EXCEEDED)) {
                return false
            }
    
            if((dx + w) < -this.CANVAS_TOLERANCE_EXCEEDED) {
                return false
            }
    
            if(dy > (this.height+this.CANVAS_TOLERANCE_EXCEEDED)) {
                return false
            }
    
            if((dy + h) < -this.CANVAS_TOLERANCE_EXCEEDED) {
                return false
            }
        }

        dx = Math.ceil(dx)
        dy = Math.ceil(dy)
        
        this.ctx.drawImage(
            img,
            dx,
            dy,
            w,
            h
        )
        return true
    }

    drawRotatedImage(imgArg, x: number, y: number, angle: number, forcedWidth: number = null, forcedHeight: number = null, fixe: boolean = false) {
        this.fpsCounter.drawPsCount++

        let img = this.getImg(imgArg)

        let dx = !fixe ? x - this.camera.x : x
        let dy = !fixe ? y - this.camera.y : y
        let w = forcedWidth === null ? img.width : forcedWidth
        let h = forcedHeight === null ? img.height : forcedHeight

        if(!fixe) {
            if(dx > (this.width+this.CANVAS_TOLERANCE_EXCEEDED)) {
                return false
            }
    
            if((dx + w) < -this.CANVAS_TOLERANCE_EXCEEDED) {
                return false
            }
    
            if(dy > (this.height+this.CANVAS_TOLERANCE_EXCEEDED)) {
                return false
            }
    
            if((dy + h) < -this.CANVAS_TOLERANCE_EXCEEDED) {
                return false
            }
        }

        dx = Math.ceil(dx)
        dy = Math.ceil(dy)

        this.ctx.save()

        this.ctx.translate(dx + (img.width / 2), dy + (img.height / 2))

        this.ctx.rotate(angle * Math.PI / 180)

        this.ctx.drawImage(
            img,
            -(img.width / 2),
            -(img.height / 2),
            w,
            h
        )

        this.ctx.restore()
    }

    drawRect(x: number, y: number, w: number, h: number, type: RectType = RectType.fill, style: string = "black", fixe: boolean = false) {

        let dx = !fixe ? x - this.camera.x : x
        let dy = !fixe ? y - this.camera.y : y

        if(!fixe) {
            if(dx > (this.width+this.CANVAS_TOLERANCE_EXCEEDED)) {
                return false
            }
    
            if((dx + w) < -this.CANVAS_TOLERANCE_EXCEEDED) {
                return false
            }
    
            if(dy > (this.height+this.CANVAS_TOLERANCE_EXCEEDED)) {
                return false
            }
    
            if((dy + h) < -this.CANVAS_TOLERANCE_EXCEEDED) {
                return false
            }
        }


        switch(type) {
            case RectType.fill:
                this.ctx.fillStyle = style
                this.ctx.fillRect(dx, dy, w, h)
                break
            case RectType.stroke:
                this.ctx.strokeStyle = style
                this.ctx.strokeRect(dx, dy, w, h)
                break
        }
        
    }
}