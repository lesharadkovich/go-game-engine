function Painter(canvas) {
    this.canvas = canvas;
}

Painter.prototype.drawStone = function (centerCoords, stone, board) {
    var x = board.canvasOffset() + centerCoords.x * board.cellWidth;
    var y = board.canvasOffset() + centerCoords.y * board.cellWidth;

    var ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, stone.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = stone.color;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, stone.radius / 3, 0, Math.PI * 2, true);
    ctx.fillStyle = "gray";
    ctx.fill();
    
    var index = board.stoneCoords.length - 2;
    if(index >= 0) {
        var previosX = board.canvasOffset() + board.stoneCoords[index].x * board.cellWidth;
        var previosY = board.canvasOffset() + board.stoneCoords[index].y * board.cellWidth;
        
        ctx.beginPath();
        ctx.arc(previosX, previosY, stone.radius, 0, Math.PI * 2, true);
        if (stone.isBlack) stone.color = "black";
        else stone.color = "white";
        ctx.fillStyle = stone.color;
        ctx.fill();
    }
}

Painter.prototype.drawBoard = function(board) {
    ctx = canvas.getContext('2d');

    var x = board.canvasOffset();
    var y = board.canvasOffset();

    ctx.fillStyle = board.backgroud;
    ctx.fillRect(x - board.canvasOffset(), y - board.canvasOffset(), canvas.width, canvas.height);
    ctx.strokeRect(x, y, board.boardWidth(), board.boardWidth());

    for (i = 0; i < board.cellNumber; i++) {
        ctx.moveTo(x + board.cellWidth * i, y);
        ctx.lineTo(x + board.cellWidth * i, y + board.boardWidth());
        ctx.stroke();

        ctx.moveTo(x, y + board.cellWidth * i);
        ctx.lineTo(x + board.boardWidth(), y + board.cellWidth * i);
        ctx.stroke();
    }
}