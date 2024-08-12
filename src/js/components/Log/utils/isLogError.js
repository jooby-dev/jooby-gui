import {logTypes} from '../../../constants/index.js';


export default log => log.type === logTypes.ERROR
    || !!log.data.error
    || !!log.data.commands.some(command => command.command.error);
