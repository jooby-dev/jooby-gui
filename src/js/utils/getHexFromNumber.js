export default ( number, withPrefix = true, withSpace = false ) => {
    let hex = number.toString(16);

    hex = hex.length % 2 === 0 ? hex : `0${hex}`;

    if ( withSpace ) {
        hex = hex.match(/.{2}/g).join(' ');
    }

    return withPrefix ? `0x${hex}` : hex;
};
