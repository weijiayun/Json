#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding:utf-8
__author__ = 'jiayun.wei'

from MessageHandler import MessagePlugin
from ConfigObjectPostgres import ConfigureObjectSql
import psycopg2, logging
from configureService.security.SecurityClient import SecClient
from configureService.acl.ACLClient import ACLClient
import json
import random, string

class ConfigureObjectServer(MessagePlugin):

    conn = psycopg2.connect(database="config3", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    configsql3 = ConfigureObjectSql(conn)

    def __init__(self, messageHandle):
        super(ConfigureObjectServer, self).__init__(messageHandle)

        self.handle('createconfigure:configureobjectproto', True, self.onCreateConfigure)
        self.handle('deleteconfigure:configureobjectproto', True, self.onDeleteConfigure)
        self.handle('createcollection:configureobjectproto', True, self.onCreateCollection)
        self.handle('deletecollection:configureobjectproto', True, self.onDeleteCollection)
        self.handle('getconfigure:configureobjectproto', True, self.onGetConfigure)
        self.handle('getcollection:configureobjectproto', True, self.onGetCollection)
        self.handle('grantcollection:configureobjectproto', True, self.onGrantCollection)
        self.handle('revokecollection:configureobjectproto', True, self.onRevokeCollection)
        self.handle('granconfigure:configureobjectproto', True, self.onGrantConfigure)
        self.handle('revokeConfigure:configureobjectproto', True, self.onRevokeCollection)
        self.handle('listcollections:configureobjectproto', True, self.onListCollections)
        self.handle('listauthoritysharers:configureobjectproto', True, self.onListAuthoritySharers)

    def onConnectionOpened(self, proto):
        try:
            self.securityClient = SecClient(proto, self.mesgHandle, 609)
            print '----securityClient connected successfully'
            self.aclClient = ACLClient(proto, self.mesgHandle, 609)
            print '----ACLClient connected successfully'
        except Exception as e:
            print e

    #@staticmethod
    def checkPermission(resourceId, permission):
        def decorator(func):
            def wrapper(self, proto, spec, message, body):
                def successCheckPermission(hasP):
                    if hasP:
                        func(self, proto, spec, message, body)
                    else:
                        (responseSpec, failedResponse) = self.create(spec.messageName, False)
                        failedResponse.status = 1
                        failedResponse.message = '<User: {0}> has no permission to {1}'.format(
                            body.session.userId, func.__name__)
                        self.write_log('error', body.session.userId, failedResponse.message)
                        self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

                def FailedCheckPermission(hasP):
                    (responseSpec, failedResponse) = self.create(spec.messageName, False)
                    failedResponse.status = 1
                    failedResponse.message = hasP
                    self.write_log('error', body.session.userId, failedResponse.message)
                    self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

                self.aclClient.hasPermission(body.session, resourceId, permission)\
                    .then(successCheckPermission)\
                    .catch(FailedCheckPermission)
            return wrapper
        return decorator

    def write_log(self, log_type, userId, message, operation):
        logger = '\n用户ID：%s\n错误信息：%s\n%s\n执行操作：%s\n' % (userId, message, operation, '-' * 50)
        if log_type == 'error':
            logging.error(logger)

    def onCreateConfigure(self, proto, spec, message, body):
        try:
            print '-------------begin Delete Configure In Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure: {0}'.format(body.Configure)
            print 'Object: {0}'.format(body.CollectionList)

            secIdList = [self.configsql3.getCollection(elem.Name,
                                                       elem.Date,
                                                       elem.Version,
                                                       elem.TemplateName,
                                                       elem.CollectionName)[1] for elem in body.CollectionList]

            IsCreateConfigureInstance = self.configsql3.createConfigure(json.dumps(secIdList),
                                                                        body.Configure.Name,
                                                                        body.Configure.Version,
                                                                        body.Configure.Date)
            if IsCreateConfigureInstance[0]:
                (responseSpec, successResponse) = self.create("createconfigure:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = IsCreateConfigureInstance[1]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("createconfigure:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = IsCreateConfigureInstance[1]
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
            print '---------------end Delete Configure In Grid---------------'
        except Exception as e:
            print e

    def onDeleteConfigure(self, proto, spec, message, body):
        try:
            print '-------------begin Delete Configure In Grid---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure: {0}'.format(body.Configure)

            IsDeleteConfigureInstanceMapping = self.configsql3.deleteConfigure(body.Configure.Name,
                                                                               body.Configure.Date,
                                                                               body.Configure.Version)
            if IsDeleteConfigureInstanceMapping[0]:
                (responseSpec, successResponse) = self.create("deleteconfigure:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = IsDeleteConfigureInstanceMapping[1]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("deleteconfigure:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = IsDeleteConfigureInstanceMapping[1]
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
            print '---------------end Delete Configure In Grid---------------'
        except Exception as e:
            print e

    def onCreateCollection(self, proto, spec, message, body):
        try:
            print '-------------begin Create  Object---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            
            def getkey():
                passwd = string.join(
                    random.sample(list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+'), 16)) \
                    .replace(" ", "")
                return passwd
            secList = [["-".join([body.Collection.Name, body.Collection.Date, body.Collection.Version, body.Collection.Category, body.Collection.TemplateName]),
                        body.Collection.Content, getkey()]]

            def putContentSuccess(nameIdDict):
                self.registCollectionInT_Collection(message, proto, nameIdDict)

            def putContentFailed(errMesg):
                print 'putSeriesContent failed: %s' % errMesg
            self.securityClient.putSeriesContent(body.session, secList, body.publicKey)\
                .then(putContentSuccess)\
                .catch(putContentFailed)

            print '---------------end Create Configure Object---------------'
        except Exception as e:
            print 'error: {0}'.format(e)
            (responseSpec, failedResponse) = self.create("createcollection:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = e
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def registCollectionInT_Collection(self, message, proto, nameIdDict):
        try:
            IsCreateObject = self.configsql3.createCollection(nameIdDict)
            if IsCreateObject[0]:
                (responseSpec, successResponse) = self.create("createcollection:configureobjectproto", False)
                successResponse.status = 0
                successResponse.message = IsCreateObject[1]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse) = self.create("createcollection:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = IsCreateObject[1]
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("createcollection:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onDeleteCollection(self, proto, spec, message, body):
        try:
            print '-------------begin Delete Configure Object---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Configure Object Name: {0}'.format(body.Collections)
    
            secIdList = [self.configsql3.getCollection(elem.Name,
                                                       elem.Date,
                                                       elem.Version,
                                                       elem.Category,
                                                       elem.TemplateName)[1] for elem in body.Collections]
    
            def deleteContentSuccess(successMsg):
                self.deleteCollectionInT_Collection(message, proto, secIdList)
    
            def deleteContentFailed(errMsg):
                print errMsg+'delete Content is Faild!!!'
            self.securityClient.deleteContent(body.session, secIdList)\
                .then(deleteContentSuccess).catch(deleteContentFailed)
            print '---------------end Create Configure Object---------------'
        except Exception as e:
            (responseSpec, failedResponse) = self.create("deletecollection:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error: {0}'.format(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
    
    def deleteCollectionInT_Collection(self, message, proto, secIdList):
        IsDeleteObject = self.configsql3.deleteCollection(secIdList)
        if IsDeleteObject[0]:
            (responseSpec, successResponse) = self.create("deletecollection:configureobjectproto", False)
            successResponse.status = 0
            successResponse.message = IsDeleteObject[1]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("deleteconfigureobject:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = IsDeleteObject[1]
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    # @checkPermission(38, 'GETOBJECTS')
    def onGetCollection(self, proto, spec, message, body):
        print '-------------Begin To Get Object---------------'
        print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
        print 'Configure Object Id: {0}'.format(body.Collections)
        try:
            secIdList = [["-".join([elem.Name, elem.Date, elem.Version, elem.Category, elem.TemplateName]),
                          self.configsql3.getCollection(elem.Name, elem.Date, elem.Version, elem.Category, elem.TemplateName)[1]]
                         for elem in body.Collections]
            if len(secIdList) == 0:
                raise Exception("Error: getting Object {0} is failed".format(body.ObjectName))
            
            (responseSpec, successResponse) = self.create("getcollection:configureobjectproto", False)

            def getContentSuccess(Content):
                successResponse.status = 0
                successResponse.message = "get object successfully!!!"
                successResponse.Content = Content
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
                
            def getContentFailed(errMsg):
                print 'put content of object is failed!!!'

            self.securityClient.getSeriesContent(body.session, secIdList, body.privateKey)\
                .then(getContentSuccess)\
                .catch(getContentFailed)
            print '---------------end Query Get Collection---------------'
        except Exception as e:
            print "Error: {0}".format(e)
            (responseSpec, failedResponse) = self.create("getcollection:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'Error: get Collection, Detail: {0}'.format(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onGetConfigure(self, proto, spec, message, body):
        print '-------------Begin Get Object---------------'
        print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
        print 'Collection Name: {0}'.format(body.Configure)
        
        try:
            objectList = self.configsql3.getConfigure(body.Configure.Name,
                                                      body.Configure.Date,
                                                      body.Configure.Version)
            if not objectList[0]:
                raise Exception(objectList[1])

            secList = [["-".join(self.configsql3.getObjectById(elem)[1][1:]), elem]
                       for elem in json.loads(objectList[0])]

            if len(secList) == 0:
                raise Exception("Error: getting Configure "
                                "<Name: {0}, Date: {1}, Version: {2}> is failed".format(body.Configure.Name, body.Configure.Date, body.Configure.Version))

            (responseSpec, successResponse) = self.create("getconfigure:configureobjectproto", False)

            def getContentSuccess(Content):
                successResponse.status = 0
                successResponse.message = "get configure successfully!!!"
                successResponse.Content = Content
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

            def getContentFailed(errMsg):
                print 'put content of configure is failed!!!'

            self.securityClient.getSeriesContent(body.session, secList, body.privateKey) \
                .then(getContentSuccess) \
                .catch(getContentFailed)
            print '---------------end Query Configure---------------'
        except Exception as e:
            print "Error: {0}".format(e)
            (responseSpec, failedResponse) = self.create("getconfigure:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = 'Error: getting Configure is failed!!!\n,Detail: {0}'.format(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onGrantCollection(self, proto, spec, message, body):
        try:
            print '---------------Begin Grant Object To Others---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Object Name: {0}'.format(body.CollectionList)
            print 'Object OthersId: {0}'.format(body.OthersId)
            print '---------------end Query Configure Object---------------'

            secIdDict = {"-".join([elem.Name, elem.Date, elem.Version, elem.Category, elem.TemplateName]):
                             self.configsql3.getCollection(elem.Name, elem.Date,
                                                           elem.Version, elem.Category, 
                                                           elem.TemplateName)[1] for elem in body.CollectionList}

            if len(secIdDict) == 0:
                raise Exception("Objects <{0}> is not exist when query the database".format(body.Collection))

            (responseSpec, successResponse) = self.create("grantcollection:configureobjectproto", False)

            def grantOtherSuccess(Msg):
                successResponse.status = 0
                successResponse.message = "Grant object to other is successfully!!!"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

            (responseSpec, failedResponse) = self.create("grantcollection:configureobjectproto", False)

            def grantOtherFailed(errMsg):
                failedResponse.status = 1
                failedResponse.message = 'Error: grant objects to others is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
            self.securityClient.grantSeriesToOther(body.session,
                                                   secIdDict,
                                                   body.OthersId,
                                                   body.privateKey,
                                                   body.othersPublicKey).then(grantOtherSuccess).catch(grantOtherFailed)
        except Exception as e:
            (responseSpec, failedResponse) = self.create("grantcollection:configureobjectproto", False)
            print "Error: {0}".format(e)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onRevokeCollection(self, proto, spec, message, body):
        try:
            print '---------------Begin Ungrant Object To Others---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Object Name: {0}'.format(body.CollectionList)
            print 'Object OthersId: {0}'.format(body.OthersId)
            print '---------------end Ungrant Configure Object---------------'

            secIdDict = {"-".join([elem.Name, elem.Date, elem.Version, elem.Category, elem.TemplateName]):
                             self.configsql3.getCollection(elem.Name, elem.Date,
                                                           elem.Version, elem.Category, elem.TemplateName)[1] for elem in body.CollectionList}

            if len(secIdDict) == 0:
                raise Exception("Objects <{0}> is not exist when query the database".format(body.ObjectList))

            (responseSpec, successResponse) = self.create("revokecollection:configureobjectproto", False)

            def revokeSuccess(Msg):
                successResponse.status = 0
                successResponse.message = "Ungrant object to other is successfully!!!"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

            (responseSpec, failedResponse) = self.create("revokecollection:configureobjectproto", False)

            def revokeFailed(errMsg):
                failedResponse.status = 1
                failedResponse.message = 'Error: Ungrant objects to others is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

            self.securityClient.revokeGrant(body.session,
                                            secIdDict,
                                            body.OthersId,
                                            ).then(revokeSuccess).catch(revokeFailed)
        except Exception as e:
            (responseSpec, failedResponse) = self.create("revokecollection:configureobjectproto", False)
            print "Error: {0}".format(e)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onGrantConfigure(self, proto, spec, message, body):
        try:
            print '---------------Begin Grant Object To Others---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Object OthersId: {0}'.format(body.OthersId)
            print 'Configure: {0}'.format(body.ConfigureList)
            print '---------------end Query Configure Object---------------'

            def getUnionList(lli, rli):
                return list(set(lli).union(set(rli)))

            temp = [json.loads(self.configsql3.getConfigure(elem.Name,
                                                            elem.Date,
                                                            elem.Version)[0]) for elem in body.ConfigureList]

            secIdDict = {"-".join(self.configsql3.getObjectById(elem)[1][1:]): elem for elem in reduce(getUnionList, temp)}

            if len(secIdDict) == 0:
                raise Exception("The Configure <Name: {0}, Date: {1}, Version: {2}> "
                                "which is going to be granted is not exist!!!".format(body.Configure.Name,
                                                                                      body.Configure.Date,
                                                                                      body.Configure.Version))

            (responseSpec, successResponse) = self.create("grantconfigure:configureobjectproto", False)

            def grantOtherSuccess(Msg):
                successResponse.status = 0
                successResponse.message = "Grant configure to other is successfully!!!"
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

            (responseSpec, failedResponse) = self.create("granconfigure:configureobjectproto", False)

            def grantOtherFailed(Msg):
                failedResponse.status = 1
                failedResponse.message = 'Error: grant configure object to others is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

            self.securityClient.grantSeriesToOther(body.session,
                                                   secIdDict,
                                                   body.OthersId,
                                                   body.privateKey,
                                                   body.othersPublicKey).then(grantOtherSuccess).catch(grantOtherFailed)
        except Exception as e:
            (responseSpec, failedResponse) = self.create("granconfigure:configureobjectproto", False)
            print "Error: {0}".format(e)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onUnGrantConfigure(self, proto, spec, message, body):
        try:
            print '---------------Begin Revoke Grant Object To Others---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Object OthersId: {0}'.format(body.OthersId)
            print 'Configure: {0}'.format(body.ConfigureList)
            print '---------------end Query Configure Object---------------'

            def getUnionList(lli, rli):
                return list(set(lli).union(set(rli)))

            temp = [json.loads(self.configsql3.getConfigure(elem.Name,
                                                            elem.Date,
                                                            elem.Version)[0]) for elem in body.ConfigureList]

            secIdDict = {"-".join(self.configsql3.getObjectById(elem)[1][1:]): elem for elem in reduce(getUnionList, temp)}

            if len(secIdDict) == 0:
                raise Exception("The Configure <Name: {0}, Date: {1}, Version: {2}> "
                                "which is going to be ungranted is not exist!!!".format(body.Configure.Name,
                                                                                        body.Configure.Date,
                                                                                        body.Configure.Version))

            (responseSpec, successResponse) = self.create("revokeConfigure:configureobjectproto", False)

            def grantOtherSuccess(Msg):
                successResponse.status = 0
                successResponse.message = "Ungrant configure<{0}> to other is successfully!!!".format(body.ConfigureList)
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

            (responseSpec, failedResponse) = self.create("revokeConfigure:configureobjectproto", False)

            def grantOtherFailed(Msg):
                failedResponse.status = 1
                failedResponse.message = 'Error: Ungrant configure<{0}> object to others is failed!!!'.format(body.ConfigureList)
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

            self.securityClient.revokeGrant(body.session,
                                            secIdDict,
                                            body.OthersId,
                                            ).then(grantOtherSuccess).catch(grantOtherFailed)
        except Exception as e:
            (responseSpec, failedResponse) = self.create("revokeConfigure:configureobjectproto", False)
            print "Error: {0}".format(e)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onListCollections(self, proto, spec, message, body):
        try:
            print '---------------Begin List Object To Others---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)

            def listCollectionsSuccess(contentIdList):
                self.__getListCollection(proto, message, contentIdList)

            (responseSpec, failedResponse) = self.create("listcollections:configureobjectproto", False)

            def listCollectionsFailed(Msg):
                failedResponse.status = 1
                failedResponse.message = 'Error: listting object is failed!!!'
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

            self.securityClient.listContent(body.session).then(listCollectionsSuccess).catch(listCollectionsFailed)
            print '---------------end List Object---------------'

        except Exception as e:
            print "Error: {0}".format(e)
            (responseSpec, failedResponse) = self.create("listcollections:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def __getListCollection(self, proto, message, contentIdList):
        contentIdList = [e.contentId for e in contentIdList]
        categoryDict = self.configsql3.getAll(contentIdList)
        if categoryDict[0]:
            (responseSpec, successResponse) = self.create("listcollections:configureobjectproto", False)
            temp = {}
            for key, val in categoryDict[1].items():
                temp[key] = []
                for elem in val:
                    col = self.createGeneric("collection:ConfigureObjectProto")
                    col.Name = elem[0]
                    col.Date = elem[1]
                    col.Version = elem[2]
                    col.Category = elem[3]
                    col.TemplateName = elem[4]
                    temp[key].append(col)
            successResponse.collections = temp
            successResponse.status = 0
            successResponse.message = "list objects successfully!!!"
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("listcollections:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = categoryDict[1]
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def onListAuthoritySharers(self, proto, spec, message, body):
        try:
            print '---------------Begin List Authority Sharers---------------'
            print 'userId-seqId: {0}-{1}'.format(body.session.userId, body.session.seqId)
            print 'Object: <{0}>'.format(body.Collection)
            print '--------------- End List Authority Sharers---------------'

            isGetObject = self.configsql3.getCollection(body.Collection.Name,
                                                        body.Collection.Date,
                                                        body.Collection.Version,
                                                        body.Collection.Category,
                                                        body.Collection.TemplateName)[1]

            if isGetObject:
                secId = isGetObject[0]

                def getSharersSuccess(sharersDict):
                    (responseSpec, successResponse) = self.create("getauthoritysharers:configureobjectproto", False)
                    successResponse.SharerList = [elem for elem in sharersDict]
                    successResponse.status = 0
                    successResponse.message = "Get sharer list {} successfully!!!".format(str(successResponse.SharerList))
                    self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

                def getSharersFailed(Msg):
                    (responseSpec, failedResponse) = self.create("getauthoritysharers:configureobjectproto", False)
                    failedResponse.status = 1
                    failedResponse.message = "Error: Getting sharer list is failed!!!"
                    self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

                self.securityClient.checkSharer(body.session, secId).then(getSharersSuccess).catch(getSharersFailed)

            else:
                (responseSpec, failedResponse) = self.create("getauthoritysharers:configureobjectproto", False)
                failedResponse.status = 1
                failedResponse.message = "Error: Getting sharer list is failed!!!"
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

        except Exception as e:
            (responseSpec, failedResponse) = self.create("getauthoritysharers:configureobjectproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
