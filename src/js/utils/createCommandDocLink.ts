import {TCommandType} from '../types.js';
import {directionNames} from '../constants.js';


export default (command: object | null, commandType: TCommandType) => (
    `https://jooby-dev.github.io/jooby-codec/classes/${commandType}.commands.${directionNames[command.directionType]}.${command.name}.html`
);
