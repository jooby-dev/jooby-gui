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

const structuredClone = (source: any): any => JSON.parse(JSON.stringify(source));

/**
 * Modifies "time2000" properties in a JSON object.
 *
 * This function recursively traverses the object and replaces any property
 * whose name contains "time2000" (case-insensitive) with a date string.
 *
 * @param source - The object to modify.
 * @return A new object with modified "time2000" properties.
 */
const modifyTime2000Properties = (source: any): any => {
    const copy = structuredClone(source);

    if (typeof copy !== 'object' || copy === null) {
        return copy;
    }

    if (Array.isArray(copy)) {
        return copy.map(element => modifyTime2000Properties(element));
    }

    const result: {[key: string]: any} = {};

    for (const key in copy) {
        if (key.toLowerCase().includes(TIME2000_KEY)) {
            result[key] = `${copy[key]} (${formatUTCDate(utils.time.getDateFromTime2000(copy[key]))})`;
        } else {
            result[key] = modifyTime2000Properties(copy[key]);
        }
    }

    return result;
};


export default modifyTime2000Properties;
