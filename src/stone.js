function Stone(board) {
    this.isBlack = true,
    this.color = "black",
    this.radius = board.cellWidth * 0.4;

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
