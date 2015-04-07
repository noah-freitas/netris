/**
 * NetrisGamepadControllerElement <netris-gamepad-controller>
 *
 * A netris gamepad controller samples the gamepad at the
 * given index, at the given rate, and converts the input
 * to netris-controller:move:* custom events fired on the
 * document.
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

    window.NetrisGamepadControllerElement = document.registerElement('netris-gamepad-controller', { prototype : proto });

    // attachedCallback :: @NetrisGamepadControllerElement, undefined -> undefined
    function attachedCallback() {
        this.attached = true;
        this.player   = this.parentElement;
        requestAnimationFrame(this.sampleLoop);
    }

    // createdCallback :: @NetrisGamepadControllerElement, undefined -> undefined
    function createdCallback() {
        this.sampleLoop = sampleLoop.bind(this);
    }

    // detachedCallback :: @NetrisGamepadControllerElement, undefined -> undefined
    function detachedCallback() {
        this.attached = false;
    }

    // getCommand :: Number, Number -> String
    function getCommand(i, axesOffset) {
        var gp   = navigator.getGamepads()[i],
            axes = gp && gp.axes.slice(axesOffset, axesOffset + 2).map(Math.round);

        return !gp                        ? ''                 :
               !axes.every(equalZero)     ? getDirection(axes) :
               gp.buttons.some(isPressed) ? 'rotate'
                                          : '';

        // equalZero :: Number -> Boolean
        function equalZero(n) { return n === 0; }

        // getDirection :: [Number, Number] -> String
        function getDirection(axes) {
            return axes[0] !== 0 ? (axes[0] === -1 ? 'left'   : 'right')
                                 : (axes[1] === -1 ? 'rotate' : 'down' );
        }

        // isPressed :: GamepadButton -> Boolean
        function isPressed(b) { return b.pressed; }
    }

    // sampleLoop :: @NetrisGamepadControllerElement, Number -> undefined
    function sampleLoop(time) {
        if (!this.attached) return;

        requestAnimationFrame(this.sampleLoop);

        if (time - this.lastTime < Number(this.dataset.sampleRate)) return;

        var command;
        if (command = getCommand(Number(this.dataset.index), Number(this.dataset.axesOffset))) document.dispatchEvent(new CustomEvent('netris-controller:move:' + this.player.dataset.name, {
            detail : command
        }));

        this.lastTime = time;
    }
}());
