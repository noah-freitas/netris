;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        makeBlocks   : makeBlocks,
        rotate       : rotate
    });

    window.NetrisShapeZLeftElement = document.registerElement('netris-shape-z-left', { prototype : proto });

    // blockRemoved :: @NetrisShapeZLeftElement, Event -> undefined
    function blockRemoved(e) {
        var removedIndex = this.blocks.indexOf(e.detail);

        switch (this.state) {
            // 1 -> 3 || 4
            case 1 : switch (removedIndex) {
                case 0 : state.call(this, 4); break;
                case 2 : state.call(this, 3); break;
            } break;
            // 2 -> 5 || 6 || 10
            case 2 : switch (removedIndex) {
                case 0 : state.call(this, 5); break;
                case 1 : state.call(this, 10); break;
                case 2 : state.call(this, 6); break;
            } break;
            // 5 -> 7 || 8
            case 5 : switch (removedIndex) {
                case 1 : state.call(this, 7); break;
                case 2 : state.call(this, 8); break;
            } break;
            // 6 -> 8 || 9
            case 6 : switch (removedIndex) {
                case 0 : state.call(this, 8); break;
                case 1 : state.call(this, 9); break;
            } break;
            // 10 -> 7 || 11
            case 10 : switch (removedIndex) {
                case 0 : state.call(this, 7); break;
                case 2 : state.call(this, 11); break;
            } break;
        }

        NetrisShapeElement.prototype.blockRemoved.call(this, e);
    }

    // makeBlocks :: @NetrisShapeZLeftElement, undefined -> undefined
    function makeBlocks() {
        var blocks    = [
                document.createElement('netris-block'),
                document.createElement('netris-block'),
                document.createElement('netris-block'),
                document.createElement('netris-block')
            ],
            blockSize = Number(this.board.dataset.blockSize),
            left      = Number(this.dataset.posLeft),
            top       = Number(this.dataset.posTop);

        blocks.forEach(function (b, i) {
            b.dataset.posLeft = i === 0 ? left :
                                i <   3 ? left + blockSize
                                        : left + blockSize * 2;

            b.dataset.posTop  = i < 2   ? top
                                        : top  + blockSize;

            this.appendChild(b);
        }, this);

        this.blocks = blocks;
        this.state  = 1;
        state.call(this, 2);

        Object.defineProperty(this, 'offsetTop', { get : function () { return this.children[0].offsetTop; } });
    }

    // rotate :: @NetrisShapeZLeftElement, undefined -> undefined
    function rotate() {
        try {
            state.call(this, this.state === 1 ? 2 : 1);
        } catch (err) {
            if (err.name !== 'InvalidStateTransition') throw err;
        }
    }

    // state :: @NetrisShapeZLeftElement, Number -> undefined
    function state(num) {
        var blockSize = Number(this.board.dataset.blockSize);

        switch (num) {
            case 1  :
                fromState.call(this, [2]);
                rotateEl.call(this);
                this.leftBlocks  = [this.blocks[0], this.blocks[2]];
                this.rightBlocks = [this.blocks[1], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[2], this.blocks[3]];
                break;
            case 2  :
                fromState.call(this, [1]);
                rotateEl.call(this);
                this.leftBlocks  = [this.blocks[0], this.blocks[1], this.blocks[2]];
                this.rightBlocks = [this.blocks[0], this.blocks[2], this.blocks[3]];
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;
            case 3  :
                fromState.call(this, [1]);
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;
            case 4  :
                fromState.call(this, [1]);
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;
            case 5  :
                fromState.call(this, [2]);
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;
            case 6  :
                fromState.call(this, [2]);
                this.downBlocks  = [this.blocks[1], this.blocks[3]];
                break;
            case 7  :
                fromState.call(this, [5, 10]);
                this.downBlocks  = [this.blocks[2]];
                break;
            case 8  :
                fromState.call(this, [5, 6]);
                this.downBlocks  = [this.blocks[1], this.blocks[3]];
                break;
            case 9  :
                fromState.call(this, [6]);
                this.downBlocks  = [this.blocks[0]];
                break;
            case 10 :
                fromState.call(this, [2]);
                this.blocks[0].move('down');
                this.downBlocks  = [this.blocks[0], this.blocks[2]];
                break;
            case 11 :
                fromState.call(this, [10]);
                this.downBlocks  = [this.blocks[0]];
                break;
            default :
                throw new Error('Unknown to state ', num);
        }

        if (num > 2) {
            this.leftBlocks  = [];
            this.rightBlocks = [];
        }

        this.state = num;

        // fromState :: @NetrisShapeZLeftElement, [Number] -> undefined
        function fromState(from) {
            if (from.indexOf(this.state) === -1) stateError.call(this);
        }

        // rotateEl :: @NetrisShapeZLeftElement, undefined -> undefined
        function rotateEl() {
            rotate.call(this, true) && rotate.call(this, false) || stateError.call(this);

            // rotate :: @NetrisShapeZLeftElement, Boolean -> Boolean
            function rotate(test) {
                var nor = blockSize,
                    neg = -blockSize;

                return this.blocks[0][test ? 'canMoveTo' : 'moveTo']((this.state === 1 ? nor : neg) * 2, this.state === 1 ? neg : nor, true)
                    && this.blocks[3][test ? 'canMoveTo' : 'moveTo'](0                                 , this.state === 1 ? neg : nor, true);
            }
        }

        // stateError :: @NetrisShapeZLeftElement, undefined -> undefined
        function stateError() {
            throw Object.assign(new Error('Invalid state transition ', this.state, '->', num), {
                name : 'InvalidStateTransition'
            });
        }
    }
}());
