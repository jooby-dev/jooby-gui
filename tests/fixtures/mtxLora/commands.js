export const uplinkCommands = {
    getDateTime: {
        hex: {
            dump: '1e11e4910010100708013a321003100718005f6a',
            lrc: '0x6a'
        },
        base64: 'HhHkkQAQEAcIAToyEAMQBxgAX2o=',
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 11 e4 91 00 10 10 07 08 01 3a 32 10 03 10 07 18 00 5f',
                    parameters: {
                        segmentationSessionId: 228,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            0,
                            16,
                            16,
                            7,
                            8,
                            1,
                            58,
                            50,
                            16,
                            3,
                            16,
                            7,
                            24,
                            0,
                            95
                        ]
                    }
                }
            }
        },
        mtx: {
            dump: '00 10 10 07 08 01 3a 32 10 03 10 07 18 00 5f',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x5f',
            commands: {
                getDateTime: {
                    name: 'getDateTime',
                    dump: '07 08 01 3a 32 10 03 10 07 18',
                    parameters: {
                        isSummerTime: true,
                        seconds: 58,
                        minutes: 50,
                        hours: 16,
                        day: 3,
                        date: 16,
                        month: 7,
                        year: 24
                    }
                }
            }
        }
    }
};

export const downlinkCommands = {
    getDateTime: {
        mtx: {
            dump: '00 10 10 07 00 00 42',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x42',
            commands: {
                getDateTime: {
                    name: 'getDateTime',
                    dump: '07 00'
                }
            }
        },
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 09 00 91 00 10 10 07 00 00 42 96',
                    parameters: {
                        segmentationSessionId: 0,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            0,
                            16,
                            16,
                            7,
                            0,
                            0,
                            66
                        ]
                    }
                }
            }
        }
    }
};
