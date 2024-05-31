import {directionNames} from '../constants/index.js';


export default (command, commandType) => (
    `https://jooby-dev.github.io/jooby-codec/modules/${commandType}.commands.${directionNames[command.directionType]}.${command.name}.html`
);
