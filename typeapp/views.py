#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template

from typeapp import app
from typeapp.typeconfig import TYPES


@app.route('/')
def index():
    return render_template('index.html',
                           types=TYPES)

