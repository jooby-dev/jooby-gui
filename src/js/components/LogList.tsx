import {useState} from 'react';
import {Box} from '@mui/material';

import LogItem from './LogItem/LogItem.js';

import {TLogs, TParametersTab, THandleShareLogsClick, TSetLogs} from '../types.js';

import {PARAMETERS_TAB_VIEW_TYPE_TREE} from '../constants.js';


const LogList = ({logs, setLogs, handleShareLogsClick}: {
    logs: TLogs;
    handleShareLogsClick: THandleShareLogsClick;
    setLogs: TSetLogs;
}) => {
    const [parametersTab, setParametersTab] = useState<TParametersTab>(PARAMETERS_TAB_VIEW_TYPE_TREE);


    return (
        <Box sx={{mb: 2, px: 2, '& > *': {minWidth: 0}}}>
            {logs.length > 0 && logs.map((log) => (
                <LogItem
                    key={log.id}
                    log={log}
                    setLogs={setLogs}
                    parametersTab={parametersTab}
                    setParametersTab={setParametersTab}
                    handleShareLogsClick={handleShareLogsClick}
                />
            ))}
        </Box>
    );
};


export default LogList;
