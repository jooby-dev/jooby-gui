import {createContext, useState, useContext, useCallback} from 'react';
import PropTypes from 'prop-types';
import {v4 as uuidv4} from 'uuid';

import isUndefined from '../utils/isUndefined.js';
import getHexFromNumber from '../utils/getHexFromNumber.js';

import {commandTypeConfigMap} from '../joobyCodec.js';
import {codecBuildDefaults} from '../constants/index.js';


const CodecBuildPrefillDataContext = createContext();


export const useCodecBuildPrefillData = () => useContext(CodecBuildPrefillDataContext);

export const CodecBuildPrefillDataProvider = ( {children} ) => {
    const [prefillData, setPrefillData] = useState(null);

    const setPrefillDataFromLog = useCallback(
        log => {
            if ( !log ) {
                setPrefillData(null);

                return;
            }

            const {accessLevel, accessKey, messageId} = log.messageParameters;
            const {source, destination, segmentationSessionId} = log.frameParameters;
            const {preparedCommandList} = commandTypeConfigMap[log.commandType];

            const logCommands = log.data.commands.map(command => ({
                command: preparedCommandList.find(({value, direction}) => value.id === command.command.id && direction === log.directionName),
                parameters: JSON.stringify(command.command.parameters, null, 4),
                id: uuidv4()
            }));

            const hardwareType = log.hardwareType
                ? commandTypeConfigMap[log.commandType].hardwareTypeList.find(({value}) => value === log.hardwareType)
                : null;

            const parameters = {
                accessLevel: isUndefined(accessLevel) ? codecBuildDefaults.accessLevel : accessLevel,
                accessKey: accessKey || codecBuildDefaults.accessKey,
                messageId: isUndefined(messageId) ? codecBuildDefaults.messageId : messageId,
                source: isUndefined(source) ? codecBuildDefaults.source : getHexFromNumber(source, false, true),
                destination: isUndefined(destination) ? codecBuildDefaults.destination : getHexFromNumber(destination, false, true),
                segmentationSessionId: isUndefined(segmentationSessionId) ? codecBuildDefaults.segmentationSessionId : segmentationSessionId
            };

            setPrefillData({
                hardwareType,
                parameters,
                commandType: log.commandType,
                preparedCommands: logCommands
            });
        },
        []
    );

    return (
        <CodecBuildPrefillDataContext.Provider value={{prefillData, setPrefillDataFromLog}}>
            {children}
        </CodecBuildPrefillDataContext.Provider>
    );
};

CodecBuildPrefillDataProvider.propTypes = {
    children: PropTypes.node.isRequired
};
