var Color = {
  set red(val) {this._red = Math.floor(this.clamp(val, 0, 255));},
  get red() {return this._red;},
  set green(val) {this._green = Math.floor(this.clamp(val, 0, 255));},
  get green() {return this._green;},
  set blue(val) {this._blue = Math.floor(this.clamp(val, 0, 255));},
  get blue() {return this._blue;},
  init(red,green,blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    return this
  },
  initRandom() {
    this.red = this.random(255);
    this.green = this.random(255);
    this.blue = this.random(255);
    return this
  },
  initFromHex(hex) {
    this.red = parseInt(hex.substr(1,2),16);
    this.green = parseInt(hex.substr(3,2),16);
    this.blue = parseInt(hex.substr(5,2),16);
    return this
  },
  initFromRGB(rgb) {
    [this.red, this.green, this.blue] = rgb.slice(4,-1).split(",");
    return this;
  },
  add(other) {
    return Object.create(Color).init(this.red + other.red, this.green + other.green, this.blue + other.blue)
  },
  subtract(other) {
    return Object.create(Color).init(this.red - other.red, this.green - other.green, this.blue - other.blue);
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
  random(number) {
    return Math.floor(Math.random()*number);
  },
  toRGB() {
    return `rgb(${this.red},${this.green},${this.blue})`
  },
  toHex() {
    return "#" + this.hex(this.red) + this.hex(this.green) + this.hex(this.blue)
  },
  invert() {
    return Object.create(Color).init(255 - this.red, 255 - this.green, 255 - this.blue);
  },
  get WHITE() {return this._WHITE = this._WHITE || Object.create(Color).init(255,255,255)},
  get BLACK() {return this._BLACK = this._BLACK || Object.create(Color).init(0,0,0)},
  get RED() {return this._RED = this._RED || Object.create(Color).init(255,0,0)},
  get GREEN() {return this._GREEN = this._GREEN || Object.create(Color).init(0,255,0)},
  get BLUE() {return this._BLUE = this._BLUE || Object.create(Color).init(0,0,255)},
}

const grid = document.getElementsByClassName("grid")[0];
const DEFAULT_SQUARE_COLOR = Color.BLACK;

{ // grid drawing
  const SIDE_BAR_WIDTH_IN_PIXELS = 120;
  const GRID_WIDTH_IN_PIXELS = window.innerWidth;
  const GRID_HEIGHT_IN_PIXELS = window.innerHeight;  
  const DEFAULT_GRID_HEIGHT_IN_SQUARES = 32;
  
  grid.style.width = GRID_WIDTH_IN_PIXELS + "px";
  grid.style.height = GRID_HEIGHT_IN_PIXELS + "px";
  
  drawHexGrid(DEFAULT_GRID_HEIGHT_IN_SQUARES);
  
  function drawGrid(heightInSquares = DEFAULT_GRID_HEIGHT_IN_SQUARES, widthInSquares) {
    let squareHeight = Math.floor(GRID_HEIGHT_IN_PIXELS / Math.floor(heightInSquares));
    widthInSquares = widthInSquares || Math.floor(GRID_WIDTH_IN_PIXELS / squareHeight);
    let squareWidth = Math.floor(GRID_WIDTH_IN_PIXELS / Math.floor(widthInSquares)) ;
    
    clearGrid();
    
    for (let i = 0; i < heightInSquares * widthInSquares; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.style.backgroundColor = DEFAULT_SQUARE_COLOR.toRGB();
      square.style.width = squareWidth + "px";
      square.style.height = squareHeight + "px";
      grid.appendChild(square);
    }
  }
  
  function drawHexGrid(heightInHexes) { // currently only support regular hexagons, so only need height
    clearGrid();
    heightInHexes = Math.floor(heightInHexes * 2) / 2; // truncate to nearest 0.5
    const hexagonHeight = GRID_HEIGHT_IN_PIXELS / heightInHexes;
    const hexagonSideLength = hexagonHeight / Math.sqrt(3);
    const hexagonBorder = 1;
    
    document.documentElement.style.setProperty("--default-hexagon-background-color", DEFAULT_SQUARE_COLOR.toRGB())
    document.documentElement.style.setProperty("--default-hexagon-margin-side-length", hexagonSideLength + "px")
    document.documentElement.style.setProperty("--default-hexagon-margin", hexagonBorder + "px");

    const numRows = heightInHexes*2 + 1;
    const numCols = Math.floor(2 * (GRID_WIDTH_IN_PIXELS / (3*hexagonSideLength)) + 1 + 1/3);
    for (let row = 0; row < numRows; row++) {
      let _top = (hexagonHeight / 2) * (row - 1);
      for (let col = 0; col < (numCols - (row % 2)) / 2; col++) { // actually loops over every second column per row
        let _left = (row % 2)*(hexagonSideLength*1.5) + (hexagonSideLength * 3) * col;
        let hexagon = document.createElement("div");
        hexagon.classList.add("hexagon");
        hexagon.style.left = _left + "px";
        hexagon.style.top = _top + "px";
        grid.appendChild(hexagon);
      }
    }
  }
  
  function clearGrid() {
    while (grid.lastChild) {
      grid.removeChild(grid.lastChild);
    }
  }
  
  const buttonRedraw = document.getElementsByClassName("redraw-button")[0];
  
  buttonRedraw.addEventListener("click", function(event) {
    let newHeightInSquares = prompt("Please enter how many grid squares in height", DEFAULT_GRID_HEIGHT_IN_SQUARES);
    let newWidthInSquares = prompt("Please enter how many grid squares in width [Leave blank for square grid-squares]", "");
    if (newHeightInSquares) {
      drawGrid(newHeightInSquares, newWidthInSquares);
    }
  });
}

{ // grid coloring
  let coloringFunction = changeColor;
  let drawColor = Color.WHITE;
  let opacity = 0.1;
  
  grid.addEventListener("mouseover", function(event) {
    if (event.target.classList.contains("square")) { // ensure only squares are targeted, not the whole grid
      coloringFunction(event.target);
    }
  });
  
  function changeColor(element) {
    let currentColor = element.style.backgroundColor ? Object.create(Color).initFromRGB(element.style.backgroundColor) : DEFAULT_SQUARE_COLOR;
    element.style.backgroundColor = currentColor.add(drawColor.multiply(opacity)).toRGB();
  }
  
  function changeColorRandom(element) {
    element.style.backgroundColor = Object.create(Color).initRandom().toRGB();
  }
  
  const buttonColorWhite = document.getElementsByClassName("white-button")[0];
  buttonColorWhite.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = Color.WHITE;
  });
  
  const buttonColorRed = document.getElementsByClassName("red-button")[0];
  buttonColorRed.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = Color.RED;
  });
  
  const buttonColorGreen = document.getElementsByClassName("green-button")[0];
  buttonColorGreen.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = Color.GREEN;
  });
  
  const buttonColorBlue = document.getElementsByClassName("blue-button")[0];
  buttonColorBlue.addEventListener("click", () => {
    coloringFunction = changeColor;
    drawColor = Color.BLUE;
  });
  
  const buttonColorRandom = document.getElementsByClassName("random-button")[0];
  buttonColorRandom.addEventListener("click", () => coloringFunction = changeColorRandom);
}

