function Field(width) {
    this.width = width,
    this.cellNumber = 4,
    this.backgroud = "rgb(255, 170, 0)",
    this.canvasOffset = 50,
    this.stoneCoords = []
}

Field.prototype.boardWidth = function () {
    return this.width - 2 * this.canvasOffset;
}

// Field.prototype.drawOn = function (painter) {
// }