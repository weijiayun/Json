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
    return render_template('index.html',
                           JsonDict=JsonDict,
                           )

@app.route("/reference/<type>",methods=["GET","POST"])
def ref(type):
    if type == "market":
        refdata = ConvertTowebFormatJson(INPUTOBJECT3)
        return json.dumps(refdata)
