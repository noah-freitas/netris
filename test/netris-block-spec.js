describe('netris-block', () => {
    'use strict';

    let el;

    beforeEach(() => el = document.createElement('netris-block'));

    it('should be a registered element with a provided constructor', () => {
        expect(el instanceof NetrisBlockElement).toBe(true);
    });

    describe('data-pos-left, data-pos-right', () => {
        describe('when given values', () => {
            beforeEach(attachEl(() => {
                el.dataset.posLeft = '50';
                el.dataset.posTop  = '100';
            }));

            it('should set the css left and top properties to the provided values', () => {
                expect(el.style.left).toBe('50px');
                expect(el.style.top ).toBe('100px');
            });
        });

        describe('when not given values', () => {
            beforeEach(attachEl());

            it('should provide default left and top values of 0', () => {
                expect(el.style.left).toBe('0px');
                expect(el.style.top ).toBe('0px');
            });
        });
    });

    describe('when attached with a data-board-el', () => {
        let board;
        const BOARD_BLOCK_SIZE = '25';

        beforeEach(attachEl(createStubBoardAndAttach, () => board));
        afterEach(detachEl(() => board.remove()));

        it('should set its width and height to its board\'s data-block-size', () => {
            expect(el.style.width ).toBe(`${ BOARD_BLOCK_SIZE }px`);
            expect(el.style.height).toBe(`${ BOARD_BLOCK_SIZE }px`);
        });

        // createStubBoardAndAttach :: undefined -> undefined
        function createStubBoardAndAttach() {
            board                   = document.createElement('netris-board-stub');
            board.dataset.blockSize = BOARD_BLOCK_SIZE;
            el.dataset.boardEl      = 'netris-board-stub';
            document.body.appendChild(board);
        }
    });

    describe('canMove', () => {
        const BOARD_BLOCK_SIZE = 25,
              STUB_STYLE_ID    = 'netris-block-spec-css';

        let board;

        beforeEach(addCss);
        beforeEach(attachEl(createStubBoardAndAttach, () => board));
        afterEach(removeCss);
        afterEach(detachEl(() => board.remove()));

        describe('when in its default position', () => {
            it(
                `should return true if the coordinates under the specified direction are empty.
                 The coordinates are empty if the corners of specified direction are occupied
                 by the block itself or its data-block-el.  The moved to position is computed
                 using the height of the block.`,
                () => {
                    expect(el.canMove('down' )).toBe(true);
                    expect(el.canMove('left' )).toBe(false);
                    expect(el.canMove('right')).toBe(true);
                }
            );
        });

        describe('when set to a new position', () => {

        });

        // addCss :: undefined -> undefined
        function addCss() {
            let style         = document.createElement('style');
            style.id          = STUB_STYLE_ID;
            style.textContent = `
                netris-board-stub {
                    display  : block;
                    position : relative;
                }
                netris-block {
                    display  : block;
                    left     : 0;
                    position : absolute;
                    top      : 0;
                }
            `;
            document.body.appendChild(style);
        }

        // createStubBoardAndAttach :: undefined -> undefined
        function createStubBoardAndAttach() {
            let boardSideDim        = `${ BOARD_BLOCK_SIZE * 10 }px`
            board                   = document.createElement('netris-board-stub');
            board.dataset.blockSize = BOARD_BLOCK_SIZE;
            board.style.height      = boardSideDim;
            board.style.width       = boardSideDim;
            el.dataset.boardEl      = 'netris-board-stub';
            board.appendChild(el);
            document.body.appendChild(board);
        }

        // removeCss :: undefined -> undefined
        function removeCss() {
            document.querySelector(`#${ STUB_STYLE_ID }`).remove();
        }
    });

    // attachEl :: (undefined -> undefined), (undefined -> Element) -> (undefined -> undefined)
    function attachEl(before, parentProvider) {
        return () => {
            if (before) before();
            (parentProvider && parentProvider() || document.body).appendChild(el);
        };
    }

    // detachEl :: (undefined -> undefined) -> (undefined -> undefined)
    function detachEl(after) {
        return () => {
            if (after) after();
            el.remove();
        };

    }
});
