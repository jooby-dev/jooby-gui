import {memo} from 'react';
import {JSONTree} from 'react-json-tree';

import {
    Box, IconButton, Typography, Accordion, AccordionSummary, AccordionDetails, Link,
    Tooltip, Tab
} from '@mui/material';

import {TabContext, TabList, TabPanel} from '@mui/lab';

import {
    ExpandMore as ExpandMoreIcon, Delete as DeleteIcon, Share as ShareIcon, UnfoldMore as UnfoldMoreIcon,
    UnfoldLess as UnfoldLessIcon, ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

import IconButtonWithTooltip from '../IconButtonWithTooltip';

import {
    Log, ParametersTab, HandleLogClick, HandleDeleteLogClick, HandleParametersTabChange,
    HandleCopyToClipboard, HandleShareLogsClick, ExpandAllLogs, CollapseAllLogs, ExpandedLogs
} from '../../types';

import {
    LOG_TYPE_ERROR, PARAMETERS_TAB_VIEW_TYPE_JSON, PARAMETERS_TAB_VIEW_TYPE_TREE
} from '../../constants';

import {
    getSubLogColor, getLogColor, createSubLogTitle, createLogTitle, createCommandHeaderDocLink
} from './utils';

import {JSONTreeTheme} from './constants';


const LogItem = ({
    log,
    expandedLogs,
    handleLogClick,
    handleDeleteLogClick,
    handleParametersTabChange,
    parametersTab,
    handleCopyToClipboard,
    handleShareLogsClick,
    expandAllLogs,
    collapseAllLogs
}: {
    log: Log;
    expandedLogs: ExpandedLogs;
    handleLogClick: HandleLogClick;
    handleDeleteLogClick: HandleDeleteLogClick;
    handleParametersTabChange: HandleParametersTabChange;
    parametersTab: ParametersTab;
    handleCopyToClipboard: HandleCopyToClipboard;
    handleShareLogsClick: HandleShareLogsClick;
    expandAllLogs: ExpandAllLogs;
    collapseAllLogs: CollapseAllLogs;
}) => {
    const {buffer, data, date, errorMessage, type, id} = log;

    if (type === LOG_TYPE_ERROR) {
        return (
            <Accordion
                sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
                key={id}
                expanded={expandedLogs.includes(id)}
                onChange={() => handleLogClick(id)}
            >
                <AccordionSummary
                    content="div"
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${id}bh-content`}
                    sx={{
                        backgroundColor: `${getLogColor(log)}`,
                        '& > *': {minWidth: 0},
                        '& .MuiAccordionSummary-expandIconWrapper': {flex: '0 0 auto'}
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center', width: '100%', '& > *': {minWidth: 0}}}>
                        <Box sx={{
                            flexShrink: 1,
                            display: 'flex',
                            alignItems: 'center',
                            '& > *': {minWidth: 0}
                        }}>
                            {createLogTitle(log, expandedLogs)}
                        </Box>

                        <Box sx={{
                            color: 'grey.500',
                            ml: 'auto',
                            mr: 2,
                            pl: 2,
                            flex: '0 0 auto',
                            fontSize: '0.8rem'
                        }}>
                            {date}
                        </Box>

                        <IconButtonWithTooltip
                            title="Expand log"
                            onClick={event => expandAllLogs(event, [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])])}
                        >
                            <UnfoldMoreIcon />
                        </IconButtonWithTooltip>

                        <IconButtonWithTooltip
                            title="Collapse log"
                            onClick={event => collapseAllLogs(event, [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])])}
                        >
                            <UnfoldLessIcon />
                        </IconButtonWithTooltip>

                        <IconButtonWithTooltip
                            title="Share log"
                            onClick={event => handleShareLogsClick(event, [log])}
                        >
                            <ShareIcon />
                        </IconButtonWithTooltip>

                        <IconButtonWithTooltip
                            title="Delete log"
                            onClick={event => handleDeleteLogClick(event, id)}
                        >
                            <DeleteIcon />
                        </IconButtonWithTooltip>
                    </Box>
                </AccordionSummary>
                {
                    expandedLogs.includes(id) && (
                        <AccordionDetails>
                            {
                                buffer && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            {'Dump '}
                                            <IconButtonWithTooltip
                                                title="Copy dump"
                                                onClick={() => handleCopyToClipboard(
                                                    buffer,
                                                    {message: 'Message dump copied to clipboard'}
                                                )}
                                            >
                                                <ContentCopyIcon />
                                            </IconButtonWithTooltip>
                                        </Typography>
                                        <Typography sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>{buffer}</Typography>
                                    </>
                                )
                            }
                            <Typography variant="h6" gutterBottom>Error</Typography>
                            <Box>{errorMessage}</Box>
                        </AccordionDetails>
                    )
                }
            </Accordion>
        );
    }

    return (
        <Accordion
            sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
            key={id}
            expanded={expandedLogs.includes(id)}
            onChange={() => handleLogClick(id)}
        >
            <AccordionSummary
                content="div"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${id}bh-content`}
                sx={{
                    backgroundColor: `${getLogColor(log)}`,
                    '& > *': {minWidth: 0},
                    '& .MuiAccordionSummary-expandIconWrapper': {flex: '0 0 auto'}
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', width: '100%', '& > *': {minWidth: 0}}}>
                    <Box sx={{
                        flexShrink: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '& > *': {minWidth: 0}
                    }}>
                        {createLogTitle(log, expandedLogs)}
                    </Box>

                    <Box sx={{
                        color: 'grey.500',
                        ml: 'auto',
                        mr: 2,
                        pl: 2,
                        flex: '0 0 auto',
                        fontSize: '0.8rem'
                    }}>
                        {date}
                    </Box>

                    <IconButtonWithTooltip
                        title="Expand log"
                        onClick={event => expandAllLogs(event, [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])])}
                    >
                        <UnfoldMoreIcon />
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip
                        title="Collapse log"
                        onClick={event => collapseAllLogs(event, [log.id, ...(log.data ? log.data.commands.map((commandData) => commandData.id) : [])])}
                    >
                        <UnfoldLessIcon />
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Delete log" onClick={event => handleShareLogsClick(event, [log])}>
                        <ShareIcon />
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Share log" onClick={event => handleDeleteLogClick(event, id)}>
                        <DeleteIcon />
                    </IconButtonWithTooltip>
                </Box>
            </AccordionSummary>
            {
                expandedLogs.includes(id) && (
                    <AccordionDetails>
                        <Typography variant="h6" gutterBottom>
                            {'Dump '}
                            <IconButtonWithTooltip
                                title="Copy dump"
                                onClick={() => handleCopyToClipboard(
                                    buffer,
                                    {message: 'Message dump copied to clipboard'}
                                )}
                            >
                                <ContentCopyIcon />
                            </IconButtonWithTooltip>
                        </Typography>
                        <Typography sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>{buffer}</Typography>

                        {data.commands.length > 0 && data.commands.map((commandData: object) => (
                            <Accordion
                                sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
                                key={commandData.id}
                                expanded={expandedLogs.includes(commandData.id)}
                                onChange={() => handleLogClick(commandData.id)}
                            >
                                <AccordionSummary
                                    content="div"
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${commandData.id}bh-content`}
                                    sx={{
                                        alignItems: 'center',
                                        backgroundColor: `${getSubLogColor(commandData)}`,
                                        '& > *': {minWidth: 0},
                                        '& .MuiAccordionSummary-expandIconWrapper': {flex: '0 0 auto'}
                                    }}
                                >
                                    <Box sx={{
                                        flexShrink: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        minWidth: 0,
                                        mr: 2,
                                        '& > *': {minWidth: 0}
                                    }}>
                                        {createSubLogTitle(commandData, expandedLogs)}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="h6" gutterBottom>
                                        {'Dump '}
                                        <IconButtonWithTooltip
                                            title="Copy dump"
                                            onClick={() => handleCopyToClipboard(
                                                `${commandData.data.header.hex} ${commandData.data.body.hex}`,
                                                {message: 'Command dump copied to clipboard'}
                                            )}
                                        >
                                            <ContentCopyIcon />
                                        </IconButtonWithTooltip>
                                    </Typography>
                                    <Typography sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>
                                        <>
                                            <Link
                                                href={createCommandHeaderDocLink(commandData.data.header.length)}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={event => event.stopPropagation()}
                                            >
                                                {commandData.data.header.hex}
                                            </Link>
                                            {' '}
                                            {commandData.data.body.hex}
                                        </>
                                    </Typography>
                                    {
                                        commandData.command.id !== undefined && commandData.command.hasParameters && (
                                            <>
                                                <Typography variant="h6" gutterBottom>
                                                    {'Parameters '}
                                                    <IconButtonWithTooltip
                                                        title="Copy parameters in JSON format"
                                                        onClick={() => handleCopyToClipboard(
                                                            JSON.stringify(commandData.command.parameters, null, 4),
                                                            {message: 'Parameters copied to clipboard'}
                                                        )}
                                                    >
                                                        <ContentCopyIcon />
                                                    </IconButtonWithTooltip>
                                                </Typography>

                                                <TabContext value={parametersTab}>
                                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                                        <TabList onChange={handleParametersTabChange} aria-label="Display command parameters in tree, JSON view">
                                                            <Tab label={PARAMETERS_TAB_VIEW_TYPE_TREE} value={PARAMETERS_TAB_VIEW_TYPE_TREE} />
                                                            <Tab label={PARAMETERS_TAB_VIEW_TYPE_JSON} value={PARAMETERS_TAB_VIEW_TYPE_JSON} />
                                                        </TabList>
                                                    </Box>
                                                    <TabPanel value={PARAMETERS_TAB_VIEW_TYPE_TREE}>
                                                        <Box sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>
                                                            <JSONTree
                                                                data={commandData.command.parameters}
                                                                theme={JSONTreeTheme}
                                                                invertTheme={false}
                                                                hideRoot={true}
                                                                shouldExpandNodeInitially={() => true}
                                                            />
                                                        </Box>
                                                    </TabPanel>
                                                    <TabPanel value={PARAMETERS_TAB_VIEW_TYPE_JSON}>
                                                        <Typography component="pre" sx={{fontFamily: 'Roboto Mono, monospace', whiteSpace: 'pre-wrap'}}>
                                                            {JSON.stringify(commandData.command.parameters, null, 4)}
                                                        </Typography>
                                                    </TabPanel>
                                                </TabContext>
                                            </>
                                        )
                                    }
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionDetails>
                )
            }
        </Accordion>
    );
};


export default memo(LogItem);
