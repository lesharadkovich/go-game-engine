function Painter(canvas) {
    this.canvas = canvas;

    addEventListener('click', function (event) {
        var mousePos = point.getMousePos(canvas, event);
        var centerPoint = point.getPointCoords(field, mousePos);
        var isStoneExist = false;

        for (var i = 0; i < field.stoneCoords.length; i++) {
            if(centerPoint.x === field.stoneCoords[i].x && 
               centerPoint.y === field.stoneCoords[i].y) {
                isStoneExist = true;
                break;
            }
        }


        if(!isStoneExist) {
            field.stoneCoords.push(centerPoint);

            if (point.isBlack) point.color = "black";
            else point.color = "white";
        
            point.isBlack = !point.isBlack;

            var ctx = this.canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(centerPoint.x, centerPoint.y, point.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = point.color;
            ctx.fill();
            ctx.stroke();
        }

    }, false);
}

// Painter.prototype.drawStone = function(centerPoint, radius, color) {
    
// }

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