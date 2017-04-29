var canvas = $('#canvas');

function drawBoard(board) {
    var context = $('#canvas').get(0).getContext("2d");

    var x = board.canvasOffset;
    var y = board.canvasOffset;

    context.fillStyle = board.backgroud;
    context.fillRect(x - board.canvasOffset, y - board.canvasOffset, board.width, board.width);
    context.strokeRect(x, y, board.boardWidth, board.boardWidth);

    for (var i = 0; i < board.cellNumber; i++) {
        context.moveTo(x + board.cellWidth * i, y);
        context.lineTo(x + board.cellWidth * i, y + board.boardWidth);
        context.stroke();

        context.moveTo(x, y + board.cellWidth * i);
        context.lineTo(x + board.boardWidth, y + board.cellWidth * i);
        context.stroke();
    }
}

function drawStone(addingCoords, stone, board, game) {
    var context = $('#canvas').get(0).getContext("2d");

    var x = board.canvasOffset + addingCoords.x * board.cellWidth;
    var y = board.canvasOffset + addingCoords.y * board.cellWidth;

    //var context = this.canvas.getContext('2d');
    context.beginPath();
    context.arc(x, y, stone.radius, 0, Math.PI * 2, true);
    context.fillStyle = game.currentPlayerColor;
    context.fill();
    context.stroke();

    context.beginPath();
    context.arc(x, y, stone.radius / 3, 0, Math.PI * 2, true);
    context.fillStyle = "gray";
    context.fill();


    if (board.previousStone !== 0) {
        var previosX = board.canvasOffset + board.previousStone.x * board.cellWidth;
        var previosY = board.canvasOffset + board.previousStone.y * board.cellWidth;

        context.beginPath();
        context.arc(previosX, previosY, stone.radius, 0, Math.PI * 2, true);
        context.fillStyle = game.color[game.currentPlayerColor];
        context.fill();
    }
}

function deleteStones(surroundedCoords, game, board, stone) {
    var enemyColor = game.color[game.currentPlayerColor];

    for (var i = 0; i < surroundedCoords.length; i++) {
        for (var j = 0; j < surroundedCoords[i].length; j++) {
            var surrounded = surroundedCoords[i][j];

            deleteCoords(surrounded, board, enemyColor, stone, game);
        }
    }
}

function deleteCoords(surrounded, board, enemyColor, stone, game) {
    for (var i = 0; i < board.stoneCoords[enemyColor].length; i++) {
        for (var j = 0; j < board.stoneCoords[enemyColor][i].length; j++) {
            var current = board.stoneCoords[enemyColor][i][j];

            if (surrounded.x === current.x && surrounded.y === current.y) {
                //painter.deleteStone(current, stone, board);
                eraseStones(current, stone, board);
                board.stoneCoords[enemyColor][i].splice(j, 1);

                board.deletedCoords.push(current);

                //game.score[game.currentPlayerColor]++;
                return;
            }
        }
    }
}

function eraseStones(deletingCoords, stone, board) {
    var x = board.canvasOffset + deletingCoords.x * board.cellWidth;
    var y = board.canvasOffset + deletingCoords.y * board.cellWidth;

    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(x, y, stone.radius + 5, 0, Math.PI * 2, true);
    ctx.fillStyle = board.backgroud;
    ctx.fill();
    ctx.strokeStyle = board.backgroud;
    ctx.stroke();


    var ctxx = canvas.getContext('2d');
    ctxx.strokeStyle = "black";

    var left = x - stone.radius - 5;
    var right = x + stone.radius + 5;
    var top = y - stone.radius - 5;
    var bottom = y + stone.radius + 5;

    if (deletingCoords.x === 0) left = x;
    if (deletingCoords.y === 0) top = y;
    if (deletingCoords.x === board.cellNumber) right = x;
    if (deletingCoords.y === board.cellNumber) bottom = y;


    var line = new Path2D();
    line.moveTo(left, y);
    line.lineTo(right, y);
    ctxx.stroke(line);

    line.moveTo(x, top);
    line.lineTo(x, bottom);
    ctxx.stroke(line);
}
