function Field() {
    this.width = 500,
    this.cellNumber = 4,
    this.backgroud = "rgb(255, 170, 0)",
    this.canvasOffset = 10
}

Field.prototype.boardWidth = function() {
    return this.width - 2 * this.canvasOffset;
}

Field.prototype.drawOn = function (canvas) {
    ctx = canvas.getContext('2d');

    canvas.width = this.width;
    canvas.height = this.width;

    var x = this.canvasOffset;
    var y = this.canvasOffset;

    ctx.strokeRect(x, y, this.boardWidth(), this.boardWidth());
    ctx.strokeRect(x - this.canvasOffset, y - this.canvasOffset, canvas.width, canvas.height);
    ctx.fillStyle = this.backgroud;
    ctx.fillRect(x, y, this.boardWidth(), this.boardWidth());

    var cellWidth = this.boardWidth() / this.cellNumber;
    for (i = 0; i < this.cellNumber; i++) {
        ctx.moveTo(x + cellWidth * i, y);
        ctx.lineTo(x + cellWidth * i, y + this.boardWidth());
        ctx.stroke();

        ctx.moveTo(x, y + cellWidth * i);
        ctx.lineTo(x + this.boardWidth(), y + cellWidth * i);
        ctx.stroke();
    }
}

var field = new Field();

var canvas = document.getElementById("example");
field.drawOn(canvas);
ctx = example.getContext('2d');


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getPointCoords(mousePos) {
    var cellWidth = field.boardWidth() / field.cellNumber;
    var x = 0, y = 0;

    if(mousePos.x % cellWidth < cellWidth * 0.3) {
        x = Math.floor(mousePos.x / cellWidth);
    }
    else if(mousePos.x % cellWidth > cellWidth * 0.7) {
        x = Math.floor(mousePos.x / cellWidth) + 1;
    }
    else return null;

    if(mousePos.y % cellWidth < cellWidth * 0.3) {
        y = Math.floor(mousePos.y / cellWidth);
    }
    else if(mousePos.y % cellWidth > cellWidth * 0.7) {
        y = Math.floor(mousePos.y / cellWidth) + 1;
    }
    else return null;
    
    return {
        X: field.canvasOffset + x * cellWidth,
        Y: field.canvasOffset + y * cellWidth
    }
}

function drawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.X, point.Y, 30, 0, Math.PI*2, true);
    ctx.fillStyle = "black";
    ctx.fill();
}

canvas.addEventListener('click', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    
    var point = getPointCoords(mousePos)
    if(point) drawPoint(point);

}, false);