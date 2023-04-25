import {LogCommands} from '../../../types';


export const isAllCommandsHaveSameDirection = (logCommands: LogCommands) => (
    logCommands.every((logCommand, index, array) => (
        logCommand.command.directionType === undefined
        || logCommand.command.directionType === array[0].command.directionType
    ))
);
