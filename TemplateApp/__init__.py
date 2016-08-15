#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import Flask
import json,re
app = Flask(__name__)
env = app.jinja_env
def jsontoObj(jsonstr):
    return json.loads(jsonstr)
def getListTypeName(listTypeName):
    return re.split(r'[<>]',listTypeName)[1]
def getDim(typeName):
    tval = re.split(r'[<>,]', typeName)
    if len(tval) == 3:
        tval = [1, eval(tval[1])]
    else:
        tval = [eval(i) for i in tval[1:3]]
    return tval
env.filters["jsontoObj"]=jsontoObj
env.filters["getListTypeName"]=getListTypeName
env.filters["getDim"]=getDim
import views