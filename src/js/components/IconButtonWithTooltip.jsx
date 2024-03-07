import PropTypes from 'prop-types';
import {Tooltip, IconButton} from '@mui/material';


const IconButtonWithTooltip = ({
    title,
    disabled = false,
    size = 'small',
    ...otherProps
}) => {
    const button = <IconButton size={size} disabled={disabled} {...otherProps}></IconButton>;

    if (disabled) {
        return button;
    }

    return <Tooltip title={title}>{button}</Tooltip>;
};

IconButtonWithTooltip.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large'])
};


export default IconButtonWithTooltip;
