export default source => Object.fromEntries(
    Object
        .entries(source)
        .map(([key, value]) => [value, key])
);
