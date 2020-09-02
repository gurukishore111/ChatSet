const users = [];

//Join user to chat

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

//User Leave

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Get room users:

function getRoomUser(room) {
  return users.filter((user) => user.room === room);
}

//Get current User

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUser };
