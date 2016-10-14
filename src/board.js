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
    if (this.cellNumber <= 9)
        return 100;
    else
        return 50;
}

Board.prototype.isStoneExists = function (centerCoords) {
    for (var i = 0; i < this.stoneCoords.length; i++) {
        if (centerCoords.x === this.stoneCoords[i].x &&
            centerCoords.y === this.stoneCoords[i].y)
            return true;
    }

    // console.log(JSON.stringify(centerCoords, null, 2));

    // console.log(JSON.stringify(this.stoneCoords, null, 2));

    // var index = _.findIndex(this.stoneCoords, centerCoords); 
    // if(index != -1)
    //     return true;
}