import {Log} from '../../../types';
import {LOG_TYPE_ERROR} from '../../../constants';
import {isAllCommandsHaveSameDirection, isAllCommandsUnknown, getSubLogColor} from './';


export const getLogColor = (log: Log): string => {
    if (log.type === LOG_TYPE_ERROR) {
        return 'error.light';
    }

    if (isAllCommandsUnknown(log.data.commands)) {
        return 'grey.100';
    }

    if (!isAllCommandsHaveSameDirection(log.data.commands)) {
        return 'error.light';
    }

    return getSubLogColor(log.data.commands.find(logCommand => logCommand.command.directionType !== undefined));
};
