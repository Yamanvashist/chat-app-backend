const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const { Server } = require("socket.io")
const http = require("http")
const cookieParser = require("cookie-parser");


const userRoute = require("./routes/userRoute")

const connect = require("./connect")


const app = express()

const server = http.createServer(app)

connect("ChatApp");

app.use(cors({
    origin: "http://localhost:5173",   // frontend
    credentials: true
}))

const io = new Server(app, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

io.on("connection", (socket) => {
    console.log("User connected", socket.id)

    socket.on("send_message", (data)=>{
        console.log("Message", data)
        io.emit("receive_message",data)
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected", socket.id)
    })
})



app.use(express.json())
app.use(cookieParser());

app.use("/api/user", userRoute)

server.listen(8000, () => console.log("Server Started on http://localhost:8000"))