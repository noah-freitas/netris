/**
 * NetrisBlockElement <netris-block>
 *
 * A block is a square shape.  It has a definite location
 * on the board.  It exposes methods to change that location
 * and to test whether a certain change is valid.  A movement
 * is valid if the new space that a block will occupy is
 * currently occupied by the board and not another block.
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        canMove          : canMove,
        canMoveTo        : canMoveTo,
        move             : move,
        moveTo           : moveTo,
        remove           : remove,
        x                : x,
        y                : y
    });

    window.NetrisBlockElement = document.registerElement('netris-block', { prototype : proto });

    // attachedCallback :: @NetrisBlockElement, undefined -> undefined
    function attachedCallback() {
        this.board        = this.parentElement.parentElement;
        this.style.height = this.board.dataset.blockSize + 'px';
        this.style.left   = (this.dataset.posLeft || 0)  + 'px';
        this.style.top    = (this.dataset.posTop  || 0)  + 'px';
        this.style.width  = this.board.dataset.blockSize + 'px';
    }

    // canMove :: @NetrisBlockElement, String, Number -> Boolean
    function canMove(direction, distance) {
        var dims   = this.getBoundingClientRect(),
            dist   = distance || dims.height,
            top    = dims.top,
            right  = dims.right  - 1,
            bottom = dims.bottom - 1,
            left   = dims.left;

        switch (direction) {
            case 'left'  : left   -= dist; right -= dist; break;
            case 'right' : left   += dist; right += dist; break;
            case 'down'  : bottom += dist; top   += dist; break;
        }

        var points = [[left, bottom], [right, bottom]].concat(
            top > 0 ? [[left, top], [right, top]] : []
        );

        return points.every(pointIsElOrBoard, this);
    }

    // canMoveTo :: @NetrisBlockElement, Number, Number, Boolean -> Boolean
    function canMoveTo(xDiff, yDiff, allowAbove) {
        var dims   = this.getBoundingClientRect(),
            top    = dims.top    + yDiff,
            right  = dims.right  + xDiff - 1,
            bottom = dims.bottom + yDiff - 1,
            left   = dims.left   + xDiff;

        if (allowAbove && top < 0) return true;

        var points = [[left, top], [right, top], [left, bottom], [right, bottom]];

        return points.every(pointIsElOrBoard, this);
    }

    // move :: @NetrisBlockElement, String, Number -> undefined
    function move(direction, distance) {
        distance = distance || Number(this.board.dataset.blockSize);

        switch (direction) {
            case 'down'  : this.style.top  = this.offsetTop  + distance + 'px'; break;
            case 'left'  : this.style.left = this.offsetLeft - distance + 'px'; break;
            case 'right' : this.style.left = this.offsetLeft + distance + 'px'; break;
        }
    }

    // moveTo :: @NetrisBlockElement, Number, Number -> Boolean
    function moveTo(xDiff, yDiff) {
        this.style.top  = this.offsetTop  + yDiff + 'px';
        this.style.left = this.offsetLeft + xDiff + 'px';
        return true;
    }

    // pointIsElOrBoard :: @NetrisBlockElement, [Number, Number] -> Boolean
    function pointIsElOrBoard(point) {
        var pointEl = document.elementFromPoint(point[0], point[1]);
        return pointEl === this || pointEl === this.board ;
    }

    // remove :: @NetrisBlockElement, undefined -> undefined
    function remove() {
        var parent = this.parentElement;
        HTMLElement.prototype.remove.call(this);
        parent.dispatchEvent(new CustomEvent('netris-block:removed', { detail : this }));
    }

    // x :: @NetrisBlockElement, Number -> undefined
    function x(xCoor) {
        this.style.left = xCoor + 'px';
        if (!this.dataset.posLeft) this.dataset.posLeft = xCoor;
    }

    // y :: @NetrisBlockElement, Number -> undefined
    function y(yCoor) {
        this.style.top = yCoor + 'px';
        if (!this.dataset.posTop) this.dataset.posTop = yCoor;
    }
}());
