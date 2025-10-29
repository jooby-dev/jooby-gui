export const uplinkCommands = {
    getDateTime: {
        hex: {
            dump: '1e 11 e4 91 00 10 10 07 08 01 3a 32 10 03 10 07 18 00 5f 6a',
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
            message: {
                segmentationSessionId: '228'
            },
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
    },
    getEnergyDayPrevious: {
        hex: {
            dump: '1e 1c ef 91 66 10 10 03 13 18 07 10 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92 00 38 0a',
            lrc: '0x0a'
        },
        base64: 'HhzvkWYQEAMTGAcQAADd0AAAY/UAAGLaAADTkgA4Cg==',
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 1c ef 91 66 10 10 03 13 18 07 10 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92 00 38',
                    parameters: {
                        segmentationSessionId: 239,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            102,
                            16,
                            16,
                            3,
                            19,
                            24,
                            7,
                            16,
                            0,
                            0,
                            221,
                            208,
                            0,
                            0,
                            99,
                            245,
                            0,
                            0,
                            98,
                            218,
                            0,
                            0,
                            211,
                            146,
                            0,
                            56
                        ]
                    }
                }
            }
        },
        mtx: {
            dump: '66 10 10 03 13 18 07 10 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92 00 38',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x38',
            message: {
                segmentationSessionId: '239',
                messageId: '102'
            },
            commands: {
                getDateTime: {
                    name: 'getEnergyDayPrevious',
                    dump: '03 13 18 07 10 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92',
                    parameters: {
                        date: {
                            year: 24,
                            month: 7,
                            date: 16
                        },
                        energies: [
                            56784,
                            25589,
                            25306,
                            54162
                        ]
                    }
                }
            }
        }
    },
    getMonthDemand: {
        hex: {
            dump: '1e 1b f5 91 08 10 10 17 12 18 07 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92 00 3d 79',
            lrc: '0x79'
        },
        base64: 'Hhv1kQgQEBcSGAcAAN3QAABj9QAAYtoAANOSAD15',
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 1b f5 91 08 10 10 17 12 18 07 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92 00 3d',
                    parameters: {
                        segmentationSessionId: 245,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            8,
                            16,
                            16,
                            23,
                            18,
                            24,
                            7,
                            0,
                            0,
                            221,
                            208,
                            0,
                            0,
                            99,
                            245,
                            0,
                            0,
                            98,
                            218,
                            0,
                            0,
                            211,
                            146,
                            0,
                            61
                        ]
                    }
                }
            }
        },
        mtx: {
            dump: '08 10 10 17 12 18 07 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92 00 3d',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x3d',
            message: {
                segmentationSessionId: '245',
                messageId: '8'
            },
            commands: {
                getDateTime: {
                    name: 'getMonthDemand',
                    dump: '17 12 18 07 00 00 dd d0 00 00 63 f5 00 00 62 da 00 00 d3 92',
                    parameters: {
                        year: 24,
                        month: 7,
                        energies: [
                            56784,
                            25589,
                            25306,
                            54162
                        ]
                    }
                }
            }
        }
    },
    getCurrentValues: {
        hex: {
            dump: '1e 29 f6 91 09 10 10 0d 20 00 00 00 00 00 00 00 00 00 03 5c 41 00 00 00 00'
                + ' 03 e8 00 00 00 00 00 00 00 00 00 00 00 00 03 e8 00 76 49',
            lrc: '0x49'
        },
        base64: 'Hin2kQkQEA0gAAAAAAAAAAAAA1xBAAAAAAPoAAAAAAAAAAAAAAAAA+gAdkk=',
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 29 f6 91 09 10 10 0d 20 00 00 00 00 00 00 00 00 00 03 5c 41 00'
                        + ' 00 00 00 03 e8 00 00 00 00 00 00 00 00 00 00 00 00 03 e8 00 76',
                    parameters: {
                        segmentationSessionId: 246,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            9,
                            16,
                            16,
                            13,
                            32,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            3,
                            92,
                            65,
                            0,
                            0,
                            0,
                            0,
                            3,
                            232,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            0,
                            3,
                            232,
                            0,
                            118
                        ]
                    }
                }
            }
        },
        mtx: {
            dump: '09 10 10 0d 20 00 00 00 00 00 00 00 00 00 03 5c 41 00 00 00 00 03 e8 00 00 00 00 00 00 00 00 00 00 00 00 03 e8 00 76',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x76',
            message: {
                segmentationSessionId: '246',
                messageId: '9'
            },
            commands: {
                getDateTime: {
                    name: 'getCurrentValues',
                    dump: '0d 20 00 00 00 00 00 00 00 00 00 03 5c 41 00 00 00 00 03 e8 00 00 00 00 00 00 00 00 00 00 00 00 03 e8',
                    parameters: {
                        powerA: 0,
                        iaRms: 0,
                        vavbRms: 220225,
                        varA: 0,
                        pfA: 1,
                        ibRms: 0,
                        powerB: 0,
                        varB: 0,
                        pfB: 1
                    }
                }
            }
        }
    }
};

export const downlinkCommands = {
    getDateTime: {
        hex: {
            dump: '1e 09 00 91 00 10 10 07 00 00 42 96'
        },
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
                    dump: '1e 09 00 91 00 10 10 07 00 00 42',
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
    },
    getOperatorParameters: {
        hex: {
            dump: '1e 09 00 91 00 10 10 1e 00 00 5b 96'
        },
        mtx: {
            dump: '00 10 10 1e 00 00 5b',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x5b',
            commands: {
                getDateTime: {
                    name: 'getOperatorParameters',
                    dump: '1e 00'
                }
            }
        },
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 09 00 91 00 10 10 1e 00 00 5b',
                    parameters: {
                        segmentationSessionId: 0,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            0,
                            16,
                            16,
                            30,
                            0,
                            0,
                            91
                        ]
                    }
                }
            }
        }
    },
    getSaldoParameters: {
        hex: {
            dump: '1e 09 00 91 00 10 10 2e 00 00 6b 96'
        },
        mtx: {
            dump: '00 10 10 2e 00 00 6b',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x6b',
            commands: {
                getDateTime: {
                    name: 'getSaldoParameters',
                    dump: '2e 00'
                }
            }
        },
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 09 00 91 00 10 10 2e 00 00 6b',
                    parameters: {
                        segmentationSessionId: 0,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            0,
                            16,
                            16,
                            46,
                            0,
                            0,
                            107
                        ]
                    }
                }
            }
        }
    },
    getBv: {
        hex: {
            dump: '1e 09 00 91 00 10 10 70 00 00 35 96'
        },
        mtx: {
            dump: '00 10 10 70 00 00 35',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x35',
            commands: {
                getDateTime: {
                    name: 'getBv',
                    dump: '70 00'
                }
            }
        },
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 09 00 91 00 10 10 70 00 00 35',
                    parameters: {
                        segmentationSessionId: 0,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            0,
                            16,
                            16,
                            112,
                            0,
                            0,
                            53
                        ]
                    }
                }
            }
        }
    },
    getEventStatus: {
        hex: {
            dump: '1e 09 00 91 00 10 10 01 00 00 44 96'
        },
        mtx: {
            dump: '00 10 10 01 00 00 44',
            accessLevel: 'UNENCRYPTED (0x00)',
            messageId: 0,
            lrc: '0x44',
            commands: {
                getDateTime: {
                    name: 'getEventStatus',
                    dump: '01 00'
                }
            }
        },
        analog: {
            commands: {
                dataSegment: {
                    name: 'dataSegment',
                    dump: '1e 09 00 91 00 10 10 01 00 00 44',
                    parameters: {
                        segmentationSessionId: 0,
                        segmentIndex: 1,
                        segmentsNumber: 1,
                        isLast: true,
                        data: [
                            0,
                            16,
                            16,
                            1,
                            0,
                            0,
                            68
                        ]
                    }
                }
            }
        }
    }
};
