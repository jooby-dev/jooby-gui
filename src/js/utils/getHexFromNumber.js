export default ( number, withPrefix = true, withSpace = false ) => {
    let hex = number.toString(16);

    hex = hex.length % 2 === 0 ? hex : `0${hex}`;

    if ( withSpace ) {
        hex = hex.match(/.{2}/g).join(' ');
    }

    if ( withPrefix ) {
        hex = withSpace
            ? hex.split(' ').map(segment => `0x${segment}`).join(' ')
            : `0x${hex}`;
    }

    return hex;
};
