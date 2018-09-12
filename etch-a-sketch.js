const GRID_SIDE_LENGTH_IN_PIXELS = 960;
const DEFAULT_GRID_SQUARES_PER_SIDE = 16;
const grid = document.getElementsByClassName("grid")[0];
grid.style.width = grid.style.height = GRID_SIDE_LENGTH_IN_PIXELS + "px";

drawGrid(32);

grid.addEventListener("mouseover", function(event) {
  if (event.target.classList.contains("square")) {
    event.target.classList.add("coloured");
  }
});

function drawGrid(squaresPerSide = DEFAULT_GRID_SQUARES_PER_SIDE) {
  let squareSideLength = Math.floor(GRID_SIDE_LENGTH_IN_PIXELS / squaresPerSide);
  for (let i = 0; i < Math.pow(squaresPerSide, 2); i++) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.style.width = square.style.height = squareSideLength + "px";
    grid.appendChild(square);
  }
}
