import {LogCommands} from '../../../types';

export const isAllCommandsUnknown = (logCommands: LogCommands) => (
    logCommands.every(logCommand => logCommand.command.directionType === undefined)
);
