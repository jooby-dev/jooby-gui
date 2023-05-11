import {Fragment, ReactElement} from 'react';
import {constants} from 'jooby-codec';
import {Box, Collapse, Tooltip} from '@mui/material';
import {Close as CloseIcon, QuestionMark as QuestionMarkIcon, SyncAlt as SyncAltIcon} from '@mui/icons-material';

import createCommandDirectionIcon from '../../../utils/createCommandDirectionIcon.js';

import HighlightedText from '../../../components/HighlightedText.js';

import {ILogItem, TExpandedLogs, TLogCommands} from '../../../types.js';

import {LOG_TYPE_MESSAGE, LOG_TYPE_ERROR} from '../../../constants.js';

import decimalToHex from './decimalToHex.js';
import isAllCommandsUnknown from './isAllCommandsUnknown.js';
import isAllCommandsHaveSameDirection from './isAllCommandsHaveSameDirection.js';


const createMessageDirectionIcon = (logCommands: TLogCommands) => {
    if (isAllCommandsUnknown(logCommands)) {
        return <QuestionMarkIcon sx={{mr: 2, color: 'grey.700'}}/>;
    }

    // commands have a different direction in the message
    if (!isAllCommandsHaveSameDirection(logCommands)) {
        return <SyncAltIcon color="error" sx={{mr: 2, transform: 'rotate(90deg)'}}/>;
    }

    return createCommandDirectionIcon(logCommands.find(logCommand => logCommand.command.directionType !== undefined).command.directionType);
};

const renderHardwareType = (hardwareType: ILogItem['hardwareType']) => {
    if (!hardwareType) {
        return null;
    }

    return (
        <>
            {'hardware type: '}
            <Tooltip title={`ID: ${constants.hardwareTypes[hardwareType]}`}>
                <Box component="span">
                    <HighlightedText>
                        {hardwareType}
                    </HighlightedText>
                </Box>
            </Tooltip>
        </>
    );
};


const createLogTitle = (log: ILogItem, expandedLogs: TExpandedLogs): ReactElement => {
    switch (log.type) {
        case LOG_TYPE_MESSAGE:
            return (
                <>
                    {createMessageDirectionIcon(log.data.commands)}
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            {'commands: '}
                            <HighlightedText>{log.data.commands.length}</HighlightedText>
                            {'; '}
                            {
                                log.data.lrc.expected !== log.data.lrc.actual
                                    ? (
                                        <>
                                            {'LRC expected: '}
                                            <HighlightedText isMonospacedFont={true}>{decimalToHex(log.data.lrc.expected)}</HighlightedText>
                                            {', actual: '}
                                            <HighlightedText isMonospacedFont={true} color="error.main">
                                                {decimalToHex(log.data.lrc.actual)}
                                            </HighlightedText>
                                            {'; '}
                                        </>
                                    )
                                    : null
                            }
                            {renderHardwareType(log.hardwareType)}
                        </Box>

                        <Box sx={{
                            fontWeight: 'fontWeightRegular',
                            fontSize: '0.75rem',
                            color: 'grey.500',
                            fontFamily: 'Roboto Mono, monospace',
                            minWidth: 0
                        }}>
                            <Collapse
                                sx={{
                                    '& .MuiCollapse-wrapperInner': {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                                in={!expandedLogs.includes(log.id)}
                            >
                                {
                                    log.data.commands.map((commandData, index) => (
                                        <Fragment key={index}>
                                            <Box component="span" sx={{color: 'grey.700'}}>{commandData.command.name}</Box>
                                            {commandData.command.id && commandData.command.hasParameters ? `: ${JSON.stringify(commandData.command.parameters)}` : ''}
                                            {'; '}
                                        </Fragment>
                                    ))
                                }
                            </Collapse>
                        </Box>
                    </Box>
                </>
            );

        case LOG_TYPE_ERROR:
            return (
                <>
                    <CloseIcon color="error" sx={{mr: 2}}/>
                    <Box>
                        {renderHardwareType(log.hardwareType)}
                        <Box sx={{
                            fontWeight: 'fontWeightRegular',
                            fontSize: '0.75rem',
                            color: 'grey.500',
                            fontFamily: 'Roboto Mono, monospace',
                            minWidth: 0
                        }}>
                            <Collapse
                                sx={{
                                    '& .MuiCollapse-wrapperInner': {
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }
                                }}
                                in={!expandedLogs.includes(log.id)}
                            >
                                {log.errorMessage}
                            </Collapse>
                        </Box>
                    </Box>
                </>
            );
    }
};


export default createLogTitle;
