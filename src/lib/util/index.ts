import type { JSONValue } from './types';

export const path = (...paths: string[]) => `/${paths.join('/')}`;

export const copy = (str: string) => navigator.clipboard.writeText(str);

export const clone = (object: JSONValue) => JSON.parse(JSON.stringify(object));

export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const debug = (...vals: any) => vals.forEach((val: any) => console.log(JSON.stringify(val, null, 4)));