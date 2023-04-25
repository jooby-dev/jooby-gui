import {useState, useEffect, useCallback} from 'react';

import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton,
    Typography
} from '@mui/material';

import {
    UnfoldMore as UnfoldMoreIcon, UnfoldLess as UnfoldLessIcon, Delete as DeleteIcon, Share as ShareIcon
} from '@mui/icons-material';

import {useSnackbar} from '../../contexts/SnackbarContext';

import LogList from '../LogList';

import {
    Log, SetLogs, HandleCopyToClipboard, HandleShareLogsClick, ExpandAllLogs, CollapseAllLogs,
    HandleLogsLimitExceededDialogClose
} from '../../types';

import {LOG_AMOUNT_LIMIT} from '../../constants';

import {createShareableLogsLink, extractLogsFromUrl} from './utils';


const LogsPanel = ({
    logs,
    setLogs
}: {
    logs: Array<Log>;
    setLogs: SetLogs;
}) => {
    const [logsLimitExceededDialogOpen, setLogsLimitExceededDialogOpen] = useState(false);
    const [expandedLogs, setExpandedLogs] = useState<Array<string>>([]);

    const {showSnackbar} = useSnackbar();

    useEffect(() => {
        const sharedLogs = extractLogsFromUrl();

        if (sharedLogs) {
            setLogs(sharedLogs);
        }
    }, [setLogs]);

    const collapseAllLogs: CollapseAllLogs = useCallback((event, ids) => {
        event.stopPropagation();
        setExpandedLogs(expandedLogs.filter((id) => !ids.includes(id)));
    }, [expandedLogs]);

    const expandAllLogs: ExpandAllLogs = useCallback((event, ids) => {
        event.stopPropagation();
        setExpandedLogs(Array.from(new Set([...expandedLogs, ...ids])));
    }, [expandedLogs]);

    const handleCopyToClipboard: HandleCopyToClipboard = useCallback(async (data, snackbarConfig) => {
        try {
            await navigator.clipboard.writeText(data);

            if (snackbarConfig) {
                showSnackbar(snackbarConfig);
            }
        } catch {
            showSnackbar({message: 'Failed to copy data to clipboard'});
        }
    }, [showSnackbar]);

    const handleShareLogsClick: HandleShareLogsClick = useCallback(async (event, logsData) => {
        event.stopPropagation();

        if (logsData.length > LOG_AMOUNT_LIMIT) {
            setLogsLimitExceededDialogOpen(true);

            return;
        }

        await handleCopyToClipboard(createShareableLogsLink(logsData), {message: 'Logs sharing link copied to clipboard'});
    }, [handleCopyToClipboard]);

    const handleClearLogsClick = () => {
        setLogs([]);
        setExpandedLogs([]);
    };

    const handleLogsLimitExceededDialogClose: HandleLogsLimitExceededDialogClose = () => {
        setLogsLimitExceededDialogOpen(false);
    };

    return (
        <Box sx={{
            flexGrow: 1,
            display:
            'flex',
            flexDirection:
            'column',
            gap: 2,
            borderLeftColor: 'divider',
            borderLeftWidth: 1,
            borderLeftStyle: 'solid',
            '& > *': {minWidth: 0}
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                p: 2,
                zIndex: 10,
                borderBottomColor: 'divider',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                backgroundColor: 'background.default',
                '& > *': {minWidth: 0}
            }}>
                <Typography variant="h5">{`Logs${logs.length > 0 ? `: (${logs.length})` : ''}`}</Typography>

                <IconButton
                    disabled={logs.length === 0}
                    aria-label="expand logs"
                    sx={{ml: 'auto'}}
                    onClick={event => expandAllLogs(event, logs.flatMap((log) => [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])]))}
                >
                    <UnfoldMoreIcon />
                </IconButton>

                <IconButton
                    disabled={logs.length === 0}
                    aria-label="collapse logs"
                    onClick={event => collapseAllLogs(event, logs.flatMap((log) => [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])]))}
                >
                    <UnfoldLessIcon />
                </IconButton>

                <IconButton
                    disabled={logs.length === 0}
                    aria-label="share log"
                    onClick={event => handleShareLogsClick(event, logs)}
                >
                    <ShareIcon />
                </IconButton>

                <IconButton
                    disabled={logs.length === 0}
                    aria-label="delete log"
                    onClick={handleClearLogsClick}
                >
                    <DeleteIcon />
                </IconButton>

                <Dialog
                    open={logsLimitExceededDialogOpen}
                    onClose={handleLogsLimitExceededDialogClose}
                    aria-labelledby="logs-limit-exceeded-dialog-title"
                >
                    <DialogTitle id="logs-limit-exceeded-dialog-title">
                        Logs limit exceeded
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`You can only share up to ${LOG_AMOUNT_LIMIT} logs.`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleLogsLimitExceededDialogClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <LogList
                logs={logs}
                expandedLogs={expandedLogs}
                setLogs={setLogs}
                setExpandedLogs={setExpandedLogs}
                handleCopyToClipboard={handleCopyToClipboard}
                handleShareLogsClick={handleShareLogsClick}
                expandAllLogs={expandAllLogs}
                collapseAllLogs={collapseAllLogs}
            />
        </Box>
    );
};


export default LogsPanel;
