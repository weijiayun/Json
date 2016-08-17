__author__ = 'jiayun.wei'

import sys
import os
import copy,re
def StructureNameNotMatchError(filename):
    raise Exception('The template "{}.h.tmpl" Cannot MATCH Its Own Structure\'s Name'.format(filename))

def excludeMember(memberList,excludename):
    if excludename is not None:
        if not isinstance(excludename,list):
            excludename=list([excludename])
        for e in excludename:
            if e in memberList:
                excludenameIndex=memberList.index(e)
                del memberList[excludenameIndex]

def outfilecsv(memeblist,initVarList,name,path):
    if not os.path.exists(path):
        os.mkdir(path)
    filename=os.path.join(path,name+'.csv')
    f=open(filename,'w')
    for i,m in enumerate(memeblist):
        if i==len(memeblist)-1:
            f.write("{}".format(m))
        else:
            f.write("{},".format(m))
    f.write('\n')
    for i,m in enumerate(initVarList):
        if i == len(memeblist) - 1:
            f.write('{}'.format(m))
        else:
            f.write('{},'.format(m))
    f.close()


def outInstrCsvfile(memblist,InstrumentStructMembers,n,name,dirpath):
    if not os.path.exists(dirpath):
        os.mkdir(dirpath)
    templist = []
    for i in range(1,n+1):
        for e in InstrumentStructMembers:
            templist.append('Instruments_'+e+'{}'.format(i))
    for i,e in enumerate(memblist):
        if e == 'Instruments':
            del memblist[i]
    templist = memblist + templist
    filename = os.path.join(dirpath, name + '.csv')
    f = open(filename, 'w')
    for i, m in enumerate(templist):
        if i == len(templist) - 1:
            f.write("{}".format(m))
        else:
            f.write("{},".format(m))
    f.close()

def FindListStruct(lns,TypeName):
    name = re.split(r'[<>]',TypeName)[1]
    npos1 = -1
    npos2 = 0
    for line in lns:
        npos1 += 1
        if name+'(' in line:
            npos1 += 2
            break
    for i in range(npos1, len(lns)):
        if '};' in lns[i]:
            npos2 = i
            break
    temTotalList = []
    for i in range(npos1, npos2):
        elemrow = lns[i].strip()
        if elemrow == '':
            continue
        if elemrow[-1] == ';':
            elemrow = elemrow[:-1]
        elemlist = elemrow.strip().split(' ')
        temTotalList.append(elemlist)
    TotalList = []
    for e in temTotalList:
        if len(e)>4:
            if e[3] == "equal":
                TotalList.append([e[0], e[1], e[2], "equal",e[-1]])
            elif e[3] == "default":
                TotalList.append([e[0], e[1], e[2], "default",e[-1]])
            elif e[3] == "reference":
                TotalList.append([e[0], e[1], e[2],"reference",e[-1]])
        else:
            TotalList.append([e[0], e[1], e[2],"",""])
    return TotalList
def FindEnumStruct(lns,TypeName):
    name=TypeName
    npos1 = -1
    npos2 = 0
    for line in lns:
        npos1 += 1
        if "enum "+name in line:
            npos1 += 2
            break
    for i in range(npos1, len(lns)):
        if '};' in lns[i]:
            npos2 = i
            break
    temTotalList = []
    for i in range(npos1, npos2):
        elemrow = lns[i].strip()
        if elemrow == '':
            continue
        if elemrow[-1] == ',':
            elemrow = elemrow[:-1]
        elemlist = re.split('=\s+',elemrow)[0:2]
        temTotalList.append(elemlist)
    return temTotalList

def findAllList(Path):
    f=open(Path)
    name =os.path.basename(Path)
    name= name.split('.')[0]
    lns = f.readlines()
    f.close()
    npos1=-1
    npos2=0
    method=""
    for line in lns:
        npos1+=1
        if name in line:
            if '(Strategy:' in line:
                method='Strategy'
            elif '(Signal:' in line:
                method='Signal'
            npos1+=2
            break
    for i in range(npos1,len(lns)):
        if '};' in lns[i]:
            npos2=i
            break
    temTotalList=[]
    for i in range(npos1,npos2):
        elemrow=lns[i].strip()
        if elemrow=='':
            continue
        if elemrow[-1]==';':
            elemrow= elemrow[:-1]
        elemlist=elemrow.strip().split(' ')
        if elemlist[2]=='Id' or elemlist[2]=='Description':
            continue
        temTotalList.append(elemlist)
    TotalDict={}
    for e in temTotalList:
        if "list<" in e[1]:
            TotalDict[e[2]] = [e[0], e[1], FindListStruct(lns, e[1])]
        elif "::" in e[1]:
            TotalDict[e[2]] = [e[0], e[1], FindEnumStruct(lns, e[1])]
        elif len(e)>4:
            if e[3] == "equal":
                TotalDict[e[2]] = [e[0], e[1], "equal", e[-1]]
            elif e[3] == "default":
                TotalDict[e[2]] = [e[0], e[1],"default",e[-1]]
            elif e[3] == "reference":
                TotalDict[e[2]] = [e[0], e[1],"reference",e[-1]]
        else:
            TotalDict[e[2]] = [e[0], e[1], "", ""]
    return [name,TotalDict]


def readDim(typeName):
    tval = re.split(r'[<>,]', typeName)
    if len(tval) == 3:
        tval = [1, eval(tval[1])]
    else:
        tval = [eval(i) for i in tval[1:3]]
    return tval


def GenerateSignalPythonScript(templatePath):
    SignalList=findAllList(templatePath)
    name = SignalList[0]
    AllInfoDict=SignalList[1]
    arrayDict = {}
    boolDict={}
    stringDict={}
    NumDict={}
    matDict={}
    enumDict={}

    for key,value in AllInfoDict.items():
        if "list<" in value[1]:
            arrayDict[key] = [value[0], value[2]]
        elif value[1] == "bool":
            boolDict[key]=[value[0],value]
        elif value[1] == "string":
            stringDict[key]=[value[0],value]
        elif value[1] == "uint32" or value[1] == "sint32" or value[1] == "double":
            NumDict[key]=[value[0],value]
        elif "mat<" in value[1] or "vec<" in value[1]:
            matDict[key]=[value[0],readDim(value[1])]
        elif '::' in value[1]:
            enumDict[key]=[value[0],value[2]]
    jsondict = {
        "number":NumDict,"mat":matDict,
        "bool":boolDict,"list":arrayDict,
        "string":stringDict,"enum":enumDict
        }
    return [name,jsondict]
def search(s,dir,outputList):
    for x1 in os.listdir(dir):
        if os.path.isfile(os.path.join(dir,x1)):
            if s in x1:
                ndir=os.path.abspath(dir)
                outputList.append(os.path.join(ndir,x1))
        if os.path.isdir(os.path.join(dir,x1)):
            search(s,os.path.join(dir,x1),outputList)


if __name__=='__main__':
    filePath='templ/strategy/Automaton.h.tmpl'
    GenerateSignalPythonScript(filePath)








