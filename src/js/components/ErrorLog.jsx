import {memo} from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';

import {
    ExpandMore as ExpandMoreIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    UnfoldMore as UnfoldMoreIcon,
    UnfoldLess as UnfoldLessIcon,
    ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

import useCopyToClipboard from '../hooks/useCopyToClipboard.js';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';
import HighlightedText from './HighlightedText.jsx';
import TypographyBold from './TypographyBold.jsx';
import TypographyMono from './TypographyMono.jsx';

import useLogActions from './Log/hooks/useLogActions.js';

import getLogColor from './Log/utils/getLogColor.js';
import createLogTitle from './Log/utils/createLogTitle.jsx';


const ErrorLog = ( {log, setLogs, handleShareLogsClick} ) => {
    const {hex, date, error, id, isExpanded} = log;

    const {toggleLog, toggleLogAndNested, handleDeleteLogClick} = useLogActions(setLogs);
    const copyToClipboard = useCopyToClipboard();

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
            {isExpanded && (
                <AccordionDetails>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'max-content 1fr',
                        alignItems: 'center',
                        columnGap: 2,
                        rowGap: 1,
                        mb: 1
                    }}>
                        {hex && (
                            <>
                                <TypographyBold>
                                    {'dump '}
                                    <IconButtonWithTooltip
                                        title="Copy dump"
                                        onClick={() => copyToClipboard(
                                            hex,
                                            {message: 'Message dump copied to clipboard'}
                                        )}
                                    >
                                        <ContentCopyIcon/>
                                    </IconButtonWithTooltip>
                                </TypographyBold>
                                <TypographyMono>{hex}</TypographyMono>
                            </>
                        )}
                        <TypographyBold>error</TypographyBold>
                        <HighlightedText fontWeight="normal" isMonospacedFont={true} color="error.main">{error}</HighlightedText>
                    </Box>
                </AccordionDetails>
            )}
        </Accordion>
    );
};

ErrorLog.propTypes = {
    log: PropTypes.object.isRequired,
    setLogs: PropTypes.func.isRequired,
    handleShareLogsClick: PropTypes.func.isRequired
};


export default memo(ErrorLog);
