function Field(width) {
    this.width = width,
    this.cellNumber = 6,
    this.backgroud = "rgb(255, 170, 0)",
    this.canvasOffset = 40
}

Field.prototype.boardWidth = function () {
    return this.width - 2 * this.canvasOffset;
}

// Field.prototype.drawOn = function (painter) {
// }