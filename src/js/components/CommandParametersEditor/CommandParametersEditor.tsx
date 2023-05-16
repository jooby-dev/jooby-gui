import {useRef, useEffect, useCallback, memo} from 'react';
import {useTheme, Box, FormHelperText, Link, FormControl} from '@mui/material';
import {Clear as ClearIcon, FormatAlignLeft as FormatAlignLeftIcon} from '@mui/icons-material';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/worker-json?worker';

import createCommandDocLink from '../../utils/createCommandDocLink.js';

import IconButtonWithTooltip from '../IconButtonWithTooltip.js';

import {TCommandType} from '../../types.js';

import isValidJson from './utils/isValidJson.js';
import formatJson from './utils/formatJson.js';


const workerJsonUrl = new URL('ace-builds/src-noconflict/worker-json.js', import.meta.url).toString();


interface ICommandParametersEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    inputRef: React.RefObject<ace.Ace.Editor>;
    command: object | null;
    onSubmit: () => void;
    commandType: TCommandType;
}

const CommandParameterEditor = ({
    value,
    onChange,
    disabled,
    inputRef,
    command,
    onSubmit,
    commandType
}: ICommandParametersEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const onSubmitRef = useRef(onSubmit);
    const theme = useTheme();

    const handleValueChange = useCallback(
        (newValue: string) => {
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
            if (!editorRef.current) {
                return;
            }

            ace.config.set('basePath', '/jooby-gui/assets');
            ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl);

            const editor = ace.edit(editorRef.current);

            editor.setTheme('ace/theme/xcode');
            editor.getSession().setMode('ace/mode/json');
            editor.setOptions({
                placeholder: 'Parameters',
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

            if (inputRef) {
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
            if (inputRef && inputRef.current) {
                const cursorPosition = inputRef.current.getCursorPosition();
                inputRef.current.setValue(value, -1);
                inputRef.current.moveCursorToPosition(cursorPosition);
            }
        },
        [value, inputRef]
    );

    useEffect(
        () => {
            if (inputRef && inputRef.current) {
                inputRef.current.setReadOnly(disabled);
            }
        },
        [disabled, inputRef]
    );

    useEffect(
        () => {
            if (inputRef && inputRef.current) {
                const placeholderNode = inputRef.current.renderer.placeholderNode;

                if (placeholderNode) {
                    placeholderNode.textContent = command.value.hasParameters
                        ? 'Parameters'
                        : 'This command has no parameters';
                }
            }
        },
        [command, inputRef]
    );

    useEffect(
        () => {
            if (inputRef && inputRef.current) {
                const placeholderNode = inputRef.current.renderer.placeholderNode;
                if (placeholderNode) {
                    placeholderNode.style.color = theme.palette.text.secondary;
                }
            }
        },
        [theme, inputRef]
    );

    const handleFormatClick = () => {
        if (inputRef && inputRef.current) {
            if (isValidJson(inputRef.current.getValue())) {
                inputRef.current.setValue(formatJson(inputRef.current.getValue()), -1);
            }

            inputRef.current.focus();
        }
    };

    const handleClearClick = () => {
        if (inputRef && inputRef.current) {
            inputRef.current.setValue('', -1);
            inputRef.current.focus();
        }
    };

    return (
        <FormControl fullWidth>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Box
                    ref={editorRef}
                    sx={{
                        flexGrow: 1,
                        height: '100%'
                    }}
                ></Box>
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
                </Box>
            </Box>
            <FormHelperText>
                <>
                    {'JSON with command parameters (see '}
                    <Link
                        href={createCommandDocLink(command.value, commandType)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {command.label}
                    </Link>
                    {' documentation)'}
                </>
            </FormHelperText>
        </FormControl>
    );
};


export default memo(CommandParameterEditor);
