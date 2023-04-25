import {useState, useCallback} from 'react';
import {Box} from '@mui/material';

import LogItem from './LogItem';

import {
    Logs, ParametersTab, HandleLogClick, HandleDeleteLogClick, HandleParametersTabChange,
    HandleCopyToClipboard, HandleShareLogsClick, ExpandAllLogs, CollapseAllLogs, SetLogs,
    SetExpandedLogs, ExpandedLogs
} from '../types';

import {PARAMETERS_TAB_VIEW_TYPE_TREE} from '../constants';


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
    logs: Logs;
    expandedLogs: ExpandedLogs;
    handleCopyToClipboard: HandleCopyToClipboard;
    handleShareLogsClick: HandleShareLogsClick;
    expandAllLogs: ExpandAllLogs;
    collapseAllLogs: CollapseAllLogs;
    setLogs: SetLogs;
    setExpandedLogs: SetExpandedLogs;
}) => {
    const [parametersTab, setParametersTab] = useState<ParametersTab>(PARAMETERS_TAB_VIEW_TYPE_TREE);

    const handleParametersTabChange: HandleParametersTabChange = useCallback((event, newValue) => {
        setParametersTab(newValue);
    }, []);

    const handleDeleteLogClick: HandleDeleteLogClick = useCallback((event, id) => {
        event.stopPropagation();

        const newLogs = [...logs];
        const deletedLogIndex = newLogs.findIndex(log => log.id === id);
        const deletedLog = newLogs[deletedLogIndex];
        const deletedLogIds = [deletedLog.id, ...(deletedLog.data ? deletedLog.data.commands.map((commandData) => commandData.id) : [])];

        newLogs.splice(deletedLogIndex, 1);
        setLogs(newLogs);
        setExpandedLogs(expandedLogs.filter((expandedLogId) => !deletedLogIds.includes(expandedLogId)));
    }, [logs, setLogs, setExpandedLogs, expandedLogs]);

    const handleLogClick: HandleLogClick = useCallback((id) => {
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
