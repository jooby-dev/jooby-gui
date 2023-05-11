import {ILogItem} from '../../../types.js';

import {LOG_TYPE_ERROR} from '../../../constants.js';

import isAllCommandsHaveSameDirection from './isAllCommandsHaveSameDirection.js';
import isAllCommandsUnknown from './isAllCommandsUnknown.js';
import getSubLogColor from './getSubLogColor.js';


export default (log: ILogItem): string => {
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
