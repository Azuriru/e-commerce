export type ValueOf<T> = T[keyof T];

export type JSONValue = null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };

export type Booleanish = boolean | 'true' | 'false';

export type ObjectProperty = number | string; // no sane person uses Symbol, ok.