import { GameAudio } from "./Audio"

export interface FileCallback {
    (file: any): any
}

export class Assets {
    public files: {
        [key: string]: any
    }
    
    constructor () {
        this.files = {}
    }

    clearFile(): void {
        this.files = {}
    }

    clear(): void {
        this.clearFile()
    }

    loadFile(name: string, src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.files[name]) {
                resolve(this.files[name])
                return
            }
            fetch(src)
            .then(Response => {
                return Response.text()
            })
            .then(text => {
                this.files[name] = text
                resolve(text)
            })
            .catch(reject)
        })
    }

    loadImage(name: string, src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.files[name]) {
                resolve(this.files[name])
                return
            }
            let img = new Image()
            img.src = src
            img.onload = function () {
                resolve(this)
            }
            img.onerror = function () {
                reject("Erreur chargement de l'image " + name + " " + src)
            }
            this.files[name] = img
        })
    }

    loadAudio(name: string, src: string): Promise<GameAudio> {
        return new Promise((resolve, reject) => {
            if(this.files[name]) {
                resolve(this.files[name])
                return
            }
            GameAudio.load(src).then(audio => {
                this.files[name] = audio
                resolve(audio)
            }).catch(reject)
        })
    }

    getFile(name): any {
        if(this.files[name]) {
            return this.files[name]
        } else {
            return null
        }
    }
}