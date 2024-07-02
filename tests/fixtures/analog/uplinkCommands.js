export const uplinkSimpleCommands = {
    'new event': {
        name: 'newEvent',
        hex: {
            dump: '1506081e000973cbe1',
            command: '15 06 08 1e 00 09 73 cb',
            lrc: '0xe1'
        },
        base64: 'FQYIHgAJc8vh',
        expectedParameters: {
            id: 8,
            sequenceNumber: 30,
            data: {
                time2000: 619467
            }
        }
    },
    currentMc: {
        name: 'currentMc',
        hex: {
            dump: '1805038ab3097b00',
            command: '18 05 03 8a b3 09 7b',
            lrc: '0x00'
        },
        base64: 'GAUDirMJewA=',
        expectedParameters: {
            channelList: [
                {
                    value: 153994,
                    index: 1
                },
                {
                    value: 123,
                    index: 2
                }
            ]
        }
    },
    getParameter: {
        name: 'getParameter',
        hex: {
            dump: '04020d035d',
            command: '04 02 0d 03',
            lrc: '0x5d'
        },
        base64: 'BAINA10=',
        expectedParameters: {
            id: 13,
            data: {
                value: 3
            }
        }
    },
    status: {
        name: 'status',
        hex: {
            dump: '140d02760c01e25b9481e017fdbc634c',
            command: '14 0d 02 76 0c 01 e2 5b 94 81 e0 17 fd bc 63',
            lrc: '0x4c'
        },
        base64: 'FA0CdgwB4luUgeAX/bxjTA==',
        expectedParameters: {
            software: {
                type: 2,
                version: 118
            },
            hardware: {
                type: 12,
                version: 1
            },
            data: {
                batteryVoltage: {
                    underLowLoad: 3621,
                    underHighLoad: 2964
                },
                batteryInternalResistance: 33248,
                temperature: 23,
                remainingBatteryCapacity: 99.6,
                lastEventSequenceNumber: 188,
                downlinkQuality: 99
            }
        }
    },
    getBatteryStatus: {
        name: 'getBatteryStatus',
        hex: {
            dump: '1f050b0de20b9b72fa17fd00000059',
            command: '1f 05 0b 0d e2 0b 9b 72 fa 17 fd 00 00 00',
            lrc: '0x59'
        },
        base64: 'HwULDeILm3L6F/0AAABZ',
        expectedParameters: {
            voltageUnderLowLoad: 57869,
            voltageUnderHighLoad: 39691,
            internalResistance: 64114,
            temperature: 23,
            remainingCapacity: 253,
            isLastDayOverconsumption: false,
            averageDailyOverconsumptionCounter: 0
        }
    }
};
