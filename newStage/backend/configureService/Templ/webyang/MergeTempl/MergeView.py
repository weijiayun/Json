#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8
__author__ = 'hongyue.yang'

from flask import render_template
from TemplContent import ReadFile
from . import app
import json
import TemplToJson
import TemplForMerge
rootdir = 'MergeTempl/code'
#模板列表，模板名对应的原始内容，模板名对应的json
TemplnameList,OriginContentDict,OutputJsonDict= ReadFile(rootdir)

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
    return '321'