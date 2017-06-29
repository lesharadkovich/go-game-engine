'use strict'

module.exports = class Rules {
    constructor() {
        this.currentPlayerColor = "black";
        this.color = {
            "black": "white",
            "white": "black"
        };
    }



    switchPlayer() {
        this.currentPlayerColor = this.color[this.currentPlayerColor];
    }

    //adds coords
    addCoords(board, addingCoord) {
        var indexOfCluster = this.findCluster(board.stoneCoords[this.currentPlayerColor], addingCoord);

        var coord = {
            x: addingCoord.x,
            y: addingCoord.y
        }

        if (indexOfCluster >= 0) {
            var length = board.stoneCoords[this.currentPlayerColor][indexOfCluster].length;

            board.stoneCoords[this.currentPlayerColor][indexOfCluster].push(coord);

            return indexOfCluster;
        }
        else {
            var cluster = [coord];

            board.stoneCoords[this.currentPlayerColor].push(cluster);

            return board.stoneCoords[this.currentPlayerColor].length - 1;
        }
    }

    //finds cluster to add coords
    findCluster(destination, addingCoord) {
        var indexesOfClusters = []; //indexes of clusters that are near the current stone 

        for (var i = 0; i < destination.length; i++) {
            var currentCluster = destination[i];

            if (this.checkNearestCoords(addingCoord, currentCluster)) {
                indexesOfClusters.push(i);
            }
        }

        //if there are few clusters near the stone combine them
        //if there is only one cluster, return its index
        //if there are no clusters, return -1
        if (indexesOfClusters.length > 1) {
            this.combineClusters(destination, indexesOfClusters);
            return indexesOfClusters[0];
        }
        else if (indexesOfClusters.length === 1) {
            return indexesOfClusters[0];
        }
        else
            return -1;
    }

    //combines two or more clusters if necessary
    combineClusters(destination, indexesOfClusters) {
        var source = indexesOfClusters[0];
        var sourceCluster = destination[source];

        for (var i = 1; i < indexesOfClusters.length; i++) {
            var current = indexesOfClusters[i];
            var currentCluster = destination[current];

            for (var j = 0; j < currentCluster.length; j++) {
                sourceCluster.push(currentCluster[j]);
            }
        }

        var shift = 0;
        for (var i = 1; i < indexesOfClusters.length; i++) {
            var current = indexesOfClusters[i] - shift;
            destination.splice(current, 1);

            shift++;
        }

        return destination;
    }

    //checks if there are stones near current point
    checkNearestCoords(addingCoord, currentCluster) {
        var isCorrectClusterFound = false;

        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;

                currentCluster.forEach(function (current, index, currentCluster) {
                    if (addingCoord.x + i === current.x && addingCoord.y + j === current.y) {
                        isCorrectClusterFound = true;
                    }
                });
            }
        }

        if (isCorrectClusterFound) return true;
        else return false;
    }



    //Checks if there are closured coords
    checkClosure(board, indexOfCluster) {
        var color = this.currentPlayerColor;
        var minX = board.cellNumber;
        var minY = board.cellNumber;
        var maxX = 0;
        var maxY = 0;

        var suspiciousCoords = [];
        var surroundedCoords = [];


        //finds minimal
        board.stoneCoords[color][indexOfCluster].forEach(function (current, i, clusterCoords) {
            if (current.x < minX) minX = current.x;
            else if (current.x > maxX) maxX = current.x;

            if (current.y < minY) minY = current.y;
            else if (current.y > maxY) maxY = current.y;
        });


        //finds suspicious coords
        for (var i = minX; i <= maxX; i++) {
            for (var j = minY; j <= maxY; j++) {
                var currentStone = {
                    x: i,
                    y: j
                };

                if (!board.isClusterContainsStone(indexOfCluster, currentStone, color)) {
                    suspiciousCoords.push(currentStone);
                }
            }
        }


        //finds surrounded coords
        for (var i = 0; i < suspiciousCoords.length; i++) {
            if (!this.isStoneAdded(suspiciousCoords[i], surroundedCoords))
                var currentStone = suspiciousCoords[i];
            else continue;

            this.checkSides(currentStone, surroundedCoords, board, indexOfCluster, maxX, maxY);
        }

        return surroundedCoords;

        //delete surrounded coords
        var enemyColor = this.color[color];
        this.isSurroundedCoordsExist(surroundedCoords, board, enemyColor);
        this.deleteCoords(surroundedCoords, board, enemyColor);

    }

    //checks all sides of current stone
    checkSides(currentStone, surroundedCoords, board, indexOfCluster, maxX, maxY) {
        var color = this.currentPlayerColor;
        var top = false, bottom = false, left = false, right = false;
        var stones = [];

        //top
        var checkingCoords = {
            x: currentStone.x,
            y: currentStone.y - 1
        }

        if (board.isClusterContainsStone(indexOfCluster, checkingCoords, color) ||
            currentStone.y === 0 || this.isStoneAdded(checkingCoords, surroundedCoords)) {
            top = true;
        }
        else return;


        //left
        checkingCoords.x = currentStone.x - 1;
        checkingCoords.y = currentStone.y;

        if (board.isClusterContainsStone(indexOfCluster, checkingCoords, color) ||
            currentStone.x === 0 || this.isStoneAdded(checkingCoords, surroundedCoords)) {
            left = true;
        }
        else return;



        //bottom
        var shift = 1;

        while (true) {
            var bottomCoords = {
                x: currentStone.x,
                y: currentStone.y + shift
            }

            if (board.isClusterContainsStone(indexOfCluster, bottomCoords, color) ||
                bottomCoords.y >= board.cellNumber) {
                bottom = true;
                break;
            }

            if (bottomCoords.y > maxY) return;

            // if(!this.isStoneAdded(bottomCoords, surroundedCoords)) {
            //     stones.push(bottomCoords);
            // }

            shift++;
        }


        //right
        shift = 1;

        while (true) {
            var rightCoords = {
                x: currentStone.x + shift,
                y: currentStone.y
            }

            if (board.isClusterContainsStone(indexOfCluster, rightCoords, color) ||
                rightCoords.x >= board.cellNumber) {
                right = true;
                break;
            }

            if (rightCoords.x > maxX) return;

            // if(!this.isStoneAdded(rightCoords, surroundedCoords)) {
            //     stones.push(rightCoords);
            // }

            shift++;
        }

        if (top && bottom && left && right) {
            this.addSurroundedCoords(surroundedCoords, currentStone);
        }

    }

    //checks if coord has already added to surrounded coords list
    isStoneAdded(checkingCoords, surroundedCoords) {
        for (var i = 0; i < surroundedCoords.length; i++) {
            for (var j = 0; j < surroundedCoords[i].length; j++) {
                if (checkingCoords.x === surroundedCoords[i][j].x &&
                    checkingCoords.y === surroundedCoords[i][j].y)
                    return true;
            }
        }

        return false;
    }

    //checks if all surrounded coords exist
    isSurroundedCoordsExist(surroundedCoords, board, enemyColor) {
        var indexOfWrongCluster = []; //why is that name so fucking awful??
        var isFound = false;


        for (var i = 0; i < surroundedCoords.length; i++) {
            for (var j = 0; j < surroundedCoords[i].length; j++) {
                isFound = false;

                //checks all color stones
                for (var index = 0; index < board.stoneCoords[enemyColor].length; index++) {
                    if (board.isClusterContainsStone(index, surroundedCoords[i][j], enemyColor)) {
                        isFound = true;
                        break;
                    }
                }

                if (!isFound) {
                    indexOfWrongCluster.push(i);
                    break;
                }
            }
        }


        var shift = 0;

        for (var i = 0; i < indexOfWrongCluster.length; i++) {
            var current = indexOfWrongCluster[i] - shift;
            surroundedCoords.splice(current, 1);

            shift++;
        }
    }

    //deletes surrounded existing coords
    deleteCoords(surrounded, board, enemyColor) {
        for (var i = 0; i < board.stoneCoords[enemyColor].length; i++) {
            //if(i === index) continue; //???????????

            for (var j = 0; j < board.stoneCoords[enemyColor][i].length; j++) {
                var current = board.stoneCoords[enemyColor][i][j];

                if (surrounded.x === current.x && surrounded.y === current.y) {
                    console.log("hey");
                    // painter.deleteStone(current, stone, board);
                    // var deleted = board.stoneCoords[enemyColor][i].splice(j, 1);
                    console.log(deleted);

                    board.deletedCoords.push(current);

                    return;
                }
            }
        }
    }





    //repeat!!!
    addSurroundedCoords(surroundedCoords, addingCoord) {
        var destination = surroundedCoords;
        //console.log(destination);

        var indexOfCluster = this.findSurroundedCluster(destination, addingCoord);

        var coord = {
            x: addingCoord.x,
            y: addingCoord.y
        }

        if (indexOfCluster >= 0) {
            var length = destination[indexOfCluster].length;

            destination[indexOfCluster].push(coord);

            return indexOfCluster;
        }
        else {
            var cluster = [coord];

            destination.push(cluster);

            return destination.length - 1;
        }
    }

    //finds cluster to add coords
    findSurroundedCluster(destination, addingCoord) {
        var indexesOfClusters = []; //indexes of clusters that are near the current stone 

        for (var i = 0; i < destination.length; i++) {
            var currentCluster = destination[i];

            if (this.checkNearestSurroundedCoords(addingCoord, currentCluster)) {
                return i;
            }
        }

        return -1;
    }

    //checks if there are stones near current point
    checkNearestSurroundedCoords(addingCoord, currentCluster) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if ((i == 0 && j == 0) || (i != 0 && j != 0)) continue;

                for (var index = 0; index < currentCluster.length; index++) {
                    if (addingCoord.x + i === currentCluster[index].x &&
                        addingCoord.y + j === currentCluster[index].y) {

                        return true;
                    }
                }
            }
        }

        return false;
    }

}