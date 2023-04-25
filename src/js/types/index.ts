import {
    SEVERITY_TYPE_SUCCESS, SEVERITY_TYPE_WARNING, SEVERITY_TYPE_ERROR, LOG_TYPE_ERROR, LOG_TYPE_MESSAGE,
    PARAMETERS_TAB_VIEW_TYPE_TREE, PARAMETERS_TAB_VIEW_TYPE_JSON
} from '../constants';

type LogType = typeof LOG_TYPE_ERROR | typeof LOG_TYPE_MESSAGE;

export type Severity = typeof SEVERITY_TYPE_SUCCESS | typeof SEVERITY_TYPE_WARNING | typeof SEVERITY_TYPE_ERROR;

export type ParametersTab = typeof PARAMETERS_TAB_VIEW_TYPE_TREE | typeof PARAMETERS_TAB_VIEW_TYPE_JSON;

export type SetLogs = (logs: Array<Log>) => void;

export type Logs = Array<Log>;

export type Command = object | null;

export type LogCommand = object;

export type LogCommands = Array<LogCommand>;

export type ExpandedLogs = Array<string>;

export type SetExpandedLogs = (expandedLogs: Array<string>) => void;

export type HandleCopyToClipboard = (data: string, snackbarConfig: ShowSnackbarParams) => Promise<void>;

export type HandleShareLogsClick = (event: React.SyntheticEvent, logsData: Array<Log>) => Promise<void>;

export type ExpandAllLogs = (event: React.SyntheticEvent, ids: Array<string>) => void;

export type CollapseAllLogs = (event: React.SyntheticEvent, ids: Array<string>) => void;

export type HandleLogsLimitExceededDialogClose = () => void;

export type HandleLogClick = (id: string) => void;

export type HandleDeleteLogClick = (event: React.SyntheticEvent, id: string) => void;

export type HandleParametersTabChange = (event: React.SyntheticEvent, newValue: ParametersTab) => void;

export interface ShowSnackbarParams {
    message: string;
    duration?: number;
    severity?: Severity;
}

export interface Log {
    hardwareType: string | undefined;
    buffer: string;
    data: Array<object> | null;
    date: string;
    errorMessage: string | undefined;
    type: LogType;
    id: string;
}
