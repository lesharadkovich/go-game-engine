function Stone(board) {
    this.isBlack = true,
    this.color = "black",
    this.radius = board.cellWidth * 0.4;

    clickListener(this, board);
}


function clickListener(stone, board) {

    addEventListener('click', function (event) {
        var mousePos = stone.getMousePos(canvas, event);
        var centerPoint = stone.getPointCoords(board, mousePos);

        if(!isStoneExists(centerPoint, board) && centerPoint) {
            if (stone.isBlack) stone.color = "black";
            else stone.color = "white";
            stone.isBlack = !stone.isBlack;
            board.stoneCoords.push(centerPoint);

            painter.drawStone(centerPoint, stone, board);
        }

    }, false);
}

function isStoneExists(centerPoint, board) {
    if(centerPoint) {

        for (var i = 0; i < board.stoneCoords.length; i++) {
            if(centerPoint.x === board.stoneCoords[i].x && 
            centerPoint.y === board.stoneCoords[i].y) 
                return true;
        }

        // if(board.stoneCoords.indexOf(centerPoint) != -1)
        //     return true;
    }
}

Stone.prototype.getMousePos = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

Stone.prototype.getPointCoords = function (board, mousePos) {
    var coords = {
        x: Math.round((mousePos.x - board.canvasOffset()) / board.cellWidth),
        y: Math.round((mousePos.y - board.canvasOffset()) / board.cellWidth)  
    }

    if (coords.x >= 0 && coords.x <= board.cellNumber &&
        coords.y >= 0 && coords.y <= board.cellNumber) {
            return coords;
        }
    else return null;
}
