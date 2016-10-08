function Point() {

}


Point.prototype.draw = function(canvas, field) {
    addEventListener('click', function (event) {
        var mousePos = getMousePos(canvas, event);
        var cellWidth = field.boardWidth() / field.cellNumber;
        var radius = cellWidth * 0.3;

        var centerPoint = getPointCoords(field, mousePos, cellWidth, radius)
        console.log(centerPoint);
        if (centerPoint) drawPoint(centerPoint, radius, canvas);

    }, false);
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function getPointCoords(field, mousePos, cellWidth, radius) {
    var lineX = Math.round((mousePos.x - field.canvasOffset) / cellWidth);
    var lineY = Math.round((mousePos.y - field.canvasOffset) / cellWidth);

    if (isClickInsideRadius(mousePos, radius, cellWidth))
        return {
            x: field.canvasOffset + lineX * cellWidth,
            y: field.canvasOffset + lineY * cellWidth
        }
    else return null;
}

function isClickInsideRadius(mousePos, radius, cellWidth) {
    var conditionX = (mousePos.x - field.canvasOffset) % cellWidth;
    var conditionY = (mousePos.y - field.canvasOffset) % cellWidth;

    if (conditionX > radius && conditionX < (cellWidth - radius) ||
        conditionY > radius && conditionY < (cellWidth - radius))
        return false;
    else return true;
}

function drawPoint(centerPoint, radius, canvas) {
    ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(centerPoint.X, centerPoint.Y, radius, 0, Math.PI * 2, true);
    ctx.fillStyle = "black";
    ctx.fill();
}