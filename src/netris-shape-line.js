;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        blockRemoved : blockRemoved,
        makeBlocks   : makeBlocks,
        rotate       : rotate
    });

    window.NetrisShapeLineElement = document.registerElement('netris-shape-line', { prototype : proto });

    // blockRemoved :: @NetrisShapeLineElement, Event -> undefined
    function blockRemoved(e) {
        if (this.state === 2) {
            var removeIndex    = this.blocks.indexOf(e.detail),
                withoutRemoved = without(e.detail);

            this.blocks.slice(0, removeIndex).forEach(function (b) { b.move('down'); });

            this.blocks        = this.blocks.filter(withoutRemoved);
            this.downBlocks    = this.downBlocks.filter(withoutRemoved);
            if (this.downBlocks.length === 0) this.downBlocks = [this.blocks[this.blocks.length - 1]];
        }

        NetrisShapeElement.prototype.blockRemoved.call(this, e);

        function without(x) {
            return function (y) { return x !== y; };
        }
    }

    // makeBlocks :: @NetrisShapeLineElement, undefined -> undefined
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
            b.dataset.posLeft = i * blockSize + left;
            b.dataset.posTop  = top;
            this.appendChild(b);
        }, this);

        this.state       = 1;
        this.blocks      = blocks;
        this.leftBlocks  = [this.children[0]];
        this.rightBlocks = [this.children[3]];
        this.downBlocks  = this.blocks;

        Object.defineProperty(this, 'offsetTop', { get : function () { return this.children[0].offsetTop; } });
    }

    // rotate :: @NetrisShapeLineElement, undefined -> undefined
    function rotate() {
        var blockSize = Number(this.board.dataset.blockSize),
            self      = this;

        if (this.blocks.every(rotateLine(true))) {
            this.blocks.forEach(rotateLine(false));

            switch (this.state) {
                case 1 :
                    this.leftBlocks  = this.blocks;
                    this.rightBlocks = this.blocks;
                    this.downBlocks  = [this.children[3]];
                    this.state       = 2;
                    break;
                case 2 :
                    this.leftBlocks  = [this.children[0]];
                    this.rightBlocks = [this.children[3]];
                    this.downBlocks  = this.blocks;
                    this.state       = 1;
                    break;
            }
        }

        // rotateLine :: Boolean -> (NetrisBlockElement, Number -> Boolean || undefined)
        function rotateLine(test) {
            return function (b, i) {
                var diff  = (3 - i) * blockSize,
                    state = self.state;

                return diff === 0
                     ? true
                     : b[test ? 'canMoveTo' : 'moveTo'](state === 1 ? diff : -diff, state === 1 ? -diff : diff, true);
            };
        }
    }
}());
