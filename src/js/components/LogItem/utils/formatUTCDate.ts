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
    const month = ('0' + (date.getUTCMonth() + 1).toString()).slice(-2);
    const day = ('0' + date.getUTCDate().toString()).slice(-2);
    const hours = ('0' + date.getUTCHours().toString()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes().toString()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds().toString()).slice(-2);

    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds} GMT`;
};
