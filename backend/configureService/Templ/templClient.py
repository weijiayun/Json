#coding: utf-8
from MessageHandler import MessagePlugin
from promise import Promise

class templClient(MessagePlugin):
    def __init__(self, proto, messageHandle, serverId):
        super(templClient, self).__init__(messageHandle)
        self.proto = proto

        self.handle('upcontent:templ_json', False, self._onUpContent)
        self.handle('jsonrelation:templ_json', False, self._onJsonRelation)
        self.handle('basecheck:templ_json', False, self._onBaseCheck)
        self.handle('download:templ_json', False, self._onDownLoad)
        self.handle('getjsoncon:templ_json', False, self._onGetJsonCon)
        self.handle('grantauthority:templ_json', False, self._onGrantAuthority)
        self.handle('templmerge:templ_json', False, self._onTemplMerge)
        self.handle('createversion:templ_json', False, self._onCreateVersion)

        self.currentRequestId = 1
        self.requests = {}
        self.serverId = serverId

    def _getRequestId(self, request):
        requestId = self.currentRequestId
        self.currentRequestId += 1
        self.requests[requestId] = request
        return requestId

    def _onUpContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def upContent(self, session, name, version, contents):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("upcontent:templ_json", True)
            rRequest.session = session
            rRequest.name = name
            rRequest.version = version
            rRequest.contents = contents
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onJsonRelation(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def jsonRelation(self, session, JsonRelationName, version):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("jsonrelation:templ_json", True)
            rRequest.session = session
            rRequest.name = JsonRelationName
            rRequest.version = version
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onBaseCheck(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def baseCheck(self, session, BaseName, version):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("basecheck:templ_json", True)
            rRequest.session = session
            rRequest.name = BaseName
            rRequest.version = version
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onDownLoad(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def downLoad(self, session, TemplName, version):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("download:templ_json", True)
            rRequest.session = session
            rRequest.name = TemplName
            rRequest.version = version
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onGetJsonCon(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def getJsonCon(self, session, JsonAttrName, version):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getjsoncon:templ_json", True)
            rRequest.session = session
            rRequest.name = JsonAttrName
            rRequest.version = version
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onGrantAuthority(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def grantAuthority(self, session, userId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantauthority:templ_json", True)
            rRequest.session = session
            rRequest.name = userId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onTemplMerge(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def templMerge(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("templmerge:templ_json", True)
            rRequest.session = session
            # rRequest.name = userId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onCreateVersion(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceId)

    def createVersion(self, session, name, version, contents):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("createversion:templ_json", True)
            rRequest.session = session
            rRequest.name = name
            rRequest.version = version
            rRequest.contents = contents
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e