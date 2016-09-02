#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'

from MessageHandler import MessagePlugin
from promise import Promise


class ConfigureObjectClient(MessagePlugin):
    def __init__(self,proto,messageHandle,serverId):
        super(ConfigureObjectClient,self).__init__(messageHandle)
        self.proto = proto
        self.currentRequestId = 1
        self.requests = {}
        self.serverId = serverId

        self.handle('createconfigure:configureobjectproto', False, self._onCreateConfigure)
        self.handle('deleteconfigure:configureobjectproto', False, self._onDeleteConfigure)
        self.handle('getconfigure:configureobjectproto', False, self._onGetConfigure)

        self.handle('deletecollection:configureobjectproto', False, self._onDeleteCollection)
        self.handle('addobjectlisttocollection:configureobjectproto', False, self._onAddObjectListToCollection)
        self.handle('deleteobjectlistincollection:configureobjectproto', False, self._onDeleteObjectListInCollection)
        self.handle('getcollection:configureobjectproto', False, self._onGetCollection)

        self.handle('createobject:configureobjectproto', False, self._onCreateObject)
        self.handle('deleteobject:configureobjectproto', False, self._onDeleteObject)
        self.handle('getobjects:configureobjectproto', False, self._onGetObjects)

        self.handle('grantobjectstoothers:configureobjectproto', False, self._onGrantObjectsToOthers)
        self.handle('ungrantobjectsofothers:configureobjectproto', False, self._onUnGrantObjectsOfOthers)
        self.handle('grantconfiguretoothers:configureobjectproto', False, self._onGrantConfigureToOthers)
        self.handle('ungrantconfigureofothers:configureobjectproto', False, self._onUnGrantConfigureOfOthers)

        self.handle('listobjects:configureobjectproto', False, self._onListObjects)
        self.handle('getauthoritysharers:configureobjectproto', False, self._onGetAuthoritySharers)
        self.handle('listcollections:configureobjectproto', False, self._onListCollections)

    def _getRequestId(self, request, func=None):
        requestId = self.currentRequestId
        self.currentRequestId += 1

        if func is None:
            self.requests[requestId] = request
        else:
            self.requests[requestId] = (request, func)
        return requestId
            
    def _onCreateConfigure(self,proto,spec,message,body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def createConfigure(self, session, name, createDate, version, objectList):

        ''' session: the information of login user
            name: configure's name
            createDate: create date of configure
            version: configure's version
            objectList: [[Name, Date, Version],...]'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("createconfigure:configureobjectproto", True)
            rRequest.session = session
            ins = self.createGeneric("configure:ConfigureObjectProto")
            ins.Name = name
            ins.Date = createDate
            ins.Version = version
            rRequest.Configure = ins
            ins = []
            for i in objectList:
                f = self.createGeneric("object:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ObjectList = ins
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onDeleteConfigure(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def deleteConfigure(self, session, name, createDate, version):

        ''' session: the information of login user
            name: configure's name
            createDate: configure's create date
            version: version of configure'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteconfigure:configureobjectproto", True)
            ins = self.createGeneric("configure:ConfigureObjectProto")
            ins.Name = name
            ins.Date = createDate
            ins.Version = version
            rRequest.Configure = ins
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onDeleteCollection(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def deleteCollection(self, session, collectionName):

        ''' session: the information of login user
            collectName: collection's name'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deletecollection:configureobjectproto", True)
            rRequest.session = session
            rRequest.CollectionName = collectionName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onAddObjectListToCollection(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def addObjectListToCollection(self, session, objectList, collectionName):

        ''' session: the information of login user
            objectList: [[Name, Date, Version],...]
                       Name: object's name
                       Date: create date of the object
            collectionName: collection's name'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addobjectlisttocollection:configureobjectproto", True)
            ins = []
            for i in objectList:
                f = self.createGeneric("object:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ObjectList = ins
            rRequest.session = session
            rRequest.CollectionName = collectionName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onDeleteObjectListInCollection(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def deleteObjectListInCollection(self, session, objectList, collectionName):

        ''' session: the information of login user
            objectList: [[Name, Date, Version],...]
                       Name: object's name
                       Date: create date of the object
            collectionName: collection's name'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteobjectlistincollection:configureobjectproto", True)
            ins = []
            for i in objectList:
                f = self.createGeneric("object:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ObjectList = ins
            rRequest.session = session
            rRequest.CollectionName = collectionName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onCreateObject(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def createObject(self, session, objectList):

        ''' session: the information of login user
            objectList: object list --> [[Name, Date, Version, Content],..]
                        Name: object's name
                        Date: object's create date
                        Version: object's version
                        Content: object's content'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("createobject:configureobjectproto", True)
            f = []
            for i in objectList:
                ins = self.createGeneric("objectContent:ConfigureObjectProto")
                ins.Name = i[0]
                ins.Date = i[1]
                ins.Version = i[2]
                ins.Content = i[3]
                f.append(ins)
            rRequest.ObjectList = f
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onDeleteObject(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def deleteObject(self, session, objectList):

        '''session: the information of login user
           objectList: object list --> [[Name, Date, Version],..]'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteobject:configureobjectproto", True)
            rRequest.session = session
            f = []
            for i in objectList:
                ins = self.createGeneric("object:ConfigureObjectProto")
                ins.Name = i[0]
                ins.Date = i[1]
                ins.Version = i[2]
                f.append(ins)
            rRequest.ObjectList = f
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGetObjects(self, proto, spec, message, body):

        '''body.Content is a dict'''

        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.Content)

    def getObjects(self, session, objectList):

        '''session: the information of login user
           objectList: object list --> [[Name, Date, Version],..]'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getobjects:configureobjectproto", True)
            ins = []
            for i in objectList:
                f = self.createGeneric("object:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ObjectList = ins
            rRequest.session = session

            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGetConfigure(self, proto, spec, message, body):

        '''body.Content is a dict'''

        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.Content)

    def getConfigure(self, session, name, createDate, version):

        '''session: the information of login user
           name: configure's name
           createDate: create Date of the configure
           version: version of the configure'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getconfigure:configureobjectproto", True)
            ins = self.createGeneric("configure:ConfigureObjectProto")
            ins.Name = name
            ins.Date = createDate
            ins.Version = version
            rRequest.Configure = ins
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGetCollection(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.Content)

    def getCollection(self, session, collectionList):

        '''session: the information of login user
           collectionList: a list of collection's name'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getcollection:configureobjectproto", True)
            rRequest.session = session
            rRequest.CollectionList = collectionList
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGrantObjectsToOthers(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def grantObjectsToOthers(self, session, othersId, objectList):

        '''session: the information of login user
            otherId: the Id of user who is going to grant the authority of object in objectList
            objectList: object list --> [[Name, Date, Version],...]'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantobjectstoothers:configureobjectproto", True)
            rRequest.session = session
            rRequest.OthersId = othersId
            ins = []
            for i in objectList:
                f = self.createGeneric("object:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ObjectList = ins

            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onUnGrantObjectsOfOthers(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def unGrantObjectsOfOthers(self, session, othersId, objectList):

        '''session: the information of login user
           otherId: the Id of user who is going to discard the authority of object in objectList
           objectList: object list --> [[Name, Date, Version],...]'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("ungrantobjectsofothers:configureobjectproto", True)
            rRequest.session = session
            rRequest.OthersId = othersId
            ins = []
            for i in objectList:
                f = self.createGeneric("object:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ObjectList = ins
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGrantConfigureToOthers(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def grantConfigureToOthers(self, session, othersId, configureList):

        '''session: the infomation of login user
           othersId: the user who is going to be granted authority of configures
           configureList: configure list --> [[Name, Date, Version],...]'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantconfiguretoothers:configureobjectproto", True)
            rRequest.session = session
            rRequest.OthersId = othersId
            ins = []
            for i in configureList:
                f = self.createGeneric("configure:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ConfigureList = ins
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onUnGrantConfigureOfOthers(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def unGrantConfigureOfOthers(self, session, othersId, configureList):

        '''the configureList's configure is [[Name, Date, Version],...]'''

        try:
            p = Promise()
            (rSpec, rRequest) = self.create("ungrantconfigureofothers:configureobjectproto", True)
            rRequest.session = session
            rRequest.OthersId = othersId
            ins = []
            for i in configureList:
                f = self.createGeneric("configure:ConfigureObjectProto")
                f.Name = i[0]
                f.Date = i[1]
                f.Version = i[2]
                ins.append(f)
            rRequest.ConfigureList = ins
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onListObjects(self, proto, spec, message, body):

        '''body.ObjectList is a list eg: ["obj1-20120812-v0.1",...]'''

        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.ObjectList)

    def listObjects(self, session):

        '''session: information of login user'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listobjects:configureobjectproto", True)
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGetAuthoritySharers(self, proto, spec, message, body):

        '''body.SharerList is a user name list, user in the list have same authority about a file'''

        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.SharerList)

    def getAuthoritySharers(self, session, name, createDate, version):

        '''session: information of login user'''
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getauthoritysharers:configureobjectproto", True)
            ins = self.createGeneric("object:ConfigureObjectProto")
            ins.Name = name
            ins.Date = createDate
            ins.Version = version
            rRequest.Object = ins
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onListCollections(self, proto, spec, message, body):

        '''CollectionList is a list of collection names in database'''
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.CollectionList)

    def listCollections(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listcollections:configureobjectproto", True)
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e











