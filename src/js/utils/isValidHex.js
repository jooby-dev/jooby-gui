import cleanHexString from './cleanHexString.js';


export default ( hex, expectedLengthBytes ) => {
    const cleanHex = cleanHexString(hex).toUpperCase();

    if ( !/^[0-9A-F]*$/.test(cleanHex) ) {
        return false;
    }

    return cleanHex.length / 2 === expectedLengthBytes;
};
