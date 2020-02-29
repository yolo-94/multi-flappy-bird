require('dotenv').config()
import express from "express"
let app = express()
import path from "path"
import { htmlCss, htmlJs } from "./encore"


/* Dossier statique */
app.use("/static", express.static('static'))

/* Pug */
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../../src/backend/Views'))

app.locals = {
    ...app.locals,
    site: {
        name: "Multi Flappy Bird",
        url: "test.net"
    },
    entrypoints: {
        css: htmlCss,
        js: htmlJs
    }
}


app.get("/", function (req: express.Request, res: express.Response) {
    res.render("./index.pug")
})

app.get("/static/html/menu.html", function (req: express.Request, res: express.Response) {
    res.render("partials/menu.pug")
})


const port = 8090
app.listen(port, function () {
    console.log('Open in port ' + port + '...')
})