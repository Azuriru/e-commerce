type RecordKey = number | string | symbol;

/**
 * An updater function that takes an item and returns a function that will take
 * an object, and extend it with the item you passed.
 * It's useful when you must extend some state with an object and that object
 * does not depend on the existing state.
 *
 * Example usage:
 * ```ts
 * setSelectedItem(updater({ active: true }));
 * ```
 *
 * @param item The item to extend into the original object
 * @returns A function that will take an original object and return it extended
 */
export function updater<T, K extends RecordKey>(item: T): (original: Record<string, T>) => T {
    return (original: Record<K, T>) => ({ ...original, ...item });
}

/**
 * Merges two objects shallowly.
 * This function will return the source object if no shallow properties changed.
 *
 * @param src The source object
 * @param merge The object to merge into the source
 * @returns The source object if no properties changed, otherwise a new merged object
 */
export function shallowMerge<K extends RecordKey, V>(src: Record<K, V> | undefined, merge: Record<K, V>) {
    if (src === undefined) return merge;

    let cpy: Record<K, V> | undefined;

    for (const key in merge) {
        if (src[key] !== merge[key]) {
            cpy = cpy ?? { ...src };

            cpy[key] = merge[key];
        }
    }

    if (cpy === undefined) {
        return src;
    } else {
        return cpy;
    }
}