require('dotenv').config()
import express from "express"
import http from "http"
import socketIo from "socket.io"
import path from "path"
import { htmlCss, htmlJs } from "./encore"

let app = express()
let server = require('http').Server(app)
let io = socketIo(server)


const serverTimeUp = Date.now()

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


io.on('connection', function (socket) {

    socket.emit("connected", true)

    socket.on("get:config", () => {

        socket.emit("config", {
            serverTimeUp
        })

    })

})



const port = 8090
server.listen(port)
console.log('Open in port ' + port + ' !')