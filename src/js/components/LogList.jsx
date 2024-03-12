import {useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';

import LogItem from './LogItem/LogItem.jsx';

import {PARAMETERS_TAB_VIEW_TYPE_TREE} from '../constants.js';


const LogList = ( {logs, setLogs, handleShareLogsClick} ) => {
    const [parametersTab, setParametersTab] = useState(PARAMETERS_TAB_VIEW_TYPE_TREE);

    return (
        <Box sx={{mb: 2, px: 2, '& > *': {minWidth: 0}}}>
            {logs.length > 0 && logs.map(log => (
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

LogList.propTypes = {
    logs: PropTypes.array.isRequired,
    setLogs: PropTypes.func.isRequired,
    handleShareLogsClick: PropTypes.func.isRequired
};


export default LogList;
