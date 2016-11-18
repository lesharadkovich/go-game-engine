class Board {
   
    constructor(width) {
        this.width = width,
        this.cellNumber = 9,
        this.backgroud = "rgb(255, 170, 0)",
        this.stoneCoords = {
            "black": [],
            "white": []
        },
        this.cellWidth = this.boardWidth() / this.cellNumber
    }

    boardWidth() {
        return this.width - 2 * this.canvasOffset();
    }

    canvasOffset() {
        if (this.cellNumber <= 9)
            return 100;
        else
            return 50;
    }

    isStoneExists(centerCoords) {
        for(var color in this.stoneCoords) {
            for (var i = 0; i < this.stoneCoords[color].length; i++) {
                for (var j = 0; j < this.stoneCoords[color].length; j++) {
                    var current =  board.stoneCoords[color][i].coords[j];

                    if (centerCoords.x === current.x &&
                        centerCoords.y === current.y)
                        return true;
                }
            }
        }
    }

}