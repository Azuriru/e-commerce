import { useCallback, useLayoutEffect, useRef } from 'react';

export function useEvent(handler: (...args: any) => void) {
    const handlerRef = useRef<(...args: any) => void>(null as unknown as (...args: any) => void);

    // In a real implementation, this would run before layout effects
    useLayoutEffect(() => {
        handlerRef.current = handler;
    });

    return useCallback((...args: any) => {
        // In a real implementation, this would throw if called during render
        const fn = handlerRef.current;

        return fn(...args);
    }, []);
}