#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template,request,redirect,url_for
from jinja2 import Environment
from typeapp import app
from typeapp.typeconfig import INPUTOBJECT3,INPUTOBJECT2,ConvertTowebFormatJson
import json

newInput = ConvertTowebFormatJson(INPUTOBJECT2)
JsonDict=json.dumps({"REFLIST":["Annapurna"],"REFERENCES":newInput})

@app.route('/',methods=["GET","POST"])
@app.route('/<StructName>',methods=["GET","POST"])
def index(StructName=""):
    if request.method == "POST":
        if len(StructName) == 0:
            print request.form["SubmitAllInput"]
        else:
            print request.form["{}input".format(StructName)]
        return redirect(url_for('index'))
    return render_template('index.html',
                           JsonDict=JsonDict,
                           )

# @app.route('/',methods=["GET","POST"])
# def index():
#     return render_template('tesy.html')

@app.route("/reference/<type>",methods=["GET","POST"])
def ref(type):
    if type == "market":
        refdata = ConvertTowebFormatJson(INPUTOBJECT3)
        return json.dumps(refdata)
