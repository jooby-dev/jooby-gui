import {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Autocomplete,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Link
} from '@mui/material';

import {CommandTypeContext} from '../contexts/CommandTypeContext.jsx';

import CodecBuildSection from './CodecBuildSection.jsx';
import CodecParseSection from './CodecParseSection.jsx';

import {commandTypeConfigMap} from '../joobyCodec.js';
import {
    COMMAND_TYPE_ANALOG,
    COMMAND_TYPE_OBIS_OBSERVER,
    COMMAND_TYPE_MTX,
    COMMAND_TYPE_MTX_LORA
} from '../constants.js';

import hasHardwareTypeInCommandType from '../utils/hasHardwareTypeInCommandType.js';


const commandTypes = [
    COMMAND_TYPE_ANALOG,
    COMMAND_TYPE_OBIS_OBSERVER,
    COMMAND_TYPE_MTX,
    COMMAND_TYPE_MTX_LORA
];


const CodecPanel = ( {setLogs} ) => {
    const {commandType, setCommandType} = useContext(CommandTypeContext);
    const [hardwareType, setHardwareType] = useState(null);

    // reset state when command type changes
    useEffect(
        () => {
            setHardwareType(null);
        },
        [commandType]
    );

    const onCommandTypeChange = event => {
        setCommandType(event.target.value);
    };

    const onHardwareTypeChange = ( event, newValue ) => {
        setHardwareType(newValue);
    };

    return (
        <Box sx={{display: 'flex', flex: '0 0 auto'}}>
            <Box sx={{
                display: 'flex',
                flexGrow: 1,
                gap: 2,
                width: '520px',
                flexDirection: 'column',
                pt: 2,
                position: 'sticky',
                top: 0,
                maxHeight: '100vh',
                overflowY: 'auto',
                minHeight: 0,
                '& > *': {minHeight: 0, flex: '0 0 auto', px: 2}
            }}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mb: 2}}>
                    <FormControl variant="standard" fullWidth={true}>
                        <InputLabel id="select-command-type-label">Codec</InputLabel>
                        <Select
                            labelId="select-command-type-label"
                            id="select-command-type"
                            value={commandType}
                            onChange={onCommandTypeChange}
                        >
                            {commandTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {hasHardwareTypeInCommandType(commandType) && (
                        <Autocomplete
                            options={commandTypeConfigMap[commandType].hardwareTypeList.sort(
                                (itemA, itemB) => itemA.label.localeCompare(itemB.label)
                            )}
                            size="small"
                            value={hardwareType}
                            onChange={onHardwareTypeChange}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label="Hardware type"
                                    variant="standard"
                                    helperText="May be required for parsing and creating a message"
                                />
                            )}
                        />
                    )}
                </Box>

                <CodecParseSection setLogs={setLogs} hardwareType={hardwareType}/>
                <CodecBuildSection setLogs={setLogs} hardwareType={hardwareType} setHardwareType={setHardwareType}/>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'sticky',
                    bottom: 0,
                    mt: 'auto',
                    px: 0,
                    py: 2,
                    backgroundColor: 'background.default',
                    borderTopColor: 'divider',
                    borderTopWidth: 1,
                    borderTopStyle: 'solid',
                    zIndex: 1000
                }}>
                    <Link href="https://github.com/jooby-dev/jooby-gui" target="_blank" rel="noopener noreferrer">GitHub</Link>
                </Box>
            </Box>
        </Box>
    );
};

CodecPanel.propTypes = {
    setLogs: PropTypes.func.isRequired
};


export default CodecPanel;
