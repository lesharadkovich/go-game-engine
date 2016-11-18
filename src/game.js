class Game {

    constructor() {
        this.currentPlayerColor = "black",
            this.color = {
                "black": "white",
                "white": "black"
            },
            this.listenClick();
    }


    listenClick() {
        addEventListener('click', function (event) {
            var mousePos = stone.getMousePos(canvas, event);
            var centerCoords = stone.getPointCoords(board, mousePos);

            if (centerCoords && !board.isStoneExists(centerCoords)) {
                painter.drawStone(centerCoords, stone, board, game);

                board.stoneCoords[game.currentPlayerColor].push(centerCoords);
                game.switchPlayer();
            }

        }, false);
    }


    switchPlayer() {
        this.currentPlayerColor = this.color[this.currentPlayerColor];
    }


    addCoords(board, centerCoords) {
        var indexOfCluster = this.findCluster(board, centerCoords)

        if(indexOfCluster >= 0) {
            board.stoneCoords[this.currentPlayerColor][indexOfCluster].coords.push(centerCoords);
        }
        else {
            var cluster = {
                coords: [centerCoords],
                isClosured: false
            };

            board.stoneCoords[this.currentPlayerColor].push(cluster);
        }

        return board.stoneCoords[this.currentPlayerColor];
    }


    findCluster(board, centerCoords) {
        var color = this.currentPlayerColor;

        for (var i = 0; i < board.stoneCoords[color].length; i++) {
            for (var j = 0; j < board.stoneCoords[color][i].coords.length; j++) {
                var current =  board.stoneCoords[color][i].coords[j];

                if(centerCoords.x - current.x <= 1 && centerCoords.x - current.x >= -1 &&
                   centerCoords.y - current.y <= 1 && centerCoords.y - current.y >= -1)
                   return i;
            }
        }

        return -1;
    }
}