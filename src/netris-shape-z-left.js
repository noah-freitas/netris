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
        var removedIndex   = this.blocks.indexOf(e.detail),
            withoutRemoved = without(e.detail);

        if (this.state === 1 || this.blocks.length < 3) {
            this.downBlocks = this.blocks.filter(withoutRemoved);
        } else {
            if (this.blocks.length === 4) {
                switch (removedIndex) {
                    case 2 :
                        this.downBlocks = [this.blocks[1], this.blocks[3]];
                        break;
                    case 3 :
                        this.blocks[0].move('down');
                        this.downBlocks = [this.blocks[0], this.blocks[2]];
                        break;
                }
            } else {
                switch (removedIndex) {
                    case 1 :
                        this.downBlocks = this.blocks[1].offsetTop < this.blocks[2].offsetTop
                                        ? [this.blocks[2]]
                                        : [this.blocks[0], this.blocks[2]];
                        break;
                    case 2 :
                        this.blocks[0].move('down');
                        this.downBlocks = [this.blocks[0], this.blocks[1]];
                        break;
                }
            }
        }

        this.blocks = this.blocks.filter(withoutRemoved);

        NetrisShapeElement.prototype.blockRemoved.call(this, e);

        function without(x) {
            return function (y) { return x !== y; };
        }
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
        state.call(this, 1);

        Object.defineProperty(this, 'offsetTop', { get : function () { return this.children[0].offsetTop; } });
    }

    // rotate :: @NetrisShapeZLeftElement, undefined -> undefined
    function rotate() {
        var blockSize = Number(this.board.dataset.blockSize);

        if (rotateEl.call(this, true)) {
            rotateEl.call(this, false);
            state.call(this, this.state === 1 ? 2 : 1);
        }

        function rotateEl(test) {
            var nor = blockSize,
                neg = -blockSize;

            return this.blocks[0][test ? 'canMoveTo' : 'moveTo']((this.state === 1 ? nor : neg) * 2, this.state === 1 ? neg : nor, true)
                && this.blocks[3][test ? 'canMoveTo' : 'moveTo'](0                                 , this.state === 1 ? neg : nor, true);
        }
    }

    // state :: @NetrisShapeZLeftElement, Number -> undefined
    function state(num) {
        switch (num) {
            case 1 :
                this.leftBlocks  = [this.blocks[0], this.blocks[2]];
                this.rightBlocks = [this.blocks[1], this.blocks[3]];
                this.downBlocks  = [this.blocks[0], this.blocks[2], this.blocks[3]];
                break;
            case 2 :
                this.leftBlocks  = [this.blocks[0], this.blocks[1], this.blocks[2]];
                this.rightBlocks = [this.blocks[0], this.blocks[2], this.blocks[3]];
                this.downBlocks  = [this.blocks[2], this.blocks[3]];
                break;
        }
        this.state = num;
    }
}());
