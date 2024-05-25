import { useCallback, useRef, useState } from "react";

type StateSetter<T> = (newState: T) => void;

// This hook keeps setState calls in sync with a mutable reference,
// and returns a pair to an updating stable callback and the contenst of the ref
// This is necessary because effects fired with dependencies on derived state
// don't have properly updating closure instances of such derived state
// i.e. it's not the latest data
export default function useRealState<T>(initialState: T): [T, StateSetter<T>] {
    const [baseState, setState] = useState(initialState);
    const realState = useRef(baseState);

    const setRealState = useCallback((newState: T) => {
        realState.current = newState;
        setState(newState);
    }, []);


    return [realState.current, setRealState];
}
