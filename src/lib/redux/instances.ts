import { createEntityAdapter, createSelector, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

type Size = {
    width: number;
    height: number;
};

type VisibilityState = 'windowed' | 'maximized' | 'minimized';

export type WindowState = {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    top: number;
    left: number;
    visibleState: VisibilityState;
};

type NewInstance = {
    appId: string;
    title?: string;
    window?: WindowState;
    size?: Size;
};

export type Instance = NewInstance & {
    window: WindowState;
    id: number;
    zIndex: number;
};


// An excellent name of our accumulated genius,
// Dimensions by boo and Window by yours truly. WinDim
type WindowDimensions = {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
};

// Defaults
const defaultDimensions = {
    width: 300,
    height: 180,
    minWidth: 180,
    minHeight: 90
};

const getWindowDimensions = (lastWindowState?: WindowState, { width, height, minWidth, minHeight }: WindowDimensions = defaultDimensions): WindowState => {
    const { innerWidth, innerHeight } = window;
    const w = width < minWidth ? minWidth : width;
    const h = height < minHeight ? minHeight : height;

    let left = (lastWindowState?.left ?? 0) + 32;
    let top = (lastWindowState?.top ?? 0) + 32;

    if (left + w > innerWidth) {
        left = 12;
    }

    if (top + h > innerHeight) {
        top = 6;
    }

    return {
        width: w,
        height: h,
        minWidth,
        minHeight,
        left,
        top,
        visibleState: 'windowed'
    };
};

const instancesAdapter = createEntityAdapter<Instance, number>({
    selectId: (instance) => instance.id
});

const instances = createSlice({
    name: 'instances',
    initialState: instancesAdapter.getInitialState({
        lastId: 0,
        lastZIndex: 0,
        lastWindowState: undefined as WindowState | undefined
    }),
    reducers: {
        // getlastInstanceIndex(state, action: PayloadAction<>) {

        // },
        addInstance(state, action: PayloadAction<NewInstance>) {
            const newInstance = {
                ...action.payload,
                window: action.payload.window ?? getWindowDimensions(state.lastWindowState),
                id: ++state.lastId,
                zIndex: ++state.lastZIndex
            };
            instancesAdapter.addOne(state, newInstance);

            state.lastWindowState = newInstance.window;
        },
        addInstances(state, action: PayloadAction<{ instances: Instance[] }>) {
            instancesAdapter.setAll(state, action.payload.instances);
        },
        deleteInstance(state, action: PayloadAction<number>) {
            instancesAdapter.removeOne(state, action.payload);
        },
        focusInstance(state, action: PayloadAction<number>) {
            const entity = state.entities[action.payload];

            if (entity && entity.zIndex !== state.lastZIndex) {
                entity.zIndex = ++state.lastZIndex;
            }
        },
        updateInstanceWindow(state, action: PayloadAction<{ id: number; state: WindowState }>) {
            const entity = state.entities[action.payload.id];

            if (entity) {
                for (const key in action.payload.state) {
                    const _key = key as keyof WindowState;

                    entity.window = entity.window ?? {} as WindowState;
                    entity.window[_key] = action.payload.state[_key] as never;
                }

                state.lastWindowState = entity.window;
            }
        },
        minimizeByAppId(state, action: PayloadAction<EntityId>) {
            for (const id of state.ids) {
                const entity = state.entities[id]!;

                if (entity.appId !== action.payload) continue;

                entity.window.visibleState = 'minimized';
            }
        },
        openByAppId(state, action: PayloadAction<EntityId>) {
            for (const id of state.ids) {
                const entity = state.entities[id]!;

                if (entity.appId !== action.payload) continue;

                entity.window.visibleState = 'windowed';
            }
        },
        minimize(state, action: PayloadAction<EntityId>) {
            const entity = state.entities[action.payload];

            if (entity) {
                if (entity.window.visibleState !== 'minimized') {
                    entity.window.visibleState = 'minimized';
                } else {
                    entity.window.visibleState = 'windowed';
                }
            }
        },
        maximize(state, action: PayloadAction<EntityId>) {
            const entity = state.entities[action.payload];

            if (entity) {
                if (entity.window.visibleState !== 'maximized') {
                    entity.window.visibleState = 'maximized';
                } else {
                    entity.window.visibleState = 'windowed';
                }
            }
        }
    }
});

// export const { addInstance, addInstances, deleteInstance, focusInstance, updateInstanceWindow, minimizeByAppId, maximizeByAppId, minimize, maximize } = instances.actions;
export const { actions } = instances;

export const {
    selectAll: selectAllInstances,
    selectById: selectInstanceById,
    selectIds: selectInstanceIds
} = instancesAdapter.getSelectors<RootState>(
    (state) => state.instances
);

export const selectLastFocused = createSelector(
    (state: RootState) => state.instances,
    (state) => state.entities[state.lastZIndex]
);

export const selectLastWindowState = createSelector(
    (state: RootState) => state.instances,
    (state) => state.lastWindowState
);

export const selectByAppId = (appId: string) => createSelector(
    (state: RootState) => state.instances,
    (state) => Object.values(state.entities).filter((instance) => instance?.appId === appId)
);

export const selectInstancesByAppId = createSelector(
    [
        (state: RootState) => state.instances.entities,
        (_, appId: string) => appId
    ],
    (entities, appId) => Object.values(entities).filter((instance) => instance?.appId === appId)
);

export default instances.reducer;