const normalizeCommandParameters = object => {
    if ( Array.isArray(object) ) {
        return object.map(normalizeCommandParameters);
    }

    if (
        object instanceof Uint8Array
        || object instanceof Int8Array
        || object instanceof Uint16Array
        || object instanceof Int16Array
        || object instanceof Uint32Array
        || object instanceof Int32Array
        || object instanceof Float32Array
        || object instanceof Float64Array
    ) {
        return Array.from(object);
    }

    if ( object !== null && typeof object === 'object' ) {
        return Object.keys(object).reduce(
            (accumulator, key) => {
                accumulator[key] = normalizeCommandParameters(object[key]);

                return accumulator;
            },
            {}
        );
    }

    return object;
};


export default normalizeCommandParameters;
