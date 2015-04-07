/**
 * NetrisBoardElement <netris-board>
 *
 * A board has one or more shapes.  It manages the game
 * event loop, falling each active shape one per turn.
 * When a shape stops falling and becomes inactive, it
 * will end the game if it stopped out of bounds, or it
 * will clear complete rows and add a new random shape
 * if the shape stopped in bounds.
 */
;(function () {
    'use strict';

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

        this.style.height = this.dataset.boardHeight + 'px';
        this.style.width  = this.dataset.boardWidth  + 'px';

        // Add starting shapes for each player.
        Array.from(this.querySelectorAll('netris-player')).forEach(function (p) {
            var playerShape              = document.createElement('netris-shape');
            playerShape.dataset.player   = p.dataset.name;
            playerShape.dataset.posLeft  = p.dataset.startX;
            playerShape.dataset.fallRate = p.dataset.speed;
            this.addShape(playerShape);
        }, this);

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

    // adjustRows :: @NetrisBoardElement, NetrisShapeElement -> undefined
    function adjustRows(cause) {
        while (this.clearRows(cause)) while (this.dropShapes()) undefined;
    }

    // clearRows :: @NetrisBoardElement, NetrisShapeElement -> undefined
    function clearRows(cause) {
        var cleared = false;

        this.getRows().reverse().forEach(function (row) {
            if (row.every(isntNull)) {
                this.dispatchEvent(new CustomEvent('netris-board:rowcleared', { detail : cause }));
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
        this.gameOver        = false;
        this.makeRows        = makeRows.bind(this);
        this.shapeStopped    = shapeStopped.bind(this);

        this.shapes          = this.dataset.shapes.split(' ');
        this.fallingShapeSel = this.shapes.map(append('[data-falling="true"]')).join(', ');
        this.stoppedBlockSel = this.shapes.map(append('[data-falling="false"] netris-block')).join(', ');
        this.stoppedShapeSel = this.shapes.map(append('[data-falling="false"]')).join(', ');

        // append :: String -> (String -> String)
        function append(a) {
            return function (s) { return s + a; };
        }
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
        rows[Math.floor(block.offsetTop / size)][Math.floor(block.offsetLeft / size)] = block;
        return rows;
    }

    // mapSize :: Number, (undefined -> a) -> [a]
    function mapSize(size, fn) {
        return new Array(size).join(' ').split(' ').map(fn);
    }

    // randomShape :: undefined -> String
    function randomShape() {
        return this.shapes[Math.round(Math.random() * (this.shapes.length - 1))];
    }

    // shapeStopped :: @NetrisBoardElement, Event -> undefined
    function shapeStopped(e) {
        this.adjustRows(e.target);
        this.addShape(e.target);
    }

    // sortShapes :: NetrisShapeElement, NetrisShapeElement -> Number
    function sortShapes(s1, s2) {
        return s2.offsetTop - s1.offsetTop;
    }
}());
