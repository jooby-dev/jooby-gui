import {TLogCommands} from '../../../types.js';

export default (logCommands: TLogCommands) => (
    logCommands.every(logCommand => logCommand.command.directionType === undefined)
);
