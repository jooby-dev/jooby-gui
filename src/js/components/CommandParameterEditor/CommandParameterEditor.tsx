import {useRef, useEffect, useCallback, memo} from 'react';
import {IconButton, Box, FormHelperText, Link, FormControl} from '@mui/material';
import {Clear as ClearIcon, FormatAlignLeft as FormatAlignLeftIcon} from '@mui/icons-material';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/worker-json?worker';

import {createCommandDocLink} from '../../utils';

import {isValidJson, formatJson} from './utils';


const workerJsonUrl = new URL('ace-builds/src-noconflict/worker-json.js', import.meta.url).toString();


interface CommandParameterEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    inputRef: React.RefObject<ace.Ace.Editor>;
    command: object | null;
    onSubmit: () => void;
}

const CommandParameterEditor = ({
    value,
    onChange,
    disabled,
    inputRef,
    command,
    onSubmit
}: CommandParameterEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const onSubmitRef = useRef(onSubmit);

    const handleValueChange = useCallback(
        (newValue: string) => {
            onChange(newValue);
        },
        [onChange]
    );

    useEffect(() => {
        onSubmitRef.current = onSubmit;
    }, [onSubmit]);

    useEffect(() => {
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
    }, [handleValueChange, inputRef]);

    useEffect(() => {
        if (inputRef && inputRef.current) {
            const cursorPosition = inputRef.current.getCursorPosition();
            inputRef.current.setValue(value, -1);
            inputRef.current.moveCursorToPosition(cursorPosition);
        }
    }, [value, inputRef]);

    useEffect(() => {
        if (inputRef && inputRef.current) {
            inputRef.current.setReadOnly(disabled);
        }
    }, [disabled, inputRef]);

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
                <div
                    ref={editorRef}
                    style={{
                        flexGrow: 1,
                        height: '100%'
                    }}
                ></div>
                <Box display="flex" flexDirection="column">
                    <IconButton
                        aria-label="clear parameters"
                        onClick={handleClearClick}
                        disabled={value === ''}
                    >
                        <ClearIcon fontSize="medium" />
                    </IconButton>
                    <IconButton
                        aria-label="format parameters"
                        onClick={handleFormatClick}
                        disabled={value === ''}
                    >
                        <FormatAlignLeftIcon fontSize="medium" />
                    </IconButton>
                </Box>
            </Box>
            <FormHelperText>
                <>
                    {'JSON/object with command parameters (see '}
                    <Link
                        href={createCommandDocLink(command.value)}
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
