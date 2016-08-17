from twisted.internet import reactor, protocol
from DMessage import DMessage
from DMessage import DMessageType
from DSignal import DSignal


class DispatchItem(object):
    def __init__(self, t, handle):
        self.Type = t
        self.Handle = handle


class DProto(protocol.Protocol):
    def __init__(self):
        self.__data = ''
        self.__message = None
        self.onConnected = DSignal()
        self.onClosed = DSignal()

    def connectionMade(self):
        self.onConnected(self)

    def connectionLost(self, reason):
        self.onClosed(self, reason)

    def dataReceived(self, data):
        self.__data += data

        while True:
            length = len(self.__data)
            if length >= DMessage.getHeaderLength() and self.__message is None:
                self.__message = DMessage()
                # self.__message.asInitiator(not DMessageType.IsInitiator)
                self.__message.setHeader(self.__data[0:DMessage.getHeaderLength()])

            if self.__message is not None and length >= self.__message.getLength():
                mesgLen = self.__message.getLength()
                self.__message.setBody(self.__data[DMessage.getHeaderLength():mesgLen])
                self.__data = self.__data[mesgLen:]
                if 100000 == self.__message.getType():
                    i = 1
                self._dispatch()
            else:
                break


    def send(self, sourceId, sessionId, itype, requestId, request=None):
        #print 'DProto.send'
        message = DMessage.serialize(itype, sourceId, sessionId, requestId, request)
        self.transport.write(message.getHeader() + message.getBody())

    def _dispatch(self):
        iType = self.__message.getType()
        self.default(self.__message)
        self.__message = None

    def default(self, msg):
        pass



    
