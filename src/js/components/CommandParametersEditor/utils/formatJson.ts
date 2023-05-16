export default (json: string): string => JSON.stringify(JSON.parse(json), null, 4);
