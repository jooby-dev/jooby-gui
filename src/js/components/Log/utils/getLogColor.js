import getSubLogColor from './getSubLogColor.js';
import isLogError from './isLogError.js';


export default log => getSubLogColor(
    log.data?.commands?.[0]?.command?.directionType,
    isLogError(log)
);
