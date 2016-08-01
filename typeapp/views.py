#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template,request,redirect,url_for
from jinja2 import Environment
from typeapp import app
from typeapp.typeconfig import INPUTOBJECT,INPUTOBJECT1

import json
JsonDict=json.dumps({"REFLIST":["Automaton","Automatontest"],"REFERENCES":INPUTOBJECT})
@app.route('/',methods=["GET","POST"])
@app.route('/<StructName>',methods=["GET","POST"])
def index(StructName=""):
    if request.method == "POST":
        print StructName
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
        refdata = INPUTOBJECT1
        return json.dumps(refdata)
