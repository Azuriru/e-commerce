export const padStart = (str: any, num: number, fill = ' ') => str.toString().padStart(num, fill);

export const padEnd = (str: any, num: number, fill = ' ') => str.toString().padEnd(num, fill);

export const startsWith = (str: string, char: string) => str.startsWith(char);

export const endsWith = (str: string, char: string) => str.endsWith(char);

export const capitalize = (str: string, num = 1) => `${str.slice(0, num).toUpperCase()}${str.slice(num)}`;

export const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const stringify = (str: string) => normalize(str).toLowerCase().replace(/ /g, '-');

export const color = (str: string) => str.slice(4, -1).split(', ').map(Number);

export const hsl = (str: string) => str.slice(4, -1).split(', ').map((s) => parseInt(s));

export const needsChars = (str: string) => str.length < 8;

export const needsUpperCase = (str: string) => str.toLowerCase() === str;

export const needsLowerCase = (str: string) => str.toUpperCase() === str;

export const needsSymbol = (str: string) => str.replace(/[a-z0-9]/gi, '') === '';

export const needsNumber = (str: string) => str.replace(/[^0-9]/g, '') === '';

export const needsMatch = (str: string, str2: string) => str === str2;

export const needsNormalize = (str: string) => str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') === str;

export const validateEmail = (email: string) => {
    if (!email) return;

    return null !== email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};