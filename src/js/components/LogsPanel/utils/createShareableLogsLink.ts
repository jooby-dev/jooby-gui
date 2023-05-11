import * as lzString from 'lz-string';
import {ILogItem} from '../../../types.js';


export default (logs: Array<ILogItem>): string => (
    `${window.location.origin}/jooby-gui?logs=${lzString.compressToEncodedURIComponent(JSON.stringify(logs))}`
);
