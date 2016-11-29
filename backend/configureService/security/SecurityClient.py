from MessageHandler import MessagePlugin
from network.DSignal import DSignal
import myEncryption
from promise import Promise

class SecClient(MessagePlugin):
    def __init__(self, proto, messageHandle, serverId):
        super(SecClient, self).__init__(messageHandle)
        self.proto = proto
        self.currentRequestId = 1
        self.requests = {}
        self.serverId = serverId
        self.handle('putseriescontent:securityproto', False, self._onPutSeriesContent)
        self.handle('getseriescontent:securityproto', False, self._onGetSeriesContent)
        self.handle('putkeys:securityproto', False, self._onPutKeys)
        self.handle('getkeys:securityproto', False, self._onGetKeys)
        self.handle('revokegrant:securityproto', False, self._onRevokeGrant)
        self.handle('listcontent:securityproto', False, self._onListContent)
        self.handle('deletecontent:securityproto', False, self._onDeleteContent)
        self.handle('checksharer:securityproto', False, self._onCheckSharer)
    def _getRequestId(self, request, func = None):
        requestId = self.currentRequestId
        self.currentRequestId += 1

        if func is None:
            self.requests[requestId] = request
        else:
            self.requests[requestId] = (request , func)
        return requestId

    def _onDeleteContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill('delete content success!')

    def deleteContent(self,  session, contentId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deletecontent:securityproto", True)
            rRequest.session = session
            rRequest.contentId = contentId
            self.deleteContentResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e


    def _onListContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.contents)

    def listContent(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listcontent:securityproto", True)
            rRequest.session = session
            self.listContentResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onPutSeriesContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.ckIds)


    def putSeriesContent(self, session, seriesContent, publicKey):
        try:
            p = Promise()
            for i in seriesContent:
                enContent = myEncryption.aesEnctypt( i[2],i[1])
                enkey = myEncryption.rsaEncrypt(i[2], publicKey)
                i[1]=enContent
                i[2]=enkey
            (rSpec, rRequest) = self.create("putseriescontent:securityproto", True)
            rRequest.session = session
            s=[]
            for i in seriesContent:
                j = self.createGeneric("Content:SecurityProto")
                j.name = i[0]
                j.content = i[1]
                j.key = i[2]
                s.append(j)
            rRequest.seriesContent = s
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onGetSeriesContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p, decrypt = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                contentDict={}
                for k,v in body.contentKeys.items():
                    content = decrypt(v.key, v.content)
                    contentDict[k]=content
                p.fulfill(contentDict)

    def getSeriesContent(self, session, contentIds, privateKey):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getseriescontent:securityproto", True)
            rRequest.session = session
            cIds=[]
            for i in contentIds:
                cId = self.createGeneric("ConId:SecurityProto")
                cId.name=i[0]
                cId.contentId=i[1]
                cIds.append(cId)
            rRequest.contentIds = cIds

            def decrypt(enKey, enContent):
                key=myEncryption.rsaDecrypt(enKey, privateKey)
                content=myEncryption.aesDectypt(key, enContent)
                return content

            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p, decrypt))
            return p
        except Exception as e :
            print e




    def _onGetKeys(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p, grants = self.requests[requestId]
            if 0 != body.status:
                # self.onGrantToOtherFailed(request.contentId, body.message)
                p.reject(Exception(body.message))
            else:
                grants( body.keys)
                p.fulfill('getkeysuccess')


    def _onPutKeys(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.keyIds)

    def putKeys(self,session, key, contentIds ,otherUserId , publicKey):
        try:
            p = Promise()
            enKey={}
            for k,v in key.items():
                enKey[k]=myEncryption.rsaEncrypt(v,publicKey)
            # newKey = myEncryption.rsaEncrypt(key,publicKey)
            # self.keyId = None
            kCIds=[]
            for k,v in contentIds.items():
                kCId = self.createGeneric("KeyContentId:SecurityProto")
                kCId.key=enKey[k]
                kCId.contentId=v
                kCId.userId=otherUserId
                kCIds.append(kCId)
            (rSpec, rRequest) = self.create("putkeys:securityproto", True)
            rRequest.session = session

            rRequest.KeyContentIds = kCIds
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def grantSeriesToOther(self,session, contentIds, otherUserId , myPrivateKey, otherPublicKey):
        try:
            p = Promise()
            conIds ={}
            for k,v in contentIds.items():
                conIds[k]=v
            (rSpec, rRequest) = self.create("getkeys:securityproto", True)
            rRequest.session = session
            rRequest.contentIds = conIds

            def grants(keys):
                grantKey = {}
                for k,v in keys.items():
                    grantKey[k] = myEncryption.rsaDecrypt(v, myPrivateKey)
                return self.putKeys( session, grantKey, contentIds, otherUserId, otherPublicKey)

            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p, grants))
            return p
        except Exception as e :
            print e



    def _onRevokeGrant(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.status)

    def revokeGrant(self,session, contentIds, otherUserId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("revokegrant:securityproto", True)
            rRequest.session = session
            rRequest.contentIds = contentIds
            rRequest.otherUserId = otherUserId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e


    def _onCheckSharer(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.sharer)


    def checkSharer(self, session, contentId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("checksharer:securityproto", True)
            rRequest.session = session
            rRequest.contentId = contentId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e






















