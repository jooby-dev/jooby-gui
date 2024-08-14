export const uplinkCommands = {
    getMeterIdList: {
        hex: {
            dump: '750a04010000000100000002'
        },
        commands: {
            getMeterIdList: {
                name: 'getMeterIdList',
                dump: '75 0a 04 01 00 00 00 01 00 00 00 02',
                parameters: {
                    requestId: 4,
                    isCompleted: true,
                    meterIdList: [1, 2]
                }
            }
        }
    }
};

export const downlinkCommands = {
    getLorawanInfo: {
        hex: {
            dump: '20 01 08'
        },
        commands: {
            getLorawanInfo: {
                name: 'getLorawanInfo',
                dump: '20 01 08',
                parameters: {
                    requestId: 8
                }
            }
        }
    }
};
