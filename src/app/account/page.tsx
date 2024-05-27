'use client';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from '$lib/redux';
import { increment, decrement, reset, incrementBy, decrementBy } from '$lib/redux/counter';

export default function Counter() {
    const count = useSelector((state) => state.counter);
    const dispatch = useDispatch();

    const onIncrement = useCallback(() => {
        dispatch(increment());
    }, []);

    const onDecrement = useCallback(() => {
        dispatch(decrementBy({ amount: 2 }));
    }, []);

    const onReset = useCallback(() => {
        dispatch(reset());
    }, []);

    return (
        <div className="counter">
            <p>Current count: {count}</p>
            <button onClick={onIncrement}>Increment</button>
            <button onClick={onDecrement}>Decrement</button>
            <button onClick={onReset}>Reset</button>
        </div>
    );
}