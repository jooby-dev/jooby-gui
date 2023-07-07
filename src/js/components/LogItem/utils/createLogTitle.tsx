import {Fragment, ReactElement} from 'react';
import * as joobyCodec from 'jooby-codec';
import {Box, Collapse, Tooltip} from '@mui/material';
import {Close as CloseIcon, QuestionMark as QuestionMarkIcon, SyncAlt as SyncAltIcon} from '@mui/icons-material';

import createCommandDirectionIcon from '../../../utils/createCommandDirectionIcon.js';
import hasLrc from '../../../utils/hasLrc.js';

import HighlightedText from '../../../components/HighlightedText.js';

import {ILogItem, TExpandedLogs, TLogCommands, TCommandType} from '../../../types.js';

import {LOG_TYPE_MESSAGE, LOG_TYPE_ERROR} from '../../../constants.js';

import isAllCommandsUnknown from './isAllCommandsUnknown.js';
import isAllCommandsHaveSameDirection from './isAllCommandsHaveSameDirection.js';


const createMessageDirectionIcon = (logCommands: TLogCommands, commandType: TCommandType) => {
    if (isAllCommandsUnknown(logCommands)) {
        return <QuestionMarkIcon sx={{mr: 2, color: 'grey.700'}}/>;
    }

    // commands have a different direction in the message
    if (!isAllCommandsHaveSameDirection(logCommands)) {
        return <SyncAltIcon color="error" sx={{mr: 2, transform: 'rotate(90deg)'}}/>;
    }

    return createCommandDirectionIcon(logCommands.find(logCommand => logCommand.command.directionType !== undefined).command, commandType);
};

const renderHardwareType = (hardwareType: ILogItem['hardwareType'], commandType: TCommandType) => {
    if (!hardwareType) {
        return null;
    }

    return (
        <>
            {'hardware type: '}
            <Tooltip title={`ID: ${joobyCodec[commandType].constants.hardwareTypes[hardwareType]}`}>
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
                    {createMessageDirectionIcon(log.data.commands, log.commandType)}
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            {'commands: '}
                            <HighlightedText>{log.data.commands.length}</HighlightedText>
                            {'; '}
                            {
                                hasLrc(log.commandType) &&
                                log.data.lrc.expected !== log.data.lrc.actual
                                    ? (
                                        <>
                                            {'LRC expected: '}
                                            <HighlightedText isMonospacedFont={true}>
                                                {joobyCodec.utils.getHexFromNumber(log.data.lrc.expected, {prefix: '0x'})}
                                            </HighlightedText>
                                            {', actual: '}
                                            <HighlightedText isMonospacedFont={true} color="error.main">
                                                {joobyCodec.utils.getHexFromNumber(log.data.lrc.actual, {prefix: '0x'})}
                                            </HighlightedText>
                                            {'; '}
                                        </>
                                    )
                                    : null
                            }
                            {renderHardwareType(log.hardwareType, log.commandType)}
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
                        {renderHardwareType(log.hardwareType, log.commandType)}
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
