#!/opt/Apps/local/Python/anaconda/bin/python
import os
import sys
import subprocess
from twisted.internet import epollreactor
epollreactor.install()
from twisted.internet import reactor
from MessageHandler import Factory
from PeaView import PeaView
from exceptions import Exception
from network.DMessage import DMessageType

def generateProto(protoPathList, metaPath):
    #generate py source
    for p in protoPathList:
        files = os.listdir(p)
        for f in files:
            stem,ext = os.path.splitext(f)
            if ext == '.thrift':
                subprocess.call(['thrift','-gen','py','-o',metaPath,os.path.join(p,f)],stdout=sys.stdout,stderr=sys.stderr)


def sendHeartbeat(pea, proto):
    #pea.sendHeartbeat(proto)
    reactor.callLater(30, sendHeartbeat, pea, proto)

class DotDict(dict):
  def __init__(self, *args, **kwargs):
    dict.__init__(self, *args, **kwargs)
    self.__dict__ = self

if __name__ == '__main__':
    scriptPath,peagunName = os.path.split(os.path.abspath(sys.argv[0]))
    if 2 != len(sys.argv):
        print('usage: ServerMain.py configure')
        sys.exit(-1)

    confFilePath = sys.argv[1]
    if not os.path.isfile(confFilePath):
        print("configure file %s doesn't exists" % confFilePath)
        sys.exit(-1)

    print('loading configure')
    try:
        configureFile = open(confFilePath, 'r')
        import json
        confs = json.load(configureFile, object_pairs_hook=DotDict)
        configureFile.close()
    except Exception as e:
        print('load configure failed: ' + str(e))
        sys.exit(-1)
    print('load configure done')


    print('thrift generating gen-py for proto files in dir:' + str(confs.ProtoPath))
    try:
        metaPath = '/tmp/'
        sys.path.append(os.path.join(metaPath, 'gen-py'))
        generateProto(confs.ProtoPath, metaPath)
    except Exception as e:
        print('thrift generate gen-py failed: ' + str(e))
        sys.exit(-1)
    print('thrift generate gen-py done')

    print('server initialzing...')
    try:
        server = PeaView(confs.ProtoPath
                      , Factory.createMessageHandles(confs.PluginPaths)
                      , confs.ExcludeProtos
                      , confs.SourceId
                      , False)

        server.customHandle.load(confs)
    except Exception as e:
        print('server initialize failed,' + str(e))
        sys.exit(-1)
    print('server initialize done.')

    def onConnected(connectionManager, proto):
        from aclSystem.ttypes import Session
        session = Session()
        session.sessionID = 100
        session.userID = 8
        session.appID = confs.SourceId
        session.AppGroupId = 2
        print('connect to tt success')
        from TTProto.ttypes import Registe
        registeMsg = Registe(session, confs.AppName, confs.Description)
        connectionManager.send(proto, 0, confs.SourceId, 0, registeMsg)

        reactor.callLater(30, sendHeartbeat, server, proto)

    def onConnectFailed(reason):
        print('connect to tt failed, reason:' + reason)

    server.onConnected.connect(onConnected)
    server.onConnectionFailed(onConnected)
    import ctypes
    import threading
    print "Main threaing id: ",ctypes.CDLL('libc.so.6').syscall(186)
    server.connectionManager.connect(confs.TTIP, confs.TTPort)
    reactor.run()
    print('exit normally.')
