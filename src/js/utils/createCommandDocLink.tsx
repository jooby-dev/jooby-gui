import {Command} from '../types';
import {directions} from '../constants';


export const createCommandDocLink = (command: Command) => (
    `https://jooby-dev.github.io/jooby-codec/stable/?page=commands.${directions[command.directionType]}.Class.${command.name}`
);
