#!/opt/Apps/local/Python/anaconda/bin/python
#coding: utf-8
import re
class VV(object):
    pass

class MergeField(VV):
    def __init__(self):
        self.Default = None
        self.Source = None
        self.Value = None
        self.Option = []
        self.Function = {}

class MergeObject(VV):
    def __init__(self,OptionList):
        self.FieldsDict = {}  #连接MergeField
        self.SourcesDict = {}
        IsComposite = True
        self.OptionDcode(OptionList)

    def OptionDcode(self,OptionList):
        for i1 in range(len(OptionList)):
            if OptionList[i1][0]=='AddSources':   #{1:['AddSources',[add list]]}
                self.AddSources(OptionList[i1][1])
            elif OptionList[i1][0]=='DeleteSource': #{2:['DeleteSource',[delete list]]}
                self.DeleteSource(OptionList[i1][1])
            elif OptionList[i1][0]=='Merge':        #{3:['Merge',[merge list],[new name for field]]}
                self.AddField(OptionList[i1][2])
                self.Merge(OptionList[i1][1])
            elif OptionList[i1][0]=='Fixed':        #{4:['Fixed',[fix list]]}
                self.FixField(OptionList[i1][1])
            elif OptionList[i1][0]=='AddField':     #{5:['AddField',[add list],[new name for field]]}
                self.AddField(OptionList[i1][2])

    def AddSources(self,valuelist):
        for i2 in range(len(valuelist)):
            self.SourcesDict.setdefault(i2,valuelist[i2])

    def DeleteSource(self,valuelist):
        for i2 in range(len(valuelist)):
            for i0 in range(len(self.SourcesDict)):
                if self.SourcesDict[i0] == valuelist[i2]:
                    del self.SourcesDict[i0]

    def FixField(self, fixlist):  # [A,B,new name,[]]
        self.AddField(fixlist[2])
        fixA = fixlist[0].split()
        fixB = fixlist[1].split()
        if 'default' in fixA:
            self.FieldsDict[fixlist[2]].Default = fixA[-1]
        elif 'default' in fixB:
            self.FieldsDict[fixlist[2]].Default = fixB[-1]
        self.FieldsDict[fixlist[2]].Value = fixB
        self.FieldsDict[fixlist[2]].Option.append('Fixed')


    def AddField(self,fieldname):
        fieldsplit = fieldname.split()
        self.FieldsDict.setdefault(fieldsplit[1],MergeField())
        if 'equal' in fieldsplit:
            self.FieldsDict[fieldsplit[1]].Value = fieldsplit[3]
        if 'default' in fieldsplit:
            self.FieldsDict[fieldsplit[1]].Default = fieldsplit[3]
        if 'reference' in fieldsplit:
            self.FieldsDict[fieldsplit[1]].Source = fieldsplit[3]

    def Merge(self,fieldlist): #检查是否含有equal #[[fieldlist],[new name]]
        self.FieldsDict.setdefault(fieldlist[1],MergeField())
        for i2 in range(len(fieldlist[0])):
            fieldsplit = fieldlist[0][i2].split()
            if 'equal' in fieldsplit:
                self.FieldsDict[fieldsplit[1]].Value = fieldsplit[3]
            if 'default' in fieldsplit:
                self.FieldsDict[fieldsplit[1]].Default = fieldsplit[3]
            if 'reference' in fieldsplit:
                self.FieldsDict[fieldsplit[1]].Source = fieldsplit[3]

        # a = []
        # for i2 in range(len(fieldlist)):
        #     a.append(re.sub("\d", " ", fieldlist[i2]))