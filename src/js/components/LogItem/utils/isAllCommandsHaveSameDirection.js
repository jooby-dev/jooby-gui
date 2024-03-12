export default logCommands => logCommands.every(
    (logCommand, index, array) => (
        logCommand.command.directionType === undefined
        || logCommand.command.directionType === array[0].command.directionType
    )
);
