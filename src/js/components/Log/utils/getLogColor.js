import getSubLogColor from './getSubLogColor.js';
import isLogError from './isLogError.js';


export default log => getSubLogColor(log.directionType, isLogError(log));
