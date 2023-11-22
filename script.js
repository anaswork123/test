let body = document.getElementsByTagName("body")[0];
let togglePan = false;
let toggleDraw = false;
let mousePressed = false;
let imageUrl =
  "https://images.pexels.com/photos/4339681/pexels-photo-4339681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

canvas = initializeCanvas();

function initializeCanvas() {
  let myCanvas = document.createElement("canvas");
  myCanvas.setAttribute("id", "myCanvas");
  body.append(myCanvas);

  let canvas = new fabric.Canvas(myCanvas, {
    width: 800,
    height: 500,
    selection: false,
  });
  canvas.freeDrawingBrush.width = 4;

  return canvas;
}

function setBackground(canvas) {
  fabric.Image.fromURL(imageUrl, (img) => {
    canvas.backgroundImage = img;
    canvas.renderAll();
  });
}

function togglePanHandler() {
  toggleDraw = false;
  togglePan === true ? (togglePan = false) : (togglePan = true);
}

function toggleDrawHandler() {
  togglePan = false;
  toggleDraw === true ? (toggleDraw = false) : (toggleDraw = true);
}

function canvasPan(e) {
  if (togglePan) {
    canvas.setCursor("grab");
  }
  if (toggleDraw) {
    canvas.setCursor("crosshair");
  }
  if (mousePressed && togglePan) {
    canvas.isDrawingMode = false;
    const cords = new fabric.Point(e.movementX, e.movementY);
    canvas.relativePan(cords);
    canvas.setCursor("grab");
  }
}
function canvasDraw() {
  // canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);

  if (mousePressed && toggleDraw) {
    canvas.isDrawingMode = true;
  } else {
    canvas.isDrawingMode = false;
  }
}

function colorHandler(e) {
  canvas.freeDrawingBrush.color = e.target.value;
}

function sizeHandler(e) {
  let size = +e.target.value;
  document.querySelector("#brushSize").innerText = size;
  canvas.freeDrawingBrush.width = size;
}

canvas.on("mouse:move", ({ e }) => {
  canvasPan(e);
});

canvas.on("mouse:down", () => {
  mousePressed = true;
  canvasDraw();
  if (togglePan) {
    canvas.setCursor("grab");
  }
});

canvas.on("mouse:up", () => {
  if (togglePan) {
    canvas.setCursor("grab");
  }
  mousePressed = false;
});

function imageHandler(e) {
  imageUrl = e.target.files[0];
  console.log(imageUrl);
  setBackground(canvas);
}

setBackground(canvas);
canvasPan();
