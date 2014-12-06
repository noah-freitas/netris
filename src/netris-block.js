;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        canMove          : canMove,
        createdCallback  : createdCallback,
        stopFalling      : stopFalling
    });

    document.registerElement('netris-block', { prototype : proto });

    // attachedCallback :: @netris-block, undefined -> undefined
    function attachedCallback() {
        this.board      = this.parentElement;
        this.style.left = (this.dataset.posLeft || 0) + 'px';
        this.style.top  = (this.dataset.posTop  || 0) + 'px';

        if (this.dataset.player)             document.addEventListener('netris-controller:move:' + this.dataset.player, this.move);
        if (this.dataset.falling === 'true') requestAnimationFrame(this.fall);
    }

    // canMove :: @netris-block, String, Number -> Boolean
    function canMove(direction, distance) {
        var dims = this.getBoundingClientRect(),
            dist = distance || (direction === 'down' ? dims.height : dims.width),
            x    = direction === 'left' ? dims.left : dims.right,
            y    = dims.bottom;

        switch (direction) {
            case 'left'  : x -= dist; break;
            case 'right' : x += dist; break;
            case 'down'  : y += dist; break;
        }

        return document.elementFromPoint(x > 0 ? x - 1 : x + 1, y > 0 ? y - 1 : y + 1) === this.board;
    }

    // createdCallback :: @netris-block, undefined -> undefined
    function createdCallback() {
        this.dataset.falling  = this.dataset.falling  || 'true';
        this.dataset.fallRate = this.dataset.fallRate || '1';
        this.fall             = fall.bind(this);
        this.move             = move.bind(this);
    }

    // fall :: @netris-block, undefined -> undefined
    function fall() {
        var rate = Number(this.dataset.fallRate);

        if (this.canMove('down', rate)) {
            this.style.top = this.offsetTop + rate + 'px';
            requestAnimationFrame(this.fall);
        } else {
            this.stopFalling();
        }
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
