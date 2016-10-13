function Board(width) {
    this.width = width,
    this.cellNumber = 9,
    this.backgroud = "rgb(255, 170, 0)",
    this.stoneCoords = [],
    this.cellWidth = this.boardWidth() / this.cellNumber
}

Board.prototype.boardWidth = function () {
    return this.width - 2 * this.canvasOffset();
}

Board.prototype.canvasOffset = function () {
    if(this.cellNumber <= 9) 
        return 100;
    else 
        return 50;
}