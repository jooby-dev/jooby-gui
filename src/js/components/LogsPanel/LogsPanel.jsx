import {useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Typography
} from '@mui/material';

import {styled} from '@mui/material/styles';

import {
    UnfoldMore as UnfoldMoreIcon,
    UnfoldLess as UnfoldLessIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    FileDownload as FileDownloadIcon,
    FileUpload as FileUploadIcon
} from '@mui/icons-material';

import useCopyToClipboard from '../../hooks/useCopyToClipboard.js';

import LogList from '../LogList.jsx';
import IconButtonWithTooltip from '../IconButtonWithTooltip.jsx';

import createShareableLogsLink from './utils/createShareableLogsLink.js';
import extractLogsFromUrl from './utils/extractLogsFromUrl.js';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
});


const LogsPanel = ( {logs, setLogs} ) => {
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
            let updatedCommands;

            if ( log.data ) {
                updatedCommands = log.data.commands.map(command => {
                    if ( command.isExpanded !== expand ) {
                        nestedLogChanged = true;

                        return {...command, isExpanded: expand};
                    }

                    return command;
                });
            }

            if ( log.isExpanded !== expand || nestedLogChanged ) {
                return {
                    ...log,
                    isExpanded: expand,
                    data: log.data ? {...log.data, commands: updatedCommands} : undefined
                };
            }

            return log;
        });

        setLogs(updatedLogs);
    };

    const handleShareLogsClick = useCallback(
        (event, logsData) => {
            event.stopPropagation();

            copyToClipboard(createShareableLogsLink(logsData), {
                message: 'Logs sharing link copied to clipboard'
            });
        },
        [copyToClipboard]
    );

    const handleExportLogs = () => {
        const now = new Date();
        const formattedDate = now.toLocaleString('en-GB', {hour12: false}).replace(/[/:]/g, '-').replace(/,\s*/g, '_');
        const fileName = `logs-${formattedDate}.json`;

        const blob = new Blob([JSON.stringify(logs, null, 4)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportLogs = event => {
        const file = event.target.files[0];

        if ( file ) {
            const reader = new FileReader();

            reader.onload = readerEvent => {
                try {
                    const importedLogs = JSON.parse(readerEvent.target.result);

                    setLogs(importedLogs);
                } catch ( error ) {
                    console.error('Error importing logs:', error);
                }
            };

            reader.readAsText(file);
        }
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

                <IconButtonWithTooltip
                    title="Export logs"
                    onClick={handleExportLogs}
                    disabled={!logs.length}
                >
                    <FileDownloadIcon/>
                </IconButtonWithTooltip>

                <IconButtonWithTooltip
                    title="Import logs"
                    component="label"
                >
                    <FileUploadIcon/>
                    <VisuallyHiddenInput type="file" accept=".json" onChange={handleImportLogs}/>
                </IconButtonWithTooltip>
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
