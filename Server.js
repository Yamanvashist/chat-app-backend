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

app.use(express.json())
app.use(cookieParser());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

const users = new Map()
let onlineUsers = {}

io.on("connection", (socket) => {
    console.log("User connected", socket.id)
    socket.on("register", (userId) => {
        users.set(userId, socket.id)
        console.log(users);
        onlineUsers[userId] = true;
        console.log("Online users:", onlineUsers);
        io.emit("update_status", { userId: userId, status: "online" })
    })
    socket.on("send_message", (data) => {
        if (!data?.receiverId) return;
        const receiverSocketId = users.get(data.receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive_message", data);
        }
    })

    socket.on("disconnect", () => {
        // Find which user disconnected
        for (let [userId, socketId] of users.entries()) {
            if (socketId === socket.id) {
                onlineUsers[userId] = false;

                io.emit("update_status", {
                    userId: userId,
                    status: "offline",
                });

                break;
            }
        }
    });
});


app.use("/api/user", userRoute)

server.listen(8000, () => console.log("Server Started on http://localhost:8000"))