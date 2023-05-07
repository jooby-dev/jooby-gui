export const isValidJson = (jsonString: string): boolean => {
    try {
        const parsedObject = JSON.parse(jsonString);

        return parsedObject && typeof parsedObject === 'object';
    } catch (error) {
        try {
            const evalResult = eval('(' + jsonString + ')');

            return evalResult && typeof evalResult === 'object';
        } catch (evalError) {
            return false;
        }
    }
};
