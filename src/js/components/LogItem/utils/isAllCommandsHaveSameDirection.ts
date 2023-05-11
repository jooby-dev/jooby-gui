import {TLogCommands} from '../../../types.js';


export default (logCommands: TLogCommands) => (
    logCommands.every((logCommand, index, array) => (
        logCommand.command.directionType === undefined
        || logCommand.command.directionType === array[0].command.directionType
    ))
);
