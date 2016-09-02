#!/opt/Apps/local/Python/anaconda/bin/python
import os
import sys
import argparse
import subprocess
from twisted.internet import epollreactor
epollreactor.install()
from twisted.internet import reactor
from MessageHandler import Factory
from PeagunCmd import Peagun
from PeaView import PeaView

def runCommandLine(pea):
    pea.cmdloop()
    reactor.callFromThread(reactor.stop)

def generateProto(protoPathList):
    #generate py source
    for p in protoPathList:
        files = os.listdir(p)
        for f in files:
            stem,ext = os.path.splitext(f)
            if ext == '.thrift':
                subprocess.call(['thrift','-gen','py','-o',metaPath,os.path.join(p,f)],stdout=sys.stdout,stderr=sys.stderr)

loginClient = None
def login(host, port, name, password, appId, appGroupId):
    from thrift.transport import TTransport
    from thrift.transport import TSocket
    from thrift.protocol import TCompactProtocol
    from aclSystem import UserService
    try:
        logsocket = TSocket.TSocket(host, port)
        transport = TTransport.TFramedTransport(logsocket)
        protocol = TCompactProtocol.TCompactProtocol(transport)
        transport.open()

        global loginClient
        loginClient = UserService.Client(protocol)
        return loginClient.login(name, password, appId, appGroupId)
    except Exception:
        return None

def sendHeartbeat(pea, proto):
    #pea.sendHeartbeat(proto)
    reactor.callLater(30, sendHeartbeat, pea, proto)

if __name__ == '__main__':
    scriptPath,peagunName = os.path.split(os.path.abspath(sys.argv[0]))
    print scriptPath

    configureFile = open(os.path.join(scriptPath,'config.txt'), 'r')
    import json
    confs = json.load(configureFile)
    configureFile.close()

    metaPath = '/tmp'
    generateProto([confs['PATH']])
    sys.path.append(metaPath + '/gen-py')


    sourceId = confs['APPID']
    pea = Peagun([confs['PATH']], Factory.createMessageHandle(''),['LMFHFProto.thrift','PluginManage.thrift'], sourceId)
    pea.cmdqueue.append('connect %s %d' % (confs['TTHOST'], confs['TTPORT']))

    def onConnected(connectionManager, proto):
        #session = login(confs['LOGINHOST'], confs['LOGINPORT'], confs['USERNAME'], confs['PASSWORD'], confs['APPID'], confs['APPGROUPID'])
	from aclSystem.ttypes import Session
        session = Session()
        session.sessionID = 100
        session.userID = 8
        session.appID = sourceId
        session.AppGroupId = 2

        from TTProto.ttypes import Registe
        registeMsg = Registe(session, 'pea', 'a mock client')
        connectionManager.send(proto, 0, sourceId, 0, registeMsg)

        reactor.callLater(30, sendHeartbeat, pea, proto)

    pea.onConnected.connect(onConnected)

    reactor.callInThread(runCommandLine,pea)
    reactor.run()
