#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template

from typeapp import app
from typeapp.typeconfig import TYPES,StructA
from Converter import GenerateSignalPythonScript as get_JsonDict,search
templateFileOrdirPath = '/home/weijiayun/PycharmProjects/Json/typeapp/templ'
tmplfilelist = []
search('.h.tmpl', templateFileOrdirPath, tmplfilelist)
JsonList =[]
for i,f in enumerate(tmplfilelist):
    u= get_JsonDict(f)
    u.append(i)
    JsonList.append(u)

@app.route('/')
def index():
    return render_template('index.html',
                           types=TYPES,
                           structA = StructA,
                           JsonDict=JsonList
                           )

