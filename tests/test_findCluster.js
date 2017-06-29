var should = require('should');

var Rules = require('../rules');
var Board = require('../board');

it("returns correct index of cluster", function () {
    var rules = new Rules();
    var board = new Board(700);

    board.stoneCoords["black"] = [[{ x: 2, y: 2 }, { x: 2, y: 3 }]];

    var testData = [
        {
            centerCoords: {
                x: 3,
                y: 2
            },
            expectedResult: 0
        },
        {
            centerCoords: {
                x: 1,
                y: 1
            },
            expectedResult: 0
        },
        {
            centerCoords: {
                x: 5,
                y: 5
            },
            expectedResult: -1
        }
    ]

    for (var i = 0; i < testData.length; i++) {
        var result = rules.findCluster(board, testData[i].centerCoords, "black");

        result = result.join(';');
        testData[i].expectedResult = testData[i].expectedResult.join(';');

        result.should.equal(testData[i].expectedResult);
    }
});