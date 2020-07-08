let users = [];

function getUserFromList(id) {
  const filtered = users.filter((user) => user.id === id);
  if (filtered.length > 0) {
    return filtered[0];
  }

  return null;
}

function removeUserFromList(id) {
  const filtered = users.filter((user) => user.id !== id);
  users = filtered;
  return users;
}

function addUserToList(id, nickname) {
  users.push({ id, nickname, typing: false });
  return users;
}

function removeTypingFromUsersList(id) {
  users = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        typing: false,
      };
    }
    return user;
  });

  return users;
}

function getUsersTypingFromList() {
  const filtered = users.filter((user) => user.typing === true);
  if (filtered.length > 0) {
    return filtered;
  }

  return [];
}

function addTypingToUsersList(id) {
  users = users.map((user) => {
    if (user.id === id) {
      return {
        ...user,
        typing: true,
      };
    }
    return user;
  });

  return users;
}

module.exports = {
  getUserFromList,
  getUsersTypingFromList,
  addUserToList,
  addTypingToUsersList,
  removeUserFromList,
  removeTypingFromUsersList,
};
