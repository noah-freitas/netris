/**
 * NetrisShapeTElement <netris-shape-t>
 *
 * A t is four blocks arranged in a t shape.
 * It has four rotation states.
 *
 * States (22):
 *
 * 1 -> 2, 5, 6
 *  - 0 -
 *  1 2 3
 *  - - -
 *
 * 2 -> 3, 7, 8, 9
 *  - 1 -
 *  - 2 0
 *  - 3 -
 *
 * 3 -> 4, 14, 15
 *  - - -
 *  3 2 1
 *  - 0 -
 *
 * 4 -> 1, 16, 17, 18
 *  - 3 -
 *  0 2 -
 *  - 1 -
 *
 * 5
 *  - 0 -
 *  - - -
 *  - - -
 *
 * 6
 *  - - -
 *  1 2 3
 *  - - -
 *
 * 7 -> 10, 11
 *  - - -
 *  - 2 0
 *  - 3 -
 *
 * 8 -> 11, 12
 *  - - -
 *  - 1 -
 *  - 3 -
 *
 * 9 -> 10, 13
 *  - 1 -
 *  - 2 0
 *  - - -
 *
 * 10
 *  - - -
 *  - 2 0
 *  - - -
 *
 * 11
 *  - - -
 *  - - -
 *  - 3 -
 *
 * 12
 *  - - -
 *  - 1 -
 *  - - -
 *
 * 13
 *  - 1 -
 *  - - -
 *  - - -
 *
 * 14
 *  - - -
 *  - - -
 *  - 0 -
 *
 * 15
 *  - - -
 *  3 2 1
 *  - - -
 *
 * 16 -> 19, 20
 *  - - -
 *  0 2 -
 *  - 1 -
 *
 * 17 -> 19, 21
 *  - - -
 *  - 3 -
 *  - 1 -
 *
 * 18 -> 20, 22
 *  - 3 -
 *  0 2 -
 *  - - -
 *
 * 19
 *  - - -
 *  - - -
 *  - 1 -
 *
 * 20
 *  - - -
 *  0 2 -
 *  - - -
 *
 * 21
 *  - - -
 *  - 3 -
 *  - - -
 *
 * 22
 *  - 3 -
 *  - - -
 *  - - -
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        rotate       : rotate,
        rotateOrTest : rotateOrTest,
        stateFn      : state
    });

    window.NetrisShapeTElement = document.registerElement('netris-shape-t', { prototype : proto });

    // blockRemoved :: @NetrisShapeTElement, Event -> undefined
    function blockRemoved(e) {
        var removedIndex = this.blocks.indexOf(e.detail);

        switch (this.state) {
            // 1 -> 5 || 6
            case 1 : switch (removedIndex) {
                case 0 : this.state = 6; break;
                case 1 : this.state = 5; break;
            } break;
            // 2 -> 7 || 8 || 9
            case 2 : switch (removedIndex) {
                case 1 : this.state = 7; break;
                case 2 : this.state = 8; break;
                case 3 : this.state = 9; break;
            } break;
            // 3 -> 14 || 15
            case 3 : switch (removedIndex) {
                case 0 : this.state = 15; break;
                case 3 : this.state = 14; break;
            } break;
            // 4 -> 16 || 17 || 18
            case 4 : switch (removedIndex) {
                case 0 : this.state = 17; break;
                case 1 : this.state = 18; break;
                case 3 : this.state = 16; break;
            } break;
            // 7 -> 10 || 11
            case 7 : switch (removedIndex) {
                case 2 : this.state = 11; break;
                case 3 : this.state = 10; break;
            } break;
            // 8 -> 11 || 12
            case 8 : switch (removedIndex) {
                case 1 : this.state = 11; break;
                case 3 : this.state = 12; break;
            } break;
            // 9 -> 10 || 13
            case 9 : switch (removedIndex) {
                case 1 : this.state = 10; break;
                case 2 : this.state = 13; break;
            } break;
            // 16 -> 19 || 20
            case 16 : switch (removedIndex) {
                case 0 : this.state = 19; break;
                case 1 : this.state = 20; break;
            } break;
            // 17 -> 19 || 21
            case 17 : switch (removedIndex) {
                case 1 : this.state = 21; break;
                case 3 : this.state = 19; break;
            } break;
            // 18 -> 20 || 22
            case 18 : switch (removedIndex) {
                case 0 : this.state = 22; break;
                case 3 : this.state = 20; break;
            } break;
        }

        NetrisShapeElement.prototype.blockRemoved.call(this, e);
    }

    // positionBlocks :: @NetrisShapeTElement, undefined -> undefined
    function positionBlocks() {
        var blockSize = Number(this.board.dataset.blockSize),
            left      = Number(this.dataset.posLeft),
            top       = Number(this.dataset.posTop);

        this.blocks.forEach(function (b, i) {
            b.x(i === 0 ? blockSize + left : (i - 1) * blockSize + left);
            b.y(i === 0 ? top : blockSize + top);
        }, this);
    }

    // rotate :: @NetrisShapeTElement, undefined -> undefined
    function rotate() {
        try {
            this.state = this.state % 4 + 1;
        } catch (err) {
            if (err.name !== 'InvalidStateTransition') throw err;
        }
    }

    // rotateOrTest :: @NetrisShapeTElement, Boolean -> Boolean
    function rotateOrTest(test) {
        var coors = { 0 : [], 1 : [], 3 : [] },
            nor   = Number(this.board.dataset.blockSize),
            neg   = -nor;

        switch (this.state) {
            case 1 :
                coors[0] = [nor, nor];
                coors[1] = [nor, neg];
                coors[3] = [neg, nor];
                break;
            case 2 :
                coors[0] = [neg, nor];
                coors[1] = [nor, nor];
                coors[3] = [neg, neg];
                break;
            case 3 :
                coors[0] = [neg, neg];
                coors[1] = [neg, nor];
                coors[3] = [nor, neg];
                break;
            case 4 :
                coors[0] = [nor, neg];
                coors[1] = [neg, neg];
                coors[3] = [nor, nor];
                break;
        }

        return test
             ? this.blocks[3].canMoveTo(coors[3][0], coors[3][1])
             : this.blocks[0].moveTo(coors[0][0], coors[0][1])
            && this.blocks[1].moveTo(coors[1][0], coors[1][1])
            && this.blocks[3].moveTo(coors[3][0], coors[3][1]);
    }

    // state :: @NetrisShapeTElement, Number -> undefined
    function state(num) {
        var blockSize = Number(this.board.dataset.blockSize);

        switch (true) {
            case num === 1 && this.state === undefined :
                this.addBlocks(4);
                positionBlocks.call(this);

            case num === 1 && this.state === 4   :
                if (this.state) this.rotateEl(num);

                this.leftBlocks  = [this.blocks[0], this.blocks[1]];
                this.rightBlocks = [this.blocks[0], this.blocks[3]];
                this.downBlocks  = [this.blocks[1], this.blocks[2], this.blocks[3]];
                break;

            case num === 2 && this.state === 1   :
                this.rotateEl(num);

                this.leftBlocks  = [this.blocks[1], this.blocks[2], this.blocks[3]];
                this.rightBlocks = [this.blocks[0], this.blocks[1], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[3]];
                break;

            case num === 3 && this.state === 2   :
                this.rotateEl(num);

                this.leftBlocks  = [this.blocks[0], this.blocks[3]];
                this.rightBlocks = [this.blocks[0], this.blocks[1]];
                this.downBlocks  = [this.blocks[0], this.blocks[1], this.blocks[3]];
                break;

            case num === 4 && this.state === 3   :
                this.rotateEl(num);

                this.leftBlocks  = [this.blocks[0], this.blocks[1], this.blocks[3]];
                this.rightBlocks = [this.blocks[1], this.blocks[2], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;

            case num === 5 && this.state === 1   :
                this.downBlocks  = [this.blocks[0]];
                break;

            case num === 6 && this.state === 1   :
                this.downBlocks  = [this.blocks[1], this.blocks[2], this.blocks[3]];
                break;

            case num === 7 && this.state === 2   :
                this.downBlocks  = [this.blocks[0], this.blocks[3]];
                break;

            case num === 8 && this.state === 2   :
                this.blocks[1].move('down');
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 9 && this.state === 2   :
                this.downBlocks  = [this.blocks[0], this.blocks[2]];
                break;

            case num === 10 && this.state === 7  :
            case num === 10 && this.state === 9  :
                this.downBlocks  = [this.blocks[0], this.blocks[2]];
                break;

            case num === 11 && this.state === 7  :
            case num === 11 && this.state === 8  :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 12 && this.state === 8  :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 13 && this.state === 9  :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 14 && this.state === 3  :
                this.downBlocks  = [this.blocks[0]];
                break;

            case num === 15 && this.state === 3  :
                this.downBlocks  = [this.blocks[1], this.blocks[2], this.blocks[3]];
                break;

            case num === 16 && this.state === 4  :
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;

            case num === 17 && this.state === 4  :
                this.blocks[3].move('down');
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 18 && this.state === 4  :
                this.downBlocks  = [this.blocks[0], this.blocks[2]];
                break;

            case num === 19 && this.state === 16 :
            case num === 19 && this.state === 17 :
                this.downBlocks  = [this.blocks[1]];
                break;

            case num === 20 && this.state === 16 :
            case num === 20 && this.state === 18 :
                this.downBlocks  = [this.blocks[0], this.blocks[2]];
                break;

            case num === 21 && this.state === 17 :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 22 && this.state === 18 :
                this.downBlocks  = [this.blocks[3]];
                break;

            default : this.stateError(num);
        }

        if (num > 4) {
            this.leftBlocks  = [];
            this.rightBlocks = [];
        }

        this.currentState = num;
    }
}());
