/* eslint-disable
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/restrict-template-expressions,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument
*/

import {utils} from 'jooby-codec';
import formatUTCDate from './formatUTCDate.js';


const TIME2000_KEY = 'time2000';

/**
 * Modifies "time2000" properties in a JSON object.
 *
 * This function recursively traverses the object and replaces any property
 * whose name contains "time2000" (case-insensitive) with a date string.
 *
 * @param obj - The object to modify.
 * @return A new object with modified "time2000" properties.
 */
const modifyTime2000Parameter = (obj: any): any => {
    const copy = JSON.parse(JSON.stringify(obj));

    if (typeof copy !== 'object' || copy === null) {
        return copy;
    }

    if (Array.isArray(copy)) {
        return copy.map(element => modifyTime2000Parameter(element));
    }

    const newObj: {[key: string]: any} = {};

    for (const key in copy) {
        if (key.toLowerCase().includes(TIME2000_KEY)) {
            newObj[key] = `${copy[key]} (${formatUTCDate(utils.time.getDateFromTime2000(copy[key]))})`;
        } else {
            newObj[key] = modifyTime2000Parameter(copy[key]);
        }
    }

    return newObj;
};


export default modifyTime2000Parameter;
