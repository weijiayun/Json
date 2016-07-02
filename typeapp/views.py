#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template,request
from typeapp import app
from typeapp.typeconfig import TYPES,StructA
from Converter import GenerateSignalPythonScript as get_JsonDict,search
import json
templateFileOrdirPath = 'typeapp/templ'
tmplfilelist = []
search('.h.tmpl', templateFileOrdirPath, tmplfilelist)
JsonList =[]
for f in tmplfilelist:
    u= get_JsonDict(f)
    JsonList.append(u)
StructNameJson = json.JSONEncoder().encode([val[0] for val in JsonList])
StructNameList = [len(JsonList),[val[0] for val in JsonList]]
@app.route('/',methods=["GET","POST"])
def index():
    if request.method == "POST":
        print request.form["0Automatoninput"]
    return render_template('index.html',
                           types=TYPES,
                           structA = StructA,
                           JsonDict=JsonList,
                           StructNameJson = StructNameJson,
                           StructNameList = StructNameList
                           )

