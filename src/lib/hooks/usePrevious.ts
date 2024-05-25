import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T) {
    const ref = useRef<T>();

    const prevValue = ref.current;
    ref.current = value;

    return prevValue;
}

export function usePreviousRender<T>(value: T) {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
