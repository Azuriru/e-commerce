import { useCallback, useRef } from 'react';

type MouseMoveDeltas = {
    deltaX: number;
    deltaY: number;
};

type MouseCallback = (e: MouseEvent) => void;

type BeginMouseTrackingFn = (e: MouseEventShape) => void;

type MouseEventShape = {
    clientX: number;
    clientY: number;
};

class GlobalMouseTracker {
    onMoveCallbacks: MouseCallback[];
    onUpCallbacks: MouseCallback[];
    isMouseDown: boolean;

    constructor() {
        this.onMoveCallbacks = [];
        this.onUpCallbacks = [];

        this.isMouseDown = false;

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.setupEvents();
    }

    addMoveListener(cb: MouseCallback) {
        this.onMoveCallbacks.push(cb);
    }

    removeMoveListener(cb: MouseCallback) {
        this.onMoveCallbacks.splice(this.onMoveCallbacks.indexOf(cb), 1);
    }

    addUpListener(cb: MouseCallback) {
        this.onUpCallbacks.push(cb);
    }

    removeUpListener(cb: MouseCallback) {
        this.onUpCallbacks.splice(this.onUpCallbacks.indexOf(cb), 1);
    }

    setupEvents() {
        // We want our events to be bound to `window` and not the React root,
        // as the window also lets us detect mouse movements that started in
        // our root, but extend past the viewport (i.e. outside the window)
        // This is not the case in all browsers (e.g. Vivaldi), but it's the
        // case in browsers with native windows (e.g. Opera, Chrome, Firefox)
        window.addEventListener('mousedown', this.onMouseDown, { passive: true });
        window.addEventListener('mousemove', this.onMouseMove, { passive: true });
        window.addEventListener('mouseup', this.onMouseUp, { passive: true });
    }

    cleanupEvents() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown() {
        // TODO: Set up
    }

    onMouseMove(e: MouseEvent) {
        if (this.isMouseDown) {
            for (const cb of this.onMoveCallbacks) {
                cb(e);
            }
        }
    }

    onMouseUp() {
        // TODO: Clean up move listeners
    }
}

const globalMouseTracker = new GlobalMouseTracker();

export default function useMouseTracker(
    onMouseDown: BeginMouseTrackingFn,
    onMove: (deltas: MouseMoveDeltas) => void
): BeginMouseTrackingFn {
    const startMouseOffset = useRef({
        top: 0,
        left: 0
    });

    const startTrackingMouse = useCallback((e: MouseEventShape) => {
        onMouseDown(e);

        startMouseOffset.current.left = e.clientX;
        startMouseOffset.current.top = e.clientY;

        function onMoveCallback(e: MouseEvent) {
            const deltaY = startMouseOffset.current.top - e.clientY;
            const deltaX = startMouseOffset.current.left - e.clientX;

            onMove({
                deltaX,
                deltaY
            });
        }

        function onUpCallback() {
            globalMouseTracker.removeMoveListener(onMoveCallback);
            globalMouseTracker.removeUpListener(onUpCallback);
        }

        globalMouseTracker.addMoveListener(onMoveCallback);
        globalMouseTracker.addUpListener(onUpCallback);
    }, [onMouseDown, onMove]);

    return startTrackingMouse;
}
