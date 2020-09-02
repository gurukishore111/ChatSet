const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUser,
} = require("./utils/users");
const io = socketIo(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage("ChatSet Bot", "Welcome to ChatSet!"));

    //Info about user

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("ChatSet Bot", ` A ${user.username} has joined the chat`)
      );

    //Sent user and room info
    io.to(user.room).emit("roomUser", {
      room: user.room,
      users: getRoomUser(user.room),
    });
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  //Runs clients disconnected
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("ChatSet Bot", `A ${user.username} has left the chat`)
      );
      //Sent user and room info
      io.to(user.room).emit("roomUser", {
        room: user.room,
        users: getRoomUser(user.room),
      });
    }
  });
});

const PORT = 9000 || process.env.PORT;

server.listen(PORT, () => console.log(`Listening the port .....${PORT}`));
