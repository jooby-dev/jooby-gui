export const uplinkCommands = {
    'new event': {
        hex: {
            dump: '1506081e000973cbe1',
            lrc: '0xe1'
        },
        base64: 'FQYIHgAJc8vh',
        commands: {
            newEvent: {
                name: 'newEvent',
                dump: '15 06 08 1e 00 09 73 cb',
                parameters: {
                    id: 8,
                    name: 'REMOVE',
                    sequenceNumber: 30,
                    data: {
                        time2000: 619467
                    }
                }
            }
        }
    },
    currentMc: {
        hex: {
            dump: '1805038ab3097b00',
            lrc: '0x00'
        },
        base64: 'GAUDirMJewA=',
        commands: {
            currentMc: {
                name: 'currentMc',
                dump: '18 05 03 8a b3 09 7b',
                parameters: {
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
            }
        }
    },
    getParameter: {
        hex: {
            dump: '04020d035d',
            lrc: '0x5d'
        },
        base64: 'BAINA10=',
        commands: {
            getParameter: {
                name: 'getParameter',
                dump: '04 02 0d 03',
                parameters: {
                    id: 13,
                    name: 'CHANNELS_CONFIG',
                    data: {
                        value: 3
                    }
                }
            }
        }
    },
    status: {
        hex: {
            dump: '140d02760c01e25b9481e017fdbc634c',
            lrc: '0x4c'
        },
        base64: 'FA0CdgwB4luUgeAX/bxjTA==',
        commands: {
            status: {
                name: 'status',
                dump: '14 0d 02 76 0c 01 e2 5b 94 81 e0 17 fd bc 63',
                parameters: {
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
            }
        }
    },
    getBatteryStatus: {
        hex: {
            dump: '1f050b0de20b9b72fa17fd00000059',
            lrc: '0x59'
        },
        base64: 'HwULDeILm3L6F/0AAABZ',
        commands: {
            getBatteryStatus: {
                name: 'getBatteryStatus',
                dump: '1f 05 0b 0d e2 0b 9b 72 fa 17 fd 00 00 00',
                parameters: {
                    voltageUnderLowLoad: 3554,
                    voltageUnderHighLoad: 2971,
                    internalResistance: 29434,
                    temperature: 23,
                    remainingCapacity: 253,
                    isLastDayOverconsumption: false,
                    averageDailyOverconsumptionCounter: 0
                }
            }
        }
    },
    // todo: need to fix issue #39533
    /* 'currentMc + lastEvent': {
         hex: {
             dump: '1802011d629c00ad',
             lrc: '0xad'
         },
         base64: 'GAIBHWKcAK0=',
         hardwareType: 'IMP4EU',
         commands: {
             currentMc: {
                 name: 'currentMc',
                 dump: '18 02 01 1d',
                 parameters: {
                     channelList: [
                         {
                             value: 29,
                             index: 1
                         }
                     ]
                 }
             },
             lastEvent: {
                 name: 'lastEvent',
                 dump: '62 9c 00',
                 parameters: {
                     sequenceNumber: 156,
                     status: {
                         isBatteryLow: false,
                         isConnectionLost: false,
                         isFirstChannelInactive: false,
                         isSecondChannelInactive: false,
                         isThirdChannelInactive: false,
                         isForthChannelInactive: false
                     }
                 }
             }
         }
     },
     'hourMc + lastEvent': {
         hex: {
             dump: '170d2eecf10199350000000000000062bc000f',
             lrc: '0x0f'
         },
         base64: 'Fw0u7PEBmTUAAAAAAAAAYrwADw==',
         hardwareType: 'IMP4EU',
         commands: {
             hourMc: {
                 name: 'hourMc',
                 dump: '17 0d 2e ec f1 01 99 35 00 00 00 00 00 00 00',
                 parameters: {
                     startTime2000: 742496400,
                     hours: 8,
                     channelList: [
                         {
                             value: 6809,
                             diff: [
                                 0,
                                 0,
                                 0,
                                 0,
                                 0,
                                 0,
                                 0
                             ],
                             index: 1
                         }
                     ]
                 }
             },
             lastEvent: {
                 name: 'lastEvent',
                 dump: '62 bc 00',
                 parameters: {
                     sequenceNumber: 188,
                     status: {
                         isBatteryLow: false,
                         isConnectionLost: false,
                         isFirstChannelInactive: false,
                         isSecondChannelInactive: false,
                         isThirdChannelInactive: false,
                         isForthChannelInactive: false
                     }
                 }
             }
         }
     },*/
    'time2000 + status': {
        hex: {
            dump: '09054e2c41dd5e140d02760c01e23b9780c218fdbc63af',
            lrc: '0xaf'
        },
        base64: 'CQVOLEHdXhQNAnYMAeI7l4DCGP28Y68=',
        hardwareType: 'IMP4EU',
        commands: {
            time2000: {
                name: 'time2000',
                dump: '09 05 4e 2c 41 dd 5e',
                parameters: {
                    sequenceNumber: 78,
                    time2000: 742514014
                }
            },
            status: {
                name: 'status',
                dump: '14 0d 02 76 0c 01 e2 3b 97 80 c2 18 fd bc 63',
                parameters: {
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
                            underLowLoad: 3619,
                            underHighLoad: 2967
                        },
                        batteryInternalResistance: 32962,
                        temperature: 24,
                        remainingBatteryCapacity: 99.6,
                        lastEventSequenceNumber: 188,
                        downlinkQuality: 99
                    }
                }
            }
        }
    },
    'getLmicInfo + getArchiveHoursMc + getArchiveEvents': {
        hex: {
            dump: '1f0202000b1a042f970c000b00e0',
            lrc: '0xe0'
        },
        base64: 'HwICAAsaBC+XDAALAOA=',
        hardwareType: 'IMP4EU',
        commands: {
            getLmicInfo: {
                name: 'getLmicInfo',
                dump: '1f 02 02 00 0b',
                parameters: {
                    capabilities: {
                        isMulticastSupported: false,
                        isFragmentedDataSupported: false
                    },
                    version: 11
                }
            },
            getArchiveHoursMc: {
                name: 'getArchiveHoursMc',
                dump: '1a 04 2f 97 0c 00',
                parameters: {
                    startTime2000: 756648000,
                    hours: 1,
                    channelList: []
                }
            },
            getArchiveEvents: {
                name: 'getArchiveEvents',
                dump: '0b 00',
                parameters: {
                    eventList: []
                }
            }
        }
    }
};

export const downlinkCommands = {
    getCurrent: {
        hex: {
            dump: '07 00 52',
            lrc: '0x52'
        },
        commands: {
            getCurrent: {
                name: 'getCurrent',
                dump: '07 00'
            }
        }
    },
    getStatus: {
        hex: {
            dump: '14 00 41',
            lrc: '0x41'
        },
        commands: {
            getStatus: {
                name: 'getStatus',
                dump: '14 00'
            }
        }
    },
    getTime2000: {
        hex: {
            dump: '09 00 5c',
            lrc: '0x5c'
        },
        commands: {
            getTime2000: {
                name: 'getTime2000',
                dump: '09 00'
            }
        }
    },
    getBatteryStatus: {
        hex: {
            dump: '1f 05 00 4f',
            lrc: '0x4f'
        },
        commands: {
            getBatteryStatus: {
                name: 'getBatteryStatus',
                dump: '1f 05 00'
            }
        }
    },
    getLmicInfo: {
        hex: {
            dump: '1f 02 00 48',
            lrc: '0x48'
        },
        commands: {
            getLmicInfo: {
                name: 'getLmicInfo',
                dump: '1f 02 00'
            }
        }
    },
    'setParameter + getParameter + setParameter': {
        hex: {
            dump: '03 02 18 01 04 01 18 03 05 01 00 00 00 06 51',
            lrc: '0x51'
        },
        commands: {
            setParameterAbsoluteData: {
                name: 'setParameter',
                dump: '03 02 18 01',
                parameters: {
                    id: 24,
                    data: {
                        state: 1
                    }
                }
            },
            getParameter: {
                name: 'getParameter',
                dump: '04 01 17',
                parameters: {
                    id: 24,
                    data: null
                }
            },
            setParameterInterval: {
                name: 'setParameter',
                dump: '03 05 01 00 00 00 06',
                parameters: {
                    id: 1,
                    data: {
                        value: 3600
                    }
                }
            }
        }
    },
    'getExAbsArchiveHoursMc + getExAbsArchiveDaysMc + getExAbsArchiveCurrentMc': {
        hex: {
            dump: '1f 0c 04 2f 97 0c 01 1f 0d 04 2f 98 01 01 1f 0f 00 46',
            lrc: '0x46'
        },
        commands: {
            getExAbsArchiveHoursMc: {
                name: 'getExAbsArchiveHoursMc',
                dump: '1f 0c 04 2f 97 0c 01',
                parameters: {
                    channelList: [1],
                    hours: 1,
                    startTime2000: 756648000
                }
            },
            getExAbsArchiveDaysMc: {
                name: 'getExAbsArchiveDaysMc',
                dump: '1f 0d 04 2f 98 01 01',
                parameters: {
                    startTime2000: 756691200,
                    days: 1,
                    channelList: [1]
                }
            },
            getExAbsCurrentMc: {
                name: 'getExAbsCurrentMc',
                dump: '1f 0f 00'
            }
        }
    }
};
