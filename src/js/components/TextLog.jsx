import {memo} from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Collapse,
    Chip
} from '@mui/material';

import {
    ExpandMore as ExpandMoreIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    UnfoldMore as UnfoldMoreIcon,
    UnfoldLess as UnfoldLessIcon,
    Edit as EditIcon,
    Notes as NotesIcon
} from '@mui/icons-material';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';
import TypographyMono from './TypographyMono.jsx';

import useLogActions from './Log/hooks/useLogActions.js';


const previewLineCount = 2;


const TextLog = ( {log, setLogs, handleShareLogsClick} ) => {
    const {text, date, id, isExpanded, tags} = log;

    const {toggleLog, toggleLogAndNested, handleDeleteLogClick} = useLogActions(setLogs);

    return (
        <Accordion
            sx={{overflow: 'hidden', '& > *': {minWidth: 0}}}
            key={id}
            expanded={isExpanded}
            onChange={() => toggleLog(id)}
        >
            <AccordionSummary
                component="div"
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`panel${id}bh-content`}
                sx={{
                    backgroundColor: 'grey.100',
                    '& > *': {minWidth: 0},
                    '& .MuiAccordionSummary-expandIconWrapper': {flex: '0 0 auto'}
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', width: '100%', '& > *': {minWidth: 0}}}>
                    <Box sx={{
                        flexShrink: 1,
                        display: 'flex',
                        alignItems: 'center',
                        mr: 2,
                        '& > *': {minWidth: 0}
                    }}>
                        <NotesIcon sx={{color: 'grey.600', mr: 2, flex: '0 0 auto'}}/>
                        <Collapse in={!isExpanded}>
                            <TypographyMono
                                sx={{
                                    color: 'grey.700',
                                    fontSize: '0.8rem',
                                    whiteSpace: 'pre-wrap',
                                    display: '-webkit-box',
                                    WebkitLineClamp: previewLineCount,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {text}
                            </TypographyMono>
                        </Collapse>
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
                            {tags.map((tag, index) => (
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

                    <IconButtonWithTooltip title="Edit as new" disabled={true}>
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
                    <TypographyMono component="pre" sx={{whiteSpace: 'pre-wrap', m: 0}}>
                        {text}
                    </TypographyMono>
                </AccordionDetails>
            )}
        </Accordion>
    );
};

TextLog.propTypes = {
    log: PropTypes.object.isRequired,
    setLogs: PropTypes.func.isRequired,
    handleShareLogsClick: PropTypes.func.isRequired
};


export default memo(TextLog);
