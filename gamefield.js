var field = {
    width: 500,
    cellNumber: 5,
    backgroud: "rgb(255,165,0)",
    canvasOffset: 20,
    boardWidth: function () {
        return this.width - 2 * this.canvasOffset;
    },
    drawOn: function (canvas) {
        // console.log(JSON.stringify(this, null, 2));

        ctx = canvas.getContext('2d');

        canvas.width = this.width;
        canvas.height = canvas.width;

        var x = this.canvasOffset;
        var y = this.canvasOffset;

        // console.log(this.boardWidth())

        ctx.strokeRect(x, y, this.boardWidth(), this.boardWidth());
        ctx.strokeRect(x - this.canvasOffset, y - this.canvasOffset, canvas.width, canvas.height);
        ctx.fillStyle = this.backgroud;
        ctx.fillRect(x, y, this.boardWidth(), this.boardWidth());

        var cellWidth = this.boardWidth() / this.cellNumber;
        for (i = 0; i < this.cellNumber; i++) {
            ctx.moveTo(x + cellWidth * i, y);
            ctx.lineTo(x + cellWidth * i, y + this.boardWidth());
            ctx.stroke();

            ctx.moveTo(x, y + cellWidth * i);
            ctx.lineTo(x + this.boardWidth(), y + cellWidth * i);
            ctx.stroke();
        }
    }
};

field.drawOn(document.getElementById("example"));
