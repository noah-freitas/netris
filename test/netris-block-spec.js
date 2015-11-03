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

    describe('when attached', () => {
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
