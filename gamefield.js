function Field(width) {
    this.width = width,
    this.cellNumber = 4,
    this.backgroud = "rgb(255, 170, 0)",
    this.canvasOffset = 40
}

Field.prototype.boardWidth = function () {
    return this.width - 2 * this.canvasOffset;
}

Field.prototype.drawOn = function (canvas) {
    ctx = canvas.getContext('2d');

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