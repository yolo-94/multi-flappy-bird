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

    loadFile(name, src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.files[name]) {
                resolve(this.files[name])
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

    loadImage(name, src: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.files[name]) {
                resolve(this.files[name])
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

    getFile(name): any {
        if(this.files[name]) {
            return this.files[name]
        } else {
            return null
        }
    }
}