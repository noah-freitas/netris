;(function () {
    'use strict';

    var shapes = [
        'netris-shape-line',
        'netris-shape-square',
        'netris-shape-t',
        'netris-shape-z-left',
        'netris-shape-z-right'
    ];

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        addShape         : addShape,
        adjustRows       : adjustRows,
        attachedCallback : attachedCallback,
        clearRows        : clearRows,
        createdCallback  : createdCallback,
        dropShapes       : dropShapes,
        getRows          : getRows,
        makeRows         : makeRows,
        randomShape      : randomShape
    });

    window.NetrisBoardElement = document.registerElement('netris-board', { prototype : proto });

    // attachedCallback :: @NetrisBoardElement, undefined -> undefined
    function attachedCallback() {
        this.addEventListener('netris-shape:stopped'     , this.shapeStopped);
        this.addEventListener('netris-shape:outofbounds' , this.endGame);
        requestAnimationFrame(this.fallShapes);
    }

    // addShape :: @NetrisBoardElement, NetrisShapeElement -> undefined
    function addShape(oldShape) {
        var newBlock              = document.createElement(this.randomShape());
        newBlock.dataset.posTop   = -this.dataset.blockSize;
        newBlock.dataset.posLeft  = oldShape.dataset.posLeft;
        newBlock.dataset.fallRate = oldShape.dataset.fallRate;
        newBlock.dataset.player   = oldShape.dataset.player;
        this.appendChild(newBlock);
    }

    // adjustRows :: @NetrisBoardElement, undefined -> undefined
    function adjustRows() {
        while (this.clearRows()) while (this.dropShapes()) undefined;
    }

    // clearRows :: @NetrisBoardElement, undefined -> undefined
    function clearRows() {
        var cleared = false;

        this.getRows().reverse().forEach(function (row) {
            if (row.every(isntNull)) {
                cleared = true;
                row.forEach(clearBlock);
            }
        }, this);

        return cleared;

        function clearBlock(b) { b.remove(); }
        function isntNull(b) { return b !== null; }
    }

    // createdCallback :: @NetrisBoardElement, undefined -> undefined
    function createdCallback() {
        this.endGame         = endGame.bind(this);
        this.fallShapes      = fallShapes.bind(this);
        this.fallingShapeSel = shapes.map(function (s) { return s + '[data-falling="true"]'; }).join(', ');
        this.gameOver        = false;
        this.makeRows        = makeRows.bind(this);
        this.shapeStopped    = shapeStopped.bind(this);
        this.stoppedBlockSel = shapes.map(function (s) { return s + '[data-falling="false"] netris-block'; }).join(', ');
        this.stoppedShapeSel = shapes.map(function (s) { return s + '[data-falling="false"]'; }).join(', ');
    }

    // dropShapes :: @NetrisBoardElement, undefined -> Boolean
    function dropShapes() {
        var dropped = false;

        Array.from(this.querySelectorAll(this.stoppedShapeSel)).sort(sortShapes).forEach(function (s) {
            if (s.canMove('down')) {
                dropped = true;
                s.move('down');
            }
        });

        return dropped;
    }

    // emptyRows :: NetrisBoardElement, Number -> [[null]]
    function emptyRows(board, blockSize) {
        var dims = board.getBoundingClientRect();
        return mapSize(dims.height / blockSize, function () {
            return mapSize(dims.width / blockSize, function () { return null; });
        });
    }

    // endGame :: Event -> undefined
    function endGame(e) {
        this.gameOver = true;
        console.log('Game ended by: ', e.target);
        alert('Game over!');
    }

    // fallShapes :: @NetrisBoardElement, undefined -> undefined
    function fallShapes() {
        Array.from(this.querySelectorAll(this.fallingShapeSel))
             .sort(sortShapes)
             .forEach(function (s) { s.fall(); });

        if (!this.gameOver) requestAnimationFrame(this.fallShapes);
    }

    // getRows :: @NetrisBoardElement, undefined -> [[NetrisBlockElement || null]]
    function getRows() {
        var blocks = Array.from(this.querySelectorAll(this.stoppedBlockSel));
        return blocks.reduce(this.makeRows, emptyRows(this, Number(this.dataset.blockSize)));
    }

    // makeRows :: @NetrisBoardElement, [[NetrisBlockElement || null]], NetrisBlockElement -> [[NetrisBlockElement || null]]
    function makeRows(rows, block) {
        var size = Number(this.dataset.blockSize);
        rows[block.offsetTop / size][block.offsetLeft / size] = block;
        return rows;
    }

    // mapSize :: Number, (undefined -> a) -> [a]
    function mapSize(size, fn) {
        return new Array(size).join(' ').split(' ').map(fn);
    }

    // randomShape :: undefined -> String
    function randomShape() {
        return shapes[Math.round(Math.random() * (shapes.length - 1))];
    }

    // shapeStopped :: @NetrisBoardElement, Event -> undefined
    function shapeStopped(e) {
        this.adjustRows();
        this.addShape(e.target);
    }

    // sortShapes :: NetrisShapeElement, NetrisShapeElement -> Number
    function sortShapes(s1, s2) {
        return s2.offsetTop - s1.offsetTop;
    }
}());
