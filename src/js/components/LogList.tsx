import {useState, useCallback} from 'react';
import {Box} from '@mui/material';

import LogItem from './LogItem/LogItem.js';

import {
    TLogs, TParametersTab, THandleLogClick, THandleDeleteLogClick, THandleParametersTabChange,
    THandleCopyToClipboard, THandleShareLogsClick, TExpandAllLogs, TCollapseAllLogs, TSetLogs,
    TExpandedLogs
} from '../types.js';

import {PARAMETERS_TAB_VIEW_TYPE_TREE} from '../constants.js';


const LogList = ({
    logs,
    expandedLogs,
    setLogs,
    setExpandedLogs,
    handleCopyToClipboard,
    handleShareLogsClick,
    expandAllLogs,
    collapseAllLogs
}: {
    logs: TLogs;
    expandedLogs: TExpandedLogs;
    handleCopyToClipboard: THandleCopyToClipboard;
    handleShareLogsClick: THandleShareLogsClick;
    expandAllLogs: TExpandAllLogs;
    collapseAllLogs: TCollapseAllLogs;
    setLogs: TSetLogs;
    setExpandedLogs: (expandedLogs: TExpandedLogs) => void;
}) => {
    const [parametersTab, setParametersTab] = useState<TParametersTab>(PARAMETERS_TAB_VIEW_TYPE_TREE);

    const handleParametersTabChange: THandleParametersTabChange = useCallback((event, newValue) => {
        setParametersTab(newValue);
    }, []);

    const handleDeleteLogClick: THandleDeleteLogClick = useCallback((event, id) => {
        event.stopPropagation();

        const newLogs = [...logs];
        const deletedLogIndex = newLogs.findIndex(log => log.id === id);
        const deletedLog = newLogs[deletedLogIndex];
        const deletedLogIds = [deletedLog.id, ...(deletedLog.data ? deletedLog.data.commands.map((commandData) => commandData.id) : [])];

        newLogs.splice(deletedLogIndex, 1);
        setLogs(newLogs);
        setExpandedLogs(expandedLogs.filter((expandedLogId) => !deletedLogIds.includes(expandedLogId)));
    }, [logs, setLogs, setExpandedLogs, expandedLogs]);

    const handleLogClick: THandleLogClick = useCallback((id) => {
        const index = expandedLogs.indexOf(id);

        if (index === -1) {
            setExpandedLogs([...expandedLogs, id]);
        } else {
            const newExpanded = [...expandedLogs];

            newExpanded.splice(index, 1);
            setExpandedLogs(newExpanded);
        }
    }, [expandedLogs, setExpandedLogs]);

    return (
        <Box sx={{mb: 2, px: 2, '& > *': {minWidth: 0}}}>
            {logs.length > 0 && logs.map((log) => (
                <LogItem
                    key={log.id}
                    log={log}
                    expandedLogs={expandedLogs}
                    handleLogClick={handleLogClick}
                    handleDeleteLogClick={handleDeleteLogClick}
                    handleParametersTabChange={handleParametersTabChange}
                    parametersTab={parametersTab}
                    handleCopyToClipboard={handleCopyToClipboard}
                    handleShareLogsClick={handleShareLogsClick}
                    expandAllLogs={expandAllLogs}
                    collapseAllLogs={collapseAllLogs}
                />
            ))}
        </Box>
    );
};


export default LogList;
