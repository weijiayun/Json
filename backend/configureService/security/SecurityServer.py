#coding: utf-8
from MessageHandler import MessagePlugin
import psycopg2
import hashlib
from decorator import decorator
import os
import time
import logging
from mypostgresql2 import mysql2


class SecurityServer(MessagePlugin):
    conn = psycopg2.connect(database="sec1", user="postgres", password="powerup", host="127.0.0.1", port="5432")

    conn2 = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")

    aclsql2 = mysql2(conn,conn2)


    # conn2 = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    # aclsql = mysql(conn2)

    def __init__(self, messageHandle):
        super(SecurityServer, self).__init__(messageHandle)

        # self.handle('putcontent:securityproto', True, self.onPutContent)
        # self.handle('getcontent:securityproto', True, self.onGetContent)
        self.handle('deletecontent:securityproto', True, self.onDeleteContent)
        # self.handle('putkey:securityproto', True, self.onPutKey)
        # self.handle('getkey:securityproto', True, self.onGetKey)
        self.handle('listcontent:securityproto', True, self.onListContent)
        self.handle('putseriescontent:securityproto', True, self.onPutSeriesContent)
        self.handle('getseriescontent:securityproto', True, self.onGetSeriesContent)
        self.handle('putkeys:securityproto', True, self.onPutKeys)
        self.handle('getkeys:securityproto', True, self.onGetKeys)
        self.handle('revokegrant:securityproto', True, self.onRevokeGrant)
        self.handle('checksharer:securityproto', True, self.onCheckSharer)

    # def onPutContent(self, proto, spec, message, body):
    #
    #     print '-------------begin put content---------------'
    #     print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
    #     print 'content:%s' % body.content
    #     print 'key:%s' % body.key
    #     print '-------------end put content---------------'
    #     contentId, keyId = SecurityServer.aclsql2.putContent(body.session.userId, body.content, body.key)
    #
    #     if contentId != False:
    #         (responseSpec, successResponse) = self.create("putcontent:securityproto", False)
    #         successResponse.status = 0
    #         successResponse.message = 'ok'
    #         successResponse.contentId = contentId
    #         successResponse.keyId = keyId
    #         self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
    #     else:
    #         (responseSpec, failedResponse) = self.create("putcontent:securityproto", False)
    #         failedResponse.status = 1
    #         failedResponse.message = 'error:  put content'
    #         self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



    def onPutSeriesContent(self, proto, spec, message, body):
        print '-------------begin put series content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        for content in  body.seriesContent:
            print 'name-content-key: %s-%s-%s '%(content.name, content.content, content.key)
        print '-------------end put content---------------'
        # content=[]
        # for i in body.seriesContent:
        #     content.append([i.])
        #
        result = SecurityServer.aclsql2.putSeriesContent(body.session.userId, body.seriesContent)


        if result != False:
            (responseSpec, successResponse) = self.create("putseriescontent:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            ids={}
            for i in result:
                ids[i[0]]=i[1]
            successResponse.ckIds = ids
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("putseriescontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:  put content'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    # def onGetContent(self, proto, spec, message, body):
    #     print '-------------begin get content---------------'
    #     print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
    #     print 'contentId:%s' % body.contentId
    #     # print 'keyId:%s' % body.keyId
    #     print '-------------end get content---------------'
    #
    #     # content,key = SecurityServer.aclsql2.getContent(body.contentId,body.keyId )
    #     content,key = SecurityServer.aclsql2.getContent(body.contentId, body.session.userId )
    #
    #     if (content!= False and key != False):
    #         (responseSpec, successResponse) = self.create("getcontent:securityproto", False)
    #         successResponse.status = 0
    #         successResponse.message = 'ok'
    #         successResponse.content = content
    #         successResponse.key = key
    #         self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
    #     else:
    #         (responseSpec, failedResponse) = self.create("getcontent:securityproto", False)
    #         failedResponse.status = 1
    #         failedResponse.message = 'error: get content'
    #         self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
    #


    def onDeleteContent(self, proto, spec, message, body):
        print '-------------begin delete content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        for i in body.contentId:
            print 'contentId:%s' % i
        print '-------------end delete content---------------'
        r = SecurityServer.aclsql2.deleteContent(body.contentId)
        
        if r != False:
            (responseSpec, successResponse) = self.create("deletecontent:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("deletecontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:contentId does not exist '
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    # def onPutKey(self, proto, spec, message, body):
    #     print '-------------begin put key---------------'
    #     print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
    #     print 'key:%s' % body.key
    #     print 'contentId:%s' % body.contentId
    #     print 'userId:%s' % body.userId
    #     print '-------------end put key---------------'
    #
    #     keyId =  SecurityServer.aclsql2.putKey( body.key, body.contentId, body.userId)
    #
    #
    #     if keyId != False:
    #         (responseSpec, successResponse) = self.create("putkey:securityproto", False)
    #         successResponse.status = 0
    #         successResponse.message = 'ok'
    #         successResponse.keyId = keyId
    #         self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
    #     else:
    #         (responseSpec, failedResponse) = self.create("putkey:securityproto", False)
    #         failedResponse.status = 1
    #         failedResponse.message = 'error: put key'
    #         self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
    #
    #
    # def onGetKey(self, proto, spec, message, body):
    #     print '-------------begin get key---------------'
    #     print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
    #     print 'contentId:%s' % body.contentId
    #     print '-------------end get key---------------'
    #
    #     key =  SecurityServer.aclsql2.getKey(body.contentId, body.session.userId )
    #
    #
    #     if key != False:
    #         (responseSpec, successResponse) = self.create("getkey:securityproto", False)
    #         successResponse.status = 0
    #         successResponse.message = 'ok'
    #         successResponse.key = key
    #         self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
    #     else:
    #         (responseSpec, failedResponse) = self.create("getkey:securityproto", False)
    #         failedResponse.status = 1
    #         failedResponse.message = 'error:get key '
    #         self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onListContent(self, proto, spec, message, body):
        print '-------------begin list content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '-------------end list content---------------'
        contents = SecurityServer.aclsql2.listContent(body.session.userId)
        
        if contents != False:
            (responseSpec, successResponse) = self.create("listcontent:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            content=[]
            for i in contents:
                r = self.createGeneric("ContentKey:SecurityProto")
                r.contentId = i[0]
                r.keyId = i[1]
                content.append(r)
            successResponse.contents = content
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("listcontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:userId does not exist '
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onGetSeriesContent(self, proto, spec, message, body):
        print '-------------begin get series content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        for content in  body.contentIds:
            print 'name-contentId: %s-%s '%(content.name, content.contentId)
        print '-------------end get content---------------'

        result = SecurityServer.aclsql2.getSeriesContent(body.session.userId, body.contentIds)


        if result != False:
            (responseSpec, successResponse) = self.create("getseriescontent:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            contentKeys={}
            for i in result:
                j = self.createGeneric("CK:SecurityProto")

                j.content = i[1]
                j.key = i[2]
                contentKeys[i[0]]=j
            successResponse.contentKeys = contentKeys
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("getseriescontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:  get content'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    def onPutKeys(self, proto, spec, message, body):
        print '-------------begin put keys---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        for i in body.KeyContentIds:
            print' key-contentId-userId: %s-%s-%s'%(i.key, i.contentId, i.userId)
        print '-------------end put keys---------------'

        keyId =  SecurityServer.aclsql2.putKeys(body.session.userId, body.KeyContentIds)


        if keyId != False:
            (responseSpec, successResponse) = self.create("putkeys:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'

            successResponse.keyIds = keyId
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("putkeys:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: put keys'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    def onGetKeys(self, proto, spec, message, body):
        print '-------------begin get keys---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        for k,v in body.contentIds.items():
            print 'name-contentId:%s-%s' % (k, v)
        print '-------------end get keys---------------'

        keyDict =  SecurityServer.aclsql2.getKeys(body.session.userId, body.contentIds )


        if keyDict != False:
            (responseSpec, successResponse) = self.create("getkeys:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.keys = keyDict
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("getkeys:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:get key '
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    def onRevokeGrant(self, proto, spec, message, body):
        print '-------------begin revoke grant---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        for k,v in body.contentIds.items():
            print 'name-contentId:%s-%s' % (k, v)
        print 'otherUserId: %s' % body.otherUserId
        print '-------------end revoke grant---------------'

        r =  SecurityServer.aclsql2.revokeGrant(body.session.userId, body.contentIds, body.otherUserId )


        if r != False:
            (responseSpec, successResponse) = self.create("revokegrant:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("revokegrant:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:grant does not exist '
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())





    def onCheckSharer(self, proto, spec, message, body):
        print '-------------begin check sharer---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'contentId: %s' % body.contentId
        print '-------------end check sharer---------------'

        sharer = SecurityServer.aclsql2.checkSharer(body.contentId)

        if sharer != False:
            (responseSpec, successResponse) = self.create('checksharer:securityproto', False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.sharer = sharer
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create('checksharer:securityproto', False)
            failedResponse.status = 1
            failedResponse.message = 'error:this contentId does not exist '
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())




























