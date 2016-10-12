#!/opt/Apps/local/Python/anaconda/bin/python
#coding: utf-8
import json
class MyEncoder(json.JSONEncoder):
    def default(self, o):
        so = {}
        for attr in o.__dict__:
            # if getattr(o, attr) == {}:
            #     pass
            # elif getattr(o, attr) == []:
            #     pass
            # elif getattr(o, attr) == None:
            #     pass
            if not callable(attr):
                v = getattr(o, attr)
                if not v and issubclass(type(v), VV):
                    so[attr] = self.default(v)
                else:
                    so[attr] = v
        return so

class VV(object):
    pass

class MergeField(VV):
    def __init__(self):
        self.Default = None
        self.Source = []
        self.Value = None
        self.Type = None
        self.Operate = []
        self.Function = {}

class MergeObject(VV):
    def __init__(self,OptionDict):
        self.FieldsDict = {}  #连接MergeField
        self.SourcesDict = []
        self.MergeTemplName = OptionDict["NewName"].encode()
        self.MergeTemplVersion = OptionDict["NewVersion"].encode()
        self.OperateLists = OptionDict
        count=1
        for i1 in range(len(OptionDict)-2):
            while(("Option_"+str(count)) not in OptionDict.keys()):
                count = count+1
            op_name = "Option_"+str(count)
            if(OptionDict[op_name]["Operate"]=='Merge'):
                self.Merge(OptionDict[op_name])
                count = count + 1
                continue
            if (OptionDict[op_name]["Operate"] == 'Fixed'):
                self.FixField(OptionDict[op_name])
                count = count + 1
                continue
            if (OptionDict[op_name]["Operate"] == 'Connected'):
                self.Connected(OptionDict[op_name])
                count = count + 1
                continue

    def Connected(self,obj):
        value = obj["Value"]
        try:
            value = value.encode()
        except AttributeError:
            pass
        texttemp = obj["Field"].encode()
        text = texttemp.split()
        type = text[1].encode()
        source = obj["Source"].encode()
        self.FieldsDict.setdefault(text[2], MergeField())
        self.FieldsDict[text[2]].Value = value
        self.FieldsDict[text[2]].Type = type
        self.FieldsDict[text[2]].Operate.append('Connected')
        if source not in self.SourcesDict:
            self.SourcesDict.append(source)
        else:
            pass
        if source not in self.FieldsDict[text[2]].Source:
            self.FieldsDict[text[2]].Source.append(source)
        else:
            pass

    def FixField(self, obj):  # [A,B,new name,[]]
        value = obj["Value"]
        try:
            value = value.encode()
        except AttributeError:
            pass
        texttemp = obj["Field"].encode()
        text = texttemp.split()
        type = text[1].encode()
        source = obj["Source"].encode()
        self.FieldsDict.setdefault(text[2], MergeField())
        self.FieldsDict[text[2]].Value = value
        self.FieldsDict[text[2]].Type = type
        self.FieldsDict[text[2]].Operate.append('Fixed')
        if source not in self.SourcesDict:
            self.SourcesDict.append(source)
        else:
            pass
        if source not in self.FieldsDict[text[2]].Source:
            self.FieldsDict[text[2]].Source.append(source)
        else:
            pass
        if 'default' in obj["Field"]:
            self.FieldsDict[text[2]].Default = text[4].rstrip(";")

    def Merge(self,obj):
        value = obj["Value"]
        try:
            value = value.encode()
        except AttributeError:
            pass
        texttemp = obj["Field"].encode()
        text=texttemp.split()
        type = text[1].encode()
        sourcedict = obj["Source"]
        self.FieldsDict.setdefault(text[2], MergeField())
        self.FieldsDict[text[2]].Value = value
        self.FieldsDict[text[2]].Type = type
        self.FieldsDict[text[2]].Operate.append('Merge')
        self.FieldsDict[text[2]].Source = {}
        for i2 in sourcedict.keys():
            # sourcedict[i2]=sourcedict[i2].encode()
            if i2 not in self.SourcesDict:
                self.SourcesDict.append(i2)
            else:
                pass
            if i2 not in self.FieldsDict[text[2]].Source.keys():
                self.FieldsDict[text[2]].Source[i2] = sourcedict[i2]
            else:
                pass
        if 'equal' in obj["Field"]:
            self.FieldsDict[text[2]].Value = text[4]
        if 'default' in obj["Field"]:
            self.FieldsDict[text[2]].Default = text[4].rstrip(";")
