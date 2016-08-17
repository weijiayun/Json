from thrift.protocol import TCompactProtocol;
from thrift.transport import TTransport;
from exceptions import Exception
import struct


class DMessageType(object):
    Request = 0
    Response = 1
    Subscribe = 2
    Notify = 4

    value2Names = {Request: 'Request'
        , Response: 'Response'
        , Subscribe: 'Subscribe'
        , Notify: 'Notify'}

    name2Values = {'Request': Request
        , 'Response': Response
        , 'Subscribe': Subscribe
        , 'Notify': Notify}

    @classmethod
    def makeCode(cls, msgType, code):
        #return msgType
        return code | (msgType << 24)

    @classmethod
    def parseCode(cls, code):
        msgType = code >> 24
        return (msgType, code & (~(7 << 24)))

    @classmethod
    def isInitiator(cls, msgType):
        return msgType % 2 == 0

    @classmethod
    def isAcceptor(cls, msgType):
        return not cls.isInitiator(msgType)


class DMessage(object):
    def __init__(self):
        self.__bodyLength = 0
        self.__type = 0
        self.__source = 0
        self.__peer = 0
        self.__magic = 4474435
        self.__mesgSeqId = 4294967295
        self.__requestId = 0
        self.__isLast = True
        self.__isCached = False
        self.__isPublic = False
        self.__reserve = 'd'

        self.__body = ''

    def isValid(self):
        return self.getType() != 0

    def getTypeCode(self):
        return self.getType()

    def getMessageType(self):
        return DMessageType.Request if self.isInitiator() else DMessageType.Response

    def isInitiator(self):
        return self.__reserve == 'q'

    def asInitiator(self, isInitiator):
        self.__reserve = 'q' if isInitiator else 's'

    def isAcceptor(self):
        return not self.isInitiator()

    @classmethod
    def getHeaderLength(self):
        return 32

    def getBodyLength(self):
        if self.__body is None:
            return 0
        else:
            return len(self.__body)

    def getLength(self):
        return self.__bodyLength + self.getHeaderLength()

    def getType(self):
        return self.__type

    def setType(self, itype):
        self.__type = itype

    def getSource(self):
        return self.__source

    def setSource(self, source):
        self.__source = source

    def getPeer(self):
        return self.__peer

    def setPeer(self, peer):
        self.__peer = peer

    def getMagic(self):
        return self.__magic

    def getMesgSeqId(self):
        return self.__mesgSeqId

    def setMesgSeqId(self,msgSeqId):
        self.__mesgSeqId = msgSeqId

    def getRequestId(self):
        return self.__requestId

    def setReqestId(self, requestId):
        self.__requestId = requestId

    def isLast(self):
        return self.__isLast

    def setLast(self, isLast):
        self.__isLast = isLast

    def isCached(self):
        return self.__isCached

    def setCached(self, isCached):
        self.__isCached = isCached

    def isPublic(self):
        return self.__isPublic

    def setPublic(self, isPublic):
        self.__isPublic = isPublic

    def getHeader(self):
        return struct.pack('!iIIIIII???c', self.__bodyLength, self.__type , self.__source, self.__peer ,
                           self.__magic, self.__mesgSeqId, self.__requestId, self.__isLast, self.__isCached,
                           self.__isPublic, self.__reserve)

    def setHeader(self, header):
        if len(header) != self.getHeaderLength():
            return
        self.__bodyLength, self.__type, self.__source, self.__peer, self.__magic, self.__mesgSeqId, self.__requestId, self.__isLast, self.__isCached, self.__isPublic, self.__reserve = struct.unpack('!iIIIIII???c', header)

    def getBody(self):
        return self.__body

    def setBody(self, body):
        self.__body = body
        self.__bodyLength = self.getBodyLength()

    @staticmethod
    # def serialize(itype, source, peer, requestId = 0, bodyObj=None):
    def serialize(itype, source, peer, requestId, bodyObj=None):
        typeCode, itype = DMessageType.parseCode(itype)
        message = DMessage()
        message.setType(itype)
        message.setSource(source)
        message.setPeer(peer)
        message.setReqestId(requestId)


        message.asInitiator(0 == typeCode)

        if bodyObj is not None:
            memBuffer = TTransport.TMemoryBuffer()
            protocol = TCompactProtocol.TCompactProtocol(memBuffer)
            bodyObj.write(protocol)
            message.setBody(memBuffer.getvalue())

        return message


    def deserialize(self, obj):
        if self.__body is None or obj is None:
            return None

        try:
            memBuffer = TTransport.TMemoryBuffer(self.__body)
            protocol = TCompactProtocol.TCompactProtocol(memBuffer)
            obj.read(protocol)
        except Exception, e:
            print str(e)
            return obj

        return obj 

