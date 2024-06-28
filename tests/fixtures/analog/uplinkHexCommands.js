export const uplinkHexSimpleCommands = {
    'new event': {
        name: 'newEvent',
        dump: '150608cd0006b48dbc',
        command: '06 08 cd 00 06 b4 8d',
        lrc: '0xbc',
        expectedParameters: {
            id: 8,
            sequenceNumber: 205,
            data: {
                time2000: 439437
            }
        }
    },
    getArchiveEvents: {
        name: 'getArchiveEvents',
        dump: '0b300005961802250005955a0124000591ed0223000590ba012200059028022100058e0d012000058dd7021f00058d5e011ecb',
        command: '0b 30 00 05 96 18 02 25 00 05 95 5a 01 24 00 05 91 ed 02 23 00 05 90 ba 01 22 00 05 90 28 02 21 00 05 8e 0d 01 20 00 05 8d d7 02 1f 00 05 8d 5e 01 1e',
        lrc: '0xcb',
        expectedParameters: {
            eventList: [
                {
                    time2000: 366104,
                    id: 2,
                    sequenceNumber: 37
                },
                {
                    time2000: 365914,
                    id: 1,
                    sequenceNumber: 36
                },
                {
                    time2000: 365037,
                    id: 2,
                    sequenceNumber: 35
                },
                {
                    time2000: 364730,
                    id: 1,
                    sequenceNumber: 34
                },
                {
                    time2000: 364584,
                    id: 2,
                    sequenceNumber: 33
                },
                {
                    time2000: 364045,
                    id: 1,
                    sequenceNumber: 32
                },
                {
                    time2000: 363991,
                    id: 2,
                    sequenceNumber: 31
                },
                {
                    time2000: 363870,
                    id: 1,
                    sequenceNumber: 30
                }
            ]
        }
    },
    status: {
        name: 'status',
        dump: '140d02760c01e16b967e6e17fdbc630c',
        command: '14 0d 02 76 0c 01 e1 6b 96 7e 6e 17 fd bc 63',
        lrc: '0x0c',
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
                    underLowLoad: 3606,
                    underHighLoad: 2966
                },
                batteryInternalResistance: 32366,
                temperature: 23,
                remainingBatteryCapacity: 99.6,
                lastEventSequenceNumber: 188,
                downlinkQuality: 99
            }
        }
    },
    getBatteryStatus: {
        name: 'getBatteryStatus',
        dump: '1f050b0de20ba7702816fd000000b4',
        command: '1f 05 0b 0d e2 0b a7 70 28 16 fd 00 00 00',
        lrc: '0xb4',
        expectedParameters: {
            voltageUnderLowLoad: 57869,
            voltageUnderHighLoad: 42763,
            internalResistance: 10352,
            temperature: 22,
            remainingCapacity: 253,
            isLastDayOverconsumption: false,
            averageDailyOverconsumptionCounter: 0
        }
    }
};
