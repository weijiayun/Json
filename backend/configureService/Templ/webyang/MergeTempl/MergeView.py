#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8
__author__ = 'hongyue.yang'

from flask import render_template
import TemplContent
from flask import request
from . import app
import os
import json
import TemplForMerge
rootdir = 'MergeTempl/code/'
#模板列表，模板名对应的原始内容，模板名对应的json
TemplnameList,OriginContentDict,OutputJsonDict= TemplContent.ReadFile(rootdir)

JsonDict=json.dumps({"REFLIST":TemplnameList,"REFERENCES":OriginContentDict,"JSONLIST":OutputJsonDict})

@app.route('/',methods=["GET","POST"])
@app.route('/<StructName>',methods=["GET","POST"])
def index(StructName=""):
    return render_template('index.html', JsonDict=JsonDict,)

@app.route("/finish/<type>",methods=["GET","POST"])
def ref(type):
    dic = json.loads(type)
    obj = TemplForMerge.MergeObject(dic)
    print json.dumps(obj, cls = TemplForMerge.MyEncoder , indent=4)
    return 'success'

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['files[]']
        filename = f.filename
        TemplnameList1, OriginContentDict1, OutputJsonDict1 = TemplContent.CheckCon(f,rootdir,filename)
        if TemplnameList1==False:
            return json.dumps({"FILENAME":OriginContentDict1,"ERROR":OutputJsonDict1})
        else:
            for i in range(len(TemplnameList1)):
                if TemplnameList1[i] in TemplnameList:
                    pass
                else:
                    TemplnameList.append(TemplnameList1[i])
            for e in OriginContentDict1.keys():
                OriginContentDict.setdefault(e,OriginContentDict1[e])
                OutputJsonDict.setdefault(e,OutputJsonDict1[e])
            return json.dumps({"REFLIST": TemplnameList, "REFERENCES": OriginContentDict, "JSONLIST": OutputJsonDict})