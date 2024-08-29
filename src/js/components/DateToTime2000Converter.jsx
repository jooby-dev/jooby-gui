import {useState} from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {time} from 'jooby-codec/analog/utils/index.js';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    InputAdornment,
    Popper
} from '@mui/material';

import {ContentCopy as ContentCopyIcon} from '@mui/icons-material';

import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

import useCopyToClipboard from '../hooks/useCopyToClipboard.js';

import IconButtonWithTooltip from './IconButtonWithTooltip.jsx';


const MIN_DATE = dayjs('2000-01-01');
const MAX_DATE = dayjs('2099-12-31');

const CustomPopper = props => (
    <Popper
        {...props}
        modifiers={[{name: 'preventOverflow', options: {altAxis: true}}]}
        style={{zIndex: 1300}}
    />
);

const getDateErrorMessage = error => {
    switch ( error ) {
        case 'maxDate':
        case 'minDate': {
            return `Date must be between ${MIN_DATE.format('YYYY-MM-DD')} and ${MAX_DATE.format('YYYY-MM-DD')}`;
        }

        case 'invalidDate': {
            return 'Date is not valid';
        }

        default: {
            return '';
        }
    }
};

const getTime2000FromDayjsDate = date => Math.floor(time.getTime2000FromDate(date.toDate()));

const getTimestampFromDayjsDate = date => Math.floor(date.valueOf() / 1000);

// Sanitizes the input string by allowing only digits and a single leading minus sign.
const sanitizeInputValue = value => value.replace(/(?!^)-|[^\d-]/g, '');


const DateToTime2000Converter = ( {isOpen, onClose} ) => {
    const initialDate = dayjs();

    const copyToClipboard = useCopyToClipboard();

    const [time2000, setTime2000] = useState(getTime2000FromDayjsDate(initialDate));
    const [timestamp, setTimestamp] = useState(getTimestampFromDayjsDate(initialDate));
    const [date, setDate] = useState(initialDate);
    const [time2000Error, setTime2000Error] = useState(null);
    const [timestampError, setTimestampError] = useState(null);
    const [dateError, setDateError] = useState(null);

    const handleDateChange = newDate => {
        setDate(newDate);

        if ( newDate.isValid() ) {
            setTime2000(getTime2000FromDayjsDate(newDate));
            setTimestamp(getTimestampFromDayjsDate(newDate));
            setTime2000Error(null);
            setTimestampError(null);
        }
    };

    const handleTime2000Change = event => {
        const value = sanitizeInputValue(event.target.value);
        const newDate = dayjs(time.getDateFromTime2000(parseInt(value, 10)));

        setTime2000(value);

        if ( newDate.isValid() ) {
            setDate(newDate);
            setTimestamp(getTimestampFromDayjsDate(newDate));
            setTime2000Error(null);
            setTimestampError(null);

            return;
        }

        setTime2000Error('Invalid time2000');
    };

    const handleTimestampChange = event => {
        const value = sanitizeInputValue(event.target.value);
        const newDate = dayjs(parseInt(value, 10) * 1000);

        setTimestamp(value);

        if ( newDate.isValid() ) {
            setTime2000(getTime2000FromDayjsDate(newDate));
            setDate(newDate);
            setTime2000Error(null);
            setTimestampError(null);

            return;
        }

        setTimestampError('Invalid timestamp');
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Date to time2000 converter</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 2,
                        paddingTop: 2,
                        alignItems: 'center'
                    }}
                >
                    <TextField
                        label="Time2000"
                        value={time2000}
                        onChange={handleTime2000Change}
                        error={!!time2000Error}
                        helperText={time2000Error}
                        InputProps={{endAdornment: <InputAdornment position="end">seconds</InputAdornment>}}
                        fullWidth
                    />
                    <IconButtonWithTooltip
                        title="Copy time2000"
                        onClick={() => copyToClipboard(time2000, {message: 'Time2000 copied to clipboard'})}
                    >
                        <ContentCopyIcon/>
                    </IconButtonWithTooltip>

                    <DateTimePicker
                        views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                        timeSteps={{hours: 1, minutes: 1, seconds: 1}}
                        minDate={MIN_DATE}
                        maxDate={MAX_DATE}
                        label="Date and time"
                        value={date}
                        onChange={handleDateChange}
                        onError={error => setDateError(error)}
                        slotProps={{
                            textField: {helperText: getDateErrorMessage(dateError)}
                        }}
                        slots={{popper: CustomPopper}}
                    />
                    <IconButtonWithTooltip
                        title="Copy ISO date"
                        onClick={() => copyToClipboard(date.toISOString(), {message: 'ISO date copied to clipboard'})}
                    >
                        <ContentCopyIcon/>
                    </IconButtonWithTooltip>

                    <TextField
                        label="Timestamp"
                        value={timestamp}
                        onChange={handleTimestampChange}
                        error={!!timestampError}
                        helperText={timestampError}
                        InputProps={{endAdornment: <InputAdornment position="end">seconds</InputAdornment>}}
                        fullWidth
                    />
                    <IconButtonWithTooltip
                        title="Copy timestamp"
                        onClick={() => copyToClipboard(timestamp, {message: 'Timestamp copied to clipboard'})}
                    >
                        <ContentCopyIcon/>
                    </IconButtonWithTooltip>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

DateToTime2000Converter.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};


export default DateToTime2000Converter;
