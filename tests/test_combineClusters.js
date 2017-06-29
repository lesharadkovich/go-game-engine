var should = require('should');

var Rules = require('../rules');
var Board = require('../board');


it("combines few clusters into one", function () {
    var rules = new Rules();
    var board = new Board(700);

    board.stoneCoords["black"] = [[{ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 2, y: 4 }],
        [{ x: 2, y: 1 }],
        [{ x: 3, y: 1 }],
        [{ x: 4, y: 1 }]
    ];


    var testData = [
        // {
        //     indexesOfClusters: [0, 1, 2, 3],
        //     expectedResult: [[{ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }]]
        // }

        {
            indexesOfClusters: [1, 2],
            expectedResult: [[{x: 3, y: 3}, {x: 3, y: 4}, {x: 2, y: 4}], [{x: 2, y: 1}, {x: 3, y: 1}], [{x: 4, y: 1}]]
        }
    ]


    for (var i = 0; i < testData.length; i++) {
        var result = rules.combineClusters(board.stoneCoords["black"], testData[i].indexesOfClusters);

        result = result.join(';');
        testData[i].expectedResult = testData[i].expectedResult.join(';');

        result.should.equal(testData[i].expectedResult);
    }
});