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
import {ELEMENT, COMMANDS, moveDirection, partsOfBody, steps, positiveElements, arrayOfSteps} from './constants';
import {
    isGameOver,
    getHeadPosition,
    getElementByXY,
    getBoardAsArray,
    getDistanceBetween,
    sortByNearest,
    findAllPositionsOfElement,
    getNextPoint, checkIfObjectIsInArray, countNegativeElementsInArray
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

    /* my code */
    const nearestPositiveElements = findNearestPositionsOfElement(board, headPosition);

    console.log('headPosition', headPosition);
    console.log('nearestPositiveElements', nearestPositiveElements);
    for (let i = 0; i < nearestPositiveElements.length; i++) {
        let nextStep = getShortestWay(board, headPosition, nearestPositiveElements[i]);
        console.log('nextStep', nextStep);
        if (nextStep) {
            return nextStep;
        }
    }
    /* ----------- */

    const surround = getSurround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Surround: ' + JSON.stringify(surround));

    const ratings = surround.map(rateElement);
    logger('Ratings:' + JSON.stringify(ratings));

    return getCommandByRatings(ratings);
}

function getSurround(board, position) {
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


function getCommandByRatings(ratings) {
    var indexToCommand = ['LEFT', 'UP', 'RIGHT', 'DOWN'];
    var maxIndex = 0;
    var max = -Infinity;
    for (var i = 0; i < ratings.length; i++) {
        var r = ratings[i];
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

function findNearestPositionsOfElement(board, headPosition) {
    const boardArray = getBoardAsArray(board);
    const elementPositions = [];

    boardArray.forEach((item, i) => {
        let startFrom = 0;
        let x = findAllPositionsOfElement(item, startFrom);

        while (x !== -1) {
            elementPositions.push({x, y: i});
            startFrom = x + 1;
            x = findAllPositionsOfElement(item, startFrom);
        }
    });

    return sortByNearest(elementPositions, headPosition);
}

function isInImpasse(board, elementPosition, headPosition) {
    /* this function should check if given element is surrounded with walls,
    * and that is why it`s unsafe to eat this element */
    let surroundingElements = getSurround(board, elementPosition);
    let indexOfNegativeElements = findAllPositionsInArray(surroundingElements);

    if (indexOfNegativeElements.length === 2) {
        const sumOfIndex = indexOfNegativeElements[0] + indexOfNegativeElements[1];
        // if elements are not opposite, they not create impasse
        if (sumOfIndex !== 2 && sumOfIndex !== 4) {
            return false;
        }

        // TODO: there should be logic for recursing
        const freeStepIndex= surroundingElements.indexOf(ELEMENT.NONE);
        if (freeStepIndex > -1) {
            const nextPointToCheck = getNextPoint(elementPosition, arrayOfSteps[freeStepIndex].shift);
            return isInImpasse(board, nextPointToCheck);
        }
    }

    return indexOfNegativeElements.length > 2;
}

function getShortestWay(board, headPosition, elementPosition) {
    console.log('getShortestWay');
    const route = [];

    const xDistance = headPosition.x - elementPosition.x;
    const yDistance = headPosition.y - elementPosition.y;
    const xDirection = xDistance > 0 ? 'left' : xDistance < 0 ? 'right' : null;
    const yDirection = yDistance > 0 ? 'up' : yDistance < 0 ? 'down' : null;

    let currentPosition = {...headPosition};
    let xTempDistance = xDirection;
    let yTempDistance = yDirection;

    let noShortestWay = false;
    let bannedDirection = '';
    const bannedDots = [];
    let next = null;

    do {
        /* check both direction or one that are not banned */
        next = getNextByDirection(board,
          bannedDots,
          currentPosition,
          bannedDirection !== xDirection && xTempDistance !== 0 && xDirection,
          bannedDirection !== yDirection && yTempDistance !== 0 && yDirection
        );

        /* add next command to array or remove last one */
        if (next.command) {
            route.push(next.command);
            bannedDirection = '';
        } else {
            bannedDirection = route.pop(); //add banned direction
            if (next.object) {
                bannedDots.push({...next.object});
            }
        }
        if (next.object) {
            currentPosition = next.object;
            xTempDistance = currentPosition.x - elementPosition.x;
            yTempDistance = currentPosition.y - elementPosition.y;
        }

        /* if there are no possible way to go */
        if (route.length === 0) {
            noShortestWay = true;
        }

    } while (getDistanceBetween(currentPosition, elementPosition) !== 0 && !noShortestWay);

    console.log('getShortestWay -- route', route);
    return route.length > 0 ? route[0] : null;
}

function getNextByDirection(board, arrayOfBannedPositions, currentPosition, direction1, direction2) {

    if (direction1) {
        let nextPoint = getNextPoint(currentPosition, steps[direction1].shift);
        let nextElement = getElementByXY(board, nextPoint);

        /* check if next dots are in banned array */
        if (checkIfObjectIsInArray(arrayOfBannedPositions, nextPoint)) {
            return {
                object: null,
                command: null
            }
        }

        if (positiveElements.includes(nextElement)) {
            return {
                object: nextPoint,
                command: steps[direction1].command
            };
        }
    }

    /* if first point are bad and there are second point, then we try it */
    if (direction2) {
        let nextPoint = getNextPoint(currentPosition, steps[direction2].shift);
        let nextElement = getElementByXY(board, nextPoint);
        /* check if next dots are in banned array */
        if (checkIfObjectIsInArray(arrayOfBannedPositions, nextPoint)) {
            return {
                object: null,
                command: null
            }
        }

        if (positiveElements.includes(nextElement)) {
            return {
                object: nextPoint,
                command: steps[direction2].command
            };
        }
    }

    return {
        object: null,
        command: null
    }
}
