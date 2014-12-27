;(function () {
    'use strict';

    var proto = Object.assign(Object.create(NetrisShapeElement.prototype), {
        makeBlocks : makeBlocks
    });

    window.NetrisShapeSquareElement = document.registerElement('netris-shape-square', { prototype : proto });

    // makeBlocks :: @NetrisShapeSquareElement, undefined -> undefined
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
            b.dataset.posLeft = i % 2 === 0 ? left : left + blockSize;
            b.dataset.posTop  = i < 2       ? top  : top  + blockSize;
            this.appendChild(b);
        }, this);

        this.blocks      = blocks;
        this.leftBlocks  = [this.children[0], this.children[2]];
        this.rightBlocks = [this.children[1], this.children[3]];
        this.downBlocks  = [this.children[2], this.children[3]];

        Object.defineProperty(this, 'offsetTop', { get : function () { return this.children[0].offsetTop; } });
    }
}());
