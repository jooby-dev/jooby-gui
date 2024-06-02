import {useCallback} from 'react';


const useLogActions = setLogs => {
    const toggleLog = useCallback(
        logId => {
            setLogs(prevLogs => {
                const updatedLogs = prevLogs.map(prevLog => {
                    if ( prevLog.id !== logId ) {
                        return prevLog;
                    }

                    return {
                        ...prevLog,
                        isExpanded: !prevLog.isExpanded
                    };
                });

                return updatedLogs;
            });
        },
        [setLogs]
    );

    const toggleLogAndNested = useCallback(
        ( event, logId, isLogExpanded = true ) => {
            event.stopPropagation();

            setLogs(prevLogs => {
                const updatedLogs = prevLogs.map(prevLog => {
                    if ( prevLog.id !== logId ) {
                        return prevLog;
                    }

                    return {
                        ...prevLog,
                        isExpanded: isLogExpanded,
                        data: {
                            ...prevLog.data,
                            commands: prevLog.data.commands.map(command => ({
                                ...command,
                                isExpanded: isLogExpanded
                            }))
                        }
                    };
                });

                return updatedLogs;
            });
        },
        [setLogs]
    );

    const toggleNestedLog = useCallback(
        ( logId, nestedLogId ) => {
            setLogs(prevLogs => {
                const updatedLogs = prevLogs.map(prevLog => {
                    if ( prevLog.id !== logId ) {
                        return prevLog;
                    }

                    return {
                        ...prevLog,
                        data: {
                            ...prevLog.data,
                            commands: prevLog.data.commands.map(command => {
                                if ( command.id !== nestedLogId ) {
                                    return command;
                                }

                                return {
                                    ...command,
                                    isExpanded: !command.isExpanded
                                };
                            })
                        }
                    };
                });

                return updatedLogs;
            });
        },
        [setLogs]
    );

    const handleDeleteLogClick = useCallback(
        ( event, logId ) => {
            event.stopPropagation();

            setLogs(prevLogs => prevLogs.filter(prevLog => prevLog.id !== logId));
        },
        [setLogs]
    );

    return {
        toggleLog,
        toggleLogAndNested,
        toggleNestedLog,
        handleDeleteLogClick
    };
};

export default useLogActions;
