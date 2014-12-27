;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        canMove          : canMove,
        move             : move
    });

    window.NetrisBlockElement = document.registerElement('netris-block', { prototype : proto });

    // attachedCallback :: @NetrisBlockElement, undefined -> undefined
    function attachedCallback() {
        this.board      = this.parentElement.parentElement;
        this.style.left = (this.dataset.posLeft || 0) + 'px';
        this.style.top  = (this.dataset.posTop  || 0) + 'px';
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

    // pointIsElOrBoard :: @NetrisBlockElement, [Number, Number] -> Boolean
    function pointIsElOrBoard(point) {
        var pointEl = document.elementFromPoint(point[0], point[1]);
        return pointEl === this || pointEl === this.board ;
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
}());
