const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from url
const {username, room}  = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join chat room
socket.emit('joinRoom', {username, room})

//get room and its users
socket.on('roomUsers', ({ room, users}) =>{
    outputRoomName(room);
    outputUsers(users);

})

//message from server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //scroll down to the last message
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit 
chatForm.addEventListener('submit', e =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);
    //clear input field
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
})
//output message to dom

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

//room name to DOM
function outputRoomName(room){
    roomName.innerText= room;
}

//add users to dom
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }