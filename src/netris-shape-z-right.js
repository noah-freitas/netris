;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        rotate       : rotate,
        rotateOrTest : rotateOrTest,
        stateFn      : state
    });

    window.NetrisShapeZRightElement = document.registerElement('netris-shape-z-right', { prototype : proto });

    // blockRemoved :: @NetrisShapeZRightElement, Event -> undefined
    function blockRemoved(e) {
        var removedIndex = this.blocks.indexOf(e.detail);

        switch (this.state) {
            // 1 -> 3 || 4
            case 1 : switch (removedIndex) {
                case 0 : this.state = 3; break;
                case 2 : this.state = 4; break;
            } break;
            // 2 -> 5 || 6 || 9
            case 2 : switch (removedIndex) {
                case 0 : this.state = 9; break;
                case 2 : this.state = 5; break;
                case 3 : this.state = 6; break;
            } break;
            // 5 -> 7 || 4
            case 5 : switch (removedIndex) {
                case 0 : this.state = 7; break;
                case 3 : this.state = 4; break;
            } break;
            // 6 -> 8 || 4
            case 6 : switch (removedIndex) {
                case 0 : this.state = 8; break;
                case 2 : this.state = 4; break;
            } break;
            // 9 -> 7 || 10
            case 9 : switch (removedIndex) {
                case 2 : this.state = 7; break;
                case 3 : this.state = 10; break;
            } break;
        }

        NetrisShapeElement.prototype.blockRemoved.call(this, e);
    }

    // positionBlocks :: @NetrisShapeZRightElement, undefined -> undefined
    function positionBlocks() {
        var blockSize = Number(this.board.dataset.blockSize),
            left      = Number(this.dataset.posLeft),
            top       = Number(this.dataset.posTop);

        this.blocks.forEach(function (b, i) {
            b.x(i < 2 ? i * blockSize + blockSize + left : (i - 2) * blockSize + left);
            b.y(i < 2 ? blockSize + top : blockSize * 2 + top);
        }, this);
    }

    // rotate :: @NetrisShapeZRightElement, undefined -> undefined
    function rotate() {
        try {
            this.state = this.state === 1 ? 2 : 1;
        } catch (err) {
            if (err.name !== 'InvalidStateTransition') throw err;
        }
    }

    // rotateOrTest :: @NetrisShapeZRightElement, Boolean -> Boolean
    function rotateOrTest(test) {
        var nor = Number(this.board.dataset.blockSize),
            neg = -nor;

        return this.blocks[2][test ? 'canMoveTo' : 'moveTo'](this.state === 1 ? nor : neg, (this.state === 1 ? neg : nor) * 2, true)
            && this.blocks[3][test ? 'canMoveTo' : 'moveTo'](this.state === 1 ? nor : neg, 0                                 , true);
    }

    // state :: @NetrisShapeZRightElement, Number -> undefined
    function state(num) {
        var blockSize = Number(this.board.dataset.blockSize);

        switch (true) {
            case num === 1 && this.state === undefined :
                this.addBlocks(4);
                positionBlocks.call(this);

            case num === 1 && this.state === 2   :
                if (this.state) this.rotateEl(num);

                this.leftBlocks  = [this.blocks[0], this.blocks[2]];
                this.rightBlocks = [this.blocks[1], this.blocks[3]];
                this.downBlocks  = [this.blocks[1], this.blocks[2], this.blocks[3]];
                break;

            case num === 2 && this.state === 1   :
                this.rotateEl(num);

                this.leftBlocks  = [this.blocks[0], this.blocks[2], this.blocks[3]];
                this.rightBlocks = [this.blocks[1], this.blocks[2], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[3]];
                break;

            case num === 3 && this.state === 1   :
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;

            case num === 4 && this.state === 1   :
            case num === 4 && this.state === 5   :
            case num === 4 && this.state === 6   :
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;

            case num === 5 && this.state === 2   :
                this.downBlocks  = [this.blocks[0], this.blocks[3]];
                break;

            case num === 6 && this.state === 2   :
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;

            case num === 7 && this.state === 5   :
            case num === 7 && this.state === 9   :
                this.downBlocks  = [this.blocks[3]];
                break;

            case num === 8 && this.state === 6   :
                this.downBlocks  = [this.blocks[2]];
                break;

            case num === 9 && this.state === 2   :
                this.blocks[2].move('down');
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;

            case num === 10 && this.state === 9  :
                this.downBlocks  = [this.blocks[2]];
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
