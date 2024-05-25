import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AmountPayload = {
    amount: number;
};

const counter = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
        increment(state) {
            return state + 1;
        },
        incrementBy(state, action: PayloadAction<AmountPayload>) {
            return state + action.payload.amount;
        },
        decrement(state) {
            return state - 1;
        },
        decrementBy(state, action: PayloadAction<AmountPayload>) {
            return state - action.payload.amount;
        },
        reset() {
            return 0;
        }
    }
});

export const { increment, incrementBy, decrement, decrementBy, reset } = counter.actions;

export default counter.reducer;