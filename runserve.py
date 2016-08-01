#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'

from typeapp import app

def run():
    app.debug = True
    app.run()
run()