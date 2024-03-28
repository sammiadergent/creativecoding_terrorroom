import "./style.css";

let introCounter = 0;
let gamemode = 0;
let videocounter = 1;
const videoElement = document.querySelector("#mainVideo");
const mainvideo = videoElement.querySelector("video");
const intro = document.querySelector(".intro_0");

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
socket.addEventListener("message", (event) => {
  const decodedMessage = JSON.parse(event.data);

  console.log("Message from server: ", decodedMessage);
  if (decodedMessage.type === "select") {
    introCounter++;
    if (introCounter > 0) {
      const prevElement = document.querySelector(`.intro_${introCounter - 1}`);
      if (prevElement) {
        prevElement.classList.add("invisable");
      }
    }

    const currentElement = document.querySelector(`.intro_${introCounter}`);
    if (currentElement) {
      currentElement.classList.remove("invisable");
    }

    if (introCounter === 6) {
      const colors = { ASS: "red", HSP: "green", ADHD: "yellow" };
      if (gamemode) {
        const currentDivElement = (document.getElementById(
          `colorDiv${colorNumber}`,
        ).style.backgroundColor = colors[gamemode]);
      }
    }
    console.log("introCounter: ", introCounter);
    if (introCounter === 6) {
      switch (decodedMessage.data.color) {
        case 2:
          gamemode = "ADHD";
          break;
        case 3:
          gamemode = "HSP";
          break;
        case 1:
          gamemode = "ASS";
      }
      console.log(gamemode);

      //we starten de video

      videoElement.classList.remove("invisable");
      mainvideo.muted = true;
      mainvideo.play();
    }
  } else if (decodedMessage.type === "fail") {
    console.log("JUMPSCARE");
    if (gamemode === "ADHD") {
      mainvideo.pause();
      videoElement.classList.add("invisable");

      const jumpscareElement = document.querySelector(
        `#failvideo2_${videocounter}`,
      );
      const jumpVideo = jumpscareElement.querySelector("video");

      if (jumpVideo) {
        jumpVideo.muted = true;
        jumpVideo.play();
        console.log("Parent div ID: " + jumpVideo.parentNode.id);
        videocounter++; // Increment videocounter here

        jumpVideo.addEventListener("ended", () => {
          jumpscareElement.classList.add("invisable");
          videoElement.classList.remove("invisable");
          mainvideo.muted = true;
          mainvideo.play();
        });
      }

      jumpscareElement.classList.remove("invisable");
    }
    if (gamemode === "ASS") {
      mainvideo.pause();
      videoElement.classList.add("invisable");

      const jumpscareElement = document.querySelector(
        `#failvideo1_${videocounter}`,
      );
      const jumpVideo = jumpscareElement.querySelector("video");

      if (jumpVideo) {
        jumpVideo.muted = true;
        jumpVideo.play();
        console.log("Parent div ID: " + jumpVideo.parentNode.id);
        videocounter++; // Increment videocounter here

        jumpVideo.addEventListener("ended", () => {
          jumpscareElement.classList.add("invisable");
          videoElement.classList.remove("invisable");
          mainvideo.muted = true;
          mainvideo.play();
        });
      }

      jumpscareElement.classList.remove("invisable");
    }
    console.log("JUMPSCARE");
    if (gamemode === "HSP") {
      mainvideo.pause();
      videoElement.classList.add("invisable");

      const jumpscareElement = document.querySelector(
        `#failvideo3_${videocounter}`,
      );
      const jumpVideo = jumpscareElement.querySelector("video");

      if (jumpVideo) {
        jumpVideo.muted = true;
        jumpVideo.play();
        console.log("Parent div ID: " + jumpVideo.parentNode.id);
        videocounter++; // Increment videocounter here

        jumpVideo.addEventListener("ended", () => {
          jumpscareElement.classList.add("invisable");
          videoElement.classList.remove("invisable");
          mainvideo.muted = true;
          mainvideo.play();
        });
      }
      jumpscareElement.classList.remove("invisable");
    }
  } else if (decodedMessage.type === "stop") {
    mainvideo.pause();
    videoElement.classList.add("invisable");
    const noodstop = document.querySelector(`.noodstop`);
    noodstop.classList.remove("invisable");
    if (decodedMessage.type === "select") {
      const outro = document.querySelector(`.outro`);
      outro.classList.remove("invisable");
      setTimeout(() => {
        introCounter = 0;
        gamemode = 0;
        outro.classList.add("invisable");
        intro.classList.remove("invisable");
      }, 5000);
    }
  }
});

//   if (decodedMessage.type === "select") {
//     if (introCounter > 0) {
//       const prevElement = document.querySelector(`.intro_${introCounter - 1}`);
//       if (prevElement) {
//         prevElement.classList.add("invisable");
//       }
//     }

//     const currentElement = document.querySelector(`.intro_${introCounter}`);
//     if (currentElement) {
//       currentElement.classList.remove("invisable");
//       introCounter++;
//     }
//     // when we are on intro 5 we have 3 options that each have a color trigger
//     const nextDivElement = document.getElementById(
//       `colorDiv${colorNumber + 1}`,
//     );
//     if (introCounter === 6) {
//       const colors = ["red", "green", "yellow"];
//       if (decodedMessage.data.color) {
//         const colorNumber = decodedMessage.data.color;
//         const currentDivElement = document.getElementById(
//           `colorDiv${colorNumber}`,
//         );

//         if (currentDivElement) {
//           currentDivElement.style.backgroundColor = colors[colorNumber - 1];
//           currentDivElement.style.display = "none"; // Hide the current div
//           gamemode = colorNumber;
//         }
//         if (nextDivElement) {
//           nextDivElement.style.display = "block"; // Show the next div
//         }
//       }
//     }
//     if (nextDivElement) {
//       nextDivElement.style.display = "block"; // Show the next div
//       const videoElement = document.querySelector("video");
//       if (videoElement) {
//         videoElement.style.display = "block"; // Show the video
//         videoElement.play();
//       }
//       let currentFailIndex = 1; // Initialize the fail index

//       if (decodedMessage.type.fail) {
//         const mainVideoElement = document.querySelector("#mainVideo");
//         const failVideoElement = document.querySelector(
//           `#failVideo${gamemode}_${currentFailIndex}`,
//         );
//         if (mainVideoElement && failVideoElement) {
//           mainVideoElement.pause(); // Pause the main video
//           failVideoElement.style.display = "block"; // Show the fail video
//           failVideoElement.play(); // Play the fail video

//           failVideoElement.addEventListener("ended", () => {
//             failVideoElement.style.display = "none"; // Hide the fail video
//             mainVideoElement.play(); // Resume the main video

//             // Increment the fail index, reset to 1 if it exceeds 4
//             currentFailIndex = (currentFailIndex % 4) + 1;
//           });
//         }
//       }
//     }
//   }
