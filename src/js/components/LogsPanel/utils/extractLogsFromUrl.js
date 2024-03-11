import * as lzString from 'lz-string';


export default () => {
    const urlParams = new URLSearchParams(window.location.search);
    const logsData = urlParams.get('logs');

    if ( logsData ) {
        try {
            return JSON.parse(lzString.decompressFromEncodedURIComponent(logsData));
        } catch ( error ) {
            console.error('Error parsing logs from URL:', error);
        }
    }

    return null;
};
