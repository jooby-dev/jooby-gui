import {ReactElement} from 'react';
import {Box, Collapse, Tooltip} from '@mui/material';
import {Close as CloseIcon, QuestionMark as QuestionMarkIcon, SyncAlt as SyncAltIcon} from '@mui/icons-material';
import HighlightedText from '../../../components/HighlightedText';
import {Log, ExpandedLogs, LogCommands} from '../../../types';
import {LOG_TYPE_MESSAGE, LOG_TYPE_ERROR} from '../../../constants';
import {
    decimalToHex, isAllCommandsUnknown, isAllCommandsHaveSameDirection, createSubLogArrowIcon
} from './';


const createLogArrowIcon = (logCommands: LogCommands) => {
    if (isAllCommandsUnknown(logCommands)) {
        return <QuestionMarkIcon sx={{mr: 2, color: 'grey.700'}} />;
    }

    // commands have a different direction in the message
    if (!isAllCommandsHaveSameDirection(logCommands)) {
        return <SyncAltIcon color="error" sx={{mr: 2, transform: 'rotate(90deg)'}} />;
    }

    return createSubLogArrowIcon(logCommands.find(logCommand => logCommand.command.directionType !== undefined).command.directionType);
};

export const renderHardwareType = (hardwareType: Log['hardwareType']) => {
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


export const createLogTitle = (log: Log, expandedLogs: ExpandedLogs): ReactElement => {
    switch (log.type) {
        case LOG_TYPE_MESSAGE:
            return (
                <>
                    {createLogArrowIcon(log.data.commands)}
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
                                    log.data.commands.map(commandData => (
                                        <>
                                            <Box component="span" sx={{color: 'grey.700'}}>{commandData.command.name}</Box>
                                            {commandData.command.id && commandData.command.hasParameters ? `: ${JSON.stringify(commandData.command.parameters)}` : ''}
                                            {'; '}
                                        </>
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
                    <CloseIcon color="error" sx={{mr: 2}} />
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
