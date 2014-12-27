;(function () {
    'use strict';

    var proto = Object.assign(Object.create(HTMLElement.prototype), {
        attachedCallback : attachedCallback,
        createdCallback  : createdCallback,
        detachedCallback : detachedCallback
    });

    window.NetrisControllerElement = document.registerElement('netris-controller', { prototype : proto });

    // attachedCallback :: @NetrisControllerElement, undefined -> undefined
    function attachedCallback() {
        document.addEventListener('keydown', this.keyHandler);
    }

    // createdCallback :: @NetrisControllerElement, undefined -> undefined
    function createdCallback() {
        this.keys                         = {};
        this.keys[this.dataset.downKey]   = 'down';
        this.keys[this.dataset.leftKey]   = 'left';
        this.keys[this.dataset.rightKey]  = 'right';
        this.keys[this.dataset.rotateKey] = 'rotate';
        this.keyHandler                   = keyHandler.bind(this);
    }

    // detachedCallback :: @NetrisControllerElement, undefined -> undefined
    function detachedCallback() {
        document.removeEventListener('keydown', this.keyHandler);
    }

    // keyHandler :: @NetrisControllerElement, KeyboardEvent -> undefined
    function keyHandler(e) {
        var key = e.keyIdentifier.toLowerCase(),
            dir = this.keys[key];

        if (dir) document.dispatchEvent(new CustomEvent('netris-controller:move:' + this.dataset.player, {
            detail  : dir
        }));
    }
}());
