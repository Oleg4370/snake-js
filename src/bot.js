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
import { ELEMENT, COMMANDS, moveDirection, partsOfBody } from './constants';
import {
    isGameOver, getHeadPosition, getElementByXY, getBoardAsArray, getDistanceBetween, sortByNearest
} from './utils';

// Bot Example
export function getNextSnakeMove(board, logger) {
    if (isGameOver(board)) {
        return '';
    }
    const headPosition = getHeadPosition(board);
    if (!headPosition) {
        return '';
    }
    logger('Head:' + JSON.stringify(headPosition));
    const nearestElement = getNearestElement(board, headPosition, ELEMENT.APPLE);

    const sorround = getSorround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Sorround: ' + JSON.stringify(sorround));

    console.log('headPosition', headPosition);
    console.log('findAllPositionsOfElement', findAllPositionsOfElement(board, ELEMENT.APPLE, headPosition));

    const raitings = sorround.map(rateElement);
    logger('Raitings:' + JSON.stringify(raitings));

    return getCommandByRaitings(raitings);
}

function getSorround(board, position) {
    const p = position;
    return [
        getElementByXY(board, {x: p.x - 1, y: p.y }), // LEFT
        getElementByXY(board, {x: p.x, y: p.y -1 }), // UP
        getElementByXY(board, {x: p.x + 1, y: p.y}), // RIGHT
        getElementByXY(board, {x: p.x, y: p.y + 1 }) // DOWN
    ];
}

function rateElement(element) {
    if (element === ELEMENT.NONE) {
        return 0;
    }
    if (
        element === ELEMENT.APPLE ||
        element === ELEMENT.GOLD
    ) {
        return 1;
    }

    return -1;
}


function getCommandByRaitings(raitings) {
    var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < raitings.length; i++) {
        var r = raitings[i];
        if (r > max) {
            maxIndex = i;
            max = r;
        }
    }

    return indexToCommand[maxIndex];
}

/* My new code */

function getSurroundInAllDirections(board, position, depth) {
    const p = position;
    return [
        getElementByXY(board, {x: p.x - depth, y: p.y }), // LEFT
        getElementByXY(board, {x: p.x, y: p.y - depth }), // UP
        getElementByXY(board, {x: p.x + depth, y: p.y}), // RIGHT
        getElementByXY(board, {x: p.x, y: p.y + depth }), // DOWN
        getElementByXY(board, {x: p.x - depth, y: p.y - depth }), // LEFT UP
        getElementByXY(board, {x: p.x + depth, y: p.y - depth }), // RIGHT UP
        getElementByXY(board, {x: p.x - depth, y: p.y + depth }), // LEFT DOWN
        getElementByXY(board, {x: p.x + depth, y: p.y + depth }), // LEFT DOWN
    ];
}

function findAllPositionsOfElement(board, element, headPosition) {
    const boardArray = getBoardAsArray(board);
    const elementPositions = [];

    boardArray.forEach((item, i) => {
        let startFrom = 0;
        let x = item.indexOf(element, startFrom);

        while (x !== -1) {
            elementPositions.push({x, y: i});
            startFrom = x;
            x = item.indexOf(element, startFrom);
        }
    });

    return sortByNearest(elementPositions, headPosition);
}

function  getNearestElement(board, headPosition, element) {
    let elementPositions = [];
    let indexOfNeededElement = -1;
    let startDepth = 0;

    do {
        startDepth += 1;
        elementPositions = getSurroundInAllDirections(board, headPosition, startDepth);
        indexOfNeededElement = elementPositions.indexOf(element);
    } while(indexOfNeededElement === -1);
    console.log('moveDirection',startDepth, elementPositions, moveDirection[indexOfNeededElement]);
    return {
        distance: startDepth,
        direction: moveDirection[indexOfNeededElement]
    };
}

function predictImpasse() {
    // this function should predict if after next move our snake will be surrounded with walls

}

function getShortestWay(headPosition, elementPosition) {
    // try direct way horizontal/vertical or vertical/horizontal
    const xStep = headPosition.x > elementPosition.x ? -1 : 1;
    const yStep = headPosition.y > elementPosition.y ? -1 : 1;

    //try horizontal/vertical
}
