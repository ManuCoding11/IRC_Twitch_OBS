import * as http from "http";
import * as WebSocket from "ws";
import * as tmi from "tmi.js";
import * as fs from "fs";

import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" })
const { CHANNELS } = process.env

let webpage: string = fs.readFileSync('./index.html').toString('utf-8');

http.createServer((req, res) => {
    if (req.headers.connection == "upgrade") {
        res.setHeader("Connection", "Upgrade")
        res.writeHead(200)
        res.end()
    }

    else {
        res.writeHead(200)
        res.write(webpage)
        res.end()
    }
})
    .listen(80, "127.0.0.1")




const ws_server: WebSocket.Server = new WebSocket.Server(
    {
        port: 8080,
        host: "localhost"
    }
);

const tmiClient: tmi.Client = new tmi.Client(
    {
        channels: CHANNELS.split(/, */)
    }
)

    .on("connected", (address: string, port: number) => {
        console.log(`Connected to ${address}:${port} successfully.`)
    })

tmiClient.connect()

ws_server.on("connection",
    (ws: WebSocket) => {
        tmiClient.on("message",
            (channel: string, userstate: tmi.ChatUserstate, msg: string, self: boolean) => {
                ws.send(
                    `${userstate.color}, ${userstate["display-name"]}, ${msg}`
                )
            }
        )
    }
)



process.on("uncaughtException", (error: Error) => {
    console.log(error)
    process.exit(1)
})


// TODO
/*
 * Add random color generator for users with 'null' color
 * Add color register for generated colors and corresponding users
 * Organize & comment
 */