import { usePrevious } from './usePrevious';

export function useOnChange<T>(callback: () => void, value: T[]) {
    const previous = usePrevious(value);

    if (previous !== undefined && previous.some((v, i) => v !== value[i])) {
        callback();
    }
}