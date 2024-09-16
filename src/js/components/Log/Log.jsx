import {memo} from 'react';
import PropTypes from 'prop-types';
import {JSONTree} from 'react-json-tree';
import {frameTypes, accessLevels} from 'jooby-codec/mtx1/constants/index.js';
import invertObject from 'jooby-codec/utils/invertObject.js';

import {
    Box,
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
    ContentCopy as ContentCopyIcon,
    Edit as EditIcon
} from '@mui/icons-material';

import useCopyToClipboard from '../../hooks/useCopyToClipboard.js';

import getHexFromNumber from '../../utils/getHexFromNumber.js';
import isUndefined from '../../utils/isUndefined.js';
import hasLrc from '../../utils/hasLrc.js';

import IconButtonWithTooltip from '../IconButtonWithTooltip.jsx';
import HighlightedText from '../HighlightedText.jsx';
import TypographyBold from '../TypographyBold.jsx';
import TypographyMono from '../TypographyMono.jsx';

import {parametersTabViewTypes, commandTypes} from '../../constants/index.js';

import useLogActions from './hooks/useLogActions.js';
import {useCodecBuildPrefillData} from '../../contexts/CodecBuildPrefillDataContext.jsx';

import HexViewer from '../HexViewer.jsx';

import getSubLogColor from './utils/getSubLogColor.js';
import getLogColor from './utils/getLogColor.js';
import createSubLogTitle from './utils/createSubLogTitle.jsx';
import createLogTitle from './utils/createLogTitle.jsx';
import modifyTime2000Properties from './utils/modifyTime2000Properties.js';
import isLogError from './utils/isLogError.js';

import {JSONTreeTheme} from './constants.js';


const frameNamesByType = invertObject(frameTypes);
const accessLevelNames = invertObject(accessLevels);

const shouldRenderLrc = log => {
    // if the mtx message is unencrypted, the device sets the LRC to 0
    if (
        log.commandType === commandTypes.MTX1
        && log.data?.lrc?.received === 0
        && log.messageParameters?.accessLevel === accessLevels.UNENCRYPTED
    ) {
        return false;
    }

    if ( !hasLrc(log.commandType) ) {
        return false;
    }

    return true;
};

const renderLrcValue = value => (value === 'n/a' ? value : <HexViewer hex={value}/>);

const renderLrc = lrc => {
    let {received, calculated} = lrc;

    calculated = isUndefined(calculated) ? 'n/a' : getHexFromNumber(calculated);
    received = isUndefined(received) ? 'n/a' : getHexFromNumber(received);

    if ( calculated === received ) {
        return renderLrcValue(calculated);
    }

    return <>received: {renderLrcValue(received)}, calculated: {renderLrcValue(calculated)}</>;
};

const getToggleLogAndNestedTitle = baseTitle => <Box sx={{textAlign: 'center'}}>{baseTitle}<br/>(Ctrl+Click on title)</Box>;


const Log = ({
    log,
    parametersTab,
    setParametersTab,
    setLogs,
    handleShareLogsClick
}) => {
    const {
        hex, data, date, id, isExpanded, frameParameters, messageParameters
    } = log;

    const {toggleLog, toggleLogAndNested, toggleNestedLog, handleDeleteLogClick} = useLogActions(setLogs);
    const copyToClipboard = useCopyToClipboard();
    const {setPrefillDataFromLog} = useCodecBuildPrefillData();

    const onEditAsNewClick = event => {
        event.stopPropagation();
        setPrefillDataFromLog(log);
    };

    const onLogToggle = event => {
        if ( event.ctrlKey ) {
            toggleLogAndNested(event, id, !isExpanded);

            return;
        }

        toggleLog(id);
    };


    return (
        <Accordion
            sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
            key={id}
            expanded={isExpanded}
            onChange={onLogToggle}
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

                    <IconButtonWithTooltip title={getToggleLogAndNestedTitle('Expand log')} onClick={event => toggleLogAndNested(event, id)}>
                        <UnfoldMoreIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title={getToggleLogAndNestedTitle('Collapse log')} onClick={event => toggleLogAndNested(event, id, false)}>
                        <UnfoldLessIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Edit as new" onClick={onEditAsNewClick} disabled={isLogError(log)}>
                        <EditIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Share log" onClick={event => handleShareLogsClick(event, [log])}>
                        <ShareIcon/>
                    </IconButtonWithTooltip>

                    <IconButtonWithTooltip title="Delete log" onClick={event => handleDeleteLogClick(event, id)}>
                        <DeleteIcon/>
                    </IconButtonWithTooltip>
                </Box>
            </AccordionSummary>
            {isExpanded && (
                <AccordionDetails>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'max-content 1fr',
                        alignItems: 'center',
                        columnGap: 2,
                        rowGap: 1
                    }}>
                        {hex && (
                            <>
                                <TypographyBold>dump</TypographyBold>
                                <Box>
                                    <HexViewer hex={hex}/>
                                </Box>
                            </>
                        )}

                        {frameParameters.type && (
                            <>
                                <TypographyBold>frame type</TypographyBold>
                                <Box>
                                    {frameNamesByType[frameParameters.type]} (<HexViewer hex={getHexFromNumber(frameParameters.type)}/>)
                                </Box>
                            </>
                        )}

                        {!isUndefined(messageParameters.accessLevel) && (
                            <>
                                <TypographyBold>access level</TypographyBold>
                                <Box>
                                    {`${accessLevelNames[messageParameters.accessLevel]} `}
                                    (<HexViewer hex={getHexFromNumber(messageParameters.accessLevel)}/>)
                                </Box>
                            </>
                        )}

                        {!isUndefined(frameParameters.destination) && (
                            <>
                                <TypographyBold>destination address</TypographyBold>
                                <Box>
                                    <HexViewer hex={getHexFromNumber(frameParameters.destination)}/>
                                </Box>
                            </>
                        )}

                        {!isUndefined(frameParameters.source) && (
                            <>
                                <TypographyBold>source address</TypographyBold>
                                <Box>
                                    <HexViewer hex={getHexFromNumber(frameParameters.source)}/>
                                </Box>
                            </>
                        )}

                        {!isUndefined(messageParameters.messageId) && (
                            <>
                                <TypographyBold>message ID</TypographyBold>
                                <TypographyMono>{messageParameters.messageId}</TypographyMono>
                            </>
                        )}

                        {shouldRenderLrc(log) && (
                            <>
                                <TypographyBold>lrc</TypographyBold>
                                <Box>{renderLrc(data.lrc)}</Box>
                            </>
                        )}

                        {data.error && (
                            <>
                                <TypographyBold>error</TypographyBold>
                                <HighlightedText fontWeight="normal" isMonospacedFont={true} color="error.main">{data.error}</HighlightedText>
                            </>
                        )}

                        {data.commands.length > 0 && <TypographyBold>commands</TypographyBold>}
                    </Box>

                    {data.commands.length > 0 && (
                        <>
                            {data.commands.map(commandData => {
                                const {command} = commandData;

                                return (
                                    <Accordion
                                        key={commandData.id}
                                        sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
                                        expanded={commandData.isExpanded}
                                        onChange={() => toggleNestedLog(id, commandData.id)}
                                    >
                                        <AccordionSummary
                                            content="div"
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls={`panel${commandData.id}bh-content`}
                                            sx={{
                                                alignItems: 'center',
                                                backgroundColor: `${getSubLogColor(command.directionType, command.error)}`,
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
                                            <Box sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'max-content 1fr',
                                                alignItems: 'center',
                                                columnGap: 2,
                                                rowGap: 1
                                            }}>
                                                {command.hex && (
                                                    <>
                                                        <TypographyBold>dump</TypographyBold>
                                                        <Box>
                                                            <HexViewer hex={command.hex}/>
                                                        </Box>
                                                    </>
                                                )}
                                                {command.error && (
                                                    <>
                                                        <TypographyBold>error</TypographyBold>
                                                        <HighlightedText fontWeight="normal" isMonospacedFont={true} color="error.main">
                                                            {command.error}
                                                        </HighlightedText>
                                                    </>
                                                )}
                                                {command.parameters && command.hasParameters && (
                                                    <TypographyBold>
                                                        {'parameters '}
                                                        <IconButtonWithTooltip
                                                            title="Copy parameters in JSON format"
                                                            onClick={() => copyToClipboard(
                                                                JSON.stringify(command.parameters, null, 4),
                                                                {message: 'Parameters copied to clipboard'}
                                                            )}
                                                        >
                                                            <ContentCopyIcon/>
                                                        </IconButtonWithTooltip>
                                                    </TypographyBold>
                                                )}
                                            </Box>
                                            {command.parameters && command.hasParameters && (
                                                <TabContext value={parametersTab}>
                                                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                                        <TabList
                                                            onChange={(event, value) => setParametersTab(value)}
                                                            aria-label="Display command parameters in tree, JSON view"
                                                        >
                                                            <Tab
                                                                label={parametersTabViewTypes.TREE}
                                                                value={parametersTabViewTypes.TREE}
                                                            />
                                                            <Tab
                                                                label={parametersTabViewTypes.JSON}
                                                                value={parametersTabViewTypes.JSON}
                                                            />
                                                        </TabList>
                                                    </Box>
                                                    <TabPanel value={parametersTabViewTypes.TREE}>
                                                        <Box sx={{mb: 2, fontFamily: 'Roboto Mono, monospace'}}>
                                                            <JSONTree
                                                                data={modifyTime2000Properties(command.parameters)}
                                                                theme={JSONTreeTheme}
                                                                invertTheme={false}
                                                                hideRoot={true}
                                                                shouldExpandNodeInitially={() => true}
                                                            />
                                                        </Box>
                                                    </TabPanel>
                                                    <TabPanel value={parametersTabViewTypes.JSON}>
                                                        <TypographyMono component="pre" sx={{whiteSpace: 'pre-wrap'}}>
                                                            {JSON.stringify(command.parameters, null, 4)}
                                                        </TypographyMono>
                                                    </TabPanel>
                                                </TabContext>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </>
                    )}
                </AccordionDetails>
            )}
        </Accordion>
    );
};

Log.propTypes = {
    log: PropTypes.object.isRequired,
    parametersTab: PropTypes.oneOf([parametersTabViewTypes.TREE, parametersTabViewTypes.JSON]),
    setParametersTab: PropTypes.func.isRequired,
    setLogs: PropTypes.func.isRequired,
    handleShareLogsClick: PropTypes.func.isRequired
};


export default memo(Log);
