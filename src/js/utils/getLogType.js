import {LOG_TYPE_ERROR, LOG_TYPE_FRAME, LOG_TYPE_MESSAGE, COMMAND_TYPE_MTX} from '../constants.js';


export default ( commandType, error ) => {
    if ( error ) {
        return LOG_TYPE_ERROR;
    }

    if ( commandType === COMMAND_TYPE_MTX ) {
        return LOG_TYPE_FRAME;
    }

    return LOG_TYPE_MESSAGE;
};
