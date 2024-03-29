import PropTypes from 'prop-types';
import {TextField as MuiTextField, InputAdornment} from '@mui/material';


const baseStyles = {
    '& .MuiInputBase-root': {
        fontFamily: 'Roboto Mono, monospace'
    }
};


const TextField = ({
    max,
    min,
    prefix,
    suffix,
    readOnly,
    sx = {},
    ...rest
}) => (
    <MuiTextField
        sx={{...baseStyles, ...sx}}
        size="small"
        variant="standard"
        type="number"
        fullWidth={true}
        spellCheck={false}
        inputProps={{
            min,
            max,
            autoComplete: 'off'
        }}
        InputProps={{
            startAdornment: prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : null,
            endAdornment: suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : null,
            readOnly
        }}
        {...rest}
    />
);


TextField.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    sx: PropTypes.object,
    readOnly: PropTypes.bool,
    fullWidth: PropTypes.bool
};


export default TextField;
