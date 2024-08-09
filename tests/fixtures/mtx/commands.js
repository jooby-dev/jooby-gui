export const uplinkCommands = {
    getCurrentStatusMeter: {
        hex: {
            dump: '7e 51 ff fe 15 75 07 7d 33 b7 34 87 63 dc ee b2 54 4b 59 89 6a c9 f6 db 6a b1 40 46 75 d0 3a 79 74 58 4d 22 27 4d 19 79 0b 44 02 cf 0d 24 56 57 64 c8 73 5b 9e 5b 76 c0 c4 9e ce 7e',
            frameType: 'DATA_RESPONSE (0x51)',
            accessLevel: 'READ_ONLY (0x03)',
            dstAddress: '0xfffe',
            srcAddress: '0x1575',
            messageId: '7',
            lrc: '0x69'
        },
        frame: {
            accessLevel: 'Read only',
            dstAddress: '0xfffe',
            srcAddress: '0x1575',
            messageId: '7'
        },
        commands: {
            getCurrentStatusMeter: {
                name: 'getCurrentStatusMeter',
                dump: '39 1f 00 fa a1 0d 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 01 58 d7 ae 00 00 01',
                parameters: {
                    operatingSeconds: 16425229,
                    tbadVAVB: 0,
                    tbadImaxAll: 0,
                    tbadPmaxAll: 0,
                    tbadFREQ: 0,
                    relayStatus: {
                        RELAY_STATE: true,
                        RELAY_UBAD: false,
                        RELAY_UNEQ_CURRENT: false,
                        RELAY_OFF_CENTER: false,
                        RELAY_IMAX: false,
                        RELAY_PMAX: false
                    },
                    statusEvent: {
                        CASE_OPEN: false,
                        MAGNETIC_ON: false,
                        PARAMETERS_UPDATE_REMOTE: false,
                        PARAMETERS_UPDATE_LOCAL: true,
                        RESTART: true,
                        ERROR_ACCESS: false,
                        TIME_SET: true,
                        TIME_CORRECT: false,
                        DEVICE_FAILURE: true,
                        CASE_TERMINAL_OPEN: true,
                        CASE_MODULE_OPEN: true,
                        TARIFF_TABLE_SET: false,
                        TARIFF_TABLE_GET: true,
                        PROTECTION_RESET_EM: false,
                        PROTECTION_RESET_MAGNETIC: true
                    },
                    calibrationFlags: {
                        calibrationEnable: false,
                        hardkey: true,
                        keyPressTest: true,
                        keyOpenkeyTest: true,
                        keyGerkonTest: false,
                        keyOpenKlemaTest: true,
                        keyOpenModuleTest: false,
                        keyPress2Test: true
                    },
                    currentTariffs: {
                        'A+': 0,
                        'A-': 0
                    },
                    isSummerTime: true
                }
            }
        }
    }
};

export const downlinkCommands = {
    getDateTime: {
        hex: {
            dump: '7e 50 ff ff ff fe 00 10 10 07 00 00 42 2d dd 7e',
            frameType: 'DATA_REQUEST (0x50)',
            accessLevel: 'UNENCRYPTED (0x00)',
            dstAddress: '0xffff',
            srcAddress: '0xfffe',
            messageId: '0',
            lrc: '0x42'
        },
        frame: {
            accessLevel: 'Read only'
        },
        commands: {
            getDateTime: {
                name: 'getDateTime',
                dump: '07 00'
            }
        }
    }
};
