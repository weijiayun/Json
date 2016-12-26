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

INPUTOBJECT21 = [
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
                "Type": "string"
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
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": 13.55,
                "DimensionX": None,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "DoubleTest",
                "Requiredness": False,
                "Type": "double"
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
                "Fieldname": "DateTest",
                "Requiredness": False,
                "Type": "date"
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
                "Fieldname": "TimeTest",
                "Requiredness": False,
                "Type": "time"
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
                "Fieldname": "TimeSpanTest",
                "Requiredness": False,
                "Type": "timespan"
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
                "Fieldname": "name",
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
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "iptest",
                "Requiredness": True,
                "Type": "ip"
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
            "Market":12,
            "DoubleTest":13,
            "DateTest":14,
            "TimeTest": 15,
            "TimeSpanTest": 16,
            "name":17,
            "iptest":18
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
INPUTOBJECT22=[
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
                "Type": "string"
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
                "Fieldname": "name",
                "Requiredness": True,
                "Type": "string"
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
            "Ranges": 8,
            "FeedMarket": 9,
            "OrderType": 10,
            "IsDaylight": 11,
            "Market": 12,
            "name":13
        },
        "TemplName": "Annapurnatest"
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

INPUTOBJECT4=[
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
                "Fieldname": "name",
                "Requiredness": True,
                "Type": "string"
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
            "Market":12,
            "name":13
        },
        "TemplName": "Annapurnatest"
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


class attrtest(object):
    def __init__(self):
        pass

    def trygetattr0(self):
        self.name = 'lucas'
        print self.name
        # equals to self.name
        print getattr(self, 'name')

    def attribute1(self, para1,para2):
        print 'attribute1 called and ' + para1 +para2+ ' is passed in as a parameter'

    def trygetattr(self):
        fun = getattr(self, 'attribute1')
        print type(fun)
        a = '"crown","sss"'
        print type(eval(a))
        fun()


if __name__ == '__main__':
    test = attrtest()
    print 'getattr(self,\'name\') equals to self.name '
    test.trygetattr0()
    print 'attribute1 is indirectly called by fun()'
    test.trygetattr()
    print 'attrribute1 is directly called'
