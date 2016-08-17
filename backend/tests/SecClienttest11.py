#!/opt/Apps/local/Python/anaconda/bin/python
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
from configureService.security.SecurityClient import SecClient

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
print scriptPath

configureFile = open(os.path.join(scriptPath,'../config.txt'), 'r')
import json
confs = json.load(configureFile)
configureFile.close()


metaPath = '/tmp'
generateProto([confs['PATH']])
sys.path.append(metaPath + '/gen-py')

sourceId = 605

pea = PeaView([confs['PATH']],Factory.createMessageHandles([]),['LMFHFProto.thrift','PluginManage.thrift'],
              sourceId, requestId=0)

def sendHeartbeat(pea, proto):
    reactor.callLater(30, sendHeartbeat, pea, proto)

def test(pea, proto):
    client123 = ACLClient(proto, pea.customHandle, 609)
    session = client123.login('bb', '1232')

    client = SecClient(proto, pea.customHandle, 609)

    #两对密钥对
    with open('tests/master-public.pem') as f:
        publicKey1 = f.read()
    with open('tests/master-private.pem') as f:
        privateKey1 = f.read()
    with open('tests/ghost-public.pem') as f:
        publicKey2 = f.read()
    with open('tests/ghost-private.pem') as f:
        privateKey2 = f.read()


    t = "zhang hai xu 1234567890"
    def putContentSeriesSuccess( result ):
        for k in result:
            print 'putSeriesContent success:name=%s : %s' % (k, result[k])
    def putSeriesContentFailed( errMesg):
        print 'putSeriesContent  %s failed: %s' % (t, errMesg)
    client.putSeriesContent( session, [['one',t, '1234567812345678'],['two',t, '1234567812345678']],publicKey1)\
            .then(putContentSeriesSuccess).catch(putSeriesContentFailed)



    t = "zhang hai xu 1234567890"
    def putContentSuccess( result ):
        print 'putContent  %s success:contentId=%d,keyId=%s' % (t, result[0], result[1])
        return client.putContent( session, t, '1234567812345678',publicKey1)
    def putContentFailed( errMesg):
        print 'putContent  %s failed: %s' % (t, errMesg)
    def put1Success(x):
        print 'haha:%d%d' % tuple(x)
    client.putContent(session, t, '1234567812345678',publicKey1)\
        .then(putContentSuccess).catch(putContentFailed)\
        .then(put1Success)

    contentId = 3
    def deleteContentSuccess( ):
        print 'deleteContent id= %s success ' % (contentId)
    def deleteContentFailed(errMesg):
        print 'deleteContent id= %s failed: %s' % (contentId, errMesg)
    client.deleteContent(session, contentId )\
            .then(deleteContentSuccess).catch(deleteContentFailed)


    id = 1
    def getContentSuccess( content ):
        print 'GetContent %d  success:content = %s' % (id, content)
    def getContentFailed( errMesg):
        print 'GetContent failed: %s' % ( errMesg)
    client.getContent( session, id, privateKey1 )\
        .then(getContentSuccess).catch(getContentFailed)



    def listContentSuccess( contents ):
        print 'ListContent success:'
        for i in contents:
            print i
    def listContentFailed(errMesg):
        print 'ListContent  failed: %s' % (errMesg[0])
    client.listContent( session )\
        .then(listContentSuccess).catch(listContentFailed)


    contentId = 1
    def getkeysuccess(a):
        print 'get key success'
    def getKeyFailed(errMesg):
        print 'get key failed %s' % errMesg


    def grantToOtherSuccess( keyId ):
        print 'grant contentId =%s to other Success success: newKeyId= %s' % (contentId,keyId)
    def grantToOtherFailed(errMesg):
        print 'grant contentId = %s to other  failed: %s' % (contentId, errMesg)
    client.grantToOther( session, contentId, 1, privateKey1, publicKey2)\
            .then(getkeysuccess).catch(getKeyFailed)\
                .then(grantToOtherSuccess).catch(grantToOtherFailed)

    print 'SecClient test seccess!!!'





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




