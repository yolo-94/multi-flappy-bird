let data = require("../../static/build/entrypoints.json")


let htmlCss = (...names: string[]): string => {
    let html = ""
    let alreadyImported = []
    for(let name of names) {
        if(data.entrypoints[name]) {
            for(let file of data.entrypoints[name].css) {
                if(alreadyImported.indexOf(file) == -1) {
                    html += `<link rel="stylesheet" href="${file}">`
                    alreadyImported.push(file)
                }
            }
        }
    }
    return html
}

let htmlJs = (...names: string[]): string => {
    let html = ""
    let alreadyImported = []
    for(let name of names) {
        if(data.entrypoints[name]) {
            for(let file of data.entrypoints[name].js) {
                if(alreadyImported.indexOf(file) == -1) {
                    html += `<script src="${file}"></script>`
                    alreadyImported.push(file)
                }
            }
        }
    }
    return html
}

export { data as encoreData, htmlJs, htmlCss }