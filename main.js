import "./style.css";

const adress = "ws://192.168.100.1:8080";
let ws = new WebSocket(adress);
ws.on("open", function open() {
  console.log("Connected to WebSocket server");
});

ws.on("message", (message) => {
  incoming(message, ws);
  return false;
});

// Event handler for WebSocket connection close
ws.on("close", () => {
  console.log("WebSocket connection closed");
  console.log("attempting reconnect");
  ws.close();
  ws.terminate();
  ws = null;
  setTimeout(() => {
    ws = initWebsocket(new WebSocket(adress));
  }, 1000);

  state = STATES.disconnected;
});

let currentIntroNum = 1; // Start from 1

function incoming(message, ws) {
  const decodedMessage = JSON.parse(message.toString()); // Decode the buffer to obtain the original string
  console.log("Received message from server:", decodedMessage);

  // Check if the message type is 'select'
  if (decodedMessage.type === "select") {
    // Hide the current intro div
    const currentIntroDiv = document.querySelector(".intro_" + currentIntroNum);
    if (currentIntroDiv) {
      currentIntroDiv.classList.remove("visible");
      currentIntroDiv.classList.add("invisible");
    }

    // Show the next intro div
    currentIntroNum++; // Increment the counter
    const nextIntroDiv = document.querySelector(".intro_" + currentIntroNum);
    if (nextIntroDiv) {
      nextIntroDiv.classList.remove("invisible");
      nextIntroDiv.classList.add("visible");
    }
  }
}
