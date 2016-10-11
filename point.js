function Point() {
    this.isBlack = true,
    this.color = "black",
    this.cellWidth = field.boardWidth() / field.cellNumber;
    this.radius = this.cellWidth * 0.4;
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

Point.prototype.getPointCoords = function (field, mousePos) {
    var lineX = Math.round((mousePos.x - field.canvasOffset) / this.cellWidth);
    var lineY = Math.round((mousePos.y - field.canvasOffset) / this.cellWidth);

    return {
        x: field.canvasOffset + lineX * this.cellWidth,
        y: field.canvasOffset + lineY * this.cellWidth
    }
}
