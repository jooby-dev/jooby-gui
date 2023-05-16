import {useState, useEffect, useCallback} from 'react';

import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Typography
} from '@mui/material';

import {
    UnfoldMore as UnfoldMoreIcon, UnfoldLess as UnfoldLessIcon, Delete as DeleteIcon, Share as ShareIcon
} from '@mui/icons-material';

import {useSnackbar} from '../../contexts/SnackbarContext.js';

import LogList from '../LogList.js';
import IconButtonWithTooltip from '../IconButtonWithTooltip.js';

import {
    ILogItem, TSetLogs, THandleCopyToClipboard, THandleShareLogsClick, TExpandAllLogs, TCollapseAllLogs
} from '../../types.js';

import {LOG_COUNT_LIMIT} from '../../constants.js';

import createShareableLogsLink from './utils/createShareableLogsLink.js';
import extractLogsFromUrl from './utils/extractLogsFromUrl.js';


const LogsPanel = ({
    logs,
    setLogs
}: {
    logs: Array<ILogItem>;
    setLogs: TSetLogs;
}) => {
    const [logsLimitExceededDialogOpen, setLogsLimitExceededDialogOpen] = useState(false);
    const [expandedLogs, setExpandedLogs] = useState<Array<string>>([]);

    const {showSnackbar} = useSnackbar();

    useEffect(
        () => {
            const sharedLogs = extractLogsFromUrl();

            if (sharedLogs) {
                setLogs(sharedLogs);
            }
        },
        [setLogs]
    );

    const collapseAllLogs: TCollapseAllLogs = useCallback((event, ids) => {
        event.stopPropagation();
        setExpandedLogs(expandedLogs.filter((id) => !ids.includes(id)));
    }, [expandedLogs]);

    const expandAllLogs: TExpandAllLogs = useCallback((event, ids) => {
        event.stopPropagation();
        setExpandedLogs(Array.from(new Set([...expandedLogs, ...ids])));
    }, [expandedLogs]);

    const handleCopyToClipboard: THandleCopyToClipboard = useCallback((data, snackbarConfig) => {
        navigator.clipboard.writeText(data)
            .then(() => {
                if (snackbarConfig) {
                    showSnackbar(snackbarConfig);
                }
            })
            .catch(() => {
                showSnackbar({message: 'Failed to copy data to clipboard'});
            });
    }, [showSnackbar]);

    const handleShareLogsClick: THandleShareLogsClick = useCallback((event, logsData) => {
        event.stopPropagation();

        if (logsData.length > LOG_COUNT_LIMIT) {
            setLogsLimitExceededDialogOpen(true);

            return;
        }

        handleCopyToClipboard(createShareableLogsLink(logsData), {message: 'Logs sharing link copied to clipboard'});
    }, [handleCopyToClipboard]);

    const handleClearLogsClick = () => {
        setLogs([]);
        setExpandedLogs([]);
    };

    const handleLogsLimitExceededDialogClose = () => {
        setLogsLimitExceededDialogOpen(false);
    };

    return (
        <Box sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
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

                <IconButtonWithTooltip
                    disabled={logs.length === 0}
                    title="Expand logs"
                    sx={{ml: 'auto'}}
                    onClick={event => expandAllLogs(event, logs.flatMap((log) => [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])]))}
                >
                    <UnfoldMoreIcon/>
                </IconButtonWithTooltip>

                <IconButtonWithTooltip
                    disabled={logs.length === 0}
                    title="Collapse logs"
                    onClick={event => collapseAllLogs(event, logs.flatMap((log) => [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])]))}
                >
                    <UnfoldLessIcon/>
                </IconButtonWithTooltip>

                <IconButtonWithTooltip
                    disabled={logs.length === 0}
                    title="Share logs"
                    onClick={event => handleShareLogsClick(event, logs)}
                >
                    <ShareIcon/>
                </IconButtonWithTooltip>

                <IconButtonWithTooltip
                    disabled={logs.length === 0}
                    title="Delete logs"
                    onClick={handleClearLogsClick}
                >
                    <DeleteIcon/>
                </IconButtonWithTooltip>

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
                            {`You can only share up to ${LOG_COUNT_LIMIT} logs.`}
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
