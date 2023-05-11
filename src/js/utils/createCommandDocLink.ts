import {directions} from '../constants.js';


export default (command: object | null) => (
    `https://jooby-dev.github.io/jooby-codec/stable/?page=commands.${directions[command.directionType]}.Class.${command.name}`
);
