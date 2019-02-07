/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import {
    easyEnemyHeads,
    ELEMENT, enemyBodyDirection, myBodyRegExp, negativeElements, regex, steps
} from './constants';

// Here is utils that might help for bot development
export function getBoardAsString(board) {
    const size = getBoardSize(board);

    return getBoardAsArray(board).join("\n");
}

export function getBoardAsArray(board) {
  const size = getBoardSize(board);
  var result = [];
  for (var i = 0; i < size; i++) {
      result.push(board.substring(i * size, (i + 1) * size));
  }
  return result;
}

export function getBoardSize(board) {
    return Math.sqrt(board.length);
}

export function isGameOver(board) {
    return board.indexOf(ELEMENT.HEAD_DEAD) !== -1;
}

export function isAt(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false;
    }
    return getAt(board, x, y) === element;
}

export function getAt(board, x, y) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }
    return getElementByXY(board, { x, y });
}

export function isNear(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }

    return isAt(board, x + 1, y, element) ||
			  isAt(board, x - 1, y, element) ||
			  isAt(board, x, y + 1, element) ||
			  isAt(board, x, y - 1, element);
}

export function isOutOf(board, x, y) {
    const boardSize = getBoardSize(board);
    return x >= boardSize || y >= boardSize || x < 0 || y < 0;
}

export function getHeadPosition(board) {
    return getFirstPositionOf(board, [
        ELEMENT.HEAD_DOWN,
        ELEMENT.HEAD_LEFT,
        ELEMENT.HEAD_RIGHT,
        ELEMENT.HEAD_UP,
        ELEMENT.HEAD_DEAD,
        ELEMENT.HEAD_EVIL,
        ELEMENT.HEAD_FLY,
        ELEMENT.HEAD_SLEEP,
    ]);
}
export function getTailPosition(board) {
    return getFirstPositionOf(board, [
        ELEMENT.TAIL_END_DOWN,
        ELEMENT.TAIL_END_LEFT,
        ELEMENT.TAIL_END_UP,
        ELEMENT.TAIL_END_RIGHT,
    ]);
}

export function getFirstPositionOf(board, elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var position = board.indexOf(element);
        if (position !== -1) {
            return getXYByPosition(board, position);
        }
    }
    return null;
}

export function getXYByPosition(board, position) {
    if (position === -1) {
        return null;
    }

    const size = getBoardSize(board);
    return {
        x:  position % size,
        y: (position - (position % size)) / size
    };
}

export function getElementByXY(board, position) {
    const size = getBoardSize(board);
    return board[size * position.y + position.x];
}

export function getDistanceBetween(el1, el2) {
    return Math.abs(el1.x - el2.x) + Math.abs(el1.y - el2.y);
}

export function getNextPoint(head, next) {
    return {
        x: head.x + next.x,
        y: head.y + next.y
    }
}

export function sortByNearest(arrayOfPositions, headPosition, priorityElements) {
    const sortedArray = arrayOfPositions.sort((a, b) => {
        return getDistanceBetween(headPosition, a) - getDistanceBetween(headPosition, b);
    });
    if (priorityElements) {
        return priorityElements.concat(sortedArray);
    }
    return sortedArray;
}


export function findAllPositionsOfElement(str, startFrom, elementsArray) {
    const foundIndex = str.substring(startFrom).search(elementsArray);
    return foundIndex === -1 ? foundIndex : foundIndex + startFrom;
}

export function findAllPositionsInArray(arr, element) {
    const indexes = [];
    let startFrom = 0;
    let currentIndex = -1;

    do {
        currentIndex = arr.indexOf(element, startFrom);
        if (currentIndex > -1) {
            indexes.push(currentIndex);
        }
        startFrom = currentIndex + 1;
    } while (currentIndex !== -1);

    return indexes;
}

function compareTwoDots(obj1, obj2) {
    return (obj1.x === obj2.x) && (obj1.y === obj2.y);
}

export function checkIfObjectIsInArray(arrayOfODots, testDot) {
    return arrayOfODots.some(item => {
        return compareTwoDots(item, testDot);
    })
}

export function countNegativeElementsInArray(arr) {
    return arr.reduce((counter, item) => {
        if (negativeElements.includes(item)) {
            counter++;
        }
        return counter;
    }, 0)
}

export function getNextDirection(bodyPart, inputDirection) {
    const possibleDirections = enemyBodyDirection[bodyPart];
    let reverseInputDirection = inputDirection;

    const horizontalWays = ['left', 'right'];
    const horizontalIndex = horizontalWays.indexOf(inputDirection);
    if (horizontalIndex > -1) {
        reverseInputDirection = horizontalIndex === 1 ? horizontalWays[0] : horizontalWays[1];
    }

    const verticalWays = ['up', 'down'];
    const verticalIndex = verticalWays.indexOf(inputDirection);
    if (verticalIndex > -1) {
        reverseInputDirection = horizontalIndex === 1 ? verticalWays[0] : verticalWays[1];
    }

    return possibleDirections.indexOf(reverseInputDirection) === 0 ? possibleDirections[1] : possibleDirections[0];
}

export function getAllEnemyHeadsAndPredictPoint(board) {
    const enemyHeadsArray = [];
    let nextPoint = null;

    for (var i = 0; i < easyEnemyHeads.length; i++) {
        var position = board.indexOf(easyEnemyHeads[i]);

        if (position !== -1) {
            const headPosition = getXYByPosition(board, position);
            switch (easyEnemyHeads[i]) {
              /* conditions for head */
                case ELEMENT.ENEMY_HEAD_DOWN:
                    nextPoint = getNextPoint(headPosition, steps.down.shift);
                    break;
                case ELEMENT.ENEMY_HEAD_UP:
                    nextPoint = getNextPoint(headPosition, steps.up.shift);
                    break;
                case ELEMENT.ENEMY_HEAD_LEFT:
                    nextPoint = getNextPoint(headPosition, steps.left.shift);
                    break;
                case ELEMENT.ENEMY_HEAD_RIGHT:
                    nextPoint = getNextPoint(headPosition, steps.right.shift);
                    break;
            }
            enemyHeadsArray.push({
                headPosition,
                nextPoint
            });
        }
    }
    return enemyHeadsArray;
}

export function getAllEvilPoints(board) {
    (board.match(ELEMENT.FURY_PILL) || []).map(item => {
        return getXYByPosition(board, item);
    })
}
