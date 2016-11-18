class Stone {

    constructor(board) {
        this.radius = board.cellWidth * 0.4;
    }

    getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    getPointCoords(board, mousePos) {
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

}