let body = document.getElementsByTagName("body")[0];
let togglePan = false;
let toggleDraw = false;
let mousePressed = false;
let defaultColor = "black";
let imageUrl =
  "https://images.pexels.com/photos/4097157/pexels-photo-4097157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

var canvas = initializeCanvas();
canvas.selection = true;

function initializeCanvas() {
  let myCanvas = document.createElement("canvas");
  myCanvas.setAttribute("id", "myCanvas");
  body.append(myCanvas);

  let canvas = new fabric.Canvas(myCanvas, {
    width: 800,
    height: 500,
    selection: true,
  });
  canvas.freeDrawingBrush.width = 4;
  return canvas;
}

function setBackground() {
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
  defaultColor = e.target.value;
  canvas.freeDrawingBrush.color = e.target.value;
}

function sizeHandler(e) {
  let size = +e.target.value;
  document.querySelector("#brushSize").innerText = size;
  canvas.freeDrawingBrush.width = size;
}

let state;
function clearCanvas() {
  state = JSON.stringify(canvas.toObject());
  if (canvas.getObjects().length > 0) {
    canvas.getObjects().map((item) => canvas.remove(item));
  } else {
    console.warn("There is nothing to clear");
  }
}

function restoreCanvas() {
  if (state) {
    const obj = JSON.parse(state);
    console.log(obj);
    console.log(obj.objects);

    canvas.loadFromJSON(obj);
  }
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
function rectangleHandler() {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  const rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: defaultColor,
    left: (canvasWidth - 100) / 2,
    objectCaching: false,
    // top: (canvasHeight - 100) / 2,
  });
  const canvasTop = (canvasHeight - 100) / 2;
  canvas.add(rect);
  rect.animate("top", canvasTop, {
    onChange: canvas.renderAll.bind(canvas),
    easing: fabric.util.ease.easeOutBounce,
    onComplete: function () {
      rect.animate("angle", 360, {
        onChange: canvas.renderAll.bind(canvas),
      });
    },
  });
  canvas.setActiveObject(rect);
  rect.on("selected", () => {
    // rect.fill = "darkblue";
  });
}
function circleHandler() {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  const circle = new fabric.Circle({
    radius: 50,
    fill: defaultColor,
    left: (canvasWidth - 100) / 2,
    // top: (canvasHeight - 100) / 2,
  });
  canvas.add(circle);
  circle.animate("top", canvasHeight - 100, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: function () {
      circle.animate("top", (canvasHeight - 100) / 2, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 800,
      });
    },
  });
  canvas.setActiveObject(circle);
}
let group;
function groupHandler(val) {
  if (val) {
    let objects = canvas.getObjects();
    group = new fabric.Group(objects, { cornerColor: "ligthblue" });
    clearCanvas();
    canvas.add(group);
    canvas.renderAll();
  } else if (group) {
    group.destroy();
    const oldgroup = group.getObjects();
    canvas.clear();
    setBackground();
    canvas.add(...oldgroup);
    group = null;
  }
}

setBackground(canvas);
canvasPan();
