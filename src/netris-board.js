;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        addBlock         : addBlock,
        adjustRows       : adjustRows,
        attachedCallback : attachedCallback,
        createdCallback  : createdCallback,
        getRows          : getRows,
        makeRows         : makeRows
    });

    document.registerElement('netris-board', { prototype : proto });

    // createdCallback :: @netris-board, undefined -> undefined
    function createdCallback() {
        this.blockStopped = blockStopped.bind(this);
        this.endGame      = endGame.bind(this);
        this.makeRows     = makeRows.bind(this);
    }

    // attachedCallback :: @netris-board, undefined -> undefined
    function attachedCallback() {
        this.addEventListener('netris-block:stopped'     , this.blockStopped);
        this.addEventListener('netris-block:outofbounds' , this.endGame);
    }

    // addBlock :: @netris-board, netris-block -> undefined
    function addBlock(oldBlock) {
        var newBlock              = document.createElement('netris-block');
        newBlock.dataset.posTop   = -this.dataset.blockSize;
        newBlock.dataset.posLeft  = parseInt(oldBlock.style.left, 10);
        newBlock.dataset.fallRate = oldBlock.dataset.fallRate;
        newBlock.dataset.player   = oldBlock.dataset.player;
        this.appendChild(newBlock);
    }

    // blockStopped :: @netris-board, Event -> undefined
    function blockStopped(e) {
        this.adjustRows()
        this.addBlock(e.target);
    }

    // adjustRows :: @netris-board, undefined -> undefined
    function adjustRows() {
        this.getRows().reverse().forEach(function (row) {
            // If the row is full.
            if (row.every(function (b) { return b !== null; })) {
                // Remove all the blocks.
                row.forEach(function (b) { b.remove(); });
            } else {
                // Otherwise try to drop the blocks.
                row.forEach(function (b) {
                    if (b) b.move({ detail: 'down' }, Number(this.dataset.blockSize));
                }, this);
            }
        }, this);
    }

    // emptyRows :: netris-board, Number -> [[null]]
    function emptyRows(board, blockSize) {
        var dims = board.getBoundingClientRect();
        return mapSize(dims.height / blockSize, function () {
            return mapSize(dims.width / blockSize, function () { return null; });
        });
    }

    // endGame :: Event -> undefined
    function endGame(e) {
        console.log('Game ended by: ', e.target);
        alert('Game over!');
    }

    // getRows :: @netris-board, undefined -> [[netris-block || null]]
    function getRows() {
        var blocks = Array.from(this.querySelectorAll('netris-block[data-falling="false"]'));
        return blocks.reduce(this.makeRows, emptyRows(this, Number(this.dataset.blockSize)));
    }

    // makeRows :: @netris-board, [[netris-block || null]], netris-block -> [[netris-block || null]]
    function makeRows(rows, block) {
        var size = Number(this.dataset.blockSize);
        rows[block.offsetTop / size][block.offsetLeft / size] = block;
        return rows;
    }

    // mapSize :: Number, (undefined -> a) -> [a]
    function mapSize(size, fn) {
        return new Array(size).join(' ').split(' ').map(fn);
    }
}());
