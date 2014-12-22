;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        canMove          : canMove,
        createdCallback  : createdCallback,
        fall             : fall,
        stopFalling      : stopFalling
    });

    document.registerElement('netris-block', { prototype : proto });

    // attachedCallback :: @netris-block, undefined -> undefined
    function attachedCallback() {
        this.board      = this.parentElement;
        this.style.left = (this.dataset.posLeft || 0) + 'px';
        this.style.top  = (this.dataset.posTop  || 0) + 'px';

        if (this.dataset.player) document.addEventListener('netris-controller:move:' + this.dataset.player, this.move);
    }

    // canMove :: @netris-block, String, Number -> Boolean
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

    // createdCallback :: @netris-block, undefined -> undefined
    function createdCallback() {
        this.dataset.falling  = this.dataset.falling  || 'true';
        this.dataset.fallRate = this.dataset.fallRate || '1';
        this.move             = move.bind(this);
    }

    // fall :: @netris-block, undefined -> undefined
    function fall() {
        var rate = Number(this.dataset.fallRate);

        this.canMove('down', rate)
            ? this.style.top = this.offsetTop + rate + 'px'
            : this.stopFalling();
    }

    // pointIsElOrBoard :: @netris-block, [Number, Number] -> Boolean
    function pointIsElOrBoard(point) {
        var pointEl = document.elementFromPoint(point[0], point[1]);
        return pointEl === this || pointEl === this.board ;
    }

    // move :: @netris-block, Event -> undefined
    function move(e) {
        if (!this.canMove(e.detail)) return;

        var dims = this.getBoundingClientRect();

        switch (e.detail) {
            case 'down'  : this.style.top  = this.offsetTop  + dims.height + 'px'; break;
            case 'left'  : this.style.left = this.offsetLeft - dims.width  + 'px'; break;
            case 'right' : this.style.left = this.offsetLeft + dims.width  + 'px'; break;
        }
    }

    // stopFalling :: @netris-block, undefined -> undefined
    function stopFalling() {
        document.removeEventListener('netris-controller:move:' + this.dataset.player, this.move);

        this.dataset.falling = 'false';

        this.dispatchEvent(new CustomEvent('netris-block:' + (this.offsetTop >= 0 ? 'stopped' : 'outofbounds'), { bubbles : true }));
    }
}());
