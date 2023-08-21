import {
    SEVERITY_TYPE_SUCCESS, SEVERITY_TYPE_WARNING, SEVERITY_TYPE_ERROR, LOG_TYPE_ERROR, LOG_TYPE_MESSAGE,
    PARAMETERS_TAB_VIEW_TYPE_TREE, PARAMETERS_TAB_VIEW_TYPE_JSON, COMMAND_TYPE_ANALOG,
    COMMAND_TYPE_OBIS_OBSERVER
} from './constants.js';


export type TSeverity = typeof SEVERITY_TYPE_SUCCESS | typeof SEVERITY_TYPE_WARNING | typeof SEVERITY_TYPE_ERROR;

export type TParametersTab = typeof PARAMETERS_TAB_VIEW_TYPE_TREE | typeof PARAMETERS_TAB_VIEW_TYPE_JSON;

export type TSetLogs = (logs: Array<ILogItem>) => void;

export type TLogs = Array<ILogItem>;

export type TLogCommands = Array<object>;

export type THandleShareLogsClick = (event: React.SyntheticEvent, logsData: TLogs) => void;

export type TCommandType = typeof COMMAND_TYPE_ANALOG | typeof COMMAND_TYPE_OBIS_OBSERVER;

export interface IShowSnackbarParams {
    message: string;
    duration?: number;
    severity?: TSeverity;
}

export interface ILogItem {
    commandType: TCommandType;
    hardwareType: string | undefined;
    hex: string;
    data: Array<object> | null;
    date: string;
    errorMessage: string | undefined;
    type: typeof LOG_TYPE_ERROR | typeof LOG_TYPE_MESSAGE;
    id: string;
    isExpanded: boolean;
    tags: Array<string>;
}
