import * as lzString from 'lz-string';


const HASH_START_INDEX = 1;
const LOGS_PARAM = 'logs';


export default () => {
    const hash = window.location.hash.substring(HASH_START_INDEX);
    const urlParams = new URLSearchParams(hash);
    const logsData = urlParams.get(LOGS_PARAM);

    if ( logsData ) {
        try {
            return JSON.parse(lzString.decompressFromEncodedURIComponent(logsData));
        } catch ( error ) {
            console.error('Error parsing logs from URL:', error);
        }
    }

    return null;
};
