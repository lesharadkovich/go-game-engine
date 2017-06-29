var should = require('should');

var Rules = require('../rules');
var Board = require('../board');

it("combines few clusters into one", function () {
    var rules = new Rules();
    var board = new Board(700);

    board.stoneCoords["black"] = [[{ x: 3, y: 3 }, { x: 3, y: 5 }, { x: 2, y: 4 }, { x: 4, y: 4 }],
        [{ x: 3, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 3 }],
        [{ x: 2, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 4, y: 1 }, { x: 4, y: 4 }, { x: 5, y: 2 }, { x: 5, y: 4 }, { x: 6, y: 3 }]];

    board.stoneCoords["white"] = [
         [{x: 3, y: 4}],

         [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 0}],

         [{x: 3, y: 3}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 5, y: 3}],

        [{ x: 6, y: 5 }],

        [{ x: 3, y: 5 }, { x: 4, y: 5 }]];

    var testData = [
        // 0
        //0x0
        // 0
        {
            surroundedCoords: [{x: 3, y: 4}],
            expectedResult: 0
        },

        // // _____________
        // // |xxx0
        // // |xx0
        // // |x0
        // // |0
        // // |
        // {
        //     surroundedCoords: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 0}, 
        //     {x: 2, y: 0}, {x: 1, y: 1}],
        //     expectedResult: 1
        // },

        // {
        //     surroundedCoords: [{x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 4, y: 2}],
        //     expectedResult: 2
        // },


        {
            surroundedCoords: [[{ x: 3, y: 5 }, { x: 4, y: 5 }], [{ x: 6, y: 5 }, { x: 7, y: 5 }]],
            expectedResult: [[{ x: 3, y: 5 }, { x: 4, y: 5 }]]
        }
    ]


    for (var i = 0; i < testData.length; i++) {
        var result = rules.isSurroundedCoordsExist(testData[i].surroundedCoords, board, "white");

        result = result.join(';');
        testData[i].expectedResult = testData[i].expectedResult.join(';');

        result.should.equal(testData[i].expectedResult);
    }
});