// // public/js/chat.js
// const socket = io();

// // Select elements
// const userList = document.querySelectorAll(".start-chat");
// const chatUser = document.getElementById("chatUser");
// const chatBox = document.getElementById("chatBox");
// const messageForm = document.getElementById("messageForm");
// const messageInput = document.getElementById("messageInput");
// const loggedInUserId = "<%= loggedInUser._id %>"; // Pass this from EJS

// let currentChatUserId = null;

// // Start chat on user click
// document.querySelector("#userList").addEventListener("click", function (event) {
//     if (event.target.classList.contains("start-chat")) {
//       const userId = event.target.getAttribute("data-userid");
//       const userName = event.target.innerText;
  
//       chatUser.innerText = `Chat with ${userName}`;
//       chatBox.innerHTML = ""; // Clear previous chat
//       currentChatUserId = userId;
  
//       fetch(`/chat/messages/${userId}`)
//         .then(res => res.json())
//         .then(messages => {
//           messages.forEach(msg => appendMessage(msg, msg.sender === currentChatUserId ? "received" : "sent"));
//         });
  
//       socket.emit("joinChat", userId);
//     }
//   });
  
// // Handle sending messages
// messageForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   if (!messageInput.value.trim()) return;

//   const message = messageInput.value;
//   appendMessage({ message }, "sent");

//   socket.emit("sendMessage", {
//     receiver: currentChatUserId,
//     message,
//   });

//   messageInput.value = "";
// });

// // Receive messages in real time
// socket.on("receiveMessage", (data) => {
//   if (data.sender === currentChatUserId) {
//     appendMessage(data, "received");
//   }
// });

// // Append message to chat box
// function appendMessage(data, type) {
//     const msgDiv = document.createElement("div");
//     msgDiv.classList.add("message", type);
//     msgDiv.innerHTML = `<p>${data.message}</p>`;
//     chatBox.appendChild(msgDiv);
    
//     setTimeout(() => {
//       chatBox.scrollTop = chatBox.scrollHeight;
//     }, 100); // Smooth scrolling
//   }
  

// // Filter users
// function filterUsers() {
//   const searchInput = document.getElementById("userSearch").value.toLowerCase();
//   document.querySelectorAll(".user-item").forEach(user => {
//     const userName = user.getAttribute("data-name");
//     user.style.display = userName.includes(searchInput) ? "block" : "none";
//   });
// }
