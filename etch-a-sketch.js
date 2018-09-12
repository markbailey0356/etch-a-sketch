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
  
  let Color = {
    set red(val) {this._red = this.clamp(val, 0, 255);},
    get red() {return this._red;},
    set green(val) {this._green = this.clamp(val, 0, 255);},
    get green() {return this._green;},
    set blue(val) {this._blue = this.clamp(val, 0, 255);},
    get blue() {return this._blue;},
    init(red,green,blue) {
      this.red = red;
      this.green = green;
      this.blue = blue;
      return this
    },
    add(other) {
      return Object.create(Color).init(this.red + other.red, this.green + other.green, this.blue + other.blue)
    },
    multiply(factor) {
      return Object.create(Color).init(this.red * factor, this.green * factor, this.blue * factor)
    },
    clamp(number, min, max) {
      return Math.min(Math.max(min, number), max)
    },
    hex(number) {
      return (number < 16 ? "0":"") + number.toString(16);
    },
    get toRGB() {
      return `rgb(${this.red},${this.green},${this.blue})`
    },
    get toHex() {
      return "#" + this.hex(this.red) + this.hex(this.green) + this.hex(this.blue)
    }
  }

  function random(number) {
    return Math.floor(Math.random()*number);
  }
}
