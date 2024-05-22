import {Fragment} from 'react';
import * as joobyCodec from 'jooby-codec';
import {Box, Collapse, Tooltip} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';

import createDirectionIcon from '../../../utils/createDirectionIcon.jsx';
import hasLrc from '../../../utils/hasLrc.js';
import getHexFromNumber from '../../../utils/getHexFromNumber.js';

import HighlightedText from '../../HighlightedText.jsx';

import {LOG_TYPE_MESSAGE, LOG_TYPE_ERROR, LOG_TYPE_FRAME} from '../../../constants.js';


const renderHardwareType = ( hardwareType, commandType ) => {
    if ( !hardwareType ) {
        return null;
    }

    return (
        <>
            {'hardware type: '}
            <Tooltip title={`ID: ${joobyCodec[commandType].constants.hardwareTypes[hardwareType]}`}>
                <Box component="span">
                    <HighlightedText>{hardwareType}</HighlightedText>
                </Box>
            </Tooltip>
        </>
    );
};

const createLogTitle = log => {
    switch ( log.type ) {
        case LOG_TYPE_MESSAGE:
        case LOG_TYPE_FRAME: {
            const actualLrc = log.data.lrc?.actual;
            const expectedLrc = log.data.lrc?.expected;

            return (
                <>
                    {createDirectionIcon(log.data.commands[0].command.directionType)}
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            {'commands: '}
                            <HighlightedText>{log.data.commands.length}</HighlightedText>
                            {'; '}
                            {
                                hasLrc(log.commandType) && ( !actualLrc || !expectedLrc || actualLrc !== expectedLrc )
                                    ? (
                                        <>
                                            {'LRC expected: '}
                                            <HighlightedText isMonospacedFont={true}>
                                                {expectedLrc ? getHexFromNumber(expectedLrc) : 'n/a'}
                                            </HighlightedText>
                                            {', actual: '}
                                            <HighlightedText isMonospacedFont={true} color="error.main">
                                                {actualLrc ? getHexFromNumber(actualLrc) : 'n/a'}
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
                                in={!log.isExpanded}
                            >
                                {
                                    log.data.commands.map((commandData, index) => (
                                        <Fragment key={index}>
                                            <Box component="span" sx={{color: 'grey.700'}}>{commandData.command.name}</Box>
                                            {
                                                commandData.command.id && commandData.command.hasParameters
                                                    ? `: ${JSON.stringify(commandData.command.parameters)}`
                                                    : ''
                                            }
                                            {'; '}
                                        </Fragment>
                                    ))
                                }
                            </Collapse>
                        </Box>
                    </Box>
                </>
            );
        }

        case LOG_TYPE_ERROR:
            return (
                <>
                    <CloseIcon color="error" sx={{mr: 2}}/>
                    <Box>
                        <Box sx={{minWidth: 0}}>error</Box>
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
                                in={!log.isExpanded}
                            >
                                {log.error}
                            </Collapse>
                        </Box>
                    </Box>
                </>
            );

        default:
            throw new Error(`Unknown log type: ${log.type}`);
    }
};


export default createLogTitle;
