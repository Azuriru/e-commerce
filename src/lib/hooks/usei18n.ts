type Scope = {
    [k: string]: Scope;
};

const globalScope: Scope = {};

export default function useI18n() {
    const load = (scopes: Scope, key: string) => {
        if (!globalScope.hasOwnProperty(key)) {
            globalScope[key] = scopes;
        }
    };

    const msg = (scope: string): string => {
        const path = scope.split('.');
        let value: Scope = globalScope;

        for (const key of path) {
            if (!value.hasOwnProperty(key)) {
                return `Missing scope: ${scope}`;
            }

            value = value[key];
        }

        return value;
    };

    return {
        load,
        msg
    };
}
