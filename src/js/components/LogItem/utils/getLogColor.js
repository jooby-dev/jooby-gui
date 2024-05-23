import {LOG_TYPE_ERROR} from '../../../constants.js';

import getSubLogColor from './getSubLogColor.js';


export default log => {
    const direction = log.data?.commands?.[0].command?.directionType;
    const error = log.type === LOG_TYPE_ERROR
        || log.data.error
        || log.data.commands.some(command => command.command.error);

    return getSubLogColor(direction, error);
};
