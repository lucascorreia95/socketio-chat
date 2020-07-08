/* eslint-disable no-undef */
$(() => {
  const socket = io();

  function handleClickTab() {
    $('.room').attr('data-active', 'false');
    $('#tabs-list li').attr('data-active', 'false');
    const ref = $(this).attr('data-ref');
    $(this).attr('data-active', true);
    $(`#chat #${ref}`).attr('data-active', 'true');
  }

  function createNewChat(id, nickname) {
    $('#chat').append(`
      <div id="${id}" class="room" data-active="false">
        <div class="container">
          <div class="content">
            <ul id="messages"></ul>
            <div id="users-typing"></div>
          </div>
        </div>
        <form action="">
          <input id="m" autocomplete="off" placeholder="Type here your message ..." minlength="3" /><button>Send</button>
        </form>
      </div>
    `);

    $('#tabs-list').append(`
      <li data-active="false" data-ref="${id}">
        ${nickname}
      </li>
    `);
  }

  function handleClickPrivate() {
    const id = $(this).attr('id');
    const nickname = $(this).children('span').text();
    socket.emit('private room', id);
    createNewChat(id, nickname);
    $('#tabs-list li').on('click', handleClickTab);
  }

  function handleVisible(target, value) {
    if (value) {
      $(target).removeClass('hidden');
      return;
    }

    $(target).addClass('hidden');
  }

  $('#tabs-list li').on('click', handleClickTab);

  $('#login form').submit((e) => {
    e.preventDefault(); // prevents page reloading
    socket.emit('nickname', $('#nickname').val());
    handleVisible('#login', false);
    handleVisible('#chat', true);
    $('#m').focus();
    return false;
  });

  $('#chat form').submit((e) => {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#messages').append($('<li>').text(`Você: ${$('#m').val()}`));
    $('#m').val('');
    socket.emit('stoped typing');
    return false;
  });

  $('#m').keyup(() => {
    if ($('#m').val()) {
      socket.emit('is typing');
    } else {
      socket.emit('stoped typing');
    }
  });

  $('#m').change(() => {
    if (!$('#m').val()) {
      socket.emit('stoped typing');
    }
  });

  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('list users', (data) => {
    $('#users-online').html('');
    $('#users-online').append(
      $('<li class="title">').text(`${data.length} Online Users`),
    );
    data.map((user) => {
      if (socket.id === user.id) {
        $('#users-online').append(
          $(`<li id="${user.id}" class="user">`).text(`${user.nickname} (You)`),
        );
      } else {
        $('#users-online').append(
          $(`<li id="${user.id}" class="user">`).append(
            `<span>${user.nickname}</span><button>Private room</button>`,
          ),
        );
        $(`#${user.id}`).on('click', handleClickPrivate);
      }
      return null;
    });
  });

  socket.on('user disconnected', (msg) => {
    $('#messages').append($('<li class="logout">').text(msg));
  });

  socket.on('user connected', (msg) => {
    $('#messages').append($('<li class="login">').text(msg));
  });

  socket.on('private room', ({ id, nickname }) => {
    createNewChat(id, nickname);
    $('#tabs-list li').on('click', handleClickTab);
  });

  socket.on('users typing', (data) => {
    $('#users-typing').html('');
    const typing = data.filter((user) => user.id !== socket.id);
    if (typing.length > 0) {
      const names = typing.map((user) => user.nickname);
      const msg = `${names.join(' and ')} is typing ...`;
      $('#users-typing').append($('<span class="users-typing">').text(msg));
    }
  });
});
