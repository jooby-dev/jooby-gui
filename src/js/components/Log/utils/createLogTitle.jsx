import {Fragment} from 'react';
import {Box, Collapse, Tooltip} from '@mui/material';
import {Close as CloseIcon} from '@mui/icons-material';
import {frameTypes} from 'jooby-codec/mtx1/constants/index.js';
import invertObject from 'jooby-codec/utils/invertObject.js';

import createDirectionIcon from '../../../utils/createDirectionIcon.jsx';
import removeQuotes from '../../../utils/removeQuotes.js';

import HighlightedText from '../../HighlightedText.jsx';

import {commandTypeConfigMap} from '../../../joobyCodec.js';
import {logTypes} from '../../../constants/index.js';


const frameNamesByType = invertObject(frameTypes);

const renderHardwareType = ( hardwareType, commandType ) => {
    if ( !hardwareType ) {
        return null;
    }

    const {hardwareTypeList} = commandTypeConfigMap[commandType];
    const hardwareTypeName = hardwareTypeList.find(({value}) => value === hardwareType).label;

    return (
        <>
            {'hardware type: '}
            <Tooltip title={`ID: ${hardwareType}`}>
                <Box component="span">
                    <HighlightedText fontWeight="normal">{hardwareTypeName}</HighlightedText>
                </Box>
            </Tooltip>
        </>
    );
};

const renderCommands = commands => {
    if ( !commands?.length ) {
        return null;
    }

    return (
        <>
            {'commands: '}
            <HighlightedText fontWeight="normal">{commands.length}</HighlightedText>
        </>
    );
};

const renderFrameType = frameParameters => {
    if ( !frameParameters?.type ) {
        return null;
    }

    return (
        <>
            {'frame type: '}
            <HighlightedText fontWeight="normal">{frameNamesByType[frameParameters.type]}</HighlightedText>
        </>
    );
};

const buildLogTitleParts = log => {
    const {data: {commands}, frameParameters} = log;
    const frameTypePart = renderFrameType(frameParameters);
    const commandsPart = renderCommands(commands);
    const hardwareTypePart = renderHardwareType(log.hardwareType, log.commandType);
    const parts = [];

    if ( frameTypePart ) {
        parts.push(frameTypePart);
    }

    if ( commandsPart ) {
        parts.push(commandsPart);
    }

    if ( hardwareTypePart ) {
        parts.push(hardwareTypePart);
    }

    return parts;
};

const createLogTitle = log => {
    switch ( log.type ) {
        case logTypes.MESSAGE:
        case logTypes.FRAME: {
            const {commands} = log.data;
            const parts = buildLogTitleParts(log);

            return (
                <>
                    {createDirectionIcon(log.directionType)}
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            <HighlightedText>{log.commandType}</HighlightedText>
                            {parts.length > 0 && (
                                <>
                                    {' ('}
                                    {parts.flatMap((part, index) => (index === 0 ? [part] : ['; ', part]))}
                                    {')'}
                                </>
                            )}
                        </Box>

                        {commands?.length && (
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
                                    {commands.map(({command}, index) => (
                                        <Fragment key={index}>
                                            <Box component="span" sx={{color: 'grey.700'}}>{command.name}</Box>
                                            {
                                                command.id && command.hasParameters
                                                    ? `: ${removeQuotes(JSON.stringify(command.parameters))}`
                                                    : ''
                                            }
                                            {'; '}
                                        </Fragment>
                                    ))}
                                </Collapse>
                            </Box>
                        )}
                    </Box>
                </>
            );
        }

        case logTypes.ERROR:
            return (
                <>
                    <CloseIcon color="error" sx={{mr: 2}}/>
                    <Box>
                        <Box sx={{minWidth: 0}}>
                            <HighlightedText>{log.commandType}</HighlightedText>
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
                                <Box component="span" sx={{color: 'grey.700'}}>error: </Box>
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
