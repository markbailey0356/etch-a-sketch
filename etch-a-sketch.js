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
const DEFAULT_CELL_COLOR = Color.BLACK;
setDefaultCellColor();

function setDefaultCellColor(color = DEFAULT_CELL_COLOR) {
  document.documentElement.style.setProperty("--default-cell-background-color", color.toRGB());
}

function getDefaultCellColor() {
  return Object.create(Color).initFromRGB(getComputedStyle(document.documentElement).getPropertyValue("--default-cell-background-color"));
}

{ // grid drawing
  const SIDE_BAR_WIDTH_IN_PIXELS = 120;
  const GRID_HEIGHT_IN_PIXELS = 490; 
  const GRID_WIDTH_IN_PIXELS = GRID_HEIGHT_IN_PIXELS * 5 / 3;
  const DEFAULT_GRID_HEIGHT_IN_CELLS = 32;
  
  grid.style.width = GRID_WIDTH_IN_PIXELS + "px";
  grid.style.height = GRID_HEIGHT_IN_PIXELS + "px";
  grid.style.left = SIDE_BAR_WIDTH_IN_PIXELS + "px";
  grid.style.top = "0";
  
  drawHexGrid();
  
  function drawSquareGrid(heightInSquares = DEFAULT_GRID_HEIGHT_IN_CELLS, widthInSquares) {
    let squareHeight = Math.floor(GRID_HEIGHT_IN_PIXELS / Math.floor(heightInSquares));
    widthInSquares = widthInSquares || Math.floor(GRID_WIDTH_IN_PIXELS / squareHeight);
    let squareWidth = Math.floor(GRID_WIDTH_IN_PIXELS / Math.floor(widthInSquares)) ;
    
    clearGrid();
    
    for (let i = 0; i < heightInSquares * widthInSquares; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("cell");
      square.style.width = squareWidth + "px";
      square.style.height = squareHeight + "px";
      grid.appendChild(square);
    }
  }
  
  function drawHexGrid(heightInHexes = DEFAULT_GRID_HEIGHT_IN_CELLS) { // currently only support regular hexagons, so only need height
    clearGrid();
    heightInHexes = Math.floor(heightInHexes * 2) / 2; // truncate to nearest 0.5
    const hexagonHeight = GRID_HEIGHT_IN_PIXELS / heightInHexes;
    const hexagonSideLength = hexagonHeight / Math.sqrt(3);
    const hexagonBorder = 0.5;

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
        hexagon.classList.add("cell");
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
  
  const buttonSquareRedraw = document.getElementsByClassName("square-redraw-button")[0];
  
  buttonSquareRedraw.addEventListener("click", function(event) {
    let newHeightInSquares = prompt("Please enter how many cells in height", DEFAULT_GRID_HEIGHT_IN_CELLS);
    if (newHeightInSquares) {
      drawSquareGrid(newHeightInSquares);
    }
  });

  const buttonHexRedraw = document.getElementsByClassName("hex-redraw-button")[0];
  
  buttonHexRedraw.addEventListener("click", function(event) {
    let newHeightInHexs = prompt("Please enter how many cells in height", DEFAULT_GRID_HEIGHT_IN_CELLS);
    if (newHeightInHexs) {
      drawHexGrid(newHeightInHexs);
    }
  });
}

{ // grid coloring
  let coloringFunction = drawColor;
  let penColor = Color.WHITE;
  let opacity = 0.5;
  let leftMouseButtonColorMode = "add";
  let rightMouseButtonColorMode = "subtract";

  grid.addEventListener("mouseover", function(event) {
    if (event.target.classList.contains("cell")) { // ensure only cells are targeted, not the whole grid
      if (event.buttons == 1) { // draw with left mouse button
        coloringFunction(event.target, leftMouseButtonColorMode);
      } else if (event.buttons == 2) { // erase with right mouse button
        coloringFunction(event.target, rightMouseButtonColorMode);
      }
    }
  });

  grid.addEventListener("contextmenu", event => event.preventDefault());
  grid.addEventListener("dragstart", event => event.preventDefault());

  function drawColor(element, colorMode) {
    let currentColor = element.style.getPropertyValue("--cell-background-color");
    currentColor = currentColor ? Object.create(Color).initFromRGB(currentColor) : getDefaultCellColor();
    colorMode = (colorMode == "subtract") ? Color.subtract.bind(currentColor) : Color.add.bind(currentColor);
    changeCellColor(element, colorMode(penColor.multiply(opacity)));
  }
  
  function drawColorRandom(element) {
    changeCellColor(element, Object.create(Color).initRandom());
  }

  function changeCellColor(element, color = "") {
    if (typeof color == "object") color = color.toRGB();
    element.style.setProperty("--cell-background-color", color);
  }

  function clearDrawing() {
    for (let cell of Array.from(grid.children)) {
      if (cell.classList.contains("cell")) {
        changeCellColor(cell);
      }
    }
  }
  
  const buttonColorWhite = document.getElementsByClassName("white-button")[0];
  buttonColorWhite.addEventListener("click", () => {
    coloringFunction = drawColor;
    penColor = Color.WHITE;
  });
  
  const buttonColorRed = document.getElementsByClassName("red-button")[0];
  buttonColorRed.addEventListener("click", () => {
    coloringFunction = drawColor;
    penColor = Color.RED;
  });
  
  const buttonColorGreen = document.getElementsByClassName("green-button")[0];
  buttonColorGreen.addEventListener("click", () => {
    coloringFunction = drawColor;
    penColor = Color.GREEN;
  });
  
  const buttonColorBlue = document.getElementsByClassName("blue-button")[0];
  buttonColorBlue.addEventListener("click", () => {
    coloringFunction = drawColor;
    penColor = Color.BLUE;
  });
  
  const buttonColorRandom = document.getElementsByClassName("random-button")[0];
  buttonColorRandom.addEventListener("click", () => coloringFunction = drawColorRandom);

  const buttonClearDrawing = document.getElementsByClassName("clear-drawing-button")[0];
  buttonClearDrawing.addEventListener("click", clearDrawing);

  (function changeDrawingMode(colorMode = "subtract") {
    if (colorMode == "subtract") {
      setDefaultCellColor(Color.WHITE);
      leftMouseButtonColorMode = "subtract";
      rightMouseButtonColorMode = "add";
    }
  })();
}

