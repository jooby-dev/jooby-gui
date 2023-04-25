import {commands} from 'jooby-codec';
import {directions} from '../../constants';


export const preparedCommandList = [...Object.values(commands.uplink), ...Object.values(commands.downlink)]
    .filter(item => item.id)
    .map(item => ({
        label: item.name,
        value: item,
        direction: directions[item.directionType]
    }));
