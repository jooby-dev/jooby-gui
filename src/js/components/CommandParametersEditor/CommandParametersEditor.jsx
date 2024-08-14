import {useRef, useEffect, useCallback, memo} from 'react';
import PropTypes from 'prop-types';
import {useTheme, Box, FormHelperText, Link, FormControl} from '@mui/material';
import {
    Clear as ClearIcon,
    FormatAlignLeft as FormatAlignLeftIcon,
    Restore as RestoreIcon
} from '@mui/icons-material';

import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';
// eslint-disable-next-line import/no-unresolved
import 'ace-builds/src-noconflict/worker-json?worker';

import createCommandDocLink from '../../utils/createCommandDocLink.js';

import IconButtonWithTooltip from '../IconButtonWithTooltip.jsx';

import isValidJson from './utils/isValidJson.js';
import formatJson from './utils/formatJson.js';

import {commandTypes} from '../../constants/index.js';

const workerJsonUrl = new URL('ace-builds/src-noconflict/worker-json.js', import.meta.url).toString();


const CommandParameterEditor = ({
    value,
    onChange,
    disabled,
    inputRef,
    command,
    onSubmit,
    onClear,
    onRestore,
    isExampleSelected,
    commandType
}) => {
    const editorRef = useRef(null);
    const onSubmitRef = useRef(onSubmit);
    const theme = useTheme();

    const handleValueChange = useCallback(
        newValue => {
            onChange(newValue);
        },
        [onChange]
    );

    useEffect(
        () => {
            onSubmitRef.current = onSubmit;
        },
        [onSubmit]
    );

    useEffect(
        () => {
            if ( !editorRef.current ) {
                return undefined;
            }

            ace.config.set('basePath', '/jooby-gui/assets');
            ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

            const editor = ace.edit(editorRef.current);

            editor.setTheme('ace/theme/xcode');
            editor.getSession().setMode('ace/mode/json');
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 4,
                minLines: 4,
                maxLines: 12,
                fontSize: '16px',
                fontFamily: 'Roboto Mono, monospace'
            });

            editor.on('change', () => {
                const newValue = editor.getValue();

                handleValueChange(newValue);
            });

            editor.commands.addCommand({
                name: 'submit',
                bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
                exec: () => {
                    onSubmitRef.current();
                }
            });

            if ( inputRef ) {
                inputRef.current = editor;
            }

            return () => {
                editor.destroy();
            };
        },
        [handleValueChange, inputRef]
    );

    useEffect(
        () => {
            if ( inputRef && inputRef.current ) {
                const cursorPosition = inputRef.current.getCursorPosition();

                inputRef.current.setValue(value, -1);
                inputRef.current.moveCursorToPosition(cursorPosition);
            }
        },
        [value, inputRef]
    );

    useEffect(
        () => {
            if ( inputRef && inputRef.current ) {
                inputRef.current.setReadOnly(disabled);
            }
        },
        [disabled, inputRef]
    );

    useEffect(
        () => {
            if ( inputRef && inputRef.current ) {
                inputRef.current.setOption(
                    'placeholder',
                    command.value.hasParameters ? 'Parameters' : 'This command has no parameters'
                );
            }
        },
        [command, inputRef]
    );

    useEffect(
        () => {
            if ( inputRef && inputRef.current ) {
                const {placeholderNode} = inputRef.current.renderer;

                if ( placeholderNode ) {
                    placeholderNode.style.color = theme.palette.text.secondary;
                }
            }
        },
        [theme, inputRef]
    );

    const handleFormatClick = () => {
        if ( inputRef && inputRef.current ) {
            if ( isValidJson(inputRef.current.getValue()) ) {
                inputRef.current.setValue(formatJson(inputRef.current.getValue()), -1);
            }

            inputRef.current.focus();
        }
    };

    const handleClearClick = () => {
        if ( inputRef && inputRef.current ) {
            inputRef.current.setValue('', -1);
            inputRef.current.focus();
            onClear(null);
        }
    };

    return (
        <FormControl fullWidth>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box ref={editorRef} sx={{flexGrow: 1, height: '100%'}}></Box>
                <Box display="flex" flexDirection="column">
                    <IconButtonWithTooltip
                        title="Clear parameters"
                        onClick={handleClearClick}
                        disabled={value === ''}
                    >
                        <ClearIcon/>
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        title="Format parameters"
                        onClick={handleFormatClick}
                        disabled={value === ''}
                    >
                        <FormatAlignLeftIcon/>
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip
                        title="Restore example"
                        onClick={onRestore}
                        disabled={!isExampleSelected}
                    >
                        <RestoreIcon/>
                    </IconButtonWithTooltip>
                </Box>
            </Box>
            <FormHelperText>
                <>
                    {'JSON with command parameters (see '}
                    <Link
                        href={createCommandDocLink(
                            command.value,
                            commandType === commandTypes.MTX_LORA ? commandTypes.MTX : commandType
                        )}
                        target="_blank"
                        rel="noreferrer"
                        onClick={event => event.stopPropagation()}
                    >
                        {command.value.name}
                    </Link>
                    {' documentation)'}
                </>
            </FormHelperText>
        </FormControl>
    );
};

CommandParameterEditor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    inputRef: PropTypes.object.isRequired,
    command: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onRestore: PropTypes.func.isRequired,
    isExampleSelected: PropTypes.bool.isRequired,
    commandType: PropTypes.oneOf(Object.values(commandTypes)).isRequired
};


export default memo(CommandParameterEditor);
