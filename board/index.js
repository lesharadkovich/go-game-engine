function Board(width, size) {
    this.width = width;
    this.cellNumber = size - 1;
    this.backgroud = "rgb(255, 170, 0)";
    this.stoneCoords = {
        "black": [],
        "white": []
    };
    this.previousStone = 0;
    this.deletedCoords = [];
    this.cellWidth = this.getBoardWidth() / this.cellNumber;
    this.canvasOffset = this.getCanvasOffset();
    this.boardWidth = this.getBoardWidth();
}


Board.prototype.getBoardWidth = function() {
    return this.width - 2 * this.getCanvasOffset();
}

Board.prototype.getCanvasOffset = function() {
    if (this.cellNumber <= 9)
        return 100;
    else
        return 50;
}

Board.prototype.isStoneExists = function(centerCoords) {
    for (var color in this.stoneCoords) {
        for (var i = 0; i < this.stoneCoords[color].length; i++) {
            if (this.isClusterContainsStone(i, centerCoords, color)) {
                return true;
            }
        }
    }

    return false;
}

Board.prototype.isClusterContainsStone = function(indexOfCluster, centerCoords, color) {
    for (var i = 0; i < this.stoneCoords[color][indexOfCluster].length; i++) {
        var current = this.stoneCoords[color][indexOfCluster][i];

        if (centerCoords.x === current.x && centerCoords.y === current.y) {
            return true;
        }
    }

    return false;
}

Board.prototype.isStoneDeleted = function(stoneCoords) {
    for (var i = 0; i < this.deletedCoords.length; i++) {
        if (this.deletedCoords[i].x === stoneCoords.x &&
            this.deletedCoords[i].y === stoneCoords.y) {
            return true;
        }
    }

    return false;
}


module.exports = Board;