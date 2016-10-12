#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8

import os
import subprocess
import sys
myRoot = os.path.split(os.path.realpath(__file__))[0]
sys.path.append(os.path.dirname(myRoot))
from twisted.internet import reactor

from MessageHandler import Factory
from PeaView import PeaView
from configureService.acl.ACLClient import ACLClient
from backend.configureService.Templ.templClient import templClient
#from twisted.internet import epollreactor
#epollreactor.install()

def generateProto(protoPathList):
    #generate py source
    for p in protoPathList:
        files = os.listdir(p)
        for f in files:
            stem,ext = os.path.splitext(f)
            if ext == '.thrift':
                subprocess.call(['thrift','-gen','py','-o',metaPath,os.path.join(p,f)],stdout=sys.stdout,stderr=sys.stderr)



scriptPath,peagunName = os.path.split(os.path.abspath(sys.argv[0]))
#print scriptPath

configureFile = open(os.path.join(scriptPath,'../config.txt'), 'r')
import json
confs = json.load(configureFile)
configureFile.close()


metaPath = '/tmp'
generateProto([confs['PATH']])
sys.path.append(metaPath + '/gen-py')

sourceId = 606

pea = PeaView([confs['PATH']],Factory.createMessageHandles([]),['LMFHFProto.thrift','PluginManage.thrift'],
              sourceId, requestId=0)

def sendHeartbeat(pea, proto):
    reactor.callLater(30, sendHeartbeat, pea, proto)

def test(pea, proto):
    client123 = ACLClient(proto, pea.customHandle, 609)
    session = client123.login('aa', '1231')

    client = templClient(proto, pea.customHandle, 607)

    with open('tests/master-public.pem') as f:
        publicKey1 = f.read()
    with open('tests/master-private.pem') as f:
        privateKey1 = f.read()
    with open('tests/ghost-public.pem') as f:
        publicKey2 = f.read()
    with open('tests/ghost-private.pem') as f:
        privateKey2 = f.read()

    def success(msg):
        print "success"
    def failed(msg):
        print "failed"

    # client.upContent(session, 'OrderType::type','1.2',"enum OrderType::type\n\n{\nOTGFD = 0,\nSIMULATION = 1,\nIOC = 2,\nPOTF = 3\n};\n\n").then(
    #     success).catch(failed)
    # client.jsonRelation(session, 'IStrategy', '1.3').then(
    #     success).catch(failed)
    # client.baseCheck(session, 'Automaton', '1.0').then(
    #     success).catch(failed)
    # client.downLoad(session, 'OrderType::type', '1.2').then(
    #     success).catch(failed)
    # client.getJsonCon(session, 'OrderType::type', '1.2').then(
    #     success).catch(failed)
    # client.grantAuthority(session, '12').then(
    #       success).catch(failed)
    client.templMerge(session).then(
          success).catch(failed)
    # client.createVersion(session, 'OrderType::type', '1.0',"enum OrderType::type\n\n{\nOTGFD = 3,\nSIMULATION = 4,\nIOC = 5,\nPOTF = 6\n};\n\n").then(
    #      success).catch(failed)



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
    reactor.callInThread(test, pea, proto)

def doConnect(pea):
    pea.connectionManager.connect(confs['TTHOST'], confs['TTPORT'])

pea.onConnected.connect(onConnected)
reactor.callLater(2, doConnect, pea )
reactor.run()




