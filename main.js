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
    { file: loadAudioFile(audioContext, "adhd_1.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "adhd_2.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "adhd_3.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "adhd_4.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_1.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_2.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_3.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_4.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_5.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_6.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_7.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_8.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_9.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_10.mp3"), pan: -1 },
  ],
  HSP: [
    { file: loadAudioFile(audioContext, "hsp_1.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "hsp_2.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "hsp_3.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "hsp_4.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_1.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_2.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_3.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_4.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_5.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_6.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_7.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_8.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_9.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_10.mp3"), pan: 1 },
  ],
  ASS: [
    { file: loadAudioFile(audioContext, "ass_1.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "ass_2.m4a"), pan: 1 },
    { file: loadAudioFile(audioContext, "ass_3.m4a"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_1.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_2.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_3.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_4.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_5.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_6.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_7.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_8.mp3"), pan: -1 },
    { file: loadAudioFile(audioContext, "random_9.mp3"), pan: 1 },
    { file: loadAudioFile(audioContext, "random_10.mp3"), pan: -1 },
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
  } else if (decodedMessage.type === "oselect") {
    const noodstop = document.querySelector(`.noodstop`);
    const outro_1 = document.querySelector(`.outro_1`);
    noodstop.classList.add("invisable");
    outro_1.classList.remove("invisable");
    outroCounter++;
    if (outroCounter > 0) {
      const prevElement = document.querySelector(`.outro_${outroCounter - 1}`);
      if (prevElement) {
        prevElement.classList.add("invisable");
      }
    }
    const currentElement = document.querySelector(`.outro_${outroCounter}`);
    if (currentElement) {
      currentElement.classList.remove("invisable");
    }
    if (outroCounter === 3) {
      console.log("hier komt hij in de select state");
      const outro1 = document.querySelector(`.outro_1`);
      outro1.classList.add("invisable");
      setTimeout(() => {
        outroCounter = 0;
        introCounter = 0;
        gamemode = 0;
        videocounter = 1;
        const outro_3 = document.querySelector(`.outro_3`);
        const intro = document.querySelector(`.intro_0`);
        const outro1 = document.querySelector(`.outro_1`);
        outro1.classList.add("invisable");
        outro_3.classList.add("invisable");
        intro.classList.remove("invisable");
        console.log("hier zou hij moeten resetten");
      }, 5000);
    }
  }
});

// Array of image paths
let images = [];
for (let i = 0; i <= 479; i++) {
  let paddedNumber = String(i).padStart(5, "0");
  images.push(`instructie/2324_CC_TeamTerror_uitlegPNGs_${paddedNumber}.png`);
}

// Get the image element
let imgElement = document.getElementById("uitlegVideo");

// Function to change image
let index = 0;
function changeImage() {
	if (introCounter === 2) {
		imgElement.src = images[index];
		index = (index + 1) % images.length; // Loop back to the first image when reaching the end
	}
}

// Call the function every 1 second (1000 milliseconds)
setInterval(changeImage, 40);
