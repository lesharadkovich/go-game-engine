var should = require('should');

var Stone = require('../stone');
var Board = require('../board');

it("returns correct point", function () {
    var board = new Board(700, 9);
    var stone = new Stone(board);

    JSON.stringify(board, null, 2);

    var testData = [
        // {
        //     mousePos: {
        //         x: 200,
        //         y: 200
        //     },
        //     expectedResult: {
        //         x: 2,
        //         y: 2
        //     }
        // },
        {
            mousePos: {
                x: 10,
                y: 10
            },
            expectedResult: null
        }
    ]

    for (var i = 0; i < testData.length; i++) {
        var result = stone.getPointCoords(board, testData[i].mousePos);

        result.should.equal(testData[i].expectedResult);
    }
});