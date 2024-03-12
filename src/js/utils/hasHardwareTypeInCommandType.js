import {commandTypeConfigMap} from '../constants.js';


export default commandType => commandTypeConfigMap[commandType].hasHardwareType;
