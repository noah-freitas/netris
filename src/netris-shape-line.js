/**
 * NetrisShapeLineElement <netris-shape-line>
 *
 * A line is four blocks arranged in a line.  It
 * has two rotation states.
 *
 * States (20):
 *
 * 1 -> 2
 *  - - - -
 *  - - - -
 *  - - - -
 *  0 1 2 3
 *
 * 2 -> 1, 3, 4, 5, 6
 *  - - - 0
 *  - - - 1
 *  - - - 2
 *  - - - 3
 *
 * 3 -> 7, 8, 9
 *  - - - -
 *  - - - 1
 *  - - - 2
 *  - - - 3
 *
 * 4 -> 7, 10, 11
 *  - - - -
 *  - - - 0
 *  - - - 2
 *  - - - 3
 *
 * 5 -> 8, 10, 12
 *  - - - -
 *  - - - 0
 *  - - - 1
 *  - - - 3
 *
 * 6 -> 9, 11, 13
 *  - - - 0
 *  - - - 1
 *  - - - 2
 *  - - - -
 *
 * 7 -> 14, 15
 *  - - - -
 *  - - - -
 *  - - - 2
 *  - - - 3
 *
 * 8 -> 14, 16
 *  - - - -
 *  - - - -
 *  - - - 1
 *  - - - 3
 *
 * 9 -> 15, 17
 *  - - - -
 *  - - - 1
 *  - - - 2
 *  - - - -
 *
 * 10 -> 14, 18
 *  - - - -
 *  - - - -
 *  - - - 0
 *  - - - 3
 *
 * 11 -> 15, 19
 *  - - - -
 *  - - - 0
 *  - - - 2
 *  - - - -
 *
 * 12 -> 16, 19
 *  - - - -
 *  - - - 0
 *  - - - 1
 *  - - - -
 *
 * 13 -> 17, 20
 *  - - - 0
 *  - - - 1
 *  - - - -
 *  - - - -
 *
 * 14
 *  - - - -
 *  - - - -
 *  - - - -
 *  - - - 3
 *
 * 15
 *  - - - -
 *  - - - -
 *  - - - 2
 *  - - - -
 *
 * 16
 *  - - - -
 *  - - - -
 *  - - - 1
 *  - - - -
 *
 * 17
 *  - - - -
 *  - - - 1
 *  - - - -
 *  - - - -
 *
 * 18
 *  - - - -
 *  - - - -
 *  - - - 0
 *  - - - -
 *
 * 19
 *  - - - -
 *  - - - 0
 *  - - - -
 *  - - - -
 *
 * 20
 *  - - - 0
 *  - - - -
 *  - - - -
 *  - - - -
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        rotate       : rotate,
        rotateOrTest : rotateOrTest,
        stateFn      : state
    });

    window.NetrisShapeLineElement = document.registerElement('netris-shape-line', { prototype : proto });

    // blockRemoved :: @NetrisShapeLineElement, Event -> undefined
    function blockRemoved(e) {
        var removedIndex = this.blocks.indexOf(e.detail);

        switch (this.state) {
            // 2 -> 3 || 4 || 5 || 6
            case 2 : switch (removedIndex) {
                case 0 : this.state = 3; break;
                case 1 : this.state = 4; break;
                case 2 : this.state = 5; break;
                case 3 : this.state = 6; break;
            } break;
            // 3 -> 7 || 8 || 9
            case 3 : switch (removedIndex) {
                case 1 : this.state = 7; break;
                case 2 : this.state = 8; break;
                case 3 : this.state = 9; break;
            } break;
            // 4 -> 7 || 10 || 11
            case 4 : switch (removedIndex) {
                case 0 : this.state = 7; break;
                case 2 : this.state = 10; break;
                case 3 : this.state = 11; break;
            } break;
            // 5 -> 8 || 10 || 12
            case 5 : switch (removedIndex) {
                case 0 : this.state = 8; break;
                case 1 : this.state = 10; break;
                case 3 : this.state = 12; break;
            } break;
            // 6 -> 9 || 11 || 13
            case 6 : switch (removedIndex) {
                case 0 : this.state = 9; break;
                case 1 : this.state = 11; break;
                case 2 : this.state = 13; break;
            } break;
            // 7 -> 14 || 15
            case 7 : switch (removedIndex) {
                case 2 : this.state = 14; break;
                case 3 : this.state = 15; break;
            } break;
            // 8 -> 14 || 16
            case 8 : switch (removedIndex) {
                case 1 : this.state = 14; break;
                case 3 : this.state = 16; break;
            } break;
            // 9 -> 15 || 17
            case 9 : switch (removedIndex) {
                case 1 : this.state = 15; break;
                case 2 : this.state = 17; break;
            } break;
            // 10 -> 14 || 18
            case 10 : switch (removedIndex) {
                case 0 : this.state = 14; break;
                case 3 : this.state = 18; break;
            } break;
            // 11 -> 15 || 19
            case 11 : switch (removedIndex) {
                case 0 : this.state = 15; break;
                case 2 : this.state = 19; break;
            } break;
            // 12 -> 16 || 19
            case 12 : switch (removedIndex) {
                case 0 : this.state = 16; break;
                case 1 : this.state = 19; break;
            } break;
            // 13 -> 17 || 20
            case 13 : switch (removedIndex) {
                case 0 : this.state = 17; break;
                case 1 : this.state = 20; break;
            } break;
        }

        NetrisShapeElement.prototype.blockRemoved.call(this, e);
    }

    // positionBlocks :: @NetrisShapeLineElement, undefined -> undefined
    function positionBlocks() {
        var blockSize = Number(this.board.dataset.blockSize),
            left      = Number(this.dataset.posLeft),
            top       = Number(this.dataset.posTop);

        this.blocks.forEach(function (b, i) {
            b.x(i * blockSize + left);
            b.y(top);
        }, this);
    }

    // rotate :: @NetrisShapeLineElement, undefined -> undefined
    function rotate() {
        try {
            this.state = this.state === 1 ? 2 : 1;
        } catch (err) {
            if (err.name !== 'InvalidStateTransition') throw err;
        }
    }

    // rotateOrTest :: @NetrisShapeLineElement, Boolean -> Boolean
    function rotateOrTest(test) {
        var blockSize = Number(this.board.dataset.blockSize),
            state     = this.state;

        return this.blocks.every(function (b, i) {
            var diff  = (3 - i) * blockSize;

            return diff === 0
                 ? true
                 : b[test ? 'canMoveTo' : 'moveTo'](state === 1 ? diff : -diff, state === 1 ? -diff : diff, true);
        }, this);
    }

    // state :: @NetrisShapeLineElement, Number -> undefined
    function state(num) {
        var blockSize = Number(this.board.dataset.blockSize);

        switch (true) {
            case num === 1 && this.state === undefined :
                this.addBlocks(4);
                positionBlocks.call(this);

            case num === 1 && this.state === 2 :
                if (this.state) this.rotateEl(num);

                this.leftBlocks  = [this.blocks[0]];
                this.rightBlocks = [this.blocks[3]];
                this.downBlocks  = this.blocks;
                break;

            case num === 2 && this.state === 1 :
                this.rotateEl(num);
                this.leftBlocks  = this.blocks;
                this.rightBlocks = this.blocks;
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 3 && this.state === 2   :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 4 && this.state === 2   :
                this.blocks[0].move('down');
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 5 && this.state === 2   :
                this.blocks[0].move('down');
                this.blocks[1].move('down');
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 6 && this.state === 2   :
                this.downBlocks  = [this.blocks[2]];
                break;

            case num === 7 && this.state === 3   :
            case num === 7 && this.state === 4   :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 8 && this.state === 3   :
                this.blocks[1].move('down');
            case num === 8 && this.state === 5   :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 9 && this.state === 3   :
            case num === 9 && this.state === 6   :
                this.downBlocks  = [this.blocks[2]];
                break;

            case num === 10 && this.state === 4  :
            case num === 10 && this.state === 5  :
                this.blocks[0].move('down');
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 11 && this.state === 5  :
            case num === 11 && this.state === 6  :
                this.downBlocks  = [this.blocks[2]];
                break;

            case num === 12 && this.state === 5  :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 13 && this.state === 6  :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 14 && this.state === 7  :
            case num === 14 && this.state === 8  :
            case num === 14 && this.state === 10 :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 15 && this.state === 7  :
            case num === 15 && this.state === 9  :
            case num === 15 && this.state === 11 :
                this.downBlocks  = [this.blocks[2]];
                break;

            case num === 16 && this.state === 8  :
            case num === 16 && this.state === 12 :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 17 && this.state === 9  :
            case num === 17 && this.state === 13 :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 18 && this.state === 10 :
                this.downBlocks  = [this.blocks[0]];
                break;

            case num === 19 && this.state === 11 :
            case num === 19 && this.state === 12 :
                this.downBlocks  = [this.blocks[0]];
                break;

            case num === 20 && this.state === 13 :
                this.downBlocks  = [this.blocks[0]];
                break;

            default : this.stateError(num);
        }

        if (num > 2) {
            this.leftBlocks  = [];
            this.rightBlocks = [];
        }

        this.currentState = num;
    }
}());
