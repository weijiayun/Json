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
            elif OptionList[i1][0]=='Addfield':     #{5:['Addfield',[add list],[new name for field]]}
                self.AddField(OptionList[i1][2])

    def AddSources(self,valuelist):
        for i2 in range(len(valuelist)):
            self.SourcesDict.setdefault(i2,valuelist[i2])

    def DeleteSource(self,valuelist):
        for i2 in range(len(valuelist)):
            for i0 in range(len(self.SourcesDict)):
                if self.SourcesDict[i0] == valuelist[i2]:
                    del self.SourcesDict[i0]

    def FixField(self,fixlist):  #[A,B,new name,[]]
        for i2 in range(len(fixlist)):
            self.AddField(fixlist[i2][2])
            fixA = fixlist[i2][0].split()
            fixB = fixlist[i2][1].split()
            if 'default' in fixA:
                self.FieldsDict[fixlist[i2][2]].Default = fixA[-1]
            elif 'default' in fixB:
                self.FieldsDict[fixlist[i2][2]].Default = fixB[-1]
            self.FieldsDict[fixlist[i2][2]].Value = fixB
            self.FieldsDict[fixlist[i2][2]].Option.append('Fixed')


    def AddField(self,fieldname):
        self.FieldsDict.setdefault(fieldname,MergeField())

    def Merge(self,fieldlist): #检查是否含有equal #[[fieldlist],[new name]]
        a = []
        for i2 in range(len(fieldlist)):
            a.append(re.sub("\d", " ", fieldlist[i2]))