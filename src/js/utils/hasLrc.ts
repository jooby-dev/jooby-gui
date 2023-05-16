import {commandTypeConfigMap} from '../constants.js';


export default (commandType: string): boolean => commandTypeConfigMap[commandType].hasLrc;
