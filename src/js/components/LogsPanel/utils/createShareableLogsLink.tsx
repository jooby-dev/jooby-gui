import * as lzString from 'lz-string';
import {Log} from '../../../types';


export const createShareableLogsLink = (logs: Array<Log>): string => (
    `${window.location.origin}/jooby-gui?logs=${lzString.compressToEncodedURIComponent(JSON.stringify(logs))}`
);
