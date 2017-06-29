var should = require('should');

var Rules = require('../rules');
var Board = require('../board');


it("adds coords correctly", function () {
    var rules = new Rules();
    var board = new Board(700);

    board.stoneCoords["black"] = [[{ x: 2, y: 2 }, { x: 2, y: 3 }]];

    var testData = {
        centerCoords: {
            x: 2,
            y: 1
        },
        expectedResult: [[{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 1 }]]
    }
    

    var result = rules.addCoords(board, testData.centerCoords);

    result = result.join(';');
    testData.expectedResult = testData.expectedResult.join(';');

    result.should.equal(testData.expectedResult);

});


it("adds coords correctly", function () {
    var rules = new Rules();
    var board = new Board(700);

    board.stoneCoords["black"] = [[{ x: 2, y: 2 }, { x: 2, y: 3 }]];

    var testData = {
        centerCoords: {
            x: 1,
            y: 1
        },
        expectedResult: [[{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 1 }]]
    }

    var result = rules.addCoords(board, testData.centerCoords);

    result = result.join(';');
    testData.expectedResult = testData.expectedResult.join(';');

    result.should.equal(testData.expectedResult);
});

it("adds coords to new cluster", function () {
    var rules = new Rules();
    var board = new Board(700);

    board.stoneCoords["black"] = [[{ x: 2, y: 2 }, { x: 2, y: 3 }]];

    var testData = {
        centerCoords: {
            x: 5,
            y: 5
        },
        expectedResult: [[{ x: 2, y: 2 }, { x: 2, y: 3 }], [{ x: 5, y: 5 }]]
    }

    var result = rules.addCoords(board, testData.centerCoords);

    result = result.join(';');
    testData.expectedResult = testData.expectedResult.join(';');

    result.should.equal(testData.expectedResult);
});