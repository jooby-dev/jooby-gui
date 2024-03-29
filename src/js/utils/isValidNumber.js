export default ( value, minValue, maxValue ) => {
    const number = Number(value);

    return !Number.isNaN(number) && number >= minValue && number <= maxValue;
};
