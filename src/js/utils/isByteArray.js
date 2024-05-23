export default array => {
    if ( !Array.isArray(array) ) {
        return false;
    }

    return array.every(number => Number.isInteger(number) && number >= 0 && number <= 255);
};
