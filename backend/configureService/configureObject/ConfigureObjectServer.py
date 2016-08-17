#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding:utf-8
__author__ = 'jiayun.wei'

from MessageHandler import MessagePlugin
from ConfigObjectPostgres import ConfigureObjectSql
import psycopg2,hashlib,os,time,logging
from configureService.security.SecurityClient import SecClient
from configureService.acl.ACLClient import ACLClient
import json
import random,string

class ConfigureObjectServer(MessagePlugin):

    conn = psycopg2.connect(database="config3", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    configsql3 = ConfigureObjectSql(conn)

    def __init__(self,messageHandle):
        super(ConfigureObjectServer,self).__init__(messageHandle)

        self.handle('getconfigurefromgrid:configureobjectproto', True, self.onGetConfigureFromGrid)
        self.handle('createconfiguregrid:configureobjectproto', True, self.onCreateConfigureGrid)
        self.handle('deleteconfiguregrid:configureobjectproto', True, self.onDeleteConfigureGrid)
        self.handle('createconfiguretogrid:configureobjectproto', True, self.onCreateConfigureToGrid)
        self.handle('deleteconfigureingrid:configureobjectproto', True, self.onDeleteConfigureInGrid)
        self.handle('createconfigureobject:configureobjectproto', True, self.onCreateConfigureObject)
        self.handle('deleteconfigureobject:configureobjectproto', True, self.onDeleteConfigureObject)
        self.handle('getconfigureobject:configureobjectproto', True, self.onGetConfigureObject)

    def onConnectionOpened(self, proto):
        print '----begin login-----'
        self.aclClient = ACLClient(proto, self.mesgHandle, 609)##myclient
        self.securityClient = SecClient(proto, self.mesgHandle, 609)
        self.session = self.aclClient.login('aa', '1231')
        if 0 == self.session.userId and 0 == self.session.seqId:
            print '----login failed-----'
        else:
            print '----login success----'

    def onConnectionClosed(self, proto, reason):
        print '----begin logout-----'
        if self.session is not None:
            self.aclClient.logout(self.session)
        print '---logout success---'

    def write_log(self, log_type, userId, message, operation):
        logger = '\n用户ID：%s\n错误信息：%s\n%s\n执行操作：%s\n' % (userId, message, operation, '-' * 50)
        if log_type == 'error':
            logging.error(logger)

    def onCreateGrid(self,proto,spec,message,body):
        try:
            print '-------------begin Create Configure Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Grid Name: {0}'.format(body.GridName)
            print '-------------end Create Configure Grid------------------'

            IsCreateGridSuccess = self.configsql3.createGridInMapping(body.GridName)
            if IsCreateGridSuccess:
                (responseSpec, successResponse) = self.create("createconfiguregrid:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "Create Grid successfully"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("createconfiguregrid:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'error: creating grid is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        except Exception as e:
            print e


    def onDeleteGrid(self, proto, spec, message, body):

        print '-------------begin Delete Configure Grid---------------'
        print 'Delete Configure Grid Name: {0}'.format(body.GridName)
        print '---------------end Delete Configure Grid---------------'

        try:
            IsDeleteConfigureGrid = self.configsql3.deleteGridInMapping(body.GridName)
            if IsDeleteConfigureGrid != False:
                (responseSpec, successResponse) = self.create("deleteconfiguregrid:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "delete grid is successfully."
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("deleteconfiguregrid:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'error: delete grid is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        except Exception as e:
            print 'Error: {0}'.format(e)


    def onAddConfigureToGrid(self,proto,spec,message,body):
        try:
            print '-------------begin Create Configure Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Grid Name: {0}'.format(body.GridName)
            print 'Configure Create Date: {0}'.format(body.Date)
            print 'Configure Version: {0}'.format(body.Version)
            print '-------------end Create Configure Grid------------------'

            IsBuildGridToMappingSuccess = self.configsql3.addConfigureToGridMapping(body.Date,body.Version,body.GridName)
            if IsBuildGridToMappingSuccess != False:
                (responseSpec, successResponse) = self.create("createconfiguregrid:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "Add configure in grid is successfully"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("createconfiguregrid:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'Error: Add configure in grid is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        except Exception as e:
            print 'error: {0}'.format(e)


    def onDeleteConfigureInGrid(self,proto,spec,message,body):

        print '-------------begin Delete Configure Grid---------------'
        print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
        print 'Delete Configure Grid Name: {0}'.format(body.GridName)
        print 'Configure Date: {0}'.format(body.Date)
        print 'Configure Version: {0}'.format(body.Version)
        print '---------------end Delete Configure Grid---------------'

        try:
            IsDeleteConfigureGrid = self.configsql3.deleteGridInMapping(body.GridName)
            if IsDeleteConfigureGrid != False:
                (responseSpec, successResponse) = self.create("deleteconfiguregrid:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "delete configure in grid is successfully."
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("deleteconfiguregrid:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'error: delete configure in grid is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        except Exception as e:
            print e

    def onCreateConfigureInstance(self,proto,spec,message,body):
        try:
            print '-------------begin Delete Configure In Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Version: {0}'.format(body.Version)
            print 'Configure Create Date: {0}'.format(body.Date)
            print 'Configure Object List: {0}'.format(body.ObjectList)
            print '---------------end Delete Configure In Grid---------------'

            secIdList = [self.configsql3.getObjectFromMapping(elem)[0] for elem in body.ObjectList]
            IsCreateConfigureInstance = self.configsql3.addConfigureToMapping(json.dumps(secIdList),body.Version,body.Date)
            if IsCreateConfigureInstance:
                (responseSpec, successResponse) = self.create("deleteconfigureingrid:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "delete configure in mapping successfully"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("deleteconfigureingrid:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'Error: delete configure in grid is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        except Exception as e:
            print e

    def onDeleteConfigureInstance(self, proto, spec, message, body):
        try:
            print '-------------begin Delete Configure In Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Version: {0}'.format(body.Version)
            print 'Configure Create Date: {0}'.format(body.Date)
            print '---------------end Delete Configure In Grid---------------'

            IsDeleteConfigureInstanceMapping = self.configsql3.deleteConfigureInMapping(body.Date, body.Version)
            if IsDeleteConfigureInstanceMapping:
                (responseSpec, successResponse) = self.create("deleteconfigureingrid:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "delete configure in mapping successfully"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("deleteconfigureingrid:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'Error: delete configure in grid is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        except Exception as e:
            print e

    def onCreateObject(self,proto,spec,message,body):
        print '-------------begin Create Configure Object---------------'
        print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
        print 'Configure Template Id : {0}'.format(body.TemplateId)
        print 'Configure Template Name : {0}'.format(body.TemplateName)
        print 'Configure Template Version: {0}'.format(body.Version)
        print 'Configure Object Name : {0}'.format(body.ObjectName)
        print 'Configure Object Content: {0}'.format(body.Content)
        print '---------------end Create Configure Object---------------'

        if body.Content != None and body.Content != []:
            try:
                with open('tests/master-public.pem') as f:
                    publicKey1 = f.read()
                contentDict = {
                    "templateName":body.TemplateName,
                    "templVersion":body.Version,
                    "objectName":body.ObjectName,
                    "content": body.Content,
                    "collection":body.Collection
                }
                passwd = string.join(
                    random.sample(list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+'),
                                  16)).replace(" ", "")
                def putContentSuccess(originContentId):
                    print originContentId
                    self.buildObjectInMapping(message, proto, originContentId,body)
                def putContentFailed(errMesg):
                    print 'putSeriesContent failed: %s' % errMesg
                self.securityClient.putContent(self.session,json.dumps(contentDict),passwd,publicKey1)\
                    .then(putContentSuccess)\
                    .catch(putContentFailed)
            except Exception as e:
                print 'error: {0}'.format(e)
                (responseSpec, failedResponse) = self.create("createconfigureobject:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = 'error: create configure object'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

        else:
            (responseSpec, failedResponse) = self.create("createconfigureobject:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: create configure object\nContent is null'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def buildObjectInMapping(self,message,proto,originContentId,body):
        security_id = originContentId[0]
        IsCreateObjectRelation = self.configsql3\
            .createObjectToMapping(security_id,
                                   body.ObjectName,
                                   body.Collection,
                                   body.TemplateName,
                                   body.Version)
        if IsCreateObjectRelation:
            (responseSpec, successResponse) = self.create("createconfigureobject:configureobjectproto", False)
            successResponse.status = 0
            successResponse.message = "ok"
            successResponse.ContentId = security_id
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("createconfigureobject:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: create configure object'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    def onDeleteObject(self,proto,spec,message,body):
        try:
            print '-------------begin Delete Configure Object---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Object Name: {0}'.format(body.ObjectName)
            print '---------------end Create Configure Object---------------'

            secId = self.configsql3.getObjectFromMapping(body.ObjectName)[0]

            def deleteContentSuccess():
                self.deleteObjectInMapping(message, proto,secId)
            def deleteContentFailed():
                print 'delete Content is Faild!!!'
            self.securityClient.deleteContent(self.session,secId)\
                .then(deleteContentSuccess).catch(deleteContentFailed)
        except Exception as e:
            (responseSpec, failedResponse) = self.create("deleteconfigureobject:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: delete configure object and {0}'.format(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def deleteObjectInMapping(self, message, proto, secId):
        IsDeleteObjectRelation = self.configsql3.deleteObjectInMapping(secId)
        if IsDeleteObjectRelation:
            (responseSpec, successResponse) = self.create("deleteconfigureobject:configureobjectproto", False)
            successResponse.status = 0
            successResponse.message = "ok"
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("deleteconfigureobject:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: delete configure object and {0}'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



    def onGetGrid(self,proto,spec,message,body):
        try:
            print '-------------begin Get Configure From Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Grid: {0}'.format(body.GridName)
            print '-------------end Get Configure From Grid-----------------'
            grid = self.configsql3.getGridFromMapping(body.GridName)
            if not grid:
                raise Exception("configure list in grid({0} is not exist!!!)".format(body.GridName))
            configureList = json.loads(grid[1])
            objectList = []
            for createTime,version in configureList:
                templ = self.configsql3.getConfigureFromMapping(createTime,version)
                if not templ:
                    raise Exception("Object list in Configure({0},{1})".format(createTime,version))
                objectList.append(json.loads(templ[0]))
            with open('tests/master-private.pem') as f:
                privateKey1 = f.read()

            (responseSpec, successResponse) = self.create("getconfigurefromgrid:configureobjectproto", False)
            (responseSpec, failedResponse) = self.create("getconfigurefromgrid:configureobjectproto", False)

            def getContentSuccess(JContent):
                Content = json.loads(JContent)
                ###############################series##################################33
                successResponse.Content[body.ObjectName] = Content["content"]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            def getContentFailed(errMsg):
                failedResponse.status = 1
                failedResponse.message = 'error: get configure from configure grid'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
            ###series getContent
            for row in objectList:
                for col in row:
                    self.securityClient.getContent(self.session,col,privateKey1).then(getContentSuccess).catch(getContentFailed)
        except Exception as e:
            print "Error: {0}".format(e)

    def onGetConfigure(self,proto,spec,message,body):
        try:
            print '-------------begin Query Configure Object---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Create Date: {0}'.format(body.Date)
            print 'Configure Version: {0}'.format(body.Version)
            print '---------------end Query Configure Object---------------'

            templ = self.configsql3.getConfigureFromMapping(body.Date, body.Version)
            if not templ:
                raise Exception("Object list in Configure({0},{1})".format(body.Date, body.Version))
            objectList = json.loads(templ[0])

            with open('tests/master-private.pem') as f:
                privateKey1 = f.read()

            (responseSpec, successResponse) = self.create("getconfigurefromgrid:configureobjectproto", False)
            (responseSpec, failedResponse) = self.create("getconfigurefromgrid:configureobjectproto", False)

            def getContentSuccess(JContent):
                Content = json.loads(JContent)
                #############################series###############################
                successResponse.Content[body.ObjectName] = Content["content"]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            def getContentFailed(errMsg):
                failedResponse.status = 1
                failedResponse.message = 'error: get configure from configure grid'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

            ###series getContent
            for elem in objectList:
                    self.securityClient.getContent(self.session,elem, privateKey1).then(getContentSuccess).catch(getContentFailed)
        except Exception as e:
            print "Error: {0}".format(e)


    def onGetObject(self, proto, spec, message, body):
        print '-------------begin Query Configure Object---------------'
        print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
        print 'Configure Object Id: {0}'.format(body.ObjectName)
        print '---------------end Query Configure Object---------------'

        try:
            secId = self.configsql3.getObjectFromMapping(body.ObjectName)
            if not secId:
                raise Exception("Error: get Object {0}".format(body.ObjectName))
            with open('tests/master-private.pem') as f:
                privateKey1 = f.read()

            def getContentSuccess(JContent):
                Content = json.loads(JContent)
                (responseSpec, successResponse) = self.create("getconfigureobject:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = "ok"
                successResponse.Content[body.ObjectName] = Content["content"]
                print 'status: {0}'.format(successResponse.status)
                print 'message: {0}'.format(successResponse.message)
                print 'Object Name: {0}'.format(body.ObjectName)
                print 'Template Name: {0}'.format(Content['templateName'])
                print successResponse.Content
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

            def getContentFailed(errMsg):
                print 'put content of object is failed!!!'
            self.securityClient.getContent(self.session,secId,privateKey1).then(getContentSuccess).catch(getContentFailed)
        except Exception as e:
            print "Error: {0}".format(e)
            (responseSpec, failedResponse) = self.create("getconfigureobject:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: get configure object'
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
















