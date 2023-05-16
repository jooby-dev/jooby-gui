import {TCommandType} from '../types.js';
import {directionNames} from '../constants.js';


export default (command: object | null, commandType: TCommandType) => (
    `https://jooby-dev.github.io/jooby-codec/stable/?page=${commandType}.commands.${directionNames[command.directionType]}.Class.${command.name}`
);
