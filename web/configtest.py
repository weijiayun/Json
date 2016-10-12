# !/opt/Apps/local/Python/anaconda/bin/python
# coding: utf-8

import os
import sys
import subprocess

myRoot = os.path.split(os.path.realpath(__file__))[0]

root = os.path.split(myRoot)[0]

sys.path.append(root)

sys.path.append(os.path.dirname(myRoot))

scriptPath = os.path.join(root, 'backend')
sys.path.append(scriptPath)
print scriptPath

from configureService.acl.ACLClient import ACLClient
from configureService.configureObject.ConfigureObjectClient import ConfigureObjectClient as coClient
from twisted.internet import reactor, defer
from MessageHandler import Factory
from PeagunCmd import Peagun
from PeaView import PeaView
import argparse
from network.DMessage import DMessageType


def generateProto(protoPathList):
    # generate py source
    for p in protoPathList:
        files = os.listdir(p)
        for f in files:
            stem, ext = os.path.splitext(f)
            if ext == '.thrift':
                subprocess.call(['thrift', '-gen', 'py', '-o', metaPath, os.path.join(p, f)], stdout=sys.stdout,
                                stderr=sys.stderr)
p = os.path.join(scriptPath, 'config.txt')
configureFile = open((p), 'r')
import json
confs = json.load(configureFile)
configureFile.close()
metaPath = '/tmp'
generateProto([os.path.join(scriptPath, 'thrift')])
sys.path.append(metaPath + '/gen-py')

sourceId = 613
files = [os.path.join(scriptPath, 'thrift', f) for f in os.listdir(os.path.join(scriptPath, 'thrift'))]
pea = PeaView([os.path.join(scriptPath, 'thrift')]
              , Factory.createMessageHandles([]), ['LMFHFProto.thrift', 'PluginManage.thrift'],
              sourceId, requestId=0)

def sendHeartbeat(pea, proto):
    # pea.sendHeartbeat(proto)
    reactor.callLater(30, sendHeartbeat, pea, proto)

def runhtml(proto, pea):
    os.environ['WERKZEUG_RUN_MAIN'] = 'false'
    from TemplateApp import app
    app.debug = True
    app.proto = proto
    app.pea = pea
    app.run(use_reloader=False)

def onConnected(connectionManager, proto):
    from aclSystem.ttypes import Session
    session = Session()
    session.sessionID = 100
    session.userID = 8
    session.appID = sourceId
    session.AppGroupId = 2

    from TTProto.ttypes import Registe
    registeMsg = Registe(session, 'acl', 'a acl')
    connectionManager.send(proto, 0, sourceId, 0, registeMsg)
    # connectionManager.send(proto, 0, sourceId, 0, registeMsg,requestId)

    reactor.callLater(30, sendHeartbeat, pea, proto)
    # reactor.callInThread(test, pea, proto)
    reactor.callInThread(runhtml, proto, pea)


def doConnect(pea):
    pea.connectionManager.connect(confs['TTHOST'], confs['TTPORT'])


pea.onConnected.connect(onConnected)
reactor.callLater(2, doConnect, pea)
reactor.run()

