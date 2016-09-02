#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8
__author__ = 'hongyue.yang'

from MergeTempl import app
def run():
    app.debug = True
    app.run()
run()