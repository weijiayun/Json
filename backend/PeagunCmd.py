import os
import sys
import readline
import cmd
import re
import atexit
import exceptions
from decorator import decorator
from PeaView import PeaView
from twisted.internet import reactor
from twisted.internet.endpoints import serverFromString


class Peagun(cmd.Cmd, PeaView):
    def __init__(self, protoPathList, mesgHandle, excludeProtos, sourceId, isClient = True):
        cmd.Cmd.__init__(self)
        PeaView.__init__(self, protoPathList, mesgHandle, excludeProtos, sourceId, 0)

        # print self.messageDict.nameDict
        import functools

        for mesgName in self.messageDict.nameDict.keys():
            mesgName1 = mesgName.split(':')[0]
            setattr(Peagun, 'do_' + mesgName1, functools.partial(self.requestCommon, mesgName))

        setattr(Peagun, 'do_setpeeradd', self.do_setPeerAddress)
        self.connectParamPattern = re.compile('(\w+|(?:\d+\.){3}(?:\d+))\s+(\d+)')
        self.historyLoaded = False

        self.setPattern = re.compile('(\w+)\s*=\s*(\$[\w?%]+|\w+:\w*)')
        self.isExited = False

        import threading

        self.messageCond = threading.Condition()
        self.waitMessageId = -1
        self.isClient = isClient
        self.ignoreMessages = [0,17]
        self.sessionId = 0

    def emptyline(self):
        if self.lastcmd.startswith('connect'):
            return
        super(Peagun, self).emptyline()

    def requestCommon(self, mesgName, line):
        self.do_request(mesgName)

    def _readHistoryFile(self, fileName):
        if self.historyLoaded:
            return

        self.historyLoaded = True

        historyFile = os.path.join(os.environ["HOME"], fileName)
        try:
            readline.read_history_file(historyFile)
        except IOError:
            pass
        atexit.register(readline.write_history_file, historyFile)

    @decorator
    def checkDeferred(f, self, *argv, **kargv):
        f(self, *argv, **kargv)


    @checkDeferred
    def onConnectionOpened(self, proto):
        if self.connectionManager.getCurrent() is None:
            self.connectionManager.setCurrent(proto.name)

            # if proto.name.startswith(self.connectionManager.defaultNamePrefix):
            # oldName = proto.name
            # address = str(proto.addr)
            # while self.connectionManager.protoDict.has_key(oldName):
            #     newName = raw_input('please input a name for connection ' + address + ' :')
            #     if not self.connectionManager.rename(oldName,newName):
            #         self.error('alread have a connection named %s, please select another name')
            #     else:
            #         break
        # self.onConnected(self.connectionManager, proto)
            super(Peagun, self).onConnectionOpened(proto)

    @checkDeferred
    def onConnectionClosed(self, proto, reason):
        if self.isExited:
            pass
        elif self.isClient and not hasattr(proto, "isInDisconnect"):
            self.checkReconnect(proto, reason)
        else:
            self.connectionManager.delConnection(proto.name)
            if hasattr(proto, "isInDisconnect"):
                self.info('connection %s closed successfully' % proto.name)
            else:
                self.warn('connection %s closed:%s' % (proto.name, reason))

    def checkReconnect(self, proto, reason):
        if 'y' != raw_input('connection %s losted because %s,retry or not(y/n):' % (proto.name, reason)):
            self.connectionManager.delConnection(proto.name)

        elif not self.connectionManager.reconnect(proto.name):
            self.error('no such connection named ' + proto.name)


    @checkDeferred
    def show(self, proto, spec, message, body):
        super(Peagun, self).show(proto, spec, message, body)

    @checkDeferred
    def user(self, proto, spec, message, body):
        super(Peagun, self).show(proto, spec, message, body)
        super(Peagun, self).user(proto, spec, message, body)

    @checkDeferred
    def onConnectionFailed(self, failure):
        self.error('connect failed because ' + str(failure))

    def sendHeartbeat(self, proto):
        self.connectionManager.send(proto, 5, self.sourceId, 0, None)

    def onMessage(self, proto, message):
        #print('on message:(%d,%d)' % (message.getType(), self.waitMessageId))
        if 5 == message.getType():
            self.sendHeartbeat(proto)
            return
        elif message.getType() in self.ignoreMessages or (self.isClient and message.getType() != self.waitMessageId):
            return
        else:
            if not self.isClient:
                self.sessionId = message.getSource()
            self.messageCond.acquire()
            self.waitMessageId = -1
            self._onMessage(proto, message)
            self.messageCond.notify()
            self.messageCond.release()

    @checkDeferred
    def _onMessage(self, proto, message):
        super(Peagun, self).onMessage(proto, message)


    def do_exit(self, s):
        self.isExited = True
        return True

    do_quit = do_EOF = do_exit

    def do_help(self, line):
        self.info('''
    help                             show this help message
    shell                            execute shell command
    exit                             exit application
    quit                             exit application
    EOF                              exit application

    [connection manage]
    listen tcp:host:port             listen on host:port
    connect host port                connect to host:port
    listConnection                   list all connections
    using  connName                  set current connection to which named [connName]
    renameConnection oldName newName rename connection [oldName] to [newName]
    disconnect connName              disconnect the connection named [connName]

    [variable operation]
    set varName=$otherVarName        set the value of [varName] same as the value of [otherVarName]
    set varName=[typeName]           set the value of [varName] to the object that need you input
    get varName                      display the value of [varName]
    del varName                      delete variable [varName]
    listVariable                     list all variables
    save fileName                    save all variables to file [fileName]
    load fileName                    load variables from file [fileName]

    [message operation]
    request $varName                 send the value of [varName] to server using current connection
    request messageType              send the message which will request you input to server using current connection
    response $varName                send the value of [varName] to server using current connection
    response messageType             send the message which will request you input to server using current connection

    [message input]
    \q                               finish input list/map
    CTL+c                            give up current field
    CTL+D                            give up message

    [special variables]
    %                                recently sent message
    ?                                recently received message
    ''')

    def do_shell(self, scmd):
        os.system(scmd)

    @decorator
    def checkException(f, self, line):
        try:
            return f(self, line)
        except exceptions.IOError:
            raise
        except exceptions.Exception, e:
            self.error('exception ' + str(e))

    @checkException
    def do_connect(self, dst):
        m = self.connectParamPattern.match(dst)
        if m is None:
            self.help_connect()
            return

        host = m.group(1)
        port = m.group(2)

        d = self.connectionManager.connect(host, port)

    @checkException
    def do_using(self, connName):
        if not self.connectionManager.setCurrent(connName):
            self.error('no such connection named ' + connName)

    def complete_using(self, text, line, ibeg, iend):
        return [i for i in self.connectionManager.protoDict.keys() if i.startswith(text)]

    @checkException
    def do_renameConnection(self, line):
        params = line.split()
        oldName = params[0]
        newName = params[1]
        if not self.connectionManager.rename(oldName, newName):
            self.error('alread have a connection named %s, please select another name')

    def complete_renameConnection(self, text, line, ibeg, iend):
        return self.complete_using(text, line, ibeg, iend)

    @checkException
    def do_disconnect(self, name):
        if not self.connectionManager.disconnect(name):
            self.error("no such connection named " + name)

    def complete_disconnect(self, text, line, ibeg, iend):
        return self.complete_using(text, line, ibeg, iend)

    @checkException
    def do_listen(self, addr):
        if not hasattr(self, "isClient") or not self.isClient:
            self.isClient = False
        else:
            self.error("this is a client, doesn't support listen")
            return

        self._readHistoryFile('.peagunServer')
        serverFromString(reactor, addr).listen(self.connectionManager)

    @checkException
    def do_listConnection(self, l):
        connectionDict = self.connectionManager.protoDict
        self.info('name%12s | address' % (' '))
        for (name, con) in connectionDict.items():
            if self.connectionManager.isCurrent(name):
                name = '[' + name + ']'
            self.info('%-16s | %-16s' % ( name, con.addr))

    def _send(self, mesgName, mesgTypeName):
        isTTRequest = mesgName.endswith(':ttproto')
        if not isTTRequest and 0 == self.sessionId:
            while 0 == self.sessionId:
                peeradd = raw_input('please input peer address:')
                self.do_setPeerAddress(peeradd)

        from network.DMessage import DMessageType

        mesgTypeCode = DMessageType.name2Values[mesgTypeName]
        spec, obj = self.get(mesgName)
        if obj is None:
            messageSpec = self.messageDict.getByName(mesgName)
            if messageSpec is not None:
                if mesgTypeName == 'Request':
                    # if DMessageType.isInitiator(mesgTypeCode):
                    spec = messageSpec.getInitiatorSpec()
                else:
                    spec = messageSpec.getAcceptorSpec()

                if spec is not None:
                    print spec.getName(), spec.moduleName
                    obj = self.inputer.input(spec)
                else:
                    # self.info('the body of this message is empty')
                    obj = None
            else:
                self.error("can't find spec for message " + mesgName)
                return
        elif spec is None or (not spec.getName().endswith(mesgTypeName) and mesgTypeName != 'Request'):
            self.error('variable %s is not a %s message' % (mesgName, mesgTypeName.lower()))
            return
        else:
            # relName = spec.getName().replace(mesgTypeName,':') + spec.getModuleName()
            relName = spec.getMessageName()
            messageSpec = self.messageDict.getByName(relName)

        sessionId = self.sessionId
        if isTTRequest:
            sessionId = 0

        mesgId = DMessageType.makeCode(mesgTypeCode, messageSpec.getCode())
        self.waitMessageId = mesgId
        if not self.connectionManager.send(None, mesgId, self.sourceId, sessionId, obj):
            self.error('current connection is None')
        else:
            self.set(self.RecentlySendObjectKey, spec, obj)
            self.waitResponse(mesgId)

    def waitResponse(self, mesgId):
        self.messageCond.acquire()
        count = 1
        while -1 != self.waitMessageId and count <= 3:
            self.messageCond.wait(3)
            count += 1

        if -1 != self.waitMessageId:
            print('request timedout')

        #self.waitMessageId = -1
        self.messageCond.release()


    def do_setPeerAddress(self, line):
        try:
            self.sessionId = int(line)
        except exceptions.Exception, e:
            self.error(str(e))

    @checkException
    def do_request(self, mesgName):
        self._send(mesgName, "Request")


    def complete_request(self, text, line, ibeg, iend):
        if -1 != line.find('$'):
            return self.complete_get(text, line, ibeg, iend)
        else:
            return [i for i in self.messageDict.nameDict.keys() if i.startswith(text)]

    @checkException
    def do_response(self, mesgName):
        self._send(mesgName, "Response")

    def complete_response(self, text, line, ibeg, iend):
        return self.complete_request(text, line, ibeg, iend)

    @checkException
    def do_set(self, line):
        m = self.setPattern.match(line)
        if m is None:
            self.error('synatax error: ' + line)
        else:
            varName = m.group(1)
            varType = m.group(2)
            if varType.startswith('$'):
                rightVar = varType[1:]
                if self.variables.has_key(rightVar):
                    self.variables[varName] = self.variables[rightVar]
                else:
                    self.error('no such variable named ' + rightVar)

                return

            spec = self.messageDict.getType(varType)

            if spec is not None:
                obj = self.inputer.input(spec)
                if obj is not None:
                    self.variables[varName] = (spec, obj)
                else:
                    self.error('you input a null object')
            else:
                self.error('no such type ' + varType)

    def complete_set(self, text, line, ibeg, iend):
        indexEqual = line.find('=')
        if indexEqual != -1:
            if -1 != line.find('$'):
                return self.complete_get(text, line, ibeg, iend)
            return [i for i in self.messageDict.typeDict.keys() if i.lower().startswith(text.lower())]
        else:
            return []

    @checkException
    def do_get(self, line):
        if not line.startswith('$'):
            line = '$' + line
        spec, obj = self.get(line)
        if spec is not None:
            self.outputer.output(spec, obj)
        else:
            self.error('no variable named ' + line)

    def complete_get(self, text, line, ibeg, iend):
        return [i for i in self.variables.keys() if i.startswith(text)]

    @checkException
    def do_listVariable(self, line):
        self.info('name%-12s | type' % ' ')
        for (varName, detail) in self.variables.items():
            self.info('%-16s | %s' % ( varName, detail[0].getName()))

    @checkException
    def do_del(self, line):
        if self.variables.has_key(line):
            del self.variables[line]
        else:
            self.error('no variable named ' + line)

    @checkException
    def do_save(self, line):
        self.save(line, self.variables)

    def complete_save(self, text, line, ibeg, iend):
        return self.complete_load(text, line, ibeg, iend)

    @checkException
    def do_load(self, line):
        self.load(line, self.variables)

    def complete_load(self, text, line, ibeg, iend):
        path = line[line.find(' ') + 1:].strip()
        return self.completePath(path)

    def completePath(self, path):
        if 0 == len(path):
            path = '/'
        root, base = os.path.split(path)
        origCompleteList = [i for i in os.listdir(root) if i.startswith(base)]
        completeList = []
        for f in origCompleteList:
            if os.path.isdir(os.path.join(root, f)):
                f += '/'
            completeList.append(f)

        return completeList

    def completenames(self, text, *ignored):
        completeList = self.inputer.getCompleteList()
        if completeList is None:
            return super(Peagun, self).completenames(text, ignored)
        else:
            return [i for i in completeList if i.startswith(text)]

    def lcsLength(self, a, b):
        table = [[0] * (len(b) + 1) for _ in xrange(len(a) + 1)]
        for i, ca in enumerate(a, 1):
            for j, cb in enumerate(b, 1):
                table[i][j] = (
                    table[i - 1][j - 1] + 1 if ca == cb else
                    max(table[i][j - 1], table[i - 1][j]))
        return table[-1][-1]

    def default(self, line):
        maxLen = 0
        messageSelected = ''
        for mesgName in self.messageDict.nameDict.keys():
            lcs = self.lcsLength(line, mesgName.split(':')[0])
            if lcs > maxLen:
                maxLen = lcs
                messageSelected = mesgName

        choice = raw_input("do you mean %s y/n?" % messageSelected)
        if 'y' == choice:
            self.do_request(messageSelected)

    def completedefault(self, text, line, ibeg, iend):
        if line.startswith('@'):
            return self.completePath(line[1:])

