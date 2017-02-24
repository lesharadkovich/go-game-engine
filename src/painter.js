class Painter{

    constructor(canvas) {
        this.canvas = canvas;
    }

    drawStone(addingCoords, stone, board) {
        var x = board.canvasOffset() + addingCoords.x * board.cellWidth;
        var y = board.canvasOffset() + addingCoords.y * board.cellWidth;

        var ctx = this.canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(x, y, stone.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = game.currentPlayerColor;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, stone.radius / 3, 0, Math.PI * 2, true);
        ctx.fillStyle = "gray";
        ctx.fill();


        if(board.previousStone !== 0) {
            var previosX = board.canvasOffset() + board.previousStone.x * board.cellWidth;
            var previosY = board.canvasOffset() + board.previousStone.y * board.cellWidth;
            
            ctx.beginPath();
            ctx.arc(previosX, previosY, stone.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = game.color[game.currentPlayerColor];
            ctx.fill();
        }
    }

    deleteStone(deletingCoords, stone, board) {

        var x = board.canvasOffset() + deletingCoords.x * board.cellWidth;
        var y = board.canvasOffset() + deletingCoords.y * board.cellWidth;

        var ctx = this.canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.arc(x, y, stone.radius + 5, 0, Math.PI * 2, true);
        ctx.fillStyle = board.backgroud;
        ctx.fill();
        ctx.strokeStyle = board.backgroud;
        ctx.stroke();


        var ctxx = this.canvas.getContext('2d');
        ctxx.strokeStyle = "black";
        
        var left = x - stone.radius - 5;
        var right = x + stone.radius + 5;
        var top = y - stone.radius - 5;
        var bottom = y + stone.radius + 5;

        if(deletingCoords.x === 0) left = x;
        if(deletingCoords.y === 0) top = y;
        if(deletingCoords.x === board.cellNumber) right = x;
        if(deletingCoords.y === board.cellNumber) bottom = y;


        var line = new Path2D();
        line.moveTo(left, y);
        line.lineTo(right, y);
        ctxx.stroke(line);

        line.moveTo(x, top);
        line.lineTo(x, bottom);
        ctxx.stroke(line);

    }

    drawBoard(board) {
        ctx = this.canvas.getContext('2d');

        var x = board.canvasOffset();
        var y = board.canvasOffset();

        ctx.fillStyle = board.backgroud;
        ctx.fillRect(x - board.canvasOffset(), y - board.canvasOffset(), canvas.width, canvas.height);
        ctx.strokeRect(x, y, board.boardWidth(), board.boardWidth());

        for (var i = 0; i < board.cellNumber; i++) {
            ctx.moveTo(x + board.cellWidth * i, y);
            ctx.lineTo(x + board.cellWidth * i, y + board.boardWidth());
            ctx.stroke();

            ctx.moveTo(x, y + board.cellWidth * i);
            ctx.lineTo(x + board.boardWidth(), y + board.cellWidth * i);
            ctx.stroke();
        }
    }

}