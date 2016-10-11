function Field(width) {
    this.width = width,
    this.cellNumber = 4,
    this.backgroud = "rgb(255, 170, 0)",
    this.stoneCoords = []
}

Field.prototype.boardWidth = function () {
    return this.width - 2 * this.canvasOffset();
}

Field.prototype.canvasOffset = function () {
    if(this.cellNumber <= 9) 
        return 100;
    else 
        return 50;
}