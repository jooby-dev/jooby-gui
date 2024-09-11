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
    },
    getObserverSingleMode: {
        hex: {
            dump: '0e020701'
        },
        commands: {
            getMeterIdList: {
                name: 'getObserverSingleMode',
                dump: '0e 02 07 01',
                parameters: {
                    requestId: 7,
                    isSingleMode: true
                }
            }
        }
    },
    getObserverUptime: {
        hex: {
            dump: '0605070013de30'
        },
        commands: {
            getMeterIdList: {
                name: 'getObserverUptime',
                dump: '06 05 07 00 13 de 30',
                parameters: {
                    requestId: 7,
                    uptime: 1302064
                }
            }
        }
    },
    getObserverCapabilities: {
        hex: {
            dump: '04050708080001'
        },
        commands: {
            getMeterIdList: {
                name: 'getObserverCapabilities',
                dump: '04 05 07 08 08 00 01',
                parameters: {
                    requestId: 7,
                    maxMeterProfilesNumber: 8,
                    maxMetersNumber: 8,
                    maxObisProfilesNumber: 0,
                    isMultiModeSupported: true
                }
            }
        }
    },
    getObserverInfo: {
        hex: {
            dump: '022907000e00060101214a6f6f627920456c656374726120524d204c6f726157616e203144343835204555'
        },
        commands: {
            getMeterIdList: {
                name: 'getObserverInfo',
                dump: '02 29 07 00 0e 00 06 01 01 21 4a 6f 6f 62 79 20 45 6c 65 63 74 72 61 20 52 '
                    + '4d 20 4c 6f 72 61 57 61 6e 20 31 44 34 38 35 20 45 55',
                parameters: {
                    requestId: 7,
                    softwareVersion: {
                        major: 0,
                        minor: 14
                    },
                    protocolVersion: {
                        major: 0,
                        minor: 6
                    },
                    hardwareVersion: {
                        major: 1,
                        minor: 1
                    },
                    deviceName: 'Jooby Electra RM LoraWan 1D485 EU'
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
    },
    getObserverInfo: {
        hex: {
            dump: '01 01 07'
        },
        commands: {
            getLorawanInfo: {
                name: 'getObserverInfo',
                dump: '01 01 07',
                parameters: {
                    requestId: 7
                }
            }
        }
    },
    getObserverCapabilities: {
        hex: {
            dump: '03 01 07'
        },
        commands: {
            getLorawanInfo: {
                name: 'getObserverCapabilities',
                dump: '03 01 07',
                parameters: {
                    requestId: 7
                }
            }
        }
    },
    getObserverUptime: {
        hex: {
            dump: '05 01 07'
        },
        commands: {
            getLorawanInfo: {
                name: 'getObserverUptime',
                dump: '05 01 07',
                parameters: {
                    requestId: 7
                }
            }
        }
    },
    getObserverSingleMode: {
        hex: {
            dump: '0d 01 07'
        },
        commands: {
            getLorawanInfo: {
                name: 'getObserverSingleMode',
                dump: '0d 01 07',
                parameters: {
                    requestId: 7
                }
            }
        }
    }
};
