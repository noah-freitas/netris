;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        canMove          : canMove,
        createdCallback  : createdCallback,
        fall             : fall,
        move             : move,
        stopFalling      : stopFalling
    });

    window.NetrisShapeElement = document.registerElement('netris-shape', { prototype : proto });

    // attachedCallback :: @NetrisShapeElement, undefined -> undefined
    function attachedCallback() {
        this.board       = this.parentElement;
        this.moveHandler = moveHandler.bind(this, Number(this.board.dataset.blockSize));
        this.makeBlocks();
        if (this.dataset.player) document.addEventListener('netris-controller:move:' + this.dataset.player, this.moveHandler);
    }

    // canMove :: @NetrisShapeElement, String, Number -> Boolean
    function canMove(direction, distance) {
        distance = distance || Number(this.board.dataset.blockSize);

        return this[direction + 'Blocks'].every(function (b) {
            return b.canMove(direction, distance);
        });
    }

    // createdCallback :: @NetrisShapeElement, undefined -> undefined
    function createdCallback() {
        this.dataset.falling  = this.dataset.falling  || 'true';
        this.dataset.fallRate = this.dataset.fallRate || '1';
    }

    // fall :: @NetrisShapeElement, undefined -> undefined
    function fall() {
        var dist = Number(this.dataset.fallRate);

        this.canMove('down', dist) ? this.move('down', dist)
                                   : this.stopFalling();
    }

    // move :: @NetrisShapeElement, String, Number -> undefined
    function move(direction, distance) {
        this.blocks.forEach(function (b) { b.move(direction, distance); });
    }

    // move :: @NetrisShapeElement, Number, Event -> undefined
    function moveHandler(distance, e) {
        if (this.canMove(e.detail, distance)) this.move(e.detail, distance);
    }

    // stopFalling :: @NetrisShapeElement, undefined -> undefined
    function stopFalling() {
        this.dataset.falling = 'false';
        document.removeEventListener('netris-controller:move:' + this.dataset.player, this.moveHandler);
        this.dispatchEvent(new CustomEvent('netris-shape:' + (this.offsetTop >= 0 ? 'stopped' : 'outofbounds'), { bubbles : true }));
    }
}());
