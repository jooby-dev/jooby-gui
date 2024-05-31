import {logTypes} from '../../../constants/index.js';

import getSubLogColor from './getSubLogColor.js';


export default log => {
    const direction = log.data?.commands?.[0]?.command?.directionType;
    const error = log.type === logTypes.ERROR
        || log.data.error
        || log.data.commands.some(command => command.command.error);

    return getSubLogColor(direction, error);
};
