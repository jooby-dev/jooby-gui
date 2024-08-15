import isMtx from './isMtx.js';
import {logTypes, commandTypes, framingFormats} from '../constants/index.js';


export default ( commandType, error, framingFormat ) => {
    if ( error ) {
        return logTypes.ERROR;
    }

    if ( isMtx(commandType, framingFormat) ) {
        return logTypes.FRAME;
    }

    return logTypes.MESSAGE;
};
