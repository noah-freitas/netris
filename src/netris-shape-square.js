/**
 * NetrisShapeSquareElement <netris-shape-square>
 *
 * A square is four blocks arranged as a square.  It
 * does not allow rotation.
 *
 * States (3):
 *
 * 1 -> 2, 3
 *  0 1
 *  2 3
 *
 * 2
 *  0 1
 *  - -
 *
 * 3
 *  - -
 *  2 3
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        stateFn      : state
    });

    window.NetrisShapeSquareElement = document.registerElement('netris-shape-square', { prototype : proto });

    // blockRemoved :: @NetrisShapeSquareElement, Event -> undefined
    function blockRemoved(e) {
        var removedIndex = this.blocks.indexOf(e.detail);

        if (this.state === 1) switch (removedIndex) {
            case 0 : this.state = 3; break;
            case 2 : this.state = 2; break;
        }

        NetrisShapeElement.prototype.blockRemoved.call(this, e);
    }

    // positionBlocks :: @NetrisShapeSquareElement, undefined -> undefined
    function positionBlocks() {
        var blockSize = Number(this.board.dataset.blockSize),
            left      = Number(this.dataset.posLeft),
            top       = Number(this.dataset.posTop);

        this.blocks.forEach(function (b, i) {
            b.x(i % 2 === 0 ? left : left + blockSize);
            b.y(i < 2       ? top  : top  + blockSize);
        }, this);
    }

    // state :: @NetrisShapeSquareElement, Number -> undefined
    function state(num) {
        var blockSize = Number(this.board.dataset.blockSize);

        switch (true) {
            case num === 1 && this.state === undefined :
                this.addBlocks(4);
                positionBlocks.call(this);

                this.leftBlocks  = [this.children[0], this.children[2]];
                this.rightBlocks = [this.children[1], this.children[3]];
                this.downBlocks  = [this.children[2], this.children[3]];
                break;

            case num === 2 && this.state === 1 :
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;

            case num === 3 && this.state === 1 :
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;

            default : this.stateError(num);
        }

        if (num > 1) {
            this.leftBlocks  = [];
            this.rightBlocks = [];
        }

        this.currentState = num;
    }
}());
