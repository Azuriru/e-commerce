export function copy<T>(array: T[]): T[] {
    const copy = array.slice();

    return copy;
}

export function sortBy<T>(array: T[], match: T[]): T[] {
    const final = copy(array);

    return final.sort((a, b) => {
        const ia = match.indexOf(a);
        if (ia === -1) return 1;

        const ib = match.indexOf(b);
        if (ib === -1) return -1;

        return ia - ib;
    });
}

export function removeIndex<T>(array: T[], index: number): T[] {
    if (index !== -1) {
        const clone = copy(array);
        clone.splice(index, 1);

        return clone;
    }

    return array;
}

export function removeByIndex<T>(array: T[], findIndex: (item: T) => boolean): T[] {
    const index = array.findIndex(findIndex);

    if (index !== -1) {
        const clone = copy(array);
        clone.splice(index, 1);

        return clone;
    }

    return array;
}

export function updateByIndex<T>(array: T[], findIndex: (item: T) => boolean, updater: (item: T) => T): T[] {
    const index = array.findIndex(findIndex);

    if (index !== -1) {
        const clone = copy(array);
        clone[index] = updater(clone[index]);

        return clone;
    }

    return array;
}

export function append<T>(array: T[], ...items: T[]): T[] {
    const clone = copy(array);
    clone.push(...items);

    return clone;
}

export function insertAt<T>(array: T[], index: number, ...items: T[]): T[] {
    const clone = copy(array);
    clone.splice(index, 0, ...items);

    return clone;
}

export function insertBeforeIndex<T>(array: T[], findIndex: (item: T) => boolean, ...items: T[]): T[] {
    const index = array.findIndex(findIndex);

    if (index !== -1) {
        return insertAt(array, index, ...items);
    }

    return array;
}

export function insertAfterIndex<T>(array: T[], findIndex: (item: T) => boolean, ...items: T[]): T[] {
    const index = array.findIndex(findIndex);

    if (index !== -1) {
        return insertAt(array, index + 1, ...items);
    }

    return array;
}

export function appender<T>(item: T) {
    return (arr: T[]) => append(arr, item);
}

export function shuffle<T>(array: T[]): T[] {
    const clone = copy(array);
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
    }

    return clone;
}