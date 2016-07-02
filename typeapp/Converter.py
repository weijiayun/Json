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


def TypeExpand(optionList,typeList,memberList,reflist,initvars,typename,ElemNameSuffix,expandNum=1):
        for typeElem in typename:
            if typeElem in typeList:
                typeIndex=typeList.index(typeElem)
                tempmemberName=memberList[typeIndex]
                initvalue=initvars[typeIndex]
                option=optionList[typeIndex]
                ref = reflist[typeIndex]
                del memberList[typeIndex]
                del typeList[typeIndex]
                del initvars[typeIndex]
                del optionList[typeIndex]
                del reflist[typeIndex]
                ElemNameSuffix.reverse()
                for nameSuffix in ElemNameSuffix:
                    if nameSuffix[0] in typeElem:
                        for i in range(expandNum,0,-1):
                            for s in nameSuffix:
                                memberList.insert(typeIndex,tempmemberName+'_'+s+str(i))
                                typeList.insert(typeIndex,typeElem)
                                initvars.insert(typeIndex,initvalue)
                                optionList.insert(typeIndex,option)
                                reflist.insert(typeIndex,ref)

def kwExpand(optionList,typeList,memberList,reflist,initvars,ElemNameSuffix,keyword,expandNum=1,iskeywords=True):
    if keyword in memberList:
        typeIndex=memberList.index(keyword)
        tempTypeName=typeList[typeIndex]
        initvalues=initvars[typeIndex]
        option=optionList[typeIndex]
        ref = reflist[typeIndex]
        del memberList[typeIndex]
        del typeList[typeIndex]
        del initvars[typeIndex]
        del optionList[typeIndex]
        del reflist[typeIndex]
        ElemNameSuffix.reverse()
        for i in range(expandNum,0,-1):
            for s in ElemNameSuffix:
                if iskeywords:
                    memberList.insert(typeIndex,keyword+'_'+s+str(i))
                else:
                    memberList.insert(typeIndex,s+str(i))
                typeList.insert(typeIndex,tempTypeName)
                initvars.insert(typeIndex,initvalues)
                optionList.insert(typeIndex,option)
                reflist.insert(typeIndex,ref)

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
    TotalList=[]
    for e in temTotalList:
        if len(e)>4:
            if e[-2]=='reference':
                TotalList.append(dict(option=e[0],type=e[1],varname=e[2],Reference=e[-1],Default=""))
                continue
            elif e[-2] == 'default' or e[-2] == 'equal':
                if '""' == e[-1]:
                    TotalList.append(dict(option=e[0], type=e[1], varname=e[2], Reference="", Default=""))
                else:
                    TotalList.append(dict(option=e[0], type=e[1], varname=e[2], Reference="", Default=e[-1]))
                continue
        else:
            TotalList.append(dict(option=e[0],type=e[1],varname=e[2],Reference="",Default=""))
            continue
    if TotalList==[]:
        StructureNameNotMatchError(name)
    return [name,TotalList,method]

def FindStructList(Path,structName):
    f = open(Path)
    name = structName
    lns = f.readlines()
    f.close()
    npos1 = -1
    npos2 = 0
    for line in lns:
        npos1 += 1
        if name+'(' in line:
            npos1 += 2
            break
        else:
            return None
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
        if elemlist[2] == 'Id' or elemlist[2] == 'Description':
            continue
        temTotalList.append(elemlist)
    TotalList = []
    for e in temTotalList:
        if len(e) > 4:
            if e[-2] == 'reference':
                TotalList.append(dict(option=e[0], type=e[1], varname=e[2], Reference=e[-1], Default=""))
                continue
            elif e[-2] == 'default' or e[-2] == 'equal':
                if '""' == e[-1]:
                    TotalList.append(dict(option=e[0], type=e[1], varname=e[2], Reference="", Default=""))
                else:
                    TotalList.append(dict(option=e[0], type=e[1], varname=e[2], Reference="", Default=e[-1]))
                continue
        else:
            TotalList.append(dict(option=e[0], type=e[1], varname=e[2], Reference="", Default=""))
            continue
    if TotalList == []:
        StructureNameNotMatchError(name)
    return TotalList



def dollarFuncCheck(memberlist,initVars):
    funcDict={memberlist[i]:e for i,e in enumerate(initVars) if '$'in e}
    dollarCheckResultsDict = {}
    for key,value in funcDict.items():
        DigitList = []
        value1 = re.split(r'[\(\)]',value)
        dollarsValue = re.split(r',',value1[1])
        for i,elem in enumerate(dollarsValue):
            if "$$" in elem:
                DigitList.append(0)
            else:
                if elem == "$none" or elem == '$None':
                    DigitList.append(0)
                else:
                    DigitList.append(1)
        value1 = re.split(r'[$\(]',value)
        funcName = value1[1]
        value1 = re.split(r'[\(\)]',value.replace("$",""))
        DollarsList =  value1[1].split(',')
        initvaltempstr ="$("+";".join(DollarsList)+")"
        initVars[initVars.index(value)] = initvaltempstr
        dollarCheckResultsDict[key]=[funcName,DollarsList,DigitList]
    return dollarCheckResultsDict
#################################################################################################

def GenerateSignalPythonScript(templatePath):
    SignalList=findAllList(templatePath)
    AllList=SignalList[1]
    name=SignalList[0]
    optionList = []
    TypeList=[]
    Memberlist=[]
    initVar=[]
    RefList=[]

    for e in AllList:
        TypeList.append(e['type'])
        Memberlist.append(e['varname'])
        initVar.append(e['Default'])
        optionList.append(e['option'])
        RefList.append(e['Reference'])

####################Type,Name,sort in the first###############
    if 'Type' in Memberlist:
        NameIndex=Memberlist.index('Type')
        Memberlist.insert(0,Memberlist[NameIndex])
        del Memberlist[NameIndex+1]
        TypeList.insert(0,TypeList[NameIndex])
        del TypeList[NameIndex+1]
        initVar.insert(0,initVar[NameIndex])
        del initVar[NameIndex+1]
        optionList.insert(0, optionList[NameIndex])
        del optionList[NameIndex + 1]
        RefList.insert(0,RefList[NameIndex])
        del RefList[NameIndex+1]

    if 'Name' in Memberlist:
        NameIndex=Memberlist.index('Name')
        Memberlist.insert(0,Memberlist[NameIndex])
        del Memberlist[NameIndex+1]
        TypeList.insert(0,TypeList[NameIndex])
        del TypeList[NameIndex+1]
        initVar.insert(0,initVar[NameIndex])
        del initVar[NameIndex+1]
        optionList.insert(0, optionList[NameIndex])
        del optionList[NameIndex + 1]
        RefList.insert(0, RefList[NameIndex])
        del RefList[NameIndex + 1]

    signalfuncdict = dollarFuncCheck(Memberlist, initVar)
    waitForMemberlist=copy.deepcopy(Memberlist)


####################job to expand types#######################
    expandtype=['list<OrderByNominal>','list<OrderByVolume>']
    nameSuffix1=[['Nominal','Type'],['Volume','Type']]
    TypeExpand(optionList,TypeList,Memberlist,RefList,initVar,expandtype,nameSuffix1,2)
    nameSuffix2=['InstrumentName','IsConnect','Market']
    kwExpand(optionList,TypeList,Memberlist,RefList,initVar,nameSuffix2,'Instruments',1)
    nameSuffix3=['Action','START','END']
    kwExpand(optionList,TypeList,Memberlist,RefList,initVar,nameSuffix3,'Ranges',1,False)

    signalvarslist = [Memberlist[i] for i, var in enumerate(TypeList) if var == "signal" and RefList[i] != 'DelegateFeeder']
    signalfeederlist = [Memberlist[i] for i, var in enumerate(TypeList) if var == "signal" and RefList[i] == 'DelegateFeeder']
    required_member_list = [Memberlist[i] for i, var in enumerate(optionList) if var == "required"]
    optional_member_list = [Memberlist[i] for i, var in enumerate(optionList) if var == "optional"]
    signalInList = [Memberlist[i] for i, var in enumerate(TypeList) if var == "list<signal>" and not "$" in initVar[i]]
    stringInList = [Memberlist[i] for i, var in enumerate(TypeList) if var == "list<string>" and not "$" in initVar[i]]
    boolList = {}
    stringList ={}
    sint32list ={}
    uint32List = {}
    doubleList = {}
    otherList = {}
    for i,var in enumerate(TypeList):

        if var == "bool":
            boolList[Memberlist[i]]= optionList[i]
            continue
        elif var == "string":
            stringList[Memberlist[i]]=optionList[i]
            continue
        elif var == "uint32":
            uint32List[Memberlist[i]]=optionList[i]
            uint32List[Memberlist[i]]=optionList[i]
            continue
        elif var == "sint32":
            sint32list[Memberlist[i]]=optionList[i]
            sint32list[Memberlist[i]]=optionList[i]
            continue
        elif var == "double":
            doubleList[Memberlist[i]]=optionList[i]
            doubleList[Memberlist[i]]=optionList[i]
            continue
        elif 'list<' not in var:
            otherList[Memberlist[i]]=optionList[i]

    arrayTypeList = [TypeList[i] for i,var in enumerate(TypeList) if "list<" in var]
    arrayDict = {}
    for var1 in arrayTypeList:
        arrayDict[var1]={"len":1,"member":{}}
        for i,var2 in enumerate(TypeList):
            if var1 == var2:
                arrayDict[var1]["member"][Memberlist[i]]=optionList[i]
        arrayDict[var1]["len"] = len(arrayDict[var1]["member"])
    sint32Dict = {"len": len(sint32list), "member": sint32list}
    uint32Dict = {"len": len(uint32List), "member": uint32List}
    doubleDict = {"len":len(doubleList),"member":doubleList}
    stringDict = {"len":len(stringList),"member":stringList}
    boolDict = {"len":len(boolList),"member":boolList}
    listDict = {"len":len(arrayDict),"member":arrayDict}
    otherDict = {"len":len(otherList),"member":otherList}
    jsondict = {"sint32":sint32Dict,"uint32":uint32Dict,"double":doubleDict,
                "bool":boolDict,"list":listDict,"string":stringDict,"other":otherDict}
    import json
    jsoncode = json.JSONEncoder().encode([name,Memberlist])
    jsonreqlist = json.JSONEncoder().encode(optionList)
    return [name,jsondict,len(Memberlist),jsoncode,jsonreqlist]
def search(s,dir,outputList):
    for x1 in os.listdir(dir):
        if os.path.isfile(os.path.join(dir,x1)):
            if s in x1:
                ndir=os.path.abspath(dir)
                outputList.append(os.path.join(ndir,x1))
        if os.path.isdir(os.path.join(dir,x1)):
            search(s,os.path.join(dir,x1),outputList)


if __name__=='__main__':
    filePath='/nethome/jiayun.wei/PycharmProjects/Json/typeapp/SizeStrategy.h.tmpl'
    GenerateSignalPythonScript(filePath)








