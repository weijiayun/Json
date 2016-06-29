#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template

from typeapp import app
from typeapp.typeconfig import TYPES,StructA
from Converter import GenerateSignalPythonScript as get_JsonDict,search
templateFileOrdirPath = '/nethome/jiayun.wei/PycharmProjects/Json/typeapp/templ'
tmplfilelist = []
search('.h.tmpl', templateFileOrdirPath, tmplfilelist)
JsonList =[]
for f in tmplfilelist:
    JsonList.append(get_JsonDict(f))
@app.route('/')
def index():
    return render_template('index.html',
                           types=TYPES,
                           structA = StructA,
                           JsonDict=JsonList
                           )

