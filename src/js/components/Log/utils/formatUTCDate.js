/**
 * Formats a UTC device date, independent of the browser timezone.
 *
 * @param date - Date produced from a time2000 value.
 * @returns Clock digits as 'YYYY.MM.DD HH:MM:SS UTC'.
 */
export default date => {
    const year = date.getUTCFullYear();
    // add 1 because months are 0-indexed
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds} UTC`;
};
