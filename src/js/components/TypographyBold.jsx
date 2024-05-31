import PropTypes from 'prop-types';
import {Typography} from '@mui/material';


const TypographyBold = ( {children, ...props} ) => (
    <Typography {...props} sx={{fontWeight: '500', ...props.sx}}>
        {children}
    </Typography>
);

TypographyBold.propTypes = {
    children: PropTypes.node,
    sx: PropTypes.object
};


export default TypographyBold;
