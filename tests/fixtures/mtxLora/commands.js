export const uplinkCommands = {
    getDateTime: {
        hex: {
            dump: '1e116d9101101007080015100f060c07180055e2',
            lrc: 0xe2
        },
        base64: 'HhFskQAQEAcIABgOBQcNAQEAU+I=',
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 11 6c 91 00 10 10 07 08 00 18 0e 05 07 0d 01 01 00 53',
                    parameters: {
                        segmentationSessionId: 109,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            1,
                            16,
                            16,
                            7,
                            8,
                            0,
                            21,
                            16,
                            15,
                            6,
                            12,
                            7,
                            24,
                            0,
                            85
                        ]
                    }
                }
            }
        },
        mtx: {
            dump: '01 10 10 07 08 00 15 10 0f 06 0c 07 18 00 55',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: 0x55,
            commands: {
                getDateTime: {
                    name: 'getDateTime',
                    dump: '07 08 00 15 10 0f 06 0c 07 18',
                    parameters: {
                        isSummerTime: false,
                        seconds: 21,
                        minutes: 16,
                        hours: 15,
                        day: 6,
                        date: 12,
                        month: 7,
                        year: 24
                    }
                }
            }
        }
    }
};
