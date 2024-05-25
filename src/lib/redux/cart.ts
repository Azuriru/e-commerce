import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartPayload = {
    id: number;
};

type CartPayloadModify = {
    quantity: number;
};

const cart = createSlice({
    name: 'cart',
    initialState: {} as Cart,
    reducers: {
        add(state, action: PayloadAction<CartPayload>) {
            const { id } = action.payload;
            const current = state[id] ?? 0;

            return {
                ...state,
                [id]: current + 1
            };
        },
        subtract(state, action: PayloadAction<CartPayload>) {
            const { id } = action.payload;
            const current = state[id] ?? 0;

            if (current - 1 === 0) {
                const { [id]: _, ..._state } = state;

                return _state;
            }

            return {
                ...state,
                [id]: current - 1
            };
        },
        remove(state, action: PayloadAction<CartPayload>) {
            const { [action.payload.id]: _, ..._state } = state;

            return _state;
        },
        modify(state, action: PayloadAction<CartPayload & CartPayloadModify>) {
            const { id, quantity } = action.payload;

            if (!quantity) {
                const { [id]: _, ..._state } = state;

                return _state;
            }

            return {
                ...state,
                [id]: quantity
            };
        },
        empty() {
            return {};
        }
    }
});

export const { add, subtract, remove, modify, empty } = cart.actions;

export default cart.reducer;