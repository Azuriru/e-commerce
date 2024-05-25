import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

// const _defaults = {
//     name: 'My App',
//     icon: '',
//     info: {
//         version: '0.0.1',
//         author: '',
//         date: 0
//     },
//     options: {
//         color: '',
//         maxSessions: 1,
//         docked: false,
//         pinned: false,
//         startup: false
//     },
//     window: {
//         width: 500,
//         height: 400,
//         minWidth: 300,
//         minHeight: 200,
//         state: 'windowed'
//     }
// };

type AppInfo = {
    version?: string;
    author?: string;
    date?: number;
};

type AppOptions = {
    color?: string;
    maxSessions?: string;
    docked?: boolean;
    pinned?: boolean;
    startup?: boolean;
};

type AppWindow = {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    state?: string;
};

export type App = {
    id: string;
    name?: string;
    icon?: string;
    info?: AppInfo;
    options?: AppOptions;
    window?: AppWindow;
};

const appsAdapter = createEntityAdapter<App, string>({
    selectId: (app) => app.id

    // sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const apps = createSlice({
    name: 'apps',
    initialState: appsAdapter.getInitialState(),
    reducers: {
        addApp: appsAdapter.addOne,
        addApps(state, action: PayloadAction<{ apps: App[] }>) {
            appsAdapter.addMany(state, action.payload.apps);
        }
    }
});

export const { addApp, addApps } = apps.actions;

export const { selectAll: selectAllApps, selectIds: selectAllAppIds } = appsAdapter.getSelectors<RootState>((state) => state.apps);

export default apps.reducer;