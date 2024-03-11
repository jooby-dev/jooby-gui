import {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from '@mui/material';

import {
    UnfoldMore as UnfoldMoreIcon,
    UnfoldLess as UnfoldLessIcon,
    Delete as DeleteIcon,
    Share as ShareIcon
} from '@mui/icons-material';

import useCopyToClipboard from '../../hooks/useCopyToClipboard.js';

import LogList from '../LogList.jsx';
import IconButtonWithTooltip from '../IconButtonWithTooltip.jsx';

import {LOG_COUNT_LIMIT} from '../../constants.js';

import createShareableLogsLink from './utils/createShareableLogsLink.js';
import extractLogsFromUrl from './utils/extractLogsFromUrl.js';


const LogsPanel = ( {logs, setLogs} ) => {
    const [logsLimitExceededDialogOpen, setLogsLimitExceededDialogOpen] = useState(false);

    const copyToClipboard = useCopyToClipboard();

    useEffect(
        () => {
            const sharedLogs = extractLogsFromUrl();

            if ( sharedLogs ) {
                setLogs(sharedLogs);
            }
        },
        [setLogs]
    );

    const toggleAllLogs = ( event, expand ) => {
        event.stopPropagation();

        const updatedLogs = logs.map(log => {
            let nestedLogChanged = false;

            const updatedNestedLogs = log.data.commands.map(command => {
                if ( command.isExpanded !== expand ) {
                    nestedLogChanged = true;

                    return {...command, isExpanded: expand};
                }

                return command;
            });

            if ( log.isExpanded !== expand || nestedLogChanged ) {
                return {
                    ...log,
                    isExpanded: expand,
                    data: {
                        ...log.data,
                        commands: updatedNestedLogs
                    }
                };
            }

            return log;
        });

        setLogs(updatedLogs);
    };

    const handleShareLogsClick = useCallback(
        (event, logsData) => {
            event.stopPropagation();

            if ( logsData.length > LOG_COUNT_LIMIT ) {
                setLogsLimitExceededDialogOpen(true);

                return;
            }

            copyToClipboard(createShareableLogsLink(logsData), {
                message: 'Logs sharing link copied to clipboard'
            });
        },
        [copyToClipboard]
    );

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
                <Typography variant="h5">{logs.length === 0 ? 'Logs' : `Logs: ${logs.length}`}</Typography>

                <IconButtonWithTooltip
                    disabled={logs.length === 0}
                    title="Expand logs"
                    sx={{ml: 'auto'}}
                    onClick={event => toggleAllLogs(event, true)}
                >
                    <UnfoldMoreIcon/>
                </IconButtonWithTooltip>

                <IconButtonWithTooltip
                    disabled={logs.length === 0}
                    title="Collapse logs"
                    onClick={event => toggleAllLogs(event, false)}
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
                    onClick={() => setLogs([])}
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
                setLogs={setLogs}
                handleShareLogsClick={handleShareLogsClick}
            />
        </Box>
    );
};

LogsPanel.propTypes = {
    logs: PropTypes.array.isRequired,
    setLogs: PropTypes.func.isRequired
};


export default LogsPanel;
