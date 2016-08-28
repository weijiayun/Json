#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template,request,redirect,url_for
from typeconfig import INPUTOBJECT3,INPUTOBJECT2,ConvertTowebFormatJson,INPUTOBJECT4
from . import app
import json
#from TemplatesJsonDatabase import User,session,Template

newInput = ConvertTowebFormatJson(INPUTOBJECT2)
JsonDict=json.dumps({"REFLIST":["Annapurna","Annapurnatest"],"REFERENCES":newInput})

@app.route('/',methods=["GET","POST"])
@app.route('/<StructName>',methods=["GET","POST"])
def index(StructName=""):
    # if request.method == "POST":
    #     if len(StructName) == 0:
    #         print request.form["SubmitAllInput"]
    #     else:
    #         print request.form["{0}input".format(StructName)]
    #     return redirect(url_for('index'))
    return render_template('index.html', JsonDict=JsonDict,)

@app.route("/reference/<type>",methods=["GET","POST"])
def ref(type):
    refdata = {"market":["market1","market2","market3"],"strategy":["stagety1","stagety2","stagety3"]}
    return json.dumps(refdata[type])

@app.route("/objects/<type>",methods=["GET","POST"])
def getobjects(type):
    print type
    refdata = {"myObjectList":{"collection1":["obj1","obj2","obj3"],"collection2":["stagety1","stagety2","stagety3"],"other":["other1","other2"]}}
    a = sorted(refdata[type].iteritems(), key=lambda asd: asd[0],reverse=False)
    return json.dumps(a)


@app.route("/saveObject/<data>",methods=["POST"])
def saveObject(data):
    objectName = data[0]
    #need to know about api from Yang
    print data
    return "True"

@app.route("/saveCollection/<data>",methods=["POST"])
def saveCollection(data):
    collectionName = data[0]
    objectNameList = data[1]
    print data
    return "True"

@app.route("/saveConfigure/<data>",methods=["POST"])
def saveConfigure(data):
    createDate = data[0]
    version = data[1]
    objectNameList = data[2]
    print data
    return "True"

@app.route("/saveGrid/<data>",methods=["POST"])
def saveGrid(data):
    gridName = data[0]
    configureList = data[1]
    print data
    return "True"





