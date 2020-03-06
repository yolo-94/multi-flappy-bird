require('dotenv').config()
import express from "express"
import http from "http"
import socketIo from "socket.io"
import path from "path"
import { htmlCss, htmlJs } from "./encore"
import { GameServer } from "./game-server/GameServer"

let app = express()
let server = require('http').Server(app)
let io = socketIo(server)


const serverTimeUp = Date.now()

/* Dossier statique */
app.use("/static", express.static('static'))

/* Pug */
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../../src/backend/views'))

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

const gameServer = new GameServer(io)

io.on('connection', function (socket) {

    gameServer.addClient(socket)

})



const port = 8090
server.listen(port)
console.log('Open in port ' + port + ' !')