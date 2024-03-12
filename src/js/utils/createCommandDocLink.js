import {directionNames} from '../constants.js';


export default (command, commandType) => (
    `https://jooby-dev.github.io/jooby-codec/classes/${commandType}.commands.${directionNames[command.directionType]}.${command.name}.html`
);
