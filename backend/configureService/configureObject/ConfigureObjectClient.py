#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'

from MessageHandler import MessagePlugin
from network.DSignal import DSignal
import myEncryption
from ..security import myEncryption
from promise import Promise
from ..security.SecurityClient import SecClient
import json


class ConfigureObjectClient(MessagePlugin):
    def __init__(self,proto,messageHandle,serverId):
        super(ConfigureObjectClient,self).__init__(messageHandle)
        self.proto = proto
        self.currentRequestId = 1
        self.requests = {}
        self.serverId = serverId
        
        self.handle('getconfigurefromgrid:configureobjectproto', False, self._onGetConfigureFromGrid)
        self.handle('createconfiguregrid:configureobjectproto', False, self._onCreateConfigureGrid)
        self.handle('deleteconfiguregrid:configureobjectproto', False, self._onDeleteConfigureGrid)
        self.handle('createconfiguretogrid:configureobjectproto', False, self._onCreateConfigureToGrid)
        self.handle('deleteconfigureingrid:configureobjectproto', False, self._onDeleteConfigureInGrid)
        self.handle('createconfigureobject:configureobjectproto', False, self._onCreateConfigureObject)
        self.handle('deleteconfigureobject:configureobjectproto', False, self._onDeleteConfigureObject)
        self.handle('getconfigureobject:configureobjectproto', False, self._onGetConfigureObject)

    def _getRequestId(self, request, func=None):
        requestId = self.currentRequestId
        self.currentRequestId += 1

        if func is None:
            self.requests[requestId] = request
        else:
            self.requests[requestId] = (request, func)
        return requestId

    def _onCreateConfigureObject(self,proto,spec,message,body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill("Object Id: {0}\nCreate Object is successfully!!!".format(body.ContentId))

    def createConfigureObject(self,session,objName,content,templId,templName,tmplVersion):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("createconfigureobject:configureobjectproto", True)
            rRequest.session = session
            rRequest.TemplateId = templId
            rRequest.TemplateName = templName
            rRequest.Version = tmplVersion
            rRequest.ObjectName = objName
            rRequest.Content = content
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onDeleteConfigureObject(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(["Object: {0}\nDelete Object is successfully!!!".format(body.ObjectName)])

    def deleteConfigureObject(self,session,ObjectName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteconfigureobject:configureobjectproto", True)
            rRequest.session = session
            rRequest.ObjectName = ObjectName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e


    def getConfigureObject(self,session,ObjectName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteconfigureobject:configureobjectproto", True)
            rRequest.session = session
            rRequest.ObjectName = ObjectName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e










