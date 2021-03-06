#!/opt/Apps/local/Python/anaconda/bin/python
#coding: utf-8

import os
import sys
import subprocess
myRoot = os.path.split(os.path.realpath(__file__))[0]

root = os.path.split(myRoot)[0]

sys.path.append(root)

sys.path.append(os.path.dirname(myRoot))

scriptPath= os.path.join(root,'backend')
sys.path.append(scriptPath)
print scriptPath

from configureService.acl.ACLClient import ACLClient
from  twisted.internet import reactor, defer
from  MessageHandler import Factory
from  PeagunCmd import Peagun
from  PeaView import PeaView
import argparse
from  network.DMessage import DMessageType


def generateProto(protoPathList):
    #generate py source
    for p in protoPathList:
        files = os.listdir(p)
        for f in files:
            stem,ext = os.path.splitext(f)
            if ext == '.thrift':
                subprocess.call(['thrift','-gen','py','-o',metaPath,os.path.join(p,f)],stdout=sys.stdout,stderr=sys.stderr)


# configureFile = open(os.path.join(scriptPath,'config.txt'), 'r')

p= os.path.join(scriptPath, 'config.txt')

# configureFile = open(('backend/config.txt'), 'r')
configureFile = open((p), 'r')

import json
confs = json.load(configureFile)
configureFile.close()

# pluginPath1 = os.path.join(scriptPath, 'configureService/acl/\w+Server')
# pluginPath2 = os.path.join(scriptPath, 'configureService/security/\w+Server')
metaPath = '/tmp'
# generateProto([confs['PATH']])

generateProto([os.path.join(scriptPath, 'thrift')])
sys.path.append(metaPath + '/gen-py')

sourceId = 605

# import json
# tableMappings = json.load(open('list2table.mapping','r'))


# pea = PeaView([os.path.join(scriptPath, 'thrift')], Factory.createMessageHandles([pluginPath1, pluginPath2]),['LMFHFProto.thrift','PluginManage.thrift'],
#               sourceId,  requestId=0)
files = [os.path.join(scriptPath,'thrift', f) for f in os.listdir(os.path.join(scriptPath, 'thrift'))]


pea = PeaView([os.path.join(scriptPath,'thrift')]
              , Factory.createMessageHandles([]), ['LMFHFProto.thrift', 'PluginManage.thrift'],
              sourceId, requestId=0)


def sendHeartbeat(pea, proto):
    #pea.sendHeartbeat(proto)
    reactor.callLater(30, sendHeartbeat, pea, proto)

def test(pea, proto):
    client = ACLClient(proto, pea.customHandle, 609)

    session = client.login('bb', '1232')
    print 'login %s'% session
    # from twisted.internet import reactor, defer

    def changePasswordSuccess():
        print 'changePassword  success'

    def changePasswordFailed( errMesg):
        print 'changePassword %s failed: %s' % (errMesg)
    client.changePassword( session,'1232')\
            .then(changePasswordSuccess).catch(changePasswordFailed)

    def changeUserNameSuccess(a):
        print 'changeUserName  success'

    def changeUserNameFailed( errMesg):
        print 'changeUserName  failed: %s' % (errMesg)

    client.changeUserName(session,'bb')\
            .then(changeUserNameSuccess).catch(changeUserNameFailed)

    def changeRoleNameSuccess(a):
        print 'changeRoleName  success'

    def changeRoleNameFailed(errMesg):
        print 'changeRoleName failed: %s' % (errMesg)

    client.changeRoleName(session,3,'ad')\
            .then(changeRoleNameSuccess).catch(changeRoleNameFailed)

    def changePublicKeySuccess(a):
        print 'changePublicKey success'

    def changePublicKeyFailed( errMesg):
        print 'changePublicKey %s failed: %s' % (errMesg)

    client.changePublicKey( session,'adddddddddd234')\
            .then(changePublicKeySuccess).catch(changePublicKeyFailed)
 
    def changePrivateKeySuccess(a):
        print 'changePrivateKey  success'

    def changePrivateKeyFailed( errMesg):
        print 'changePrivateKey failed: %s'  % errMesg

    client.changePrivateKey( session,'adddddddddd234')\
            .then(changePrivateKeySuccess).catch(changePrivateKeyFailed)

    def myRoleSuccess(roles):
        print 'myRoleId-name  is %s -%s '% (roles[0],roles[1])

    def myRoleFailed( errMesg):
        print 'myRole failed: %s' % (errMesg)

    client.myRole(session)\
            .then(myRoleSuccess).catch(myRoleFailed)

    print "begin logout"
    client.logout(session)

    print 'ACLClient test success!!! '

def runhtml(proto, pea):
    os.environ['WERKZEUG_RUN_MAIN'] = 'false'
    from myapp import app
    app.debug = True
    app.proto = proto
    app.pea = pea
    # app.run(host="192.168.10.252")
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
reactor.callLater(2, doConnect, pea )
reactor.run()



