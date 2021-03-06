/**
 * NetrisShapeElement <netris-shape>
 *
 * A shape is a group of blocks in a geographic arrangement.
 * A shape is always in a known arrangement, and it can change
 * arrangements by moving or removing its blocks.  The possible
 * arrangements that a shape can take on are represented as its
 * states.
 *
 * A shape has one or more states which can be thought of as a
 * directed graph.  A terminal state is one without any out edges.
 *
 * A player can change the state of a shape by rotating it, if
 * the shape allows rotation.  The board will also change the
 * state of a shape by removing its blocks as rows are cleared.
 *
 * Once all of the shape's blocks have been removed (which can
 * only happen while in a terminal state), the shape will remove
 * itself from the board.
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        addBlocks        : addBlocks,
        attachedCallback : attachedCallback,
        blockRemoved     : blockRemoved,
        canMove          : canMove,
        createdCallback  : createdCallback,
        fall             : fall,
        move             : move,
        rotate           : rotate,
        rotateEl         : rotateEl,
        stateError       : stateError,
        stopFalling      : stopFalling
    });

    window.NetrisShapeElement = document.registerElement('netris-shape', { prototype : proto });

    // addBlocks :: @NetrisShapeElement, Number -> undefined
    function addBlocks(num) {
        this.blocks = new Array(num).join(' ').split(' ').map(function () { return document.createElement('netris-block'); });
        this.blocks.forEach(function (b) { this.appendChild(b); }, this);
    }

    // attachedCallback :: @NetrisShapeElement, undefined -> undefined
    function attachedCallback() {
        this.board       = this.parentElement;
        this.moveHandler = moveHandler.bind(this, Number(this.board.dataset.blockSize));
        this.state       = 1;
        this.addEventListener('netris-block:removed', this.blockRemovedLis);
        if (this.dataset.player) document.addEventListener('netris-controller:move:' + this.dataset.player, this.moveHandler);
    }

    // blockRemoved :: @NetrisShapeElement, Event -> undefined
    function blockRemoved(e) {
        if (this.children.length === 0) this.remove();
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
        this.blockRemovedLis  = this.blockRemoved.bind(this);
        this.dataset.falling  = this.dataset.falling  || 'true';
        this.dataset.fallRate = this.dataset.fallRate || '1';

        Object.defineProperty(this, 'state', {
            get : function () { return this.currentState; },
            set : this.stateFn
        });

        Object.defineProperty(this, 'offsetTop', { get : function () {
            return this.children[0].offsetTop;
        } });
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
        if (e.detail === 'rotate') { this.rotate(); return; }
        if (this.canMove(e.detail, distance)) this.move(e.detail, distance);
    }

    // rotate :: @NetrisShapeElement, undefined -> undefined
    function rotate() {}

    // rotateEl :: @NetrisShapeElement, Number -> undefined
    function rotateEl(newState) {
        this.rotateOrTest(true) && this.rotateOrTest(false) || this.stateError(newState);
    }

    // stateError :: @NetrisShapeElement, Number -> undefined
    function stateError(newState) {
        throw Object.assign(new Error('Invalid state transition ', this.state, '->', newState), {
            name : 'InvalidStateTransition'
        });
    }

    // stopFalling :: @NetrisShapeElement, undefined -> undefined
    function stopFalling() {
        setTimeout(function () {
            this.dataset.falling = 'false';
            document.removeEventListener('netris-controller:move:' + this.dataset.player, this.moveHandler);
            this.dispatchEvent(new CustomEvent('netris-shape:' + (this.offsetTop >= 0 ? 'stopped' : 'outofbounds'), { bubbles : true }));
        }.bind(this), 0);
    }
}());
