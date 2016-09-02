from twisted.internet import reactor
from twisted.internet.protocol import Protocol
from twisted.internet.protocol import Factory
from twisted.internet.endpoints import TCP4ClientEndpoint, connectProtocol,clientFromString
from network.DProto import DProto
from network.DSignal import DSignal

class PeagunProtocol(DProto,object):
    def __init__(self, manager):
        super(PeagunProtocol,self).__init__()
        self.manager = manager

    def default(self,message):
        reactor.callInThread(self.manager.onMessage, self,message)

class ConnectionManager(Factory):
    def __init__(self,messageHandler):
        self.currentProtocol = None
        self.protoDict = {}
        self.garbageDict = {}
        self.messageHandler = messageHandler
        self.defaultNamePrefix = '__connection__'
        self.lastConnectionId = 0

    def buildProtocol(self,addr):
        proto = PeagunProtocol(self)
        proto.onConnected.connect(self.onConnectionOpened)
        proto.onClosed.connect(self.onConnectionClosed)
        proto.addr = addr
        proto.name = '%s%03d' % (self.defaultNamePrefix,self.lastConnectionId)
        self.lastConnectionId += 1
        self.protoDict[proto.name] = proto
        return proto

    def onConnectionOpened(self,proto):
        reactor.callInThread(self.messageHandler.onConnectionOpened, proto)

    def onConnectionClosed(self,proto,reason):
        del self.protoDict[proto.name]
        self.garbageDict[proto.name] = proto
        reactor.callInThread(self.messageHandler.onConnectionClosed, proto,reason)

    def onMessage(self,proto,msg):
        # import ctypes
        # import threading
        # print "threaing id: ",ctypes.CDLL('libc.so.6').syscall(186)
        self.messageHandler.onMessage(proto,msg)

    def connect(self,host,port):
        from twisted.internet.endpoints import clientFromString
        endpoint = clientFromString(reactor,b"tcp:host=%s:port=%d"%(host,int(port)))

        def doConnect(endpoint):
            d = endpoint.connect(self)
            d.addErrback(self.messageHandler.onConnectionFailed)

        reactor.callFromThread(doConnect,endpoint)


    def rename(self,oldName,newName):
        proto = self.protoDict.get(oldName)
        if proto is None:
            return False
        elif self.protoDict.has_key(newName):
            return False
        else:
            del self.protoDict[oldName]
            self.protoDict[newName] = proto
            proto.name = newName
            return True

    def setCurrent(self,name):
        proto = self.protoDict.get(name)
        if proto is None:
            return False
        else:
            self.currentProtocol = proto
            return True


    def getCurrent(self):
        return self.currentProtocol

    def isCurrent(self,name):
        if self.currentProtocol is None:
            return False
        else:
            return self.currentProtocol.name == name

    def reconnect(self,name):
        if self.protoDict.has_key(name):
            return False
        elif self.garbageDict.has_key(name):
            proto = self.garbageDict[name]
            endpoint = clientFromString(reactor,b"tcp:host=%s:port=%d"%(proto.addr.host,proto.addr.port))
            def onReconnected(proto):
                del self.garbageDict[name]
                self.protoDict[name] = proto

            def doReconnect(endpoint):
                d = connectProtocol(endpoint,proto)
                d.addCallbacks(onReconnected,self.messageHandler.onConnectionFailed)

            reactor.callFromThread(doReconnect,endpoint)
            
            return True

    def disconnect(self,name):
        if self.protoDict.has_key(name):
            proto = self.protoDict[name]
            proto.transport.loseConnection()
            proto.isInDisconnect = True
            return True

        return False

    def delConnection(self,name):
        if self.protoDict.has_key(name):
            del self.protoDict[name]

        if self.garbageDict.has_key(name):
            del self.garbageDict[name]

        if self.currentProtocol is not None and self.currentProtocol.name == name:
            self.currentProtocol = None

    def send(self, proto, itype, sourceId, targetId, message, requestId = 0):
    # def send(self, proto, itype, sourceId, sessionId, requestId=0, message):

        if proto is None:
            proto = self.currentProtocol

        if proto is None:
            return False
        else:
            reactor.callFromThread(proto.send, sourceId, targetId, itype, requestId, message)
            # reactor.callFromThread(proto.send, sourceId, sessionId, itype, requestId=0, message)


            return True

