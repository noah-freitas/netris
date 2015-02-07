/**
 * NetrisKeyboardControllerElement <netris-controller>
 *
 * A netris controller captures the commands issued by
 * a player and converts them to netris-controller:move:*
 * custom events fired on the document.
 *
 * Active shapes listen for these events and attempt to
 * execute the command if the command came from their player.
 */
;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        createdCallback  : createdCallback,
        detachedCallback : detachedCallback
    });

    window.NetrisKeyboardControllerElement = document.registerElement('netris-keyboard-controller', { prototype : proto });

    // attachedCallback :: @NetrisKeyboardControllerElement, undefined -> undefined
    function attachedCallback() {
        this.player = this.parentElement;
        document.addEventListener('keydown', this.keyHandler);
    }

    // createdCallback :: @NetrisKeyboardControllerElement, undefined -> undefined
    function createdCallback() {
        this.keys                         = {};
        this.keys[this.dataset.downKey]   = 'down';
        this.keys[this.dataset.leftKey]   = 'left';
        this.keys[this.dataset.rightKey]  = 'right';
        this.keys[this.dataset.rotateKey] = 'rotate';
        this.keyHandler                   = keyHandler.bind(this);
    }

    // detachedCallback :: @NetrisKeyboardControllerElement, undefined -> undefined
    function detachedCallback() {
        document.removeEventListener('keydown', this.keyHandler);
    }

    // keyHandler :: @NetrisKeyboardControllerElement, KeyboardEvent -> undefined
    function keyHandler(e) {
        var key = e.keyIdentifier.toLowerCase(),
            dir = this.keys[key];

        if (dir) document.dispatchEvent(new CustomEvent('netris-controller:move:' + this.player.dataset.name, {
            detail  : dir
        }));
    }
}());
