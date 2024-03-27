import "./style.css";

// Select all divs and buttons
const divs = document.querySelectorAll('div[class^="intro_"]');
const buttons = document.querySelectorAll("button");

// Add event listener to each button
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    // Hide current div
    if (divs[index]) {
      divs[index].style.display = "none";
    }

    // Show next div
    if (divs[index + 1]) {
      divs[index + 1].style.display = "block";
    }
  });
});
