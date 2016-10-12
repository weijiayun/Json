#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8

import os
import subprocess
import sys
myRoot = os.path.split(os.path.realpath(__file__))[0]
sys.path.append(os.path.dirname(myRoot))
from twisted.internet import reactor, defer

from MessageHandler import Factory
from PeaView import PeaView
from configureService.acl.ACLClient import ACLClient
from configureService.configureObject.ConfigureObjectClient import ConfigureObjectClient

#from twisted.internet import epollreactor
#epollreactor.install()
from  promise import Promise

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

sourceId = 613

pea = PeaView([confs['PATH']],Factory.createMessageHandles([]),['LMFHFProto.thrift','PluginManage.thrift'],
              sourceId, requestId=0)

def sendHeartbeat(pea, proto):
    reactor.callLater(30, sendHeartbeat, pea, proto)

def test(pea, proto):
    client123 = ACLClient(proto, pea.customHandle, 609)
    session = client123.login('aa', '1231')

    client = ConfigureObjectClient(proto, pea.customHandle, 612)

    with open('tests/master-public.pem') as f:
        publicKey1 = f.read()
    with open('tests/master-private.pem') as f:
        privateKey1 = f.read()
    with open('tests/ghost-public.pem') as f:
        publicKey2 = f.read()
    with open('tests/ghost-private.pem') as f:
        privateKey2 = f.read()


    def getObjectSuccess(content):
        print content
    def getObjectFailed(errMsg):
        print errMsg
    def success(msg):
        print msg
    def failed(msg):
        print msg

    #client.listCollections(session).then(getObjectSuccess).catch(getObjectFailed)

    # client.deleteObject(session, [['obj6', '20120812', 'v0.2'], ['obj7', '20120812', 'v0.2']]).then(
    #     success).catch(failed)
    # client.getObjects(session, [['obj6', '20120812', 'v0.2'],['obj7', '20120812', 'v0.2']]).then(
    #     success).catch(failed)
    objcontentlist = [
        ['obj1', '20120813', 'v0.2', "signal", "tmpl1", "col1", 'ccc2'],
        ['obj2', '20120813', 'v0.2', "signal","tmpl1","col1",'ccc2'],
        ['obj3', '20120813', 'v0.2', "signal","tmpl1","col1",'ccc2'],
        ['obj4', '20120813', 'v0.2', "signal","tmpl1","col1",'ccc2'],
        ['obj5', '20120813', 'v0.2', "signal","tmpl1","col1",'ccc2'],
        ['obj6', '20120813', 'v0.2', "signal","tmpl1","col1",'ccc2'],
        ['obj7', '20120813', 'v0.2',"signal","tmpl1","col1", 'ccc2'],
        ['obj8', '20120813', 'v0.2', "signal","tmpl1","col1",'ccc2'],
        ['obj1', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj2', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj3', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj4', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj5', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj6', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj7', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj8', '20120813', 'v0.3', "signal","tmpl1","col2",'ccc3'],
        ['obj1', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj2', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj3', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj4', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj5', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj6', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj7', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj8', '20120814', 'v0.2', "strategy","tmpl1","col1",'ccc2'],
        ['obj1', '20120814', 'v0.3', "strategy","tmpl1","col2",'ccc3'],
        ['obj2', '20120814', 'v0.3', "strategy","tmpl1","col2",'ccc3'],
        ['obj3', '20120814', 'v0.3', "strategy","tmpl1","col2",'ccc3'],
        ['obj4', '20120814', 'v0.3', "strategy","tmpl1","col",'ccc3'],
        ['obj5', '20120814', 'v0.3', "strategy","tmpl1","col1",'ccc3'],
    ]
    objlist = [
        # ['obj1', '20120813', 'v0.2'],
        # ['obj2', '20120813', 'v0.2'],
        # ['obj3', '20120813', 'v0.2'],
        # ['obj4', '20120813', 'v0.2'],
        # ['obj5', '20120813', 'v0.2'],
        # ['obj6', '20120813', 'v0.2'],
        # ['obj7', '20120813', 'v0.2'],
        # ['obj8', '20120813', 'v0.2'],
        # ['obj1', '20120813', 'v0.3'],
        # ['obj2', '20120813', 'v0.3'],
        # ['obj3', '20120813', 'v0.3'],
        # ['obj4', '20120813', 'v0.3'],
        # ['obj5', '20120813', 'v0.3'],
        # ['obj6', '20120813', 'v0.3'],
        # ['obj7', '20120813', 'v0.3'],
        # ['obj8', '20120813', 'v0.3']
        ['obj1', '20120814', 'v0.2'],
        ['obj2', '20120814', 'v0.2'],
        ['obj3', '20120814', 'v0.2'],
        ['obj4', '20120814', 'v0.2'],
        ['obj5', '20120814', 'v0.2'],
        ['obj6', '20120814', 'v0.2'],
        ['obj7', '20120814', 'v0.2'],
        ['obj8', '20120814', 'v0.2'],
        ['obj1', '20120814', 'v0.3'],
        ['obj2', '20120814', 'v0.3'],
        ['obj3', '20120814', 'v0.3'],
        ['obj4', '20120814', 'v0.3'],
        ['obj5', '20120814', 'v0.3'],
        ['obj6', '20120814', 'v0.3'],
        ['obj7', '20120814', 'v0.3'],
        ['obj8', '20120814', 'v0.3']
               ]
    col = []
    client.getCollection(session, '20120813', 'v0.2',"signal","tmpl1","col1").then(success).catch(failed)
    #client.createObject(session, objcontentlist).then(success).catch(failed)
    # client.addObjectListToCollection(session, objlist, "col3").then(
    #     success).catch(failed)
    #
    # client.deleteObjectListInCollection(session,[['obj6', '20120812', 'v0.2'],['obj7', '20120812', 'v0.2']],"col3").then(
    #     success).catch(failed)
    # client.deleteCollection(session,"col2").then(
    #     success).catch(failed)

    # client.createConfigure(session,"config20120814","20120814","v0.1", objlist).then(
    #      success).catch(failed)
    # client.deleteConfigure(session,"config3","20120812","v0.3").then(
    #       success).catch(failed)
    # client.getConfigure(session,"config3","20120812","v0.3").then(
    #        success).catch(failed)
    # client.getCollection(session,"col3").then(
    #         success).catch(failed)
    # client.unGrantObjectsOfOthers(session,120,[['obj6', '20120812', 'v0.2'],['obj7', '20120812', 'v0.2']]).then(
    #          success).catch(failed)

    # client.grantConfigureToOthers(session,120,[["config1","20120812","v0.1"],["config2","20120812","v0.1"]]).then(
    #           success).catch(failed)
    # client.unGrantConfigureOfOthers(session,120,[["config1","20120812","v0.1"],["config2","20120812","v0.1"]]).then(
    #            success).catch(failed)

    # client.listObjects(session).then(success).catch(failed)
    # client.getAuthoritySharers(session,'obj1','20120812','v0.1').then(success).catch(failed)











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




