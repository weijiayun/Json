#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8
import os
import os.path
import json
import TemplToJson
__author__ = 'hongyue.yang'

def ReadFile(rootdir):
    TemplnameList = []
    OriginContentDict = {}
    OutputJsonDict = {}
    for parent,dirnames,filenames in os.walk(rootdir):
        for filename in filenames:
            file_object = open('MergeTempl/code/'+filename)
            try:
                all_the_text = file_object.read() #读取文件内容
            finally:
                file_object.close()
            ####分割文件，解析每个模板对应的json，和原始模板
            TemplList = all_the_text.split('};') #原始模板列表
            for i in range(len(TemplList)):
                TemplList[i] = TemplList[i].strip()
                JsonSingleCon = Templ2Field(TemplList[i]) #对应单个模板解析的json
                if JsonSingleCon != [] and JsonSingleCon != None and isinstance(JsonSingleCon, int) == False:
                    json_dumps = json.dumps(JsonSingleCon, cls=TemplToJson.MyEncoder, indent=4)
                    json_loads = json.loads(json_dumps)
                    json_loads_dict = ConvertTowebFormatJson(json_loads)
                    json_loads_key = json_loads_dict.keys()

                    TemplnameList.append(json_loads_key[0])
                    OutputJsonDict.setdefault(json_loads_key[0],json_loads_dict[json_loads_key[0]])

                    contline = TemplList[i].splitlines()
                    while '' in contline:
                        contline.remove('')
                    OriginContentDict.setdefault(json_loads_key[0],contline)
                elif JsonSingleCon != []:
                    print 'error:%s,%s' % (filename,JsonSingleCon)
                    break
    return TemplnameList,OriginContentDict,OutputJsonDict


def Templ2Field(templcon):  # 将模板转为json字段存储
    ################判断是否只有一个模板##################
    c = None
    ob = []
    templcon = templcon.splitlines()
    while '' in templcon:
        templcon.remove('')
    if templcon != []:
        templcon = TemplToJson.TemplObject(templcon)
        if templcon.islegal == None:
            ob.append(templcon)
        else:
            c = templcon.islegal
    if c == None:
        return ob
    else:
        return c

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