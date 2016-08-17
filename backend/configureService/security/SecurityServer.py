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
    aclsql2 = mysql2(conn)

    def __init__(self, messageHandle):
        super(SecurityServer, self).__init__(messageHandle)

        self.handle('putcontent:securityproto', True, self.onPutContent)
        self.handle('getcontent:securityproto', True, self.onGetContent)
        self.handle('deletecontent:securityproto', True, self.onDeleteContent)
        self.handle('putkey:securityproto', True, self.onPutKey)
        self.handle('getkey:securityproto', True, self.onGetKey)
        self.handle('listcontent:securityproto', True, self.onListContent)
        self.handle('putseriescontent:securityproto', True, self.onPutSeriesContent)


    def onPutContent(self, proto, spec, message, body):

        print '-------------begin put content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'content:%s' % body.content
        print 'key:%s' % body.key
        print '-------------end put content---------------'
        contentId, keyId = SecurityServer.aclsql2.putContent(body.session.userId, body.content, body.key)

        if contentId != False:
            (responseSpec, successResponse) = self.create("putcontent:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.contentId = contentId
            successResponse.keyId = keyId
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("putcontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:  put content'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



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
                id = self.createGeneric("ContentKeyId:SecurityProto")

                id.contentId = i[1]
                id.keyId = i[2]
                ids[i[0]]=id
            successResponse.ckIds = ids
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("putseriescontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:  put content'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    def onGetContent(self, proto, spec, message, body):
        print '-------------begin get content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'contentId:%s' % body.contentId
        # print 'keyId:%s' % body.keyId
        print '-------------end get content---------------'
        
        # content,key = SecurityServer.aclsql2.getContent(body.contentId,body.keyId )
        content,key = SecurityServer.aclsql2.getContent(body.contentId, body.session.userId )
        
        if (content!= False and key != False):
            (responseSpec, successResponse) = self.create("getcontent:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.content = content
            successResponse.key = key
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("getcontent:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: get content'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



    def onDeleteContent(self, proto, spec, message, body):
        print '-------------begin delete content---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'contentId:%s' % body.contentId
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

    def onPutKey(self, proto, spec, message, body):
        print '-------------begin put key---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'key:%s' % body.key
        print 'contentId:%s' % body.contentId
        print 'userId:%s' % body.userId
        print '-------------end put key---------------'

        keyId =  SecurityServer.aclsql2.putKey( body.key, body.contentId, body.userId)

        
        if keyId != False:
            (responseSpec, successResponse) = self.create("putkey:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.keyId = keyId
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("putkey:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: put key'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    def onGetKey(self, proto, spec, message, body):
        print '-------------begin get key---------------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'contentId:%s' % body.contentId
        print '-------------end get key---------------'

        key =  SecurityServer.aclsql2.getKey(body.contentId, body.session.userId )


        if key != False:
            (responseSpec, successResponse) = self.create("getkey:securityproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.key = key
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("getkey:securityproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:get key '
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

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



