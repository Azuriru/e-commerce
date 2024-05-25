import { useCallback, useRef } from 'react';

type OnMouseMoveDeltas = {
    deltaX: number;
    deltaY: number;
};

type BeginMouseTrackingFn = (e: MouseEventShape) => void;

type MouseEventShape = {
    clientX: number;
    clientY: number;
};

export default function useMouseTracker(
    onMouseDown: (e: MouseEventShape) => void,
    onMove: (deltas: OnMouseMoveDeltas) => void
): BeginMouseTrackingFn {
    const startMouseOffset = useRef({
        top: 0,
        left: 0
    });

    // Note about the following callbacks:
    // Their references MUST be stable,
    // as they're passed to `addEventListener` and `removeEventListener`
    // So their second argument must always be `[]`
    // If this were to change, the callbacks should be updated
    // to use local state for the created functions
    // Or mutable refs could be used to hold the callbacks
    const onMouseMove = useCallback((e: MouseEvent) => {
        const deltaY = startMouseOffset.current.top - e.clientY;
        const deltaX = startMouseOffset.current.left - e.clientX;

        onMove({
            deltaX,
            deltaY
        });

    // `onMouseMove` must have no dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }, [onMouseMove]);
    const startTrackingMouse = useCallback((e: MouseEventShape) => {
        onMouseDown(e);

        startMouseOffset.current.left = e.clientX;
        startMouseOffset.current.top = e.clientY;

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }, [onMouseDown, onMouseMove, onMouseUp]);

    return startTrackingMouse;
}
