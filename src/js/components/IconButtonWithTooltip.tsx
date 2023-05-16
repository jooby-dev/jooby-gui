import {Tooltip, IconButton, IconButtonProps} from '@mui/material';


interface IconButtonWithTooltipProps extends IconButtonProps {
    title: string;
}

const IconButtonWithTooltip = ({
    title,
    disabled = false,
    size = 'small',
    ...otherProps
}: IconButtonWithTooltipProps) => {
    const button = <IconButton size={size} disabled={disabled} {...otherProps}></IconButton>;

    if (disabled) {
        return button;
    }

    return (
        <Tooltip title={title}>
            {button}
        </Tooltip>
    );
};


export default IconButtonWithTooltip;
