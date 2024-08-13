import * as lzString from 'lz-string';


export default logs => (
    `${window.location.origin}/jooby-gui#logs=${lzString.compressToEncodedURIComponent(JSON.stringify(logs))}`
);
