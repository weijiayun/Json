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
                "Reference": None,
                "DimensionX":None,
                "DimensionY":None,
                "Function":None
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
            "Strategies": {
                "Type": "list<uint32>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "strategy"
            },
            "IsDaylight":{
                "Type": "bool",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": False,
                "Reference": None
            },
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
            "Strategies": {
                "Type": "list<uint32>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "strategy"
            },
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
            },
            "Feedbeed": {
                "Type": "string",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Feedmarket": {
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
                "Type": "OrderType::type1",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Ranges": {
                "Type": "list<TradingRange1>",
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
                "Type": "list<FeedcodeMaxQty1>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            },
            "Strategies": {
                "Type": "list<uint32>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": "strategy"
            },
            "Market": {
                "Type": "sint32",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": True,
                "Default": None,
                "Reference": "market"
            },
            "Components": {
                "Type": "list<IInstructionComponent1>",
                "Requiredness": "required",
                "IsAuto": False,
                "IsFixed": False,
                "Default": None,
                "Reference": None
            }

        }
    },
    "OrderType::type1": {
        "Type": "OrderType::type1",
        "Category": "enum",
        "Fields": {
            "OTGFD": 0,
            "SIMULATION": 1,
            "IOC": 2,
            "POTF": 3
        }
    },
    "IStrategy1": {
        "Type": "IStrategy1",
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
    "IInstructionComponent1": {
        "Type": "IInstructionComponent1",
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
    "FeedcodeMaxQty1": {
        "Type": "FeedcodeMaxQty1",
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
    "TradingRange1":{
        "Type": "TradingRange1",
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

INPUTOBJECT2=[
    {
        "Category": "signal",
        "TemplType": "struct",
        "Fields": [
            {
                "Function": {
                    "FunctionName": "YHY",
                    "Parameters": []
                },
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "MidSignalId",
                "Requiredness": True,
                "Type": "uint32_t"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": "strategy",
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": "sint32",
                "Fieldname": "Strategies",
                "Requiredness": False,
                "Type": "list"
            },
            {
                "Function": {
                    "FunctionName": "ObserveHistory",
                    "Parameters": [
                        "MidSignalId",
                        "Strategies",
                        "Type",
                        "Id"
                    ]
                },
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "ObserveHistory",
                "Requiredness": True,
                "Type": "string"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "Type",
                "Requiredness": True,
                "Type": "string"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": "Autonomy",
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "diemen",
                "Requiredness": False,
                "Type": "SignalMode::type"
            },
            {
                "Function": None,
                "IsAuto": True,
                "Reference": None,
                "Default": None,
                "DimensionX": "diemen",
                "DimensionY": 1,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "Id",
                "Requiredness": True,
                "Type": "uint_32"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 1,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "I",
                "Requiredness": True,
                "Type": "vec"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "RiskMatrix",
                "Requiredness": False,
                "Type": "mat"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": "IInstructionComponent",
                "Fieldname": "Ranges",
                "Requiredness": True,
                "Type": "list"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": "FeedcodeMaxQty",
                "Fieldname": "FeedMarket",
                "Requiredness": True,
                "Type": "list"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": "OrderType::type",
                "Fieldname": "OrderType",
                "Requiredness": True,
                "Type": "enum"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "IsDaylight",
                "Requiredness": True,
                "Type": "bool"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": "market",
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": "sint32",
                "Fieldname": "Market",
                "Requiredness": False,
                "Type": "sint_32"
            }
        ],
        "BaseName": "signal",
        "FieldName": {
            "I": 6,
            "diemen": 4,
            "MidSignalId": 0,
            "RiskMatrix": 7,
            "Strategies": 1,
            "ObserveHistory": 2,
            "Type": 3,
            "Id": 5,
            "Ranges":8,
            "FeedMarket":9,
            "OrderType":10,
            "IsDaylight":11,
            "Market":12
        },
        "TemplName": "Annapurna"
    },
    {
        "Category": "signal",
        "TemplType": "struct",
        "Fields": [
            {
                "Function": {
                    "FunctionName": "YHY",
                    "Parameters": []
                },
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "END",
                "Requiredness": True,
                "Type": "uint_32"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "Start",
                "Requiredness": False,
                "Type": "sint_32"
            }
        ],
        "BaseName": "signal",
        "FieldName": {
            "END": 0,
            "Start":1
        },
        "TemplName": "IInstructionComponent"
    },
    {
      "Category": "signal",
      "TemplType": "struct",
      "Fields": [
          {
              "Function": {
                  "FunctionName": "YHY",
                  "Parameters": []
              },
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": True,
              "EleType": None,
              "Fieldname": "Feedmarket",
              "Requiredness": True,
              "Type": "uint_32"
          },
          {
              "Function": None,
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": False,
              "EleType": None,
              "Fieldname": "Feedbeed",
              "Requiredness": False,
              "Type": "sint_32"
          },
          {
              "Function": None,
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": False,
              "EleType": None,
              "Fieldname": "Feedcode",
              "Requiredness": False,
              "Type": "sint_32"
          },
          {
              "Function": None,
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": False,
              "EleType": None,
              "Fieldname": "MaxQty",
              "Requiredness": False,
              "Type": "sint_32"
          }
      ],
      "BaseName": "signal",
      "FieldName": {
          "Feedmarket":0,
          "Feedbeed":1,
          "Feedcode":2,
          "MaxQty":3
      },
      "TemplName":"FeedcodeMaxQty"
    },
    {
        "TemplType": "enum",
        "Values": {
            "POTF": 3,
            "SIMULATION": 1,
            "IOC": 2,
            "OTGFD": 0
        },
        "TemplName": "OrderType::type"
    }
]
INPUTOBJECT3=[
    {
        "Category": "signal",
        "TemplType": "struct",
        "Fields": [
            {
                "Function": {
                    "FunctionName": "YHY",
                    "Parameters": []
                },
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "MidSignalId",
                "Requiredness": True,
                "Type": "uint_32"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": "strategy",
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": "sint32",
                "Fieldname": "Strategies",
                "Requiredness": False,
                "Type": "list"
            },
            {
                "Function": {
                    "FunctionName": "ObserveHistory",
                    "Parameters": [
                        "MidSignalId",
                        "Strategies",
                        "Type",
                        "Id"
                    ]
                },
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "ObserveHistory",
                "Requiredness": True,
                "Type": "string"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "Type",
                "Requiredness": True,
                "Type": "string"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": "Autonomy",
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "diemen",
                "Requiredness": False,
                "Type": "SignalMode::type"
            },
            {
                "Function": None,
                "IsAuto": True,
                "Reference": None,
                "Default": None,
                "DimensionX": "diemen",
                "DimensionY": 1,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "Id",
                "Requiredness": True,
                "Type": "uint_32"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 1,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "I",
                "Requiredness": True,
                "Type": "vec"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "RiskMatrix",
                "Requiredness": False,
                "Type": "mat"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": "IInstructionComponent",
                "Fieldname": "Ranges",
                "Requiredness": True,
                "Type": "list"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": "FeedcodeMaxQty",
                "Fieldname": "FeedMarket",
                "Requiredness": True,
                "Type": "list"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": "OrderType::type",
                "Fieldname": "OrderType",
                "Requiredness": True,
                "Type": "enum"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": 2,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "IsDaylight",
                "Requiredness": True,
                "Type": "bool"
            }
        ],
        "BaseName": "signal",
        "FieldName": {
            "I": 6,
            "diemen": 4,
            "MidSignalId": 0,
            "RiskMatrix": 7,
            "Strategies": 1,
            "ObserveHistory": 2,
            "Type": 3,
            "Id": 5,
            "Ranges":8,
            "FeedMarket":9,
            "OrderType":10,
            "IsDaylight":11
        },
        "TemplName": "Annapurna1"
    },
    {
        "Category": "signal",
        "TemplType": "struct",
        "Fields": [
            {
                "Function": {
                    "FunctionName": "YHY",
                    "Parameters": []
                },
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": True,
                "EleType": None,
                "Fieldname": "END",
                "Requiredness": True,
                "Type": "uint_32"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "Start",
                "Requiredness": False,
                "Type": "sint_32"
            }
        ],
        "BaseName": "signal",
        "FieldName": {
            "END": 0,
            "Start":1
        },
        "TemplName": "IInstructionComponent1"
    },
    {
      "Category": "signal",
      "TemplType": "struct",
      "Fields": [
          {
              "Function": {
                  "FunctionName": "YHY",
                  "Parameters": []
              },
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": True,
              "EleType": None,
              "Fieldname": "Feedmarket",
              "Requiredness": True,
              "Type": "uint_32"
          },
          {
              "Function": None,
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": False,
              "EleType": None,
              "Fieldname": "Feedbeed",
              "Requiredness": False,
              "Type": "sint_32"
          },
          {
              "Function": None,
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": False,
              "EleType": None,
              "Fieldname": "Feedcode",
              "Requiredness": False,
              "Type": "sint_32"
          },
          {
              "Function": None,
              "IsAuto": False,
              "Reference": None,
              "Default": None,
              "DimensionX": None,
              "DimensionY": None,
              "IsFixed": False,
              "EleType": None,
              "Fieldname": "MaxQty",
              "Requiredness": False,
              "Type": "sint_32"
          }
      ],
      "BaseName": "signal",
      "FieldName": {
          "Feedmarket":0,
          "Feedbeed":1,
          "Feedcode":2,
          "MaxQty":3
      },
      "TemplName":"FeedcodeMaxQty1"
    },
    {
        "TemplType": "enum",
        "Values": {
            "POTF": 3,
            "SIMULATION": 1,
            "IOC": 2,
            "OTGFD": 0
        },
        "TemplName": "OrderType::type1"
    }
]
def ConvertTowebFormatJson(data):
    outputDict={}
    for elem in data:
        template = {}
        if elem["TemplType"]=="enum":
            template["TemplType"] = elem["TemplType"]
            template["Fields"] = elem["Values"]
            template["TemplName"] = elem["TemplName"]
        else:
            temldict={}
            for varname,varindex in elem["FieldName"].items():
                temldict[varname]= elem["Fields"][varindex]
            template["Category"] = elem["Category"]
            template["TemplType"] = elem["TemplType"]
            template["BaseName"] = elem["BaseName"]
            template["Type"] = elem["TemplName"]
            template["Fields"] = temldict
        outputDict[elem["TemplName"]] = template
    return outputDict
