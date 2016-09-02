import os
import sys
import re
import subprocess
import exceptions
from ControlInputer import ControlInputer
from ControlOutputer import ControlOutputer
from JsonInputer import JsonInputer
from JsonOutputer import JsonOutputer
from protoMeta.MessageSpec import MessageSpecDict
from protoMeta.ProtoParser import ProtoParser
from protoMeta.MessageInputCore import MessageInputCore
from protoMeta.MessageOutputCore import MessageOutputCore
from termcolor import colored, cprint
from network.DSignal import DSignal
class PeaView(object):
    RecentlySendObjectKey = '%'
    RecentlyRecvObjectKey = '?'
    varBeginPattern = re.compile(r'(\w+):\s*(\w+)\s+(\w+|\?|%)\s*=')
    varEndPattern = re.compile(r'(.*);')

    def __init__(self,protoPathList, mesgHandle, excludeProtos, sourceId, requestId=0):
        self.messageDict = MessageSpecDict()
        inputImpl = ControlInputer()
        outputImpl = ControlOutputer(sys.stdout)
        self.inputer = MessageInputCore(inputImpl)
        self.outputer = MessageOutputCore(outputImpl)
        self.foutputer = MessageOutputCore(JsonOutputer(None))
        self.finputer = MessageInputCore(JsonInputer(None))
        from ConnectionManager import ConnectionManager
        self.connectionManager = ConnectionManager(self)
        self.variables = {}
        self.sourceId = sourceId
        self.onConnected = DSignal()
        self.onConnectFailed = DSignal()


        ########
        self.requsetId = requestId
        ########
        try:
            parser = ProtoParser()
            for p in protoPathList:
                parser.parse(p,self.messageDict,excludeProtos)
        except exceptions.Exception,ex:
            print(str(type(ex)) + ":" + str(ex))

        #print self.messageDict.nameDict
        self.customHandle = mesgHandle
        self.customHandle.setView(self)

    def onConnectionOpened(self,proto):
        self.onConnected(self.connectionManager, proto)
        self.customHandle.onConnectionOpened(proto)
        from twisted.internet import reactor
        #reactor.callLater(5, self.customHandle.onConnectionOpened, proto)


    def onConnectionClosed(self,proto,reason):
        self.customHandle.onConnectionClosed(proto,reason)
        self.connectionManager.delConnection(proto.name)

    def onConnectionFailed(self,failure):
        self.onConnectFailed(failure)

    def onMessage(self,proto,message):
        if 5 == message.getType():
            self.connectionManager.send(proto, 5, self.sourceId, 0, None)
            return
        (spec,body) = self.customHandle.onMessage(proto,message)
        self.set(self.RecentlyRecvObjectKey,spec,body)

    def error(self,s):
        cprint(s,'red',attrs=['bold'],file=sys.stderr)

    def warn(self,s):
        cprint(s,'yellow',attrs=['bold'],file=sys.stderr)

    def info(self,s):
        cprint(s,'green',attrs=['bold'],file=sys.stderr)

    def get(self,varName):
        varName = varName.strip()
        if varName.startswith('$'):
            return self.variables.get(varName[1:])
        else:
            return (None,None)

    def set(self,varName,spec,obj):
        if spec is not None:
            self.variables[varName] = (spec,obj)

    def show(self,proto,spec,message,body):
        #self.info('received message %s'  % spec.getName())
        self.info('')
        self.info('Header:')
        self.info('    len:%d' % message.getLength())
        self.info('    type:%d' % message.getType())
        self.info('    peer:%d' % message.getPeer())
        self.info('    magic:%d' % message.getMagic())
        self.info('    mesgId:%d' % message.getMesgSeqId())
        self.info('')
        self.info('Body:')
        if body is not None:
            self.outputer.output(spec,body)
        self.info('')

    def user(self,proto,spec,message,body):

        if message.isInitiator():
            messageSpec = self.messageDict.getByName(spec.getMessageName())
            responseSpec = messageSpec.getAcceptorSpec()
            if responseSpec is None:
                self.sendNoBody(proto,spec.getMessageName(),False)
            else:
                self.info('please input message ' + responseSpec.getName())
                body = self.inputer.input(responseSpec)
                if body is not None:
                    self.send(proto,responseSpec,body)


                else:
                    self.warn('\ngive up response')

    def createGeneric(self, name):
        typeSpec = self.messageDict.typeDict.get(name)
        if typeSpec is None:
            return None
        obj = self.inputer.create(typeSpec)
        return obj


    def create(self,name,isInitiator = False):
        if isinstance(name,int):
            from network.DMessage import DMessageType
            msgCode = name
            messageSpec = self.messageDict.getByCode(msgCode)
        else:
            messageSpec = self.messageDict.getByName(name)

        spec = None
        if messageSpec is not None:
            if not isInitiator:
                spec = messageSpec.getAcceptorSpec()
            else:
                spec = messageSpec.getInitiatorSpec()
        
        if spec is None:
            spec = self.messageDict.getType('DResponse:DProto')

        obj = self.inputer.create(spec)
        return (spec,obj)


    def send(self,targetId, proto,spec,body, requestId = 0):
        mesgSpecName = spec.getMessageName()
        messageSpec = self.messageDict.getByName(mesgSpecName)
        if messageSpec is None:
            self.error('%s is not a request or response' % spec.getName())
            return False

        from network.DMessage import DMessageType
        if not self.connectionManager.send(proto
                ,DMessageType.makeCode(spec.getMessageTypeCode(),messageSpec.getCode())
                ,self.sourceId
                ,targetId
            ################
                # ,self.requsetId
            ################
                ,body
                ,requestId):
            self.error('current connection is None')
            return False
        else:
            self.set(self.RecentlySendObjectKey,spec,body)
            return True

    def sendNoBody(self,targetId, proto,mesgName,isInitiator = False, requestId = 0):
        messageSpec = self.messageDict.getByName(mesgName)
        if messageSpec is None:
            self.error('%s is not a request or response' % mesgName)
        else:
            if isInitiator and messageSpec.getInitiatorSpec() is not None:
                self.error('%s is not a request without body' % mesgName)
            elif not isInitiator and messageSpec.getAcceptorSpec() is not None:
                self.error('%s is not a request without body' % mesgName)
            elif not self.connectionManager.send(proto,messageSpec.getCode(), self.sourceId, targetId, None, requestId):
                self.error('current connection is None')
            else:
                return True

        return False

    def deserialize(self,message):
        code = message.getType()
        (spec,obj) = self.create(code, message.isInitiator())
        obj = message.deserialize(obj)
        return (spec,obj)

    def save(self,fileName,variables):
        vfile = open(fileName,'w')
        self.foutputer.outputer.sink = vfile
        for (varName,(spec,obj)) in variables.items():
            vfile.write('%s:%s %s = ' % (spec.getName(),spec.getModuleName(),varName))
            self.foutputer.output(spec,obj)
            vfile.write(';\n\n')
        self.foutputer.outputer.sink = None
        vfile.close()



    def load(self,fileName,variables):
        if not os.path.exists(fileName):
            self.error("cannot open file %s for read." % fileName)
            return

        vfile = open(fileName,'r')
        varName = ''
        varType = ''
        varContent = ''
        lineCount = 0
        for line in vfile:
            lineCount += 1
            m = self.varBeginPattern.match(line)
            if m is not None:
                varType = m.group(1) + ':' + m.group(2)
                varName = m.group(3)
                varContent = line[m.end():]
                continue

            m = self.varEndPattern.match(line)
            if m is not None:
                varContent += m.group(1)

                if varName == '?' or varName == '%':
                    self.warn('can not load variable named ? or %.')
                    break

                spec = self.messageDict.getType(varType)
                if spec is None:
                    self.error("line %d,can't find type %s" % (lineCount,varType))
                    continue
                try:
                    import json
                    self.finputer.inputer.jsonObject = json.loads(varContent)
                    #print varContent
                    obj = self.finputer.input(spec)
                    variables[varName] = (spec,obj)
                except exceptions.Exception,e:
                    self.error("load variable %s typed %s exception: %s" % (varName,varType,e.message))


            varContent += line

