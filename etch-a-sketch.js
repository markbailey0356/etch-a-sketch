const grid = document.getElementsByClassName("grid")[0];

{ // grid drawing
  const GRID_SIDE_LENGTH_IN_PIXELS = 960;
  const DEFAULT_GRID_SQUARES_PER_SIDE = 32;

  grid.style.width = grid.style.height = GRID_SIDE_LENGTH_IN_PIXELS + "px";

  drawGrid(DEFAULT_GRID_SQUARES_PER_SIDE);

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

  const buttonRedraw = document.getElementsByClassName("redraw-button")[0];

  buttonRedraw.addEventListener("click", function(event) {
    let newSquaresPerSide = prompt("Please enter how many squares per side", DEFAULT_GRID_SQUARES_PER_SIDE) || DEFAULT_GRID_SQUARES_PER_SIDE;
    drawGrid(newSquaresPerSide);
  });
}

{ // grid coloring
  let coloringFunction = changeColor;
  let drawColor = "black";
  
  const buttonColorBlack = document.getElementsByClassName("black-button")[0];
  buttonColorBlack.addEventListener("click", () => coloringFunction = changeColorBlack);

  const buttonColorRandom = document.getElementsByClassName("random-button")[0];
  buttonColorRandom.addEventListener("click", () => coloringFunction = changeColorRandom);

  grid.addEventListener("mouseover", function(event) {
    if (event.target.classList.contains("square")) { // ensure only squares are targeted, not the whole grid
      coloringFunction(event.target);
    }
  });

  function changeColor(element) {
    element.style.backgroundColor = drawColor;
  }
  
  function changeColorRandom(element) {
    element.style.backgroundColor = `rgb(${random(255)},${random(255)},${random(255)})`;
  }
  
  function random(number) {
    return Math.floor(Math.random()*number);
  }

  const buttonColorBlack = document.getElementsByClassName("black-button")[0];
  buttonColorBlack.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = "black";
  });

  const buttonColorRed = document.getElementsByClassName("red-button")[0];
  buttonColorRed.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = "red";
  });

  const buttonColorGreen = document.getElementsByClassName("green-button")[0];
  buttonColorGreen.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = "green";
  });

  const buttonColorBlue = document.getElementsByClassName("blue-button")[0];
  buttonColorBlue.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = "blue";
  });

  const buttonColorRandom = document.getElementsByClassName("random-button")[0];
  buttonColorRandom.addEventListener("click", () => coloringFunction = changeColorRandom);
}
