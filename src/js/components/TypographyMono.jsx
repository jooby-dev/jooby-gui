import PropTypes from 'prop-types';
import {Typography} from '@mui/material';


const TypographyMono = ( {children, ...props} ) => (
    <Typography {...props} sx={{fontFamily: 'Roboto Mono, monospace', ...props.sx}}>
        {children}
    </Typography>
);

TypographyMono.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object
};


export default TypographyMono;
