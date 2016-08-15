
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
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "Id",
                "Requiredness": True,
                "Type": "vec"
            },
            {
                "Function": None,
                "IsAuto": False,
                "Reference": None,
                "Default": None,
                "DimensionX": 3,
                "DimensionY": None,
                "IsFixed": False,
                "EleType": None,
                "Fieldname": "I",
                "Requiredness": False,
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
            "Id": 5
        },
        "TemplName": "Annapurna"
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
            template["TemplName"] = elem["TemplName"]
            template["Fields"] = temldict
        outputDict[elem["TemplName"]] = template
    return outputDict


print ConvertTowebFormatJson(INPUTOBJECT2)



