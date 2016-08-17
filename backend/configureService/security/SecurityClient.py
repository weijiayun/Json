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

        self.handle('putcontent:securityproto', False, self._onPutContent)

        self.handle('getcontent:securityproto', False, self._onGetContent)

        self.handle('deletecontent:securityproto', False, self._onDeleteContent)

        self.handle('listcontent:securityproto', False, self._onListContent)

        self.handle('putkey:securityproto', False, self._onPutKey)


        self.handle('getkey:securityproto', False, self._onGetKey)

        self.handle('putseriescontent:securityproto', False, self._onPutSeriesContent)

    def _getRequestId(self, request, func = None):
        requestId = self.currentRequestId
        self.currentRequestId += 1

        if func is None:
            self.requests[requestId] = request
        else:
            self.requests[requestId] = (request , func)
        return requestId


    def _onPutContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill([body.contentId, body.keyId])


    def putContent(self, session, content, key, publicKey):
        p = Promise()
        try:
            enContent = myEncryption.aesEnctypt(key, content)
            enkey = myEncryption.rsaEncrypt(key, publicKey)
            (rSpec, rRequest) = self.create("putcontent:securityproto", True)
            rRequest.session = session
            rRequest.content = enContent
            rRequest.key = enkey
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            # p.fulfill('putContent')
            return p
        except Exception as e :
            print e

    def _onGetContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p, decrypt = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                content = decrypt(body.key, body.content)
                p.fulfill(content)

    def getContent(self, session, contentId, privateKey):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getcontent:securityproto", True)
            rRequest.session = session
            rRequest.contentId = contentId

            def decrypt(enKey, enContent):
                key=myEncryption.rsaDecrypt(enKey, privateKey)
                content=myEncryption.aesDectypt(key, enContent)
                return content

            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p, decrypt))
            return p
        except Exception as e :
            print e


    def _onDeleteContent(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill("delete successfully")

    def deleteContent(self,  session, contentId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deletecontent:securityproto", True)
            rRequest.session = session
            rRequest.contentId = contentId
            self.deleteContentResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
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


    def _onGetKey(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p, grant = self.requests[requestId]
            if 0 != body.status:
                # self.onGrantToOtherFailed(request.contentId, body.message)
                p.reject(Exception(body.message))
            else:
                grant( body.key)
                p.fulfill('getkeysuccess')

    def _onPutKey(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.keyId)

    def putKey(self,session, key, userId, contentId, publicKey):
        try:
            p = Promise()
            newKey = myEncryption.rsaEncrypt(key,publicKey)
            self.keyId = None
            (rSpec, rRequest) = self.create("putkey:securityproto", True)
            rRequest.session = session
            rRequest.key = newKey
            rRequest.contentId = contentId
            rRequest.userId = userId
            self.putKeyResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e
    
    def grantToOther(self,session, contentId,  otherUserId, myPrivateKey, otherPublicKey):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getkey:securityproto", True)
            rRequest.session = session
            rRequest.contentId = contentId
            self.getKeyResponse = None

            def grant(enKey):
                grantKey = myEncryption.rsaDecrypt(enKey, myPrivateKey)
                return  self.putKey( session, grantKey, otherUserId , contentId , otherPublicKey)

            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p, grant))
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









