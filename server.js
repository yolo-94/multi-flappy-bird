const fs = require("fs")

if(!fs.existsSync("./.env") && fs.existsSync("./.env.example")) {
    console.log("------ Le fichier .env n'existe pas, création du fichier à partir de .env.example ...")
    fs.copyFileSync("./.env.example", "./.env")
}

require("./build/backend/app")