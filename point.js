function Point() {
    this.isBlack = true
}


// Point.prototype.draw = function(canvas, field, painter) {
// }

Point.prototype.getMousePos = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

Point.prototype.getPointCoords = function (field, mousePos, cellWidth, radius) {
    var lineX = Math.round((mousePos.x - field.canvasOffset) / cellWidth);
    var lineY = Math.round((mousePos.y - field.canvasOffset) / cellWidth);

    return {
        x: field.canvasOffset + lineX * cellWidth,
        y: field.canvasOffset + lineY * cellWidth
    }
}
