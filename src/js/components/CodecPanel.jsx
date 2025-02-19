import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
    Autocomplete,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    InputLabel,
    Link
} from '@mui/material';

import {useCommandType} from '../contexts/CommandTypeContext.jsx';
import {useCodecBuildPrefillData} from '../contexts/CodecBuildPrefillDataContext.jsx';
import {useCodecStore} from '../store/codec.js';

import CodecBuildSection from './CodecBuildSection.jsx';
import CodecParseSection from './CodecParseSection.jsx';
import DateToTime2000Converter from './DateToTime2000Converter.jsx';
import Button from './Button.jsx';

import {commandTypeConfigMap} from '../joobyCodec.js';
import {commandTypes, framingFormats} from '../constants/index.js';

import hasHardwareTypeInCommandType from '../utils/hasHardwareTypeInCommandType.js';


const CodecPanel = ( {setLogs} ) => {
    const {prefillData} = useCodecBuildPrefillData();
    const [framingFormat, setFramingFormat] = useCodecStore(state => [state.framingFormat, state.setFramingFormat]);
    const {commandType, setCommandType} = useCommandType();

    const [hardwareType, setHardwareType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onCommandTypeChange = event => {
        setCommandType(event.target.value);
        setHardwareType(null);
    };

    const onHardwareTypeChange = ( event, newValue ) => {
        setHardwareType(newValue);
    };

    useEffect(
        () => {
            if ( prefillData ) {
                setCommandType(prefillData.commandType);
                setHardwareType(prefillData.hardwareType);
            }
        },
        [prefillData, setCommandType]
    );

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
                    <Box>
                        <FormControl variant="standard" fullWidth={true}>
                            <InputLabel id="select-command-type-label">Codec</InputLabel>
                            <Select
                                labelId="select-command-type-label"
                                id="select-command-type"
                                value={commandType}
                                onChange={onCommandTypeChange}
                            >
                                {Object.values(commandTypes).map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {(commandType === commandTypes.MTX1 || commandType === commandTypes.MTX3) && (
                            <FormControl sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <FormLabel id="framing-format-label" sx={{pr: 2}}>Framing format</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="framing-format-label"
                                    name="framing-format"
                                    value={framingFormat}
                                    onChange={event => setFramingFormat(event.target.value)}
                                >
                                    <FormControlLabel value={framingFormats.HDLC} control={<Radio/>} label={framingFormats.HDLC}/>
                                    <FormControlLabel value={framingFormats.NONE} control={<Radio/>} label={framingFormats.NONE}/>
                                </RadioGroup>
                            </FormControl>
                        )}
                    </Box>

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
                    justifyContent: 'space-between',
                    position: 'sticky',
                    bottom: 0,
                    mt: 'auto',
                    p: 2,
                    backgroundColor: 'background.default',
                    borderTopColor: 'divider',
                    borderTopWidth: 1,
                    borderTopStyle: 'solid',
                    zIndex: 1000
                }}>
                    <Link href="https://github.com/jooby-dev/jooby-gui" target="_blank" rel="noopener noreferrer">GitHub</Link>
                    <Button variant="text" onClick={() => setIsModalOpen(true)}>Date to time2000 converter</Button>
                </Box>
            </Box>
            <DateToTime2000Converter isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </Box>
    );
};

CodecPanel.propTypes = {
    setLogs: PropTypes.func.isRequired
};


export default CodecPanel;
