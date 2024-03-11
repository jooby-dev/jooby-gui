import {memo} from 'react';
import PropTypes from 'prop-types';
import {JSONTree} from 'react-json-tree';

import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tab,
    Chip
} from '@mui/material';

import {TabContext, TabList, TabPanel} from '@mui/lab';
import {
    ExpandMore as ExpandMoreIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    UnfoldMore as UnfoldMoreIcon,
    UnfoldLess as UnfoldLessIcon,
    ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

import useCopyToClipboard from '../../hooks/useCopyToClipboard.js';

import IconButtonWithTooltip from '../IconButtonWithTooltip.jsx';

import {
    LOG_TYPE_ERROR,
    PARAMETERS_TAB_VIEW_TYPE_JSON,
    PARAMETERS_TAB_VIEW_TYPE_TREE
} from '../../constants.js';

import getSubLogColor from './utils/getSubLogColor.js';
import getLogColor from './utils/getLogColor.js';
import createSubLogTitle from './utils/createSubLogTitle.jsx';
import createLogTitle from './utils/createLogTitle.jsx';
import modifyTime2000Properties from './utils/modifyTime2000Properties.js';

import {JSONTreeTheme} from './constants.js';

const LogItem = ({
    log,
    parametersTab,
    setParametersTab,
    setLogs,
    handleShareLogsClick
}) => {
    const {
        hex, data, date, errorMessage, type, id, isExpanded
    } = log;

    const copyToClipboard = useCopyToClipboard();

    const toggleLog = logId => {
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
    };

    const toggleLogAndNested = ( event, logId, isLogExpanded = true ) => {
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
    };

    const toggleNestedLog = ( logId, nestedLogId ) => {
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
    };

    const handleDeleteLogClick = ( event, logId ) => {
        event.stopPropagation();

        setLogs(prevLogs => prevLogs.filter(prevLog => prevLog.id !== logId));
    };

    if ( type === LOG_TYPE_ERROR ) {
        return (
            <Accordion
                sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
                key={id}
                expanded={isExpanded}
                onChange={() => toggleLog(id)}
            >
                <AccordionSummary
                    content="div"
                    expandIcon={<ExpandMoreIcon/>}
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
                            {createLogTitle(log)}
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

                        <IconButtonWithTooltip title="Expand log" onClick={event => toggleLogAndNested(event, id)}>
                            <UnfoldMoreIcon/>
                        </IconButtonWithTooltip>

                        <IconButtonWithTooltip title="Collapse log" onClick={event => toggleLogAndNested(event, id, false)}>
                            <UnfoldLessIcon/>
                        </IconButtonWithTooltip>

                        <IconButtonWithTooltip title="Share log" onClick={event => handleShareLogsClick(event, [log])}>
                            <ShareIcon/>
                        </IconButtonWithTooltip>

                        <IconButtonWithTooltip title="Delete log" onClick={event => handleDeleteLogClick(event, id)}>
                            <DeleteIcon/>
                        </IconButtonWithTooltip>
                    </Box>
                </AccordionSummary>
                {
                    isExpanded && (
                        <AccordionDetails>
                            {
                                hex && (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            {'Dump '}
                                            <IconButtonWithTooltip
                                                title="Copy dump"
                                                onClick={() => copyToClipboard(
                                                    hex,
                                                    {message: 'Message dump copied to clipboard'}
                                                )}
                                            >
                                                <ContentCopyIcon/>
                                            </IconButtonWithTooltip>
                                        </Typography>
                                        <Typography sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>{hex}</Typography>
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
            expanded={isExpanded}
            onChange={() => toggleLog(id)}
        >
            <AccordionSummary
                content="div"
                expandIcon={<ExpandMoreIcon/>}
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
                        {createLogTitle(log)}
                    </Box>

                    <Box sx={{
                        color: 'grey.500',
                        ml: 'auto',
                        mr: 2,
                        pl: 2,
                        flex: '0 0 auto',
                        fontSize: '0.8rem'
                    }}>
                        <Box sx={{display: 'flex', justifyContent: 'end'}}>{date}</Box>
                        <Box sx={{display: 'flex', justifyContent: 'end', gap: 1}}>
                            {log.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    variant="filled"
                                    size="small"
                                    sx={{color: 'grey.500'}}
                                />
                            ))}
                        </Box>
                    </Box>

                    <IconButtonWithTooltip title="Expand log" onClick={event => toggleLogAndNested(event, id)}>
                        <UnfoldMoreIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Collapse log" onClick={event => toggleLogAndNested(event, id, false)}>
                        <UnfoldLessIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Share log" onClick={event => handleShareLogsClick(event, [log])}>
                        <ShareIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Delete log" onClick={event => handleDeleteLogClick(event, id)}>
                        <DeleteIcon/>
                    </IconButtonWithTooltip>
                </Box>
            </AccordionSummary>
            {
                isExpanded && (
                    <AccordionDetails>
                        <Typography variant="h6" gutterBottom>
                            {'Dump '}
                            <IconButtonWithTooltip
                                title="Copy dump"
                                onClick={() => copyToClipboard(
                                    hex,
                                    {message: 'Message dump copied to clipboard'}
                                )}
                            >
                                <ContentCopyIcon/>
                            </IconButtonWithTooltip>
                        </Typography>
                        <Typography sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>{hex}</Typography>

                        {data.commands.length > 0 && data.commands.map(commandData => (
                            <Accordion
                                sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
                                key={commandData.id}
                                expanded={commandData.isExpanded}
                                onChange={() => toggleNestedLog(id, commandData.id)}
                            >
                                <AccordionSummary
                                    content="div"
                                    expandIcon={<ExpandMoreIcon/>}
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
                                        {createSubLogTitle(commandData, log.commandType)}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="h6" gutterBottom>
                                        {'Dump '}
                                        <IconButtonWithTooltip
                                            title="Copy dump"
                                            onClick={() => copyToClipboard(
                                                commandData.command.hex,
                                                {message: 'Command dump copied to clipboard'}
                                            )}
                                        >
                                            <ContentCopyIcon/>
                                        </IconButtonWithTooltip>
                                    </Typography>
                                    <Typography sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>{commandData.command.hex}</Typography>
                                    {
                                        commandData.command.id !== undefined && commandData.command.hasParameters && (
                                            <>
                                                <Typography variant="h6" gutterBottom>
                                                    {'Parameters '}
                                                    <IconButtonWithTooltip
                                                        title="Copy parameters in JSON format"
                                                        onClick={() => copyToClipboard(
                                                            JSON.stringify(commandData.command.parameters, null, 4),
                                                            {message: 'Parameters copied to clipboard'}
                                                        )}
                                                    >
                                                        <ContentCopyIcon/>
                                                    </IconButtonWithTooltip>
                                                </Typography>

                                                <TabContext value={parametersTab}>
                                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                                        <TabList
                                                            onChange={(event, value) => setParametersTab(value)}
                                                            aria-label="Display command parameters in tree, JSON view"
                                                        >
                                                            <Tab label={PARAMETERS_TAB_VIEW_TYPE_TREE} value={PARAMETERS_TAB_VIEW_TYPE_TREE}/>
                                                            <Tab label={PARAMETERS_TAB_VIEW_TYPE_JSON} value={PARAMETERS_TAB_VIEW_TYPE_JSON}/>
                                                        </TabList>
                                                    </Box>
                                                    <TabPanel value={PARAMETERS_TAB_VIEW_TYPE_TREE}>
                                                        <Box sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>
                                                            <JSONTree
                                                                data={modifyTime2000Properties(commandData.command.parameters)}
                                                                theme={JSONTreeTheme}
                                                                invertTheme={false}
                                                                hideRoot={true}
                                                                shouldExpandNodeInitially={() => true}
                                                            />
                                                        </Box>
                                                    </TabPanel>
                                                    <TabPanel value={PARAMETERS_TAB_VIEW_TYPE_JSON}>
                                                        <Typography
                                                            component="pre"
                                                            sx={{fontFamily: 'Roboto Mono, monospace', whiteSpace: 'pre-wrap'}}
                                                        >
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

LogItem.propTypes = {
    log: PropTypes.object.isRequired,
    parametersTab: PropTypes.oneOf([PARAMETERS_TAB_VIEW_TYPE_TREE, PARAMETERS_TAB_VIEW_TYPE_JSON]),
    setParametersTab: PropTypes.func.isRequired,
    setLogs: PropTypes.func.isRequired,
    handleShareLogsClick: PropTypes.func.isRequired
};


export default memo(LogItem);
