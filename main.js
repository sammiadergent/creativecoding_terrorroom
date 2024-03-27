import "./style.css";

let introCounter = 1

// Create a new WebSocket.
var socket = new WebSocket("ws://192.168.100.1:8080");

// Connection opened
socket.addEventListener("open", function (event) {
	//socket.send("Hello Server!");
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
	console.log("Message from server: ", event.data);
	const decodedMessage = JSON.parse(event.data.toString())
	console.log(decodedMessage);
	if (decodedMessage.type === "select") {
		if(introCounter > 0) {
			var element = document.getElementsByClassName("intro_" + introCounter - 1)[0];
			if(element != undefined) {
				element.classList.add("invisable");
			}
		}
		var element = document.getElementsByClassName("intro_" + introCounter)[0];
		if(element != undefined) {
			element.classList.remove("invisable");
			introCounter++;
		}
	}
});
