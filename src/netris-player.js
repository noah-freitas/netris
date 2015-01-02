/**
 * NetrisPlayerElement <netris-player>
 *
 * A netris player element contains metadata about a
 * player in a netris game.  It should contain a controller
 * element for the player.
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        createdCallback  : createdCallback,
        fireScore        : fireScore
    });

    window.NetrisPlayerElement = document.registerElement('netris-player', { prototype : proto });

    // attachedCallback :: @NetrisPlayerElement, undefined -> undefined
    function attachedCallback() {
        var style         = document.createElement('style');
        style.textContent = '[data-player="' + this.dataset.name + '"] netris-block { background : ' + this.dataset.color + '; }';
        document.head.appendChild(style);

        this.parentElement.addEventListener('netris-board:rowcleared', this.rowclearedHandler);
        this.fireScore();
    }

    // createdCallback :: @NetrisPlayerElement, undefined -> undefined
    function createdCallback() {
        this.score             = 0;
        this.rowclearedHandler = score.bind(this);
    }

    // fireScore :: @NetrisPlayerElement, undefined -> undefined
    function fireScore() {
        document.dispatchEvent(new CustomEvent('netris-player:score', { detail : {
            player : this.dataset.name,
            score  : this.score
        } }));
    }

    // score :: @NetrisPlayerElement, CustomEvent -> undefined
    function score(e) {
        if (e.detail.dataset.player === this.dataset.name) {
            this.score++;
            this.fireScore();
        }
    }
}());
