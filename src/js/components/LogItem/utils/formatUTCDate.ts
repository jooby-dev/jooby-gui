/**
 * Formats a JavaScript Date object into a specific UTC format.
 * The output format is 'YYYY.MM.DD HH:MM:SS GMT'.
 *
 * @param date - The Date object to format.
 * @returns The formatted date string.
 */
export default (date: Date): string => {
    const year = date.getUTCFullYear();
    // add 1 because months are 0-indexed
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds} GMT`;
};
