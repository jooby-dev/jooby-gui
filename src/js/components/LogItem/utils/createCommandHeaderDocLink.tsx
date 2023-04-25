const baseUrl = 'https://github.com/jooby-dev/jooby-docs/blob/main/docs/message.md#';


export const createCommandHeaderDocLink = (headerLength: number) => {
    switch (headerLength) {
        case 1:
            return `${baseUrl}command-with-a-one-byte-header`;

        case 2:
            return `${baseUrl}command-with-a-two-bytes-header`;

        case 3:
            return `${baseUrl}command-with-a-three-bytes-header`;
    }
};
