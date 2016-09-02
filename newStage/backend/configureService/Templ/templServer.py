#!/opt/Apps/local/Python/anaconda/bin/python
#coding: utf-8
import sys
sys.path.extend(["../thrift", "../acl", "../security", '../..'])
from MessageHandler import MessagePlugin
from MypostgreDb import mydb
import psycopg2
import os
import TemplToJson
import time
import logging
import json
from configureService.security.SecurityClient import SecClient
from configureService.acl.ACLClient import ACLClient
import random
import string
from twisted.internet import defer

class templServer(MessagePlugin):
    #
    conn = psycopg2.connect(database="MyDb", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    templdb = mydb(conn)

    def __init__(self, messageHandle):
        super(templServer, self).__init__(messageHandle)

        logging.basicConfig(filename = os.path.join(os.getcwd(), time.strftime('%Y-%m-%d-') + 'log.txt'),
        level = logging.ERROR, filemode = 'a', format = '错误时间：%(asctime)s  %(message)s',datefmt='%a, %d %b %Y %H:%M:%S')

        #按照下面的顺序将函数写入

        self.handle('upcontent:templ_json', True, self.onUpContent)
        self.handle('jsonrelation:templ_json', True, self.onJsonRelation)
        self.handle('basecheck:templ_json', True, self.onBaseCheck)
        self.handle('download:templ_json', True, self.onDownLoad)
        self.handle('getjsoncon:templ_json', True, self.onGetJsonCon)
        self.handle('grantauthority:templ_json', True, self.onGrantAuthority)
        self.handle('templmerge:templ_json', True, self.onTemplMerge)
        self.handle('createversion:templ_json', True, self.onCreateVersion)

    def onConnectionOpened(self, proto):
        print '----begin login-----'
        self.aclClient = ACLClient(proto, self.mesgHandle, 609)
        self.securityClient = SecClient(proto, self.mesgHandle, 609)
        self.session = self.aclClient.login('bb', '1232')
        if 0 == self.session.userId and 0 == self.session.seqId:
            print '----login failed-----'
        else:
            print '----login success----'

    def onConnectionClosed(self, proto, reason):
        print '----begin logout-----'
        if self.session is not None:
            self.aclClient.logout(self.session)
        print '---logout success---'

    def write_log(self,log_type, userId, message, operation):
        logger = '\n用户ID：%s\n错误信息：%s\n%s\n执行操作：%s\n' % (userId, message, operation,'-'*50)
        if log_type == 'error':
            logging.error(logger)

#上传模板成功后(不管是更新，还是新建)，该模板需要转换成json存储到t_jsonattr表中，还需要将该表的关系更新至t_baserelation中

    def Templ2Field(self,templcontent):#将模板转为json字段存储
        ################判断是否只有一个模板##################
        templcon = templcontent.split('};')
        c = None
        ob = []
        for ii in range(len(templcon)):
            templob = []
            templcon[ii] = templcon[ii].strip()
            templcon[ii] = templcon[ii].splitlines()
            for ii0 in range(len(templcon[ii])):#去除空行
                if templcon[ii][ii0] != '':
                    templob.append(templcon[ii][ii0])
            if templob != []:
                templob = TemplToJson.TemplObject(templob)
                if templob.islegal == None:
                    ob.append(templob)
                else:
                    c = templob.islegal
                    break
        if c == None:
            return ob
        else:
            return c
    # @checkLogin
    # @checkPermission
    def onUpContent(self, proto, spec, message, body):
        print '------Begin Upload Content------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'template name:%s' % body.name
        print 'version:%s' % body.version
        print 'contents:%s' % body.contents
        print '------End Upload Content--------'
        with open('tests/master-public.pem') as f:
            publicKey1 = f.read()
        checkcontent = self.Templ2Field(body.contents)
        (responseSpec, failedResponse) = self.create("upcontent:templ_json", False)
        if checkcontent != [] and checkcontent != None and isinstance(checkcontent,int) == False:
            # 获取密钥
            passcontent = []
            passorigin = []
            passwd = string.join(random.sample(list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+'), 16)).replace(" ","")
            passorigin.append('origin' + body.name + body.version)
            passorigin.append(body.contents)
            passorigin.append(passwd)
            passcontent.append(passorigin)
            for ii in range(len(checkcontent)):
                jsoncontent = []
                passwd = string.join(random.sample(list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+'), 16)).replace(" ","")
                jsoncontent.append('json' + checkcontent[ii].TemplName + body.version)
                m = json.dumps(checkcontent[ii], cls=TemplToJson.MyEncoder, indent=4)
                jsoncontent.append(json.loads(m))  # putcontent->初始内容
                jsoncontent.append(passwd)
                passcontent.append(jsoncontent)

            def putContentSuccess(originContentId):
                option = 'update'
                self.passcontent(message,proto,originContentId,checkcontent,publicKey1,body,option)

            def putContentFailed(errMesg):
                print 'putSeriesContent failed: %s' % errMesg
                pass
            try:
                self.securityClient.putSeriesContent(self.session, passcontent, publicKey1).then(putContentSuccess).catch(putContentFailed)
            except Exception as e:
                print 'error:%s' % e
        else:

            failedResponse.status = 0
            failedResponse.message = 'contents is not legal:%s' % checkcontent
            failedResponse.name = body.name
            failedResponse.isLegal = False
            failedResponse.version = body.version
            failedResponse.isVersionIn = False
            # self.send(message.getSourceId(), proto, responseSpec, failedResponse)
            print failedResponse

    def passcontent(self,message, proto,originContentId,checkcontent,publicKey1,body,option):
        security_cid = originContentId['origin' + body.name + body.version].contentId
        ######################################
        for iii in range(len(checkcontent)):
            # try:
            # 更新数据库
            security_jid = originContentId['json' + checkcontent[iii].TemplName + body.version].contentId
            checkv = templServer.templdb.CheckVersion(body.name, body.version)
            (responseSpec, successResponse) = self.create("upcontent:templ_json", False)
            (responseSpec, failedResponse) = self.create("upcontent:templ_json", False)
            if checkv != False and checkv != None and option == 'update':  # 该version在数据库内，执行update该version的函数
                # try:
                update = templServer.templdb.UpDateJsonAttr(checkcontent[iii].TemplName, body.version,
                                                            checkcontent[iii].BaseName, security_cid, security_jid,
                                                            'false',publicKey1, checkcontent[iii].TemplType)
                # except Exception as e:
                #     print e
                #     self.error()
                #     return 'error'
                if update == True:  # update成功
                    successResponse.status = 1
                    successResponse.message = 'update content successful'
                    successResponse.name = checkcontent[iii].TemplName
                    successResponse.isLegal = True
                    successResponse.version = body.version
                    successResponse.isVersionIn = True
                    print successResponse
                    upRela = templServer.templdb.UpdateRelation(checkcontent[iii].TemplName, body.version,checkcontent[iii].BaseName)
                    if upRela==True:
                        print 'base relation update success'
                    else:
                        print 'error:123456'
                    # self.send(message.getSourceId(),proto, responseSpec, successResponse)
                else:
                    failedResponse.status = 0
                    failedResponse.message = 'error: cannot update content'
                    failedResponse.name = checkcontent[iii].TemplName
                    failedResponse.isLegal = True
                    failedResponse.version = body.version
                    failedResponse.isVersionIn = False
                    print failedResponse
                    self.write_log('error', body.session.userId, failedResponse.message, '更新文件')
                    # self.send(message.getSourceId(),proto, responseSpec, failedResponse)
            elif checkv == None and option == 'create':  # 该version不在数据库内，执行创建该version的函数

                upversion = templServer.templdb.CreateJsonAttr(checkcontent[iii].TemplName, body.version,
                                                               checkcontent[iii].BaseName, security_cid, security_jid,
                                                               'false', publicKey1, checkcontent[iii].TemplType)
                if upversion == True:
                    successResponse.status = 2
                    successResponse.message = 'creat a new version of this name'
                    successResponse.name = checkcontent[iii].TemplName
                    successResponse.isLegal = True
                    successResponse.version = body.version
                    successResponse.isVersionIn = False
                    print successResponse
                    upRela = templServer.templdb.UpdateRelation(checkcontent[iii].TemplName, body.version,checkcontent[iii].BaseName)
                    if upRela==True:
                        print 'base relation update success'
                    else:
                        print 'error:123456'
                    # self.send(message.getSourceId(),proto, responseSpec, successResponse,0)
                else:
                    successResponse.status = 0
                    successResponse.message = 'error:cannot create a new version'
                    successResponse.name = checkcontent[iii].TemplName
                    successResponse.isLegal = True
                    successResponse.version = body.version
                    successResponse.isVersionIn = False
                    print successResponse
                    # self.send(message.getSourceId(),proto, responseSpec, successResponse)
            else:  # 否则返回错误信息
                failedResponse.status = 0
                failedResponse.message = 'cannot upload content'
                failedResponse.name = checkcontent[iii].TemplName
                failedResponse.isLegal = True
                failedResponse.version = body.version
                failedResponse.isVersionIn = False
                print failedResponse
                self.write_log('error', body.session.userId, failedResponse.message, '上传文件')
                # self.send(message.getSourceId(),proto, responseSpec, failedResponse)

    def onJsonRelation(self, proto, spec, message, body):#请求Json relationship
        cur = self.conn.cursor()
        print '------Begin ask Json relationship------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'JsonRelationName:%s' % body.JsonRelationName
        print 'version:%s' % body.version
        print '------End ask Json relationship--------'
        # try:
        RelCheck=templServer.templdb.CheckRelVersion(body.JsonRelationName, body.version)
        (responseSpec, successResponse) = self.create("jsonrelation:templ_json", False)
        (responseSpec, failedResponse) = self.create("jsonrelation:templ_json", False)
        # except Exception as e:
        #     print e
        #     self.error()
        #     return 'error'
        if RelCheck != False and RelCheck != None:
            JsonRelation = templServer.templdb.JsonRelation(body.JsonRelationName, body.version)
            if JsonRelation != False and JsonRelation != None:
                successResponse.status = 1
                successResponse.message = 'show json relationship successful'
                successResponse.JsonRelationName = body.JsonRelationName
                successResponse.version = body.version
                successResponse.JRelation = '%s' % JsonRelation
                print successResponse
                # self.send(message.getSourceId(),proto, responseSpec, successResponse)
            elif JsonRelation == None:
                successResponse.status = 2
                successResponse.message = ' json relationship is empty'
                successResponse.JsonRelationName = body.JsonRelationName
                successResponse.version = body.version
                successResponse.JRelation = 'None'
                print successResponse
                # self.send(message.getSourceId(),proto, responseSpec, successResponse)
            else:
                failedResponse.status = 0
                failedResponse.message = 'error:cannot show json relationship'
                print failedResponse
                self.write_log('error', body.session.userId, failedResponse.message, '返回Json relationship信息')
                # self.send(message.getSourceId(),proto, responseSpec, failedResponse)
        elif RelCheck == None:
            successResponse.status = 2
            successResponse.message = 'the jsonrelationship of this name&version does not exist'
            successResponse.JsonRelationName = body.JsonRelationName
            successResponse.version = body.version
            successResponse.JRelation = 'None'
            print successResponse
            # self.send(message.getSourceId(),proto, responseSpec, successResponse)
        else:
            failedResponse.status = 0
            failedResponse.message = 'error:something is wrong!'
            print failedResponse
            self.write_log('error', body.session.userId, failedResponse.message, '请求Json relationship')
            # self.send(message.getSourceId(),proto, responseSpec, failedResponse)


    def onBaseCheck(self, proto, spec, message, body):#基类查看
        cur = self.conn.cursor()
        print '------Begin Base Check------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'base name:%s' % body.BaseName
        print 'version:%s' % body.version
        print '------End Base Check--------'
        # try:
        base=templServer.templdb.CheckRelVersion(body.JsonRelationName, body.version)
        (responseSpec, successResponse) = self.create("basecheck:templ_json", False)
        (responseSpec, failedResponse) = self.create("basecheck:templ_json", False)
        # except Exception as e:
        #     print e
        #     self.error()
        #     return 'error'
        if base != False and base != None:
            baserel = templServer.templdb.BaseCheck(body.JsonRelationName, body.version)
            if baserel != False and baserel != None:
                successResponse.status = 1
                successResponse.BaseName = 'base check successful'
                successResponse.BaseName = body.BaseName
                successResponse.version = body.version
                successResponse.BRelation = '%s:%s'% (body.BaseName,baserel)
                print successResponse
                # self.send(message.getSourceId(),proto, responseSpec, successResponse)
            elif baserel == None:
                successResponse.status = 2
                successResponse.message = ' this base does not have base template'
                successResponse.BaseName = body.BaseName
                successResponse.version = body.version
                successResponse.BRelation = 'None'
                print successResponse
                # self.send(message.getSourceId(),proto, responseSpec, successResponse)
            else:
                successResponse.status = 0
                successResponse.message = 'error:cannot show json relationship'
                self.write_log('error', body.session.userId, successResponse.message, '返回Json relationship信息')
                print successResponse
                # self.send(message.getSourceId(),proto, responseSpec, successResponse)
        elif base == None:
            failedResponse.status = 2
            failedResponse.message = 'error:cannot find the base'
            failedResponse.BaseName = body.BaseName
            failedResponse.version = body.version
            failedResponse.BRelation = 'None'
            print failedResponse
            # self.send(message.getSourceId(),proto, responseSpec, successResponse)
        else:
            failedResponse.status = 0
            failedResponse.message = 'error:something is wrong!'
            print failedResponse
            self.write_log('error', body.session.userId, failedResponse, '基类查看')
            # self.send(message.getSourceId(),proto, responseSpec, failedResponse)


    def onDownLoad(self, proto, spec, message, body):#下载
        cur = self.conn.cursor()
        print '------Begin download------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'template name:%s' % body.TemplName
        print 'version:%s' % body.version
        print '------End download--------'
        with open('tests/master-private.pem') as f:
            privateKey1 = f.read()
        # try:
        download=templServer.templdb.CheckVersion(body.TemplName, body.version)
        (responseSpec, successResponse) = self.create("download:templ_json", False)
        (responseSpec, failedResponse) = self.create("download:templ_json", False)
        # except Exception as e:
        #     print e
        #     self.error()
        #     return 'error'
        if download != False and download != None:
            #添加下载模板函数，连接数据库
            downT=templServer.templdb.download(body.TemplName, body.version)
            if downT != None and downT != False:
                def GetTContentSuccess(TContent):
                    successResponse.status = 1
                    successResponse.message = 'template check successful'
                    successResponse.TemplName = body.TemplName
                    successResponse.version = body.version
                    tcontent = TContent.split('?')
                    successResponse.contents = 'contents:\n%s'% tcontent[0]
                    print 'status:%s'% successResponse.status
                    print 'message:%s'% successResponse.message
                    print 'TemplName:%s'% successResponse.TemplName
                    print 'version:%s'% successResponse.version
                    print successResponse.contents
                    for ii in range(1,len(tcontent)):
                        print tcontent[ii]

                def GetTContentFailed(errMesg):
                    print 'putSeriesContent failed: %s' % errMesg
                    pass
                try:
                    self.securityClient.getContent(self.session, int(downT[0]), privateKey1).then(GetTContentSuccess).catch(GetTContentFailed)
                except Exception as e:
                    print 'error:%s' % e
                # self.send(message.getSourceId(),proto, responseSpec, successResponse)
            ########################
            else: return False
        elif download == None:
            successResponse.status = 2
            successResponse.message = 'this template does not exist'
            successResponse.TemplName = body.TemplName
            successResponse.version = body.version
            successResponse.contents = None
            print successResponse
            # self.send(message.getSourceId(),proto, responseSpec, successResponse)
        else:
            failedResponse.status = 0
            failedResponse.message = 'error:cannot download the template'
            failedResponse.TemplName = body.TemplName
            failedResponse.version = body.version
            failedResponse.contents = None
            print failedResponse
            self.write_log('error', body.session.userId, failedResponse.message, '下载')
            # self.send(message.getSourceId(),proto, responseSpec, successResponse)


    def onGetJsonCon(self, proto, spec, message, body):#请求json内容
        cur = self.conn.cursor()
        print '------Begin ask json content------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'json name:%s' % body.JsonAttrName
        print 'version:%s' % body.version
        print '-------End ask json content-------'
        with open('tests/master-private.pem') as f:
            privateKey1 = f.read()
        # try:
        checkrel=templServer.templdb.CheckVersion(body.JsonAttrName, body.version)
        (responseSpec, successResponse) = self.create("typeattr:templ_json", False)
        # except Exception as e:
        #     print e
        #     self.error()
        #     return 'error'
        if checkrel != False and checkrel != None:
            #添加json属性字段查找函数，连接数据库
            gattr = templServer.templdb.GetAttr(body.JsonAttrName, body.version)
            if gattr != False and gattr != None:
                def GetContentSuccess(JsonContent):
                    successResponse.status = 1
                    successResponse.message = 'json check successful'
                    Jcontent = JsonContent.split('\n')
                    successResponse.JsonAttr = '%s:%s'% (body.JsonAttrName,Jcontent[0])
                    print 'status:%s'% successResponse.status
                    print 'message:%s'% successResponse.message
                    print 'JsonContent:%s'% successResponse.JsonAttr
                    for ii in range(1,len(Jcontent)):
                        print Jcontent[ii]

                def GetContentFailed(errMesg):
                    print 'putSeriesContent failed: %s' % errMesg
                    pass
                try:
                    self.securityClient.getContent(self.session, int(gattr[0]), privateKey1).then(GetContentSuccess).catch(GetContentFailed)
                except Exception as e:
                    print 'error:%s' % e
            # self.send(message.getSourceId(),proto, responseSpec, successResponse)
        else:
            (responseSpec, failedResponse) = self.create("typeattr:templ_json", False)
            failedResponse.status = 0
            failedResponse.message = 'error:cannot show json attribute'
            print failedResponse
            self.write_log('error', body.session.userId, failedResponse, '请求json内容')
            # self.send(message.getSourceId(),proto, responseSpec, successResponse)


    def onGrantAuthority(self, proto, spec, message, body):#授权
        print '------Begin Grant Authority------'
        print 'userId-seqId: %s-%s' % (body.check.userId, body.check.seqId)
        print 'userId:%s' % body.userId
        print '-------End Grant Authority-------'
        try:
            #调用接口，检查该userID是否在数据库中  #以下函数要改
            checkid=templServer.templdb.CheckRelVersion(body.name, body.version)
            (responseSpec, successResponse) = self.create("grantauthority:templ_json", False)
        except Exception as e:
            print e
            self.error()
            return 'error'
        if checkid != False:
            successResponse.status = 1
            successResponse.message = 'Grant Authority successful'
            #添加授权函数，连接数据库
            successResponse.JsonAttr = '%s:'% (body.JsonAttrName)
            self.send(message.getSourceId(),proto, responseSpec, successResponse)
        else:
            successResponse.status = 0
            successResponse.message = 'error:cannot Grant Authority'
            self.write_log('error', body.session.userId, successResponse.message, '授权')
            self.send(message.getSourceId(),proto, responseSpec, successResponse)

    #######模板合并未编完######
    def onTemplMerge(self, proto, spec, message, body):#请求模板合并
        print '------Begin ask merge template------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'json name:%s' % body.JsonAttrName
        print 'version:%s' % body.version
        print '-------End ask merge template-------'
        ###################未编完，思路有待考证，版本是否需要check ###
        try: #无需check版本
            checkrel=templServer.templdb.CheckRelVersion(body.name, body.version)
            (responseSpec, successResponse) = self.create("templmerge:templ_json", False)
        except Exception as e:
            print e
            self.error()
            return 'error'
        if checkrel != False:
            successResponse.status = 1
            successResponse.message = 'json check successful'
            #添加json属性字段查找函数，连接数据库
            successResponse.JsonAttr = '%s:'% (body.JsonAttrName)
            self.send(message.getSourceId(),proto, responseSpec, successResponse)
        else:
            successResponse.status = 0
            successResponse.message = 'error:cannot show json attribute'
            self.write_log('error', body.session.userId, successResponse.message, '请求json内容')
            self.send(message.getSourceId(),proto, responseSpec, successResponse)


    def onCreateVersion(self, proto, spec, message, body):
        print '------Begin Create Version------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'templname:%s' % body.name
        print 'version:%s' % body.version
        print 'contents:%s' % body.contents
        print '------End Create Version--------'
        # try:
        ##############未编完，需定义参数，并讨论情况###############
        with open('tests/master-public.pem') as f:
            publicKey1 = f.read()
        checkcontent = self.Templ2Field(body.contents)
        (responseSpec, failedResponse) = self.create("creatversion:templ_json", False)
        if checkcontent != [] and checkcontent != None and isinstance(checkcontent,int) == False:
            # 获取密钥
            passcontent = []
            passorigin = []
            passwd = string.join(random.sample(list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+'), 16)).replace(" ","")
            passorigin.append('origin' + body.name + body.version)
            passorigin.append(body.contents)
            passorigin.append(passwd)
            passcontent.append(passorigin)
            for ii in range(len(checkcontent)):
                jsoncontent = []
                passwd = string.join(random.sample(list('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+'), 16)).replace(" ","")
                jsoncontent.append('json' + checkcontent[ii].TemplName + body.version)
                jsoncontent.append(json.dumps(checkcontent[ii], cls=TemplToJson.MyEncoder, indent=4))  # putcontent->初始内容
                jsoncontent.append(passwd)
                passcontent.append(jsoncontent)

            def putContentSuccess(originContentId):
                option = 'create'
                self.passcontent(message,proto,originContentId,checkcontent,publicKey1,body,option)

            def putContentFailed(errMesg):
                print 'putSeriesContent failed: %s' % errMesg
                pass
            try:
                self.securityClient.putSeriesContent(self.session, passcontent, publicKey1).then(putContentSuccess).catch(putContentFailed)
            except Exception as e:
                print 'error:%s' % e
        else:

            failedResponse.status = 0
            failedResponse.message = 'contents is not legal:%s' % checkcontent
            failedResponse.name = body.name
            failedResponse.isLegal = False
            failedResponse.version = body.version
            failedResponse.isVersionIn = False
            # self.send(message.getSourceId(), proto, responseSpec, failedResponse)
            print failedResponse