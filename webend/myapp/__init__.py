#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8

from flask import Flask
app = Flask(__name__)
app.secret_key = 'why would I tell you my secret key?'
import views
