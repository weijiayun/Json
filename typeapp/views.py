#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from typeapp import app
from typeconfig import TYPES
from flask import redirect,render_template,url_for,g,request
app.route('/')
def index():
    types = [value for key,value in TYPES.items()]
    return render_template('/templates/index.html',
                           types=types)

