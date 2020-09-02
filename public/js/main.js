const chatForm = document.getElementById("chat-form");
const socket = io();
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get Username and room

//form qs cdn for url params

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });

//get room and user

socket.on("roomUser", ({ room, users }) => {
  outputRoomName(room);
  outputUser(users);
});

//Message form server
socket.on("message", (message) => {
  //console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

//Message submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  //console.log(msg);
  //Emitting msg to server
  socket.emit("chatMessage", msg);
  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to Dom

function outputRoomName(room) {
  roomName.innerText = room;
}

//Add the users to DOM

function outputUser(users) {
  //console.log(user);

  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
