import {logTypes} from '../../../constants/index.js';


export default ( {type, data} ) => type === logTypes.ERROR
    || !!data.error
    || (data.commands?.length && !!data.commands.some(command => command.command.error));
