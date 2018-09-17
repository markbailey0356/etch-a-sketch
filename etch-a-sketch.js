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
  stretch(factor, center = 127) {
    return Object.create(Color).init((this.red - center) * factor + center,
      (this.green - center) * factor + center,
      (this.blue - center) * factor + center);
  },
  unstretch(factor, center = 127) {
    return this.stretch(1/factor, center);
  },
  addUnstreched(other, factor, center = 127) {
    return this.unstretch(factor, center).add(other).stretch(factor,center);
  },
  subtractUnstreched(other, factor, center = 127) {
    return this.unstretch(factor, center).subtract(other).stretch(factor,center);
  },
  get WHITE() {return this._WHITE = this._WHITE || Object.create(Color).init(255,255,255)},
  get BLACK() {return this._BLACK = this._BLACK || Object.create(Color).init(0,0,0)},
  get RED() {return this._RED = this._RED || Object.create(Color).init(255,0,0)},
  get GREEN() {return this._GREEN = this._GREEN || Object.create(Color).init(0,255,0)},
  get BLUE() {return this._BLUE = this._BLUE || Object.create(Color).init(0,0,255)},
}

const grid = document.getElementsByClassName("grid")[0];
const frame = document.getElementsByClassName("frame")[0];
const DEFAULT_COLOR_MODE = "subtract";

{ // grid drawing
  const GRID_HEIGHT_IN_PIXELS = 490; 
  const GRID_WIDTH_IN_PIXELS = GRID_HEIGHT_IN_PIXELS * 5 / 3;
  const DEFAULT_GRID_HEIGHT_IN_CELLS = 32;
  
  grid.style.width = GRID_WIDTH_IN_PIXELS + "px";
  grid.style.height = GRID_HEIGHT_IN_PIXELS + "px";
  
  drawHexGrid();
  
  function drawSquareGrid(heightInSquares = DEFAULT_GRID_HEIGHT_IN_CELLS, widthInSquares) {
    let squareHeight = GRID_HEIGHT_IN_PIXELS / Math.floor(heightInSquares);
    widthInSquares = widthInSquares || Math.floor(GRID_WIDTH_IN_PIXELS / squareHeight);
    let squareWidth = GRID_WIDTH_IN_PIXELS / Math.floor(widthInSquares);
    
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
  const COLOR_STRETCH_FACTOR = 0.7;
  const COLOR_STRETCH_CENTER = 127;
  const GRIDLINE_STRETCH_FACTOR = 0.5;
  let coloringFunction = drawColor;
  let penColor = Color.WHITE;
  let opacity = 0.5;

  let leftMouseButtonColorMode;
  let rightMouseButtonColorMode;
  let colorMode;

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
    let currentColor = getCellColor(element);
    colorMode = (colorMode == "subtract") ? Color.subtract.bind(currentColor) : Color.add.bind(currentColor);
    setCellColor(element, colorMode(penColor.multiply(opacity)));
  }
  
  function drawColorRandom(element) {
    setCellColor(element, Object.create(Color).initRandom());
  }

  function setCellColor(element, color = "") {
    if (color && typeof color == "string") {
      if (color[0] == "#") color = Object.create(Color).initFromHex(color);
      else color = Object.create(Color).initFromRGB(color);
    } 
    if (typeof color == "object") color = color.stretch(COLOR_STRETCH_FACTOR, COLOR_STRETCH_CENTER).toRGB();
    element.style.setProperty("--cell-background-color", color);
  }

  function getCellColor(element) {
    let cellColor = element.style.getPropertyValue("--cell-background-color");
    if (cellColor) {
      return Object.create(Color).initFromRGB(cellColor).unstretch(COLOR_STRETCH_FACTOR, COLOR_STRETCH_CENTER);
    } else {
      return getDefaultCellColor();
    } 
  }

  function isDefaultCellColor(element) {
    return !element.style.getPropertyValue("--cell-background-color");
  }

  function clearDrawing() {
    for (let cell of Array.from(grid.children)) {
      if (cell.classList.contains("cell")) {
        setCellColor(cell);
      }
    }
  }

  function invertDrawing(changeDefaultColoredCells = false) {
    for (let cell of Array.from(grid.children)) {
      if (cell.classList.contains("cell")) {
        if (!isDefaultCellColor(cell) || changeDefaultColoredCells) {
          setCellColor(cell, getCellColor(cell).invert());
        }
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

  function setDefaultCellColor(color) {
    document.documentElement.style.setProperty("--default-cell-background-color", color.stretch(COLOR_STRETCH_FACTOR, COLOR_STRETCH_CENTER).toRGB());
  }

  function getDefaultCellColor() {
    return Object.create(Color)
        .initFromRGB(getComputedStyle(document.documentElement).getPropertyValue("--default-cell-background-color"))
        .unstretch(COLOR_STRETCH_FACTOR, COLOR_STRETCH_CENTER);
  }

  changeDrawingMode();

  function changeDrawingMode(_colorMode = DEFAULT_COLOR_MODE) {
    colorMode = _colorMode;
    invertDrawing();
    if (_colorMode == "add") {
      setDefaultCellColor(Color.BLACK);
      grid.style.backgroundColor = Color.BLACK.stretch(GRIDLINE_STRETCH_FACTOR).toRGB();;
      leftMouseButtonColorMode = "add";
      rightMouseButtonColorMode = "subtract";
      buttonColorWhite.textContent = "Color: White";
      buttonColorRed.textContent = "Color: Red";
      buttonColorGreen.textContent = "Color: Green";
      buttonColorBlue.textContent = "Color: Blue";
    } else if (_colorMode == "subtract") {
      setDefaultCellColor(Color.WHITE);
      grid.style.backgroundColor = Color.WHITE.stretch(GRIDLINE_STRETCH_FACTOR).toRGB();
      leftMouseButtonColorMode = "subtract";
      rightMouseButtonColorMode = "add";
      buttonColorWhite.textContent = "Color: Black";
      buttonColorRed.textContent = "Color: Cyan";
      buttonColorGreen.textContent = "Color: Magenta";
      buttonColorBlue.textContent = "Color: Yellow";
    }
  }

  const buttonChangeColorMode = document.getElementsByClassName("change-color-mode-button")[0];
  buttonChangeColorMode.addEventListener("click", function() {
    (colorMode == "add") ? changeDrawingMode("subtract") : changeDrawingMode("add");
  });
}

{ // make frame draggable
  let currentlyDragged = false;
  let previousClientX;
  let previousClientY;

  frame.style.left = getComputedStyle(frame).left;
  frame.style.top = getComputedStyle(frame).top;

  frame.addEventListener("dragstart", function(event) {
    if (event.target == grid) {
      event.preventDefault();
    }
    
    currentlyDragged = true;
    previousClientX = event.clientX;
    previousClientY = event.clientY;
  });

  frame.addEventListener("dragend", function(event) {
    let frameX = parseInt(frame.style.left);
    let frameY = parseInt(frame.style.top);
    frameX += (event.clientX - previousClientX);
    frameY += (event.clientY - previousClientY);
    frame.style.left = frameX + "px";
    frame.style.top = frameY + "px";
  });
}