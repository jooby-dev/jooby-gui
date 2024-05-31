import {logTypes, commandTypes} from '../constants/index.js';


export default ( commandType, error ) => {
    if ( error ) {
        return logTypes.ERROR;
    }

    if ( commandType === commandTypes.MTX ) {
        return logTypes.FRAME;
    }

    return logTypes.MESSAGE;
};
