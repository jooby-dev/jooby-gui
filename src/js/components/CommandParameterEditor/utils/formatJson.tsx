export const formatJson = (jsonString: string): string => {
    try {
        const parsedJson = JSON.parse(jsonString);

        return JSON.stringify(parsedJson, null, 4);
    } catch (error) {
        try {
            const evalResult = eval('(' + jsonString + ')');

            return JSON.stringify(evalResult, null, 4);
        } catch (evalError) {
            return jsonString;
        }
    }
};
