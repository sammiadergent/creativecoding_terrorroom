import "./style.css";

let introCounter = 0;
let gamemode = 0;
let videocounter = 1;
let outroCounter = 0;
const videoElement = document.querySelector("#mainVideo");
const mainvideo = videoElement.querySelector("video");
const intro = document.querySelector(".intro_0");

//panner
const audioContext = new AudioContext();

// Function to load an audio file into a buffer
function loadAudioFile(context, url) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer));
}

// Function to play a sound with a specific panner value
function playSound(context, audioBuffer, panValue) {
  let source = context.createBufferSource();
  let panner = context.createStereoPanner();
  source.buffer = audioBuffer;
  source.connect(panner);
  panner.connect(context.destination);
  panner.pan.value = panValue;
  source.start();
}

// Load and play a sound
loadAudioFile(audioContext, "audio1.m4a")
  .then((audioBuffer) => playSound(audioContext, audioBuffer, 1))
  .catch((error) => console.error(error));

// audio elementen
const gameModeAudios = {
  ADHD: [
    { file: loadAudioFile(audioContext, "audio1.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "audio2.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "audio3.m4a"), pan: 1 },
  ],
  HSP: [
    { file: loadAudioFile(audioContext, "audio1.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "audio2.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "audio3.m4a"), pan: 1 },
  ],
  ASS: [
    { file: loadAudioFile(audioContext, "audio1.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "audio2.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "audio3.m4a"), pan: -1 },
  ],
};

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

//
document.getElementById("next").addEventListener("click", function () {
  document.getElementById("next").classList.add("invisable");
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
      console.log("gameMode: " + gamemode);

      //we starten de video

      videoElement.classList.remove("invisable");
      //mainvideo.muted = true;
      mainvideo.play();
      setInterval(() => {
        if (!mainvideo.paused) {
          // The video is playing
          // Select a random audio file from the current game mode's audio files
          const audioFiles = gameModeAudios[gamemode];
          const audioFile =
            audioFiles[Math.floor(Math.random() * audioFiles.length)];

          // Log the game mode and the audio file
          console.log(`Game mode: ${gamemode}, Audio file: ${audioFile}`);
          console.log(audioFile);

          // Start the promise returned by audioFile.file
          audioFile.file
            .then((audioBuffer) => {
              // Once the audio buffer is loaded, play the sound
              playSound(audioContext, audioBuffer, audioFile.pan);
            })
            .catch((error) => {
              // Handle any errors that occur during loading the audio file
              console.error("Error loading audio file:", error);
            });
        }
      }, 5000);
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
        //jumpVideo.muted = true;
        jumpVideo.play();
        console.log("Parent div ID: " + jumpVideo.parentNode.id);
        videocounter++; // Increment videocounter here

        jumpVideo.addEventListener("ended", () => {
          jumpscareElement.classList.add("invisable");
          videoElement.classList.remove("invisable");
          //mainvideo.muted = true;
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
        //jumpVideo.muted = true;
        jumpVideo.play();
        console.log("Parent div ID: " + jumpVideo.parentNode.id);
        videocounter++; // Increment videocounter here

        jumpVideo.addEventListener("ended", () => {
          jumpscareElement.classList.add("invisable");
          videoElement.classList.remove("invisable");
          //mainvideo.muted = true;
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
        //jumpVideo.muted = true;
        jumpVideo.play();
        console.log("Parent div ID: " + jumpVideo.parentNode.id);
        videocounter++; // Increment videocounter here

        jumpVideo.addEventListener("ended", () => {
          jumpscareElement.classList.add("invisable");
          videoElement.classList.remove("invisable");
          //mainvideo.muted = true;
          mainvideo.play();
        });
      }
      jumpscareElement.classList.remove("invisable");
    }
    //hier stoppen de modussen
  } else if (decodedMessage.type === "stop") {
    mainvideo.pause();
    mainvideo.currentTime = 0;
    console.log(mainvideo.currentTime);
    videoElement.classList.add("invisable");
    const noodstop = document.querySelector(`.noodstop`);
    noodstop.classList.remove("invisable");
  } else if (decodedMessage.type === "select") {
    noodstop.classList.add("invisable");
    outro_1.classList.remove("invisable");
    outroCounter++;
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
    if (introCounter === 3) {
      setTimeout(() => {
        introCounter = 0;
        outroCounter = 0;
        gamemode = 0;
        videocounter = 1;
        outro_3.classList.add("invisable");
        intro.classList.remove("invisable");
        console.log("hier zou hij moeten resetten");
      }, 5000);
    }
  }
});
