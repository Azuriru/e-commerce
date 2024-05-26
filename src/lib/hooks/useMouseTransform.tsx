import { useState, useCallback, useRef, useMemo, type RefObject } from 'react';
import useMouseTracker from './useMouseTracker.old';
import assert from 'assertmin';
import { shallowMerge } from '../util/object';

export type Size = {
    width: number;
    height: number;
};

type InitialOffset = {
    top: number;
    left: number;
};

enum Direction {
    Up = 1,
    Down = 2,
    Right = 4,
    Left = 8
}

type MouseTransformOptions = {
    minSize?: Size;
    initialSize?: Size;
    initialOffset?: InitialOffset;
};

export default function useMouseTransform(
    elementRef: RefObject<HTMLElement>,
    options: MouseTransformOptions
) {
    const { minSize, initialSize, initialOffset } = options;

    const [size, setSize] = useState(initialSize);
    const [offset, setOffset] = useState(initialOffset);

    // These are instance variables
    // They're used to keep track of the initial positions of `draggable`
    // and the mouse when the user starts dragging
    // They're not state because they're used in the mouse move callbacks
    // and they must always get the latest value, and their identity
    // must be stable
    const startSize = useRef({
        width: 0,
        height: 0
    });
    const startOffset = useRef({
        top: 0,
        left: 0
    });

    const storeStartOffsets = useCallback((e) => {
        e.preventDefault();

        if (!elementRef.current) return;

        const bounds = elementRef.current.getBoundingClientRect();

        startSize.current.width = bounds.width;
        startSize.current.height = bounds.height;

        startOffset.current.top = offset?.top ?? 0;
        startOffset.current.left = offset?.left ?? 0;
    }, [offset, elementRef]);

    const startTrackingMouseDrag = useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
        setOffset({
            top: startOffset.current.top - deltaY,
            left: startOffset.current.left - deltaX
        });
    });

    const useMouseResizeTracking = (direction: Direction) => {
        const onMouseMove = useCallback(({ deltaX, deltaY }) => {
            const { width, height } = startSize.current;
            const { top, left } = startOffset.current;

            let newHeight: number | undefined;
            let newWidth: number | undefined;
            let newTop: number | undefined;
            let newLeft: number | undefined;

            // Set and update the dimensions variables as needed
            // Up and left are special, as they must handle position
            // and size at the same time
            if (direction & Direction.Up) {
                newHeight = height + deltaY;
                newTop = top - deltaY;
            }

            if (direction & Direction.Down) {
                newHeight = height - deltaY;
            }

            if (direction & Direction.Left) {
                newLeft = left - deltaX;
                newWidth = width + deltaX;
            }

            if (direction & Direction.Right) {
                newWidth = width - deltaX;
            }

            // If the caller has provided minimum sizes, we must clamp them in our js
            // We only have to do this in the "up" and "left" directions, because
            // those are the directions that impact the translation transform
            // Therefore we can't just rely on min-height and min-width to deal with it
            if (minSize !== undefined) {
                if (direction & Direction.Up) {
                    assert.unchecked(newHeight !== undefined);
                    assert.unchecked(newTop !== undefined);

                    const clampedHeight = Math.max(minSize.height, newHeight);
                    newTop -= clampedHeight - newHeight;
                    newHeight = clampedHeight;
                }

                if (direction & Direction.Down) {
                    assert.unchecked(newHeight !== undefined);

                    const clampedHeight = Math.max(minSize.height, newHeight);
                    newHeight = clampedHeight;
                }

                if (direction & Direction.Left) {
                    assert.unchecked(newWidth !== undefined);
                    assert.unchecked(newLeft !== undefined);

                    const clampedWidth = Math.max(minSize.width, newWidth);
                    newLeft -= clampedWidth - newWidth;
                    newWidth = clampedWidth;
                }

                if (direction & Direction.Right) {
                    assert.unchecked(newWidth !== undefined);

                    const clampedWidth = Math.max(minSize.width, newWidth);
                    newWidth = clampedWidth;
                }
            }

            // Only set the state when a relevant field has been updated
            if (newWidth !== undefined || newHeight !== undefined) {
                setSize((size) => shallowMerge(size, {
                    width: newWidth ?? size?.width ?? 0,
                    height: newHeight ?? size?.height ?? 0
                }));
            }
            if (newTop !== undefined || newLeft !== undefined) {
                setOffset((offset) => shallowMerge(offset, {
                    top: newTop ?? offset?.top ?? 0,
                    left: newLeft ?? offset?.left ?? 0
                }));
            }
        }, [direction]);

        return useMouseTracker(storeStartOffsets, onMouseMove);
    };

    const useStyles = (rest: any) => {
        return useMemo(() => {
            return {
                transform: `translate(${offset?.left ?? 0}px, ${offset?.top ?? 0}px)`,

                // minWidth: minSize?.width,
                // minHeight: minSize?.height,
                width: size?.width ?? initialSize?.width,
                height: size?.height ?? initialSize?.height,
                ...rest
            };

        // This is wrong.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [rest, size, offset]);
    };

    return {
        size,
        offset,
        startTrackingMouseDrag,
        startTrackingMouseResizeTop: useMouseResizeTracking(Direction.Up),
        startTrackingMouseResizeTopRight: useMouseResizeTracking(Direction.Up | Direction.Right),
        startTrackingMouseResizeRight: useMouseResizeTracking(Direction.Right),
        startTrackingMouseResizeBottomRight: useMouseResizeTracking(Direction.Down | Direction.Right),
        startTrackingMouseResizeBottom: useMouseResizeTracking(Direction.Down),
        startTrackingMouseResizeBottomLeft: useMouseResizeTracking(Direction.Down | Direction.Left),
        startTrackingMouseResizeLeft: useMouseResizeTracking(Direction.Left),
        startTrackingMouseResizeTopLeft: useMouseResizeTracking(Direction.Up | Direction.Left),
        useStyles
    };
}