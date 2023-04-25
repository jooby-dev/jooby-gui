import {DIRECTION_TYPE_AUTO, DIRECTION_TYPE_DOWNLINK, DIRECTION_TYPE_UPLINK} from '../../constants';


export type HardwareType = object | null;

export type CommandExample = object | null;

export type CommandList = Array<object>;

export type CommandExampleList = Array<object>;

export type PreparedCommands = Array<object>;

export type AnchorButtonGroupList = HTMLDivElement | null;

export type SelectedParseButtonIndex =
    | typeof DIRECTION_TYPE_AUTO
    | typeof DIRECTION_TYPE_DOWNLINK
    | typeof DIRECTION_TYPE_UPLINK;

export type HandleHardwareTypeChange = (
    event: React.SyntheticEvent,
    newValue: object | null
) => void;

export type HandleBufferChange = (
    event: React.ChangeEvent<HTMLInputElement>
) => void;

export type HandleDeletePreparedCommandClick = (index: number) => void;

export type HandleParametersChange = (
    event: React.ChangeEvent<HTMLInputElement>
) => void;

export type HandleCommandExampleChange = (
    event: React.SyntheticEvent,
    newValue: object | null
) => void;

export type HandleCommandChange = (
    event: React.SyntheticEvent,
    newValue: object | null
) => void;

export type HandleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    directionType: number
) => void;

export type HandleParseButtonGroupMenuClose = (event: Event) => void;
