function Painter(canvas) {
    this.canvas = canvas;

    addEventListener('click', function (event) {
        var mousePos = point.getMousePos(canvas, event);
        var cellWidth = field.boardWidth() / field.cellNumber;
        var radius = cellWidth * 0.3;
        var color;

        if (point.isBlack) {
            color = "black";
            point.isBlack = false;
        }
        else {
            color = "white";
            point.isBlack = true;
        }

        var centerPoint = point.getPointCoords(field, mousePos, cellWidth, radius);

        var ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(centerPoint.x, centerPoint.y, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();

    }, false);
}

Painter.prototype.drawStone = function(point, field) {
}

Painter.prototype.drawField = function(field) {
    ctx = canvas.getContext('2d');

    var x = field.canvasOffset;
    var y = field.canvasOffset;

    ctx.strokeRect(x, y, field.boardWidth(), field.boardWidth());
    ctx.strokeRect(x - field.canvasOffset, y - field.canvasOffset, canvas.width, canvas.height);
    ctx.fillStyle = field.backgroud;
    ctx.fillRect(x, y, field.boardWidth(), field.boardWidth());

    var cellWidth = field.boardWidth() / field.cellNumber;
    for (i = 0; i < field.cellNumber; i++) {
        ctx.moveTo(x + cellWidth * i, y);
        ctx.lineTo(x + cellWidth * i, y + field.boardWidth());
        ctx.stroke();

        ctx.moveTo(x, y + cellWidth * i);
        ctx.lineTo(x + field.boardWidth(), y + cellWidth * i);
        ctx.stroke();
    }
}