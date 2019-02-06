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
export const ELEMENT = {
    NONE: ' ',
    WALL: '☼',
    START_FLOOR: '#',
    OTHER: '?',

    APPLE: '○',
    STONE: '●',
    FLYING_PILL: '©',
    FURY_PILL: '®',
    GOLD: '$',

    // игрок
    HEAD_DOWN: '▼',
    HEAD_LEFT: '◄',
    HEAD_RIGHT: '►',
    HEAD_UP: '▲',
    HEAD_DEAD: '☻',
    HEAD_EVIL: '♥',
    HEAD_FLY: '♠',
    HEAD_SLEEP: '&',

    TAIL_END_DOWN: '╙',
    TAIL_END_LEFT: '╘',
    TAIL_END_UP: '╓',
    TAIL_END_RIGHT: '╕',
    TAIL_INACTIVE: '~',

    BODY_HORIZONTAL: '═',
    BODY_VERTICAL: '║',
    BODY_LEFT_DOWN: '╗',
    BODY_LEFT_UP: '╝',
    BODY_RIGHT_DOWN: '╔',
    BODY_RIGHT_UP: '╚',

    // противник
    ENEMY_HEAD_DOWN: '˅',
    ENEMY_HEAD_LEFT: '<',
    ENEMY_HEAD_RIGHT: '>',
    ENEMY_HEAD_UP: '˄',
    ENEMY_HEAD_DEAD: '☺',
    ENEMY_HEAD_EVIL: '♣',
    ENEMY_HEAD_FLY: '♦',
    ENEMY_HEAD_SLEEP: 'ø',

    ENEMY_TAIL_END_DOWN: '¤',
    ENEMY_TAIL_END_LEFT: '×',
    ENEMY_TAIL_END_UP: 'æ',
    ENEMY_TAIL_END_RIGHT: 'ö',
    ENEMY_TAIL_INACTIVE: '*' ,

    ENEMY_BODY_HORIZONTAL: '─',
    ENEMY_BODY_VERTICAL: '│',
    ENEMY_BODY_LEFT_DOWN: '┐',
    ENEMY_BODY_LEFT_UP: '┘',
    ENEMY_BODY_RIGHT_DOWN: '┌',
    ENEMY_BODY_RIGHT_UP: '└'
};

export const COMMANDS = {
    UP: 'UP', // snake moves
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    ACT: 'ACT', // drop stone if any
};

export const moveDirection = [
    COMMANDS.LEFT,
    COMMANDS.UP,
    COMMANDS.RIGHT,
    COMMANDS.DOWN,
    [COMMANDS.LEFT, COMMANDS.UP],
    [COMMANDS.RIGHT, COMMANDS.UP],
    [COMMANDS.LEFT, COMMANDS.DOWN],
    [COMMANDS.RIGHT, COMMANDS.DOWN]
];

export const partsOfBody = [
    ELEMENT.BODY_HORIZONTAL,
    ELEMENT.BODY_LEFT_DOWN,
    ELEMENT.BODY_LEFT_UP,
    ELEMENT.BODY_RIGHT_DOWN,
    ELEMENT.BODY_RIGHT_UP,
    ELEMENT.BODY_VERTICAL
];

export const steps = {
    left: {
        shift: {
            x: -1,
            y: 0
        },
        command: COMMANDS.LEFT
    },
    up: {
        shift: {
            x: 0,
            y: -1
        },
        command: COMMANDS.UP
    },
    right: {
        shift: {
            x: 1,
            y: 0
        },
        command: COMMANDS.RIGHT
    },
    down: {
        shift: {
            x: 0,
            y: 1
        },
        command: COMMANDS.DOWN
    }
};

export const arrayOfSteps = [
    {
        shift: {
            x: -1,
            y: 0
        },
        command: COMMANDS.LEFT
    },
    {
        shift: {
            x: 0,
            y: -1
        },
        command: COMMANDS.UP
    },
    {
        shift: {
            x: 1,
            y: 0
        },
        command: COMMANDS.RIGHT
    },
    {
        shift: {
            x: 0,
            y: 1
        },
        command: COMMANDS.DOWN
    }
];

const searchRegex = `[${ELEMENT.APPLE}\\${ELEMENT.GOLD}${ELEMENT.FURY_PILL}]`;
export const regex = new RegExp(searchRegex,"g");

export const positiveElements = [
  ELEMENT.NONE,
  ELEMENT.APPLE,
  ELEMENT.GOLD,
  ELEMENT.FURY_PILL
];

export const negativeElements = [
    ELEMENT.WALL,
    // противник
    ELEMENT.ENEMY_HEAD_DOWN,
    ELEMENT.ENEMY_HEAD_LEFT,
    ELEMENT.ENEMY_HEAD_RIGHT,
    ELEMENT.ENEMY_HEAD_UP,
    ELEMENT.ENEMY_HEAD_DEAD,
    ELEMENT.ENEMY_HEAD_EVIL,
    ELEMENT.ENEMY_HEAD_FLY,
    ELEMENT.ENEMY_HEAD_SLEEP,
    ELEMENT.ENEMY_TAIL_END_DOWN,
    ELEMENT.ENEMY_TAIL_END_LEFT,
    ELEMENT.ENEMY_TAIL_END_UP,
    ELEMENT.ENEMY_TAIL_END_RIGHT,
    ELEMENT.ENEMY_TAIL_INACTIVE,
    ELEMENT.ENEMY_BODY_HORIZONTAL,
    ELEMENT.ENEMY_BODY_VERTICAL,
    ELEMENT.ENEMY_BODY_LEFT_DOWN,
    ELEMENT.ENEMY_BODY_LEFT_UP,
    ELEMENT.ENEMY_BODY_RIGHT_DOWN,
    ELEMENT.ENEMY_BODY_RIGHT_UP,
    // my body
    ELEMENT.BODY_HORIZONTAL,
    ELEMENT.BODY_VERTICAL,
    ELEMENT.BODY_LEFT_DOWN,
    ELEMENT.BODY_LEFT_UP,
    ELEMENT.BODY_RIGHT_DOWN,
    ELEMENT.BODY_RIGHT_UP
];

const myBodySearchString = `[${partsOfBody.join('')}]`;
export const myBodyRegExp = new RegExp(myBodySearchString,"g");

export const enemyBodyDirection = {
    [ELEMENT.ENEMY_BODY_HORIZONTAL]: ['left', 'right'],
    [ELEMENT.ENEMY_BODY_VERTICAL]: ['up', 'down'],
    [ELEMENT.ENEMY_BODY_LEFT_DOWN]: ['right', 'down'],
    [ELEMENT.ENEMY_BODY_LEFT_UP]: ['right', 'up'],
    [ELEMENT.ENEMY_BODY_RIGHT_DOWN]: ['left', 'down'],
    [ELEMENT.ENEMY_BODY_RIGHT_UP]: ['left', 'up']
};
export const easyEnemyHeads = [
    ELEMENT.ENEMY_HEAD_DOWN,
    ELEMENT.ENEMY_HEAD_LEFT,
    ELEMENT.ENEMY_HEAD_RIGHT,
    ELEMENT.ENEMY_HEAD_UP,
];

export const enemy = [
    ELEMENT.ENEMY_HEAD_DOWN,
    ELEMENT.ENEMY_HEAD_LEFT,
    ELEMENT.ENEMY_HEAD_RIGHT,
    ELEMENT.ENEMY_HEAD_DEAD,
    ELEMENT.ENEMY_HEAD_EVIL,
    ELEMENT.ENEMY_HEAD_FLY,
    ELEMENT.ENEMY_HEAD_SLEEP,
    ELEMENT.ENEMY_TAIL_END_DOWN,
    ELEMENT.ENEMY_TAIL_END_LEFT,
    ELEMENT.ENEMY_TAIL_END_UP,
    ELEMENT.ENEMY_TAIL_END_RIGHT,
    ELEMENT.ENEMY_BODY_HORIZONTAL,
    ELEMENT.ENEMY_BODY_LEFT_DOWN,
    ELEMENT.ENEMY_BODY_LEFT_UP,
    ELEMENT.ENEMY_BODY_RIGHT_DOWN,
    ELEMENT.ENEMY_BODY_RIGHT_UP,
];
const enemySearchString = `[${enemy.join('')}\\${ELEMENT.ENEMY_HEAD_UP}\\${ELEMENT.ENEMY_BODY_VERTICAL}]`;
export const enemyRegExp = new RegExp(enemySearchString,"g");
