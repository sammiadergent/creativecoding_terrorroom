import "./style.css";

let introCounter = 1;

// Create a new WebSocket.
const socket = new WebSocket("ws://192.168.100.1:8080");

// Connection opened
socket.addEventListener("open", (event) => {
  // socket.send("Hello Server!");
});

// Connection closed
socket.addEventListener("close", (event) => {
  console.log("Server connection closed: ", event.code);
});

// Connection error
socket.addEventListener("error", (event) => {
  console.error("WebSocket error: ", event);
});

// Listen for messages
socket.addEventListener("message",
(event) => {
    const decodedMessage = JSON.parse(event.data);

    console.log("Message from server: ", decodedMessage);

    if (decodedMessage.type === "select") {
      if (introCounter > 0) {
        const prevElement = document.querySelector(
          `.intro_${introCounter - 1}`,
        );
        if (prevElement) {
          prevElement.classList.add("invisable");
        }
      }

      const currentElement = document.querySelector(`.intro_${introCounter}`);
      if (currentElement) {
        currentElement.classList.remove("invisable");
        introCounter++;
      }
      // when we are on intro 5 we have 3 options that each have a color trigger
      if (introCounter === 6) {
		const colors = ["red", "green", "yellow"];
        if (decodedMessage.data.color) {
          const colorNumber = decodedMessage.data.color;
          const divElement = document.getElementById(`colorDiv${colorNumber}`);
          if (divElement) {
            divElement.style.backgroundColor = colors[colorNumber - 1];
          }
        }
      }
    }
  });
