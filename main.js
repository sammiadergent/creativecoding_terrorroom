import "./style.css";

// Create a new WebSocket.
var socket = new WebSocket("ws://localhost:8080");

// Connection opened
socket.addEventListener("open", function (event) {
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  console.log("Message from server: ", event.data);
});

// Connection closed
socket.addEventListener("close", function (event) {
  console.log("Server connection closed: ", event.code);
});

// Connection error
socket.addEventListener("error", function (event) {
  console.error("WebSocket error: ", event);
});

//when select message comes in I need to hide the div that is showing called "intro_0" and need to show the div called "intro_1" until intro_5
socket.addEventListener("message", function (event) {
  if (event.data.startsWith("select")) {
    var index = event.data.split("_")[1]; // Get the index from the message data
    for (var i = 0; i <= 5; i++) {
      var element = document.getElementById("intro_" + i);
      if (element) {
        element.style.display = i == index ? "block" : "none";
      }
    }
  }
});
