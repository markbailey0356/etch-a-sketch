const GRID_SIDE_LENGTH_IN_PIXELS = 960;
const DEFAULT_GRID_SQUARES_PER_SIDE = 32;
const grid = document.getElementsByClassName("grid")[0];
grid.style.width = grid.style.height = GRID_SIDE_LENGTH_IN_PIXELS + "px";

drawGrid(DEFAULT_GRID_SQUARES_PER_SIDE);

grid.addEventListener("mouseover", function(event) {
  if (event.target.classList.contains("square")) {
    event.target.classList.add("coloured");
  }
});

const redrawButton = document.getElementsByClassName("redraw-button")[0];
redrawButton.addEventListener("click", function(event) {
  let newSquaresPerSide = prompt("Please enter how many squares per side", DEFAULT_GRID_SQUARES_PER_SIDE) || DEFAULT_GRID_SQUARES_PER_SIDE;
  drawGrid(newSquaresPerSide);
});

function drawGrid(squaresPerSide = DEFAULT_GRID_SQUARES_PER_SIDE) {
  let squareSideLength = Math.floor(GRID_SIDE_LENGTH_IN_PIXELS / Math.floor(squaresPerSide));
  while (grid.lastChild) {
    grid.removeChild(grid.lastChild);
  }
  for (let i = 0; i < Math.pow(squaresPerSide, 2); i++) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.style.width = square.style.height = squareSideLength + "px";
    grid.appendChild(square);
  }
}
