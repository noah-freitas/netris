;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        makeBlocks   : makeBlocks,
        rotate       : rotate
    });

    window.NetrisShapeZLeftElement = document.registerElement('netris-shape-z-left', { prototype : proto });

    // addBlocks :: @NetrisShapeZLeftElement, undefined -> undefined
    function addBlocks() {
        this.blocks = [
            document.createElement('netris-block'),
            document.createElement('netris-block'),
            document.createElement('netris-block'),
            document.createElement('netris-block')
        ];

        this.blocks.forEach(function (b) { this.appendChild(b); }, this);
    }

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
        state.call(this, 1);
    }

    // positionBlocks :: @NetrisShapeZLeftElement, undefined -> undefined
    function positionBlocks() {
        var blockSize = Number(this.board.dataset.blockSize),
            left      = Number(this.dataset.posLeft),
            top       = Number(this.dataset.posTop);

        this.blocks.forEach(function (b, i) {
            b.dataset.posLeft = i === 0 ? left :
                                i <   3 ? left + blockSize
                                        : left + blockSize * 2;

            b.dataset.posTop  = i < 2   ? top
                                        : top  + blockSize;

            // TODO: I shouldn't have to set both the style and data-* attributes,
            //       but this is currently required so that the shape will fall at
            //       first.

            b.style.left = b.dataset.posLeft + 'px';
            b.style.top  = b.dataset.posTop  + 'px';
        }, this);
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

        switch (true) {
            case num === 1 && this.state === undefined :
                addBlocks.call(this);
                positionBlocks.call(this);

                Object.defineProperty(this, 'offsetTop', { get : function () {
                    return this.children[0].offsetTop;
                } });

                this.leftBlocks  = [this.blocks[0], this.blocks[2]];
                this.rightBlocks = [this.blocks[1], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[2], this.blocks[3]];
                break;

            case num === 1 && this.state === 2   :
                rotateEl.call(this);
                this.leftBlocks  = [this.blocks[0], this.blocks[2]];
                this.rightBlocks = [this.blocks[1], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[2], this.blocks[3]];
                break;

            case num === 2 && this.state === 1   :
                rotateEl.call(this);
                this.leftBlocks  = [this.blocks[0], this.blocks[1], this.blocks[2]];
                this.rightBlocks = [this.blocks[0], this.blocks[2], this.blocks[3]];
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;

            case num === 3 && this.state === 1   :
                this.downBlocks  = [this.blocks[0], this.blocks[1]];
                break;

            case num === 4 && this.state === 1   :
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;

            case num === 5 && this.state === 2   :
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;

            case num === 6 && this.state === 2   :
                this.downBlocks  = [this.blocks[1], this.blocks[3]];
                break;

            case num === 7 && this.state === 5   :
            case num === 7 && this.state === 10  :
                this.downBlocks  = [this.blocks[2]];
                break;

            case num === 8 && this.state === 5   :
            case num === 8 && this.state === 6   :
                this.downBlocks  = [this.blocks[1], this.blocks[3]];
                break;

            case num === 9 && this.state === 6   :
                this.downBlocks  = [this.blocks[0]];
                break;

            case num === 10 && this.state === 2  :
                this.blocks[0].move('down');
                this.downBlocks  = [this.blocks[0], this.blocks[2]];
                break;

            case num === 11 && this.state === 10 :
                this.downBlocks  = [this.blocks[0]];
                break;

            default : stateError.call(this);
        }

        if (num > 2) {
            this.leftBlocks  = [];
            this.rightBlocks = [];
        }

        this.state = num;

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
