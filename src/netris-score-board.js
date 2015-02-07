/**
 * NetrisScoreBoardElement <netris-score-board>
 *
 * A score board shows the current score for each player
 * in the game.
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        createdCallback  : createdCallback
    });

    window.NetrisScoreBoardElement = document.registerElement('netris-score-board', { prototype : proto });

    // attachedCallback :: @NetrisScoreBoardElement, undefined -> undefined
    function attachedCallback() {
        document.addEventListener('netris-player:score', this.scoreHandler);
    }

    // createdCallback :: @NetrisScoreBoardElement, undefined -> undefined
    function createdCallback() {
        this.players      = {};
        this.scoreHandler = scoreHandler.bind(this);
        this.appendChild(document.createElement('ul'));
    }

    // makeEl :: @NetrisScoreBoardElement, { color :: String, player :: String, score :: Number } -> undefined
    function makeEl(detail) {
        var playerEl                = document.createElement('li'),
            nameEl                  = document.createElement('span'),
            scoreEl                 = document.createElement('span');

        nameEl.textContent          = detail.player;
        playerEl.style.color        = detail.color;
        this.players[detail.player] = scoreEl;

        playerEl.appendChild(nameEl);
        playerEl.appendChild(scoreEl);
        this.querySelector('ul').appendChild(playerEl);
    }

    // setScore :: @NetrisScoreBoardElement, { color :: String, player :: String, score :: Number } -> undefined
    function setScore(detail) {
        this.players[detail.player].textContent = detail.score;
    }

    // scoreHandler :: @NetrisScoreBoardElement, CustomEvent -> undefined
    function scoreHandler(e) {
        if (!this.players[e.detail.player]) makeEl.call(this, e.detail);
        setScore.call(this, e.detail);
    }
}());
