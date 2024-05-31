import {useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';

import Log from './Log/Log.jsx';
import ErrorLog from './ErrorLog.jsx';

import {parametersTabViewTypes, logTypes} from '../constants/index.js';


const LogList = ( {logs, setLogs, handleShareLogsClick} ) => {
    const [parametersTab, setParametersTab] = useState(parametersTabViewTypes.TREE);

    return (
        <Box sx={{mb: 2, px: 2, '& > *': {minWidth: 0}}}>
            {logs.length > 0 && logs.map(log => (
                log.type === logTypes.ERROR
                    ? (
                        <ErrorLog
                            key={log.id}
                            log={log}
                            setLogs={setLogs}
                            handleShareLogsClick={handleShareLogsClick}
                        />
                    )
                    : (
                        <Log
                            key={log.id}
                            log={log}
                            setLogs={setLogs}
                            parametersTab={parametersTab}
                            setParametersTab={setParametersTab}
                            handleShareLogsClick={handleShareLogsClick}
                        />
                    )
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
