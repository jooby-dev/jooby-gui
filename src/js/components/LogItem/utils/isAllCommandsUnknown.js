export default logCommands => logCommands.every(
    logCommand => logCommand.command.directionType === undefined
);
