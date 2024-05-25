import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as useReactSelector, useDispatch as useReactDispatch } from 'react-redux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import counter from './counter';
import cart from './cart';
import apps from './apps';
import instances from './instances';

import { useStore as useReduxStore } from 'react-redux';

const reducers = combineReducers({
    counter,
    cart,
    apps,
    instances
});
const persistConfig = {
    key: 'root',
    version: 1,
    storage
};
const reducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReactSelector;
export const useDispatch: () => StoreDispatch = useReactDispatch;
export const useStore = () => useReduxStore<RootState>();

export const persistor = persistStore(store);