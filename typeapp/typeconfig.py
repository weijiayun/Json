#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'

TYPES = {
    1:"Choose hero",
    2:"Spider Man",
    3:"Wolverine",
    4:"Captain America",
    5:"X-Men",
    6:"Crocodile",
    7:"Json Wei"
}
INPUTOBJECT = {
    "Automaton": {
        "Type": "Automaton",
        "Category": "strategy",
        "Fields": {
            "I": {
                "Type": "vec<3>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "OrderType": {
                "Type": "OrderType::type",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Ranges": {
                "Type": "list<TradingRange>",
                "Requiredness": "optional",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "RiskMatrix": {
                "Type": "mat<3,3>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Dimension": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": 3,
                "Reference": None
            },
            "Type": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": "Automaton",
                "Reference": None
            },
            "SplitType": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": "ShyGirl",
                "Reference": None
            },
            "MaxOrderQty": {
                "Type": "list<FeedcodeMaxQty>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            # "Strategies": {
            #     "Type": "list<uint32>",
            #     "Requiredness": "required",
            #     "IsAuto": False,
            #     "IsFixed": False,
            #     "Default": None,
            #     "Reference": "strategy"
            # },
            "Market": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": None,
                "Reference": "market"
            },
            "Components": {
                "Type": "list<IInstructionComponent>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }

        }
    },
    "OrderType::type": {
        "Type": "OrderType::type",
        "Category": "enum",
        "Fields": {
            "OTGFD": 0,
            "SIMULATION": 1,
            "IOC": 2,
            "POTF": 3
        }
    },
    "IStrategy": {
        "Type": "IStrategy",
        "Category": "strategy",
        "Fields": {
            "Name": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Id": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": True,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Type": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": "IStrategy",
                "Reference": None
            }
        }
    },
    "IInstructionComponent": {
        "Type": "IInstructionComponent",
        "Category": "struct",
        "Fields": {
            "End": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "DateTime"
            },
            "Start": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "DateTime"
            }
        }
    },
    "FeedcodeMaxQty": {
        "Type": "FeedcodeMaxQty",
        "Category": "struct",
        "Fields": {
            "MaxQty": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Feedcode": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }
        }
    },
    "TradingRange":{
        "Type": "TradingRange",
        "Category": "struct",
        "Fields": {
            "End": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Start": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }
        }
    }
}
INPUTOBJECT1 = {
    "Automatontest": {
        "Type": "Automatontest",
        "Category": "strategy",
        "Fields": {
            "I": {
                "Type": "vec<3>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "OrderType": {
                "Type": "OrderType::type",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Ranges": {
                "Type": "list<TradingRange>",
                "Requiredness": "optional",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "RiskMatrix": {
                "Type": "mat<3,3>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Dimension": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": 3,
                "Reference": None
            },
            "Type": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": "Automaton",
                "Reference": None
            },
            "SplitType": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": "ShyGirl",
                "Reference": None
            },
            "MaxOrderQty": {
                "Type": "list<FeedcodeMaxQty>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            # "Strategies": {
            #     "Type": "list<uint32>",
            #     "Requiredness": "required",
            #     "IsAuto": False,
            #     "IsFixed": False,
            #     "Default": None,
            #     "Reference": "strategy"
            # },
            "Market": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": None,
                "Reference": "market"
            },
            "Components": {
                "Type": "list<IInstructionComponent>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }

        }
    },
    "OrderType::type": {
        "Type": "OrderType::type",
        "Category": "enum",
        "Fields": {
            "OTGFD": 0,
            "SIMULATION": 1,
            "IOC": 2,
            "POTF": 3
        }
    },
    "IStrategy": {
        "Type": "IStrategy",
        "Category": "strategy",
        "Fields": {
            "Name": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Id": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": True,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Type": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": "IStrategy",
                "Reference": None
            }
        }
    },
    "IInstructionComponent": {
        "Type": "IInstructionComponent",
        "Category": "struct",
        "Fields": {
            "End": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "DateTime"
            },
            "Start": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "DateTime"
            }
        }
    },
    "FeedcodeMaxQty": {
        "Type": "FeedcodeMaxQty",
        "Category": "struct",
        "Fields": {
            "MaxQty": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Feedcode": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }
        }
    },
    "TradingRange":{
        "Type": "TradingRange",
        "Category": "struct",
        "Fields": {
            "End": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Start": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }
        }
    }
}
