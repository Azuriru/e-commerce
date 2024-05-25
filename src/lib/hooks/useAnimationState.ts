import { useLayoutEffect, useRef } from "react";
import { useEvent } from "./useEvent";
import { usePrevious } from "./usePrevious";
import useRealState from "./useRealState";

type AnimationState = 'starting' | 'running' | 'ended';

export function useAnimationState(status: string, shouldHide?: boolean) {
    const [ state, setState ] = useRealState<AnimationState>('starting');
    // const realState = useRef(state);

    const previousStatus = usePrevious(status);
    if (previousStatus !== status) {
        console.log('sync update', previousStatus, status);
        setState('starting');
    }

    const ref = useRef<HTMLElement>(null);

    const startTransition = useEvent(() => {
        setState('starting');
    });
    const endTransition = useEvent(() => {
        setState('ended');
    });

    useLayoutEffect(() => {
        if (state === 'starting') {
            console.log('starting reflowing', ref.current);

            if (ref.current) {
                ref.current.scrollHeight;
            }

            setState('running');
        }
    }, [setState, state]);

    return {
        ref,
        state,
        shouldShow: state === 'starting' || state === 'running' || state === 'ended',
        shouldAnimate: state === 'running' || state === 'ended' || (state === 'starting' && shouldHide),
        shouldRemove: shouldHide && state === 'ended' && previousStatus === status,
        startTransition,
        endTransition
    };
}
