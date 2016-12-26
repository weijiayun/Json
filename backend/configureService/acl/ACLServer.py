#coding: utf-8
from MessageHandler import MessagePlugin
from mypostgresql import mysql
import psycopg2
import hashlib
from decorator import decorator
import os
import time
import logging
from RMS import Role, Resource,RoleManager
class ACLServer(MessagePlugin):

    def __init__(self, messageHandle):
        super(ACLServer, self).__init__(messageHandle)

        self.conn = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")
        self.aclsql = mysql(self.conn)
        self.roleManager = RoleManager(self.conn)

        global T
        T = {}

        logging.basicConfig(
            filename=os.path.join('log/', time.strftime('%Y-%m-%d-') + 'log.txt'),
            level=logging.ERROR,
            filemode='a',
            format='错误时间：%(asctime)s  %(message)s',
            datefmt='%a, %d %b %Y %H:%M:%S')

        self.handle('addresourcetype:aclproto', True, self.onAddResourceType)
        self.handle('deleteresourcetype:aclproto', True, self.onDeleteResourceType)
        self.handle('listresourcetype:aclproto', True, self.onListResourceType)

        self.handle('addresource:aclproto', True, self.onAddResource)
        self.handle('deleteresource:aclproto', True, self.onDeleteResource)
        self.handle('getresources:aclproto', True, self.onGetResources)

        self.handle('addresourcetogroup:aclproto', True, self.onAddResourceToGroup)
        self.handle('removeresourcefromgroup:aclproto', True, self.onRemoveResourceFromGroup)
        self.handle('getgroup:aclproto', True, self.onGetGroup)

        self.handle('haspermission:aclproto', True, self.onHasPermission)

        self.handle('addrole:aclproto', True, self.onAddRole)
        self.handle('deleterole:aclproto', True, self.onDeleteRole)
        self.handle('listroles:aclproto', True, self.onListRoles)

        self.handle('adduser:aclproto', True, self.onAddUser)
        self.handle('deleteuser:aclproto', True, self.onDeleteUser)
        self.handle('listuser:aclproto', True, self.onListUser)

        self.handle('setroletouser:aclproto', True, self.onSetRoleToUser)
        self.handle('granttorole:aclproto', True, self.onGrantToRole)
        self.handle('revokefromrole:aclproto', True, self.onRevokeFromRole)
        self.handle('grantresourcetorole:aclproto', True, self.onGrantResourceToRole)
        self.handle('revokeresourceFromrole:aclproto', True, self.onRevokeResourceFromRole)

        self.handle('login:aclproto', True, self.onLogin)
        self.handle('logout:aclproto', True, self.onLogout)
        self.handle('listlogin:aclproto', True, self.onListLogin)

        self.handle('changeroleofuser:aclproto', True, self.onChangeRoleOfUser)
        self.handle('changepassword:aclproto', True, self.onChangePassword)
        self.handle('changeusername:aclproto', True, self.onChangeUserName)
        self.handle('changemyinformation:aclproto', True, self.onChangeMyInformation)
        self.handle('changemypassword:aclproto', True, self.onChangeMyPassword)
        self.handle('changerolename:aclproto', True, self.onChangeRoleName)
        self.handle('changepublickey:aclproto', True, self.onChangePublicKey)
        self.handle('changeprivatekey:aclproto', True, self.onChangePrivateKey)
        self.handle('getpublickey:aclproto', True, self.onGetPublicKey)

        self.handle('myrole:aclproto', True, self.onMyRole)
        self.handle('myinformation:aclproto', True, self.onMyInformation)
        self.handle('otherinformation:aclproto', True, self.onOtherInformation)
        self.handle('alluserinformation:aclproto', True, self.onAllUserInformation)

    def write_log(self, log_type, userId, message):
        logger = '\n用户ID：%s\n错误信息：%s\n%s\n' % (userId, message, '-'*50)
        if log_type == 'error':
            logging.error(logger)

    @decorator
    def checkLogin(f, self, proto, spec, message, body):
        '''增加检查登录,防止其他人构造SESSION登录'''
        if self.isLogin(proto, spec, message, body):
            try:
                global T
                t = time.time()-T[body.session.userId]#设置100无操作掉线
                print t
                if t<600 :
                    T[body.session.userId] = time.time()
                    print time.ctime()
                    f(self, proto, spec, message, body)
                    print spec.messageName
                else:
                    self.aclsql.sessionTimeOut(body.session.userId)
                    T.pop(body.session.userId, 'already logout!')
                    (responseSpec, failedResponse) = self.create(spec.messageName, False)
                    failedResponse.status = 1
                    failedResponse.message = 'time out. please log in again.'
                    self.write_log('error', body.session.userId, failedResponse.message )
                    self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
            except:
                self.aclsql.sessionTimeOut(body.session.userId)
                (responseSpec, failedResponse) = self.create(spec.messageName, False)
                failedResponse.status = 1
                failedResponse.message = 'Not logged in'
                self.write_log('error', body.session.userId, failedResponse.message)
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create(spec.messageName, False)
            failedResponse.status = 1
            failedResponse.message = 'Not logged in'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    def isLogin(self, proto, spec, message, body):
        '''对session值进行检查，确定是否可以进行后续操作'''
        login = self.aclsql.checkLogin(body.session.userId, body.session.seqId)
        if login :
            return True
        else:
            return False

    # @decorator
    # def checkPermission(f, self, proto, spec, message, body):
    #     '''增加检查登录,防止其他人构造SESSION登录'''
    #     if self.permission(proto, spec, message, body):
    #         f(self, proto, spec, message, body)
    #         print 'call %s() ' % f.__name__
    #     else:
    #         (responseSpec, successResponse) = self.create(spec.messageName, False)
    #         successResponse.status = 1
    #         successResponse.message = 'No permission '
    #         self.write_log('error', body.session.userId, successResponse.message)
    #         self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            # print 'No permission'

    #@staticmethod
    def checkPermission(resourceId, permission):
        def decoratorPerm(func):
            def wrapper(self, proto, spec, message, body):
                roleId = self.aclsql.myRole(body.session.userId)
                if roleId:
                    if self.roleManager.allRoles[roleId[0]].hasPermission(resourceId,permission):
                        return func(self, proto, spec, message, body)
                    else:
                        (responseSpec, failedResponse) = self.create(spec.messageName, False)
                        failedResponse.status = 1
                        failedResponse.message = '<User: {0} Role:{1}> has no permission to {2}'\
                            .format(body.session.userId, str(roleId), func.__name__)
                        self.write_log('error', body.session.userId, failedResponse.message)
                        self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
                else:
                    (responseSpec, failedResponse) = self.create(spec.messageName, False)
                    failedResponse.status = 1
                    failedResponse.message = 'User: {0} has not been granted a role to use {1}'\
                        .format(body.session.userId, func.__name__)
                    self.write_log('error', body.session.userId, failedResponse.message)
                    self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
            return wrapper
        return decoratorPerm

    def md5(self, str):
        '''加密算法'''
        self.str = str
        m = hashlib.md5()
        m.update(self.str)
        return m.hexdigest()

    def onLogin(self, proto, spec, message, body):
        print '--------begin login   --------'
        print 'userName:%s' % body.userName
        print 'password:%s' % body.password
        print '--------end login ----------'

        seqId, userId = self.aclsql.login(body.userName, self.md5(body.password))

        global T
        t = time.time()
        T[userId] = t
        if seqId == 0:
            (responseSpec, failedResponse) = self.create("login:aclproto", False)
            failedResponse.status = 2
            failedResponse.message = 'No user or wrong  password '
            login = self.createGeneric("LoginSession:ACLProto")
            login.userId = 0
            login.seqId = 0
            failedResponse.session = login
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        elif seqId == -1:
            (responseSpec, failedResponse) = self.create("login:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'already logged '
            login = self.createGeneric("LoginSession:ACLProto")
            login.userId = 0
            login.seqId = 0
            failedResponse.session = login
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        else:
            (responseSpec, successResponse) = self.create("login:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            login = self.createGeneric("LoginSession:ACLProto")
            login.userId = userId
            login.seqId = seqId
            successResponse.session = login
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

   # @checkLogin
    @checkPermission(40, "AddResourceType")
    def onAddResourceType(self, proto, spec, message, body):
        try:
            print '------begin add resource type------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'name:%s' % body.name
            print 'description:%s' % body.description
            for permission in body.permissions:
                print 'permission: {0}'.format(permission)
            print '------end add resource type--------'

            resourceTypeId = self.aclsql.insertResourceType(body.name, body.description, body.permissions)
            isAddResourceType = self.roleManager.addResourceType(int(resourceTypeId[0]),
                                                                 body.name,
                                                                 body.description,
                                                                 body.permissions)
            if resourceTypeId and isAddResourceType:
                (responseSpec, successResponse) = self.create("addresourcetype:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.resourceTypeId = resourceTypeId[0]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("AddResourceType: userId:{0}, Resource<name:{1},description:{2},permission:{3}>".format(
                    body.session.userId, body.name, body.description, body.permissions
                ))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("addresourcetype:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    # @checkLogin
    def onDeleteResourceType(self, proto, spec, message, body):
        try:
            print '------begin delete resource type------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'name:%s' % body.resourceTypeId
            print 'force delete?: {0}'.format(body.force)
            print '------end delete resource type--------'
            if body.force:
                resourceTypeId = self.aclsql.deleteResourceType(body.resourceTypeId)
                if resourceTypeId:
                    self.roleManager.removeResourceType(body.resourceTypeId)
                    (responseSpec, successResponse) = self.create("deleteresourcetype:aclproto", False)
                    successResponse.status = 0
                    successResponse.message = 'ok'
                    self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
                else:
                    raise Exception("DeleteResourceType: ResourceType<name:{0}>".format(body.resourceTypeId))
            else:
                raise Exception("can not to delete this resource type, if you must to delete it, let parameter force=true")

        except Exception as e:
            (responseSpec, failedResponse) = self.create("deleteresourcetype:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    # @checkLogin
    def onListResourceType(self, proto, spec, message, body):
        try:
            print '------begin list resource type------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '------end list resource type--------'

            resourceTypes = self.roleManager.allResourceTypes
            if resourceTypes:
                temp = []
                for rtid, RT in resourceTypes.items():
                    resT = self.createGeneric("ResType:ACLProto")
                    resT.id = rtid
                    resT.name = RT.getName()
                    resT.description = RT.getDesc()
                    resT.permissions = map(lambda x: self.roleManager.permissionTable[x]["name"], RT.getPermissions())
                    temp.append(resT)
                (responseSpec, successResponse) = self.create("listresourcetype:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.resourceTypes = temp
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        except Exception as e:
            (responseSpec, failedResponse) = self.create("listresourcetype:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onAddResource(self, proto, spec, message, body):
        try:
            print '--------begin add resource --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'resourceTypeId:%s' % body.resourceTypeId
            print 'name:%s' % body.name
            print 'content_id : %s' % body.contentId
            print 'isGroup: %s'%body.isGroup
            print '--------end add resource ----------'

            resourceId = self.aclsql.insertResource(body.name,
                                                    body.resourceTypeId,
                                                    body.contentId,
                                                    body.isGroup)
            resourceTmp = Resource(int(resourceId[0]), body.name,
                                   self.roleManager.allResourceTypes[body.resourceTypeId],
                                   body.contentId, body.isGroup)

            isRegisteResource = self.roleManager.registResource(resourceTmp)

            r = self.aclsql.myRole(body.session.userId)

            isGrantsuccess = self.aclsql.grantResourceToRole(r[0],
                                                             self.roleManager.allResourceTypes[body.resourceTypeId].getPermissions(),
                                                             resourceId[0])

            role = self.roleManager.allRoles[r[0]]

            role.addResource((self.roleManager.allResources[resourceId[0]],
                              map(lambda x: self.roleManager.permIdToName(x),
                                  self.roleManager.allResourceTypes[body.resourceTypeId].getPermissions())))

            if resourceId and isRegisteResource and r and isGrantsuccess:
                (responseSpec, successResponse) = self.create("addresource:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.resourceId = resourceId[0]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("FUNCTION:addResource, "
                                "when userId:{0}, resource<name:{1}, resourceTypeID: {2}, contentId: {3}, isGroup: {4}>"
                                .format(body.session.userId, body.name,
                                        body.resourceTypeId, body.contentId, body.isGroup))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("addresource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onGetResources(self, proto, spec, message, body):
        try:
            print '--------begin get resources --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end get resource ----------'
            r = self.aclsql.myRole(body.session.userId)
            if r:
                role = self.roleManager.allRoles[r[0]]
                resources = list()
                for resId, resPerm in role.getAllResources().items():
                    resm = self.createGeneric("Res:ACLProto")
                    resm.id = resId
                    resm.name = resPerm[0].getName()
                    resm.resourceType = resPerm[0].getResourceType().getName()
                    resm.contentId = resPerm[0].getContentId()
                    resm.isGroup = resPerm[0].getIsGroup()
                    resources.append(resm)
                (responseSpec, successResponse) = self.create("getresources:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.resources = resources
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("FUNCTION: getAllResources when user: <userId:{0}>".format(body.session.userId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("getresources:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onAddResourceToGroup(self, proto, spec, message, body):
        try:
            print '--------begin add resource to group --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'groupId:{0}'.format(body.groupId)
            print 'resourceIds: {0}'.format(body.resourceIds)
            print '--------end add resource to group----------'
            if body.groupId in self.roleManager.allResources and self.roleManager.allResources[body.groupId].getIsGroup() == 1:
                r = self.aclsql.insertResourceToGroup(body.groupId, body.resourceIds)
            else:
                raise Exception("there is no group:id:{0}".format(body.groupId))
            if r:
                for resId in body.resourceIds:
                    if resId in self.roleManager.allResources:
                        self.roleManager.allResources[body.groupId].addMember(self.roleManager.allResources[resId])
                (responseSpec, successResponse) = self.create("addresourcetogroup:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("AddResourceToGroup:user: userId:{0}, groupId:{1}, resourceIds:{2}".format(
                    body.session.userId, body.groupId, body.resourceIds))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("addresourcetogroup:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onRemoveResourceFromGroup(self, proto, spec, message, body):
        try:
            print '--------begin remove resource from group--------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'groupId:{0}'.format(body.groupId)
            print 'resourceIds: {0}'.format(body.resourceIds)
            print '--------end remove resource from group----------'
            if body.groupId in self.roleManager.allResources and self.roleManager.allResources[body.groupId].getIsGroup() == 1:
                r = self.aclsql.removeResourceFromGroup(body.groupId, body.resourceIds)
            else:
                raise Exception("there is no group:id:{0}".format(body.groupId))
            if r:
                for resId in body.resourceIds:
                    if resId in self.roleManager.allResources:
                        self.roleManager.allResources[body.groupId].removeMember(self.roleManager.allResources[resId])
                (responseSpec, successResponse) = self.create("removeresourcefromgroup:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("RemoveResourceFromGroup:user: userId:{0}, groupId:{1}, resourceIds:{2}".format(
                    body.session.userId, body.groupId, body.resourceIds))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("removeresourcefromgroup:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onGetGroup(self, proto, spec, message, body):
        try:
            print '--------begin get group --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'groupId: {0}'.format(body.groupId)
            print '--------end get group ----------'
            if body.groupId in self.roleManager.allResources and self.roleManager.allResources[body.groupId].getIsGroup() == 1:
                resources = self.roleManager.allResources[body.groupId].getMembers()
                resourcesTmp = []
                for resId, res in resources.items():
                    resm = self.createGeneric("Res:ACLProto")
                    resm.id = resId
                    resm.name = res.getName()
                    resm.resourceTypeId = res.getResourceType().getId()
                    resm.contentId = res.getContentId()
                    resm.isGroup = res.getIsGroup()
                    resourcesTmp.append(resm)
                (responseSpec, successResponse) = self.create("getgroup:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.resources = resourcesTmp
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("FUNCTION: getGroup: userId:{0}, groupId:{1}".format(body.session.userId, body.groupId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("getgroup:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onHasPermission(self, proto, spec, message, body):
        try:
            print '--------begin has permission --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'resourceId: {0}'.format(body.resourceId)
            print 'validate permission: {0}'.format(body.permission)
            print '--------end haspermission ----------'
            r = self.aclsql.myRole(body.session.userId)
            if r:
                if r[0] in self.roleManager.allRoles:
                    role = self.roleManager.allRoles[r[0]]
                else:
                    raise Exception("role: id:{0} is not in the roleManager".format(r[0]))
                (responseSpec, successResponse) = self.create("haspermission:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                if body.resourceId not in self.roleManager.allResources:
                    raise Exception("resourceId:{0} not in the roleManager".format(body.resourceId))
                if role.hasPermission(body.resourceId, body.permission):
                    successResponse.hasPerm = 1
                else:
                    successResponse.hasPerm = 0
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception('hasPermission when error occurs <resourceId:{0}, permission:{1}>'
                                .format(body.resourceId, body.permission))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("haspermission:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onAddRole(self, proto, spec, message, body):
        try:
            print '--------begin add role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleName:%s' % body.roleName
            print '-------end add role  --------'

            roleId = self.aclsql.insertRole(body.roleName)
            roleTmp = Role(roleId, body.roleName)
            isRegisteRole = self.roleManager.registRole(roleTmp)

            if roleId and isRegisteRole:
                (responseSpec, successResponse) = self.create("addrole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.roleId = roleId[0]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("addRole: userId:{0}, roleName: {1}".format(body.session.userId, body.roleName))

        except Exception as e:
            (responseSpec, failedResponse) = self.create("addrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onAddUser(self, proto, spec, message, body):
        try:
            print '--------begin add user --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'userName:%s' % body.userName
            print 'password: %s ' % body.password
            print 'email: %s' % body.email
            print 'role id {0}'.format(body.roleId)
            print '--------end add user ----------'

            userId = self.aclsql.insertUser(body.userName, body.password, body.email, body.roleId)
            if userId:
                (responseSpec, successResponse) = self.create("adduser:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.userId = userId[0]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("addUser: userId: {0}, NewUserName: {1}".format(body.session.userId, body.userName))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("adduser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    def onSetRoleToUser(self, proto, spec, message, body):
        try:
            print '--------begin grant role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'userId:%s' % body.userId
            print 'roleId:%s' % body.roleId
            print '--------end grant user ----------'
            if body.roleId in self.roleManager.allRoles:
                r = self.aclsql.updateUserRole(body.userId, body.roleId)
            else:
                raise Exception("No Role: id:{0} has been registed".format(body.roleId))

            if r:
                (responseSpec, successResponse) = self.create("setroletouser:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("setRoleToUser when userId:{0}, roleId:{1}".format(body.userId, body.roleId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("setroletouser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    def onGrantToRole(self, proto, spec, message, body):
        try:
            print '--------begin grant role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleId:%s' % body.roleId
            print 'parent role id: {0}'.format(str(body.parentsRoleId))
            print '--------end grant user ----------'

            r = self.aclsql.grantRoleToRole(body.roleId, body.parentsRoleId)
            role = self.roleManager.allRoles[body.roleId]

            for pid in body.parentsRoleId:
                if pid not in self.roleManager.allRoles:
                    pRole = self.roleManager.allRoles[pid]
                    role.addParent(pRole)

            if r is True:
                (responseSpec, successResponse) = self.create("granttorole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("GrantToRole: roleId:{0}, parentRoleId:{1}".format(body.roleId, str(body.parentsRoleId)))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("granttorole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onRevokeFromRole(self, proto, spec, message, body):
        try:
            print '--------begin grant role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleId:%s' % body.roleId
            print 'parent role id: {0}'.format(str(body.parentsRoleId))
            print '--------end grant user ----------'

            r = self.aclsql.revokeRoleFromRole(body.roleId, body.parentsRoleId)
            role = self.roleManager.allRoles[body.roleId]
            for pid in body.parentsRoleId:
                if pid not in self.roleManager.allRoles:
                    pRole = self.roleManager.allRoles[pid]
                    role.removeParent(pRole)
            if r is True:
                (responseSpec, successResponse) = self.create("revokefromrole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("RevokeFromRole: roleId:{0}, parentsRoleId:{1}".format(body.roleId, str(body.parentsRoleId)))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("revokefromrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangeRoleOfUser(self, proto, spec, message, body):
        try:
            print '--------begin change role of user --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'userId:%s' % body.userId
            print 'roleId:%s' % body.roleId
            print '--------end change role of user ----------'

            r = self.aclsql.updateUserRole(body.userId, body.roleId)
            if r:
                (responseSpec, successResponse) = self.create("changeroleofuser:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("changeroleofuser: userId:{0}, roleId:{1}".format(body.userId, body.roleId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("changeroleofuser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangePassword(self, proto, spec, message, body):
        try:
            print '--------begin change password --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'password:%s' % body.password
            print '--------end change password ----------'
            r = self.aclsql.changePassword(body.session.userId, self.md5(body.password))

            if r:
                (responseSpec, successResponse) = self.create("changepassword:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ChangePassword: userId:{0}, password:{1}".format(body.session.userId, body.password))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("changepassword:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onLogout(self, proto, spec, message, body):
        try:
            print '--------begin logout  --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end logout----------'
            global T
            T.pop(body.session.userId,'already logout!')

            r = self.aclsql.logout(body.session.userId, body.session.seqId)

            if r:
                (responseSpec, successResponse) = self.create("logout:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("Logout: userId:{0}".format(body.session.userId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("logout:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onGrantResourceToRole(self, proto, spec, message, body):
        try:
            print '--------begin grant permission  --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleId:%s' % body.roleId
            print 'permissionId: {0}'.format(str(body.permissionIds))
            print 'resourceId:%s' % body.resourceId
            print '--------end grant permission----------'

            r = self.aclsql.grantResourceToRole(body.roleId, body.permissionIds, body.resourceId)
            role = self.roleManager.allRoles[body.roleId]
            role.addResource((self.roleManager.allResources[body.resourceId], body.permissionIds))

            if r:
                (responseSpec, successResponse) = self.create("grantresourcetorole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("GrantResourceToRole: roleId:{0}, permissions:{1}, resourceId:{2}".format(
                    body.roleId, str(body.permissionIds), body.resourceId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("grantresourcetorole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onRevokeResourceFromRole(self, proto, spec, message, body):
        try:
            print '--------begin grant permission  --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleId:%s' % body.roleId
            print 'resourceId:%s' % body.resourceId
            print '--------end grant permission----------'

            r = self.aclsql.revokeResourceFromRole(body.roleId, body.resourceId)
            if body.roleId not in self.roleManager.allRoles:
                role = self.roleManager.allRoles[body.roleId]
            else:
                raise Exception("no role: id:{0}".format(body.roleId))
            if body.resourceId not in self.roleManager.allResources:
                role.removeResource(self.roleManager.allResources[body.resourceId])
            else:
                raise Exception("no resource: id:{0}".format(body.resourceId))

            if r:
                (responseSpec, successResponse) = self.create("grantresourcetorole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("RevokeResourceFromRole: roleId:{0}, resourceId:{1}".format(body.roleId, body.resourceId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("grantresourcetorole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onListUser(self, proto, spec, message, body):
        try:
            print '--------begin list user --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'body userId: %s'%body.userId
            print '--------end list user----------'
            users = self.aclsql.listUser(body.userId)
            if users:
                (responseSpec, successResponse) = self.create("listuser:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                user = []
                for i in users:
                    r = self.createGeneric("User:ACLProto")
                    r.userId = i[0]
                    r.userName = i[1]
                    r.phoneNamber = i[2]
                    r.password = i[3]
                    r.privateKey = i[4]
                    r.publicKey = i[5]
                    r.email = i[6]
                    r.description = i[7]
                    r.avatar = i[8]
                    rid = self.aclsql.myRole(r.userId)
                    if rid:
                        r.roleName = rid[1]
                    else:
                        raise Exception("user id:{0} has no role".format(r.userId))
                    user.append(r)
                successResponse.users = user
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ListUser:UserId:{0}".format(body.session.userId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("listuser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangeUserName(self, proto, spec, message, body):
        try:
            print '--------begin change user nanme --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'userName : %s' % body.userName
            print '--------end change user name----------'
            r = self.aclsql.changeUserName(body.session.userId, body.userName)
            if r:
                (responseSpec, successResponse)= self.create("changeusername:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ChangeUserName: userId:{0}, userNewName:{1}".format(body.session.userId, body.userName))

        except Exception as e:
            (responseSpec, failedResponse) = self.create("changeusername:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangeRoleName(self, proto, spec, message, body):
        try:
            print '--------begin change role nanme --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleId : %s ' % body.roleId
            print 'roleName : %s' % body.roleName
            print '--------end change role name----------'
            r = self.aclsql.changeRoleName(body.roleId, body.roleName)
            if r:
                (responseSpec, successResponse) = self.create("changerolename:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ChangeRoleName: userId:{0}, roleId:{1}, roleNewName:{2}".format(body.session.userId,
                                                                                                 body.roleId,
                                                                                                 body.roleName))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("changerolename:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangePublicKey(self, proto, spec, message, body):
        try:
            print '--------begin change public key --------'
            print 'new publickey : %s ' % body.publicKey
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end change public key----------'
            r = self.aclsql.changePublicKey(body.session.userId, body.publicKey)

            if r:
                (responseSpec, successResponse)= self.create("changepublickey:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ChangePublicKey: userId:{0}".format(body.session.userId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("changepublickey:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangePrivateKey(self, proto, spec, message, body):
        try:
            print '--------begin change public key --------'
            print 'new privatekey : %s ' % body.privateKey
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end change private key----------'
            r = self.aclsql.changePrivateKey(body.session.userId, body.privateKey )

            if r:
                (responseSpec, successResponse)= self.create("changeprivatekey:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ChangePrivateKey: userId:{0}".format(body.session.userId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("changeprivatekey:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onGetPublicKey(self, proto, spec, message, body):
        try:
            print '--------begin get public key --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'userId: {0}'.format(body.userId)
            print '--------end get public key----------'

            publickey = self.aclsql.getPublicKey(body.userId)

            if publickey[0]:
                (responseSpec, successResponse) = self.create("getpublickey:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.publicKey = publickey[1]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("GetPublicKey: userId:{0}".format(body.session.userId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("getpublickey:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    def onDeleteResource(self, proto, spec, message, body):
        try:
            print '--------begin delete resource --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'resourceId : %s' % body.resourceId
            print '--------end change delete resource----------'
            r = False
            if body.resourceId in self.roleManager.allRoles:
                r = self.aclsql.deleteResource(body.resourceId)
            if r:
                for rid, role in self.roleManager.allRoles.items():
                    role.removeResource(self.roleManager.allResources[body.resourceId])
                del self.roleManager.allResources[body.resourceId]
                (responseSpec, successResponse)= self.create("deleteresource:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("DeleteResource: userId:{0}, resourceId:{1}".format(body.session.userId, body.resourceId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("deleteresource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onDeleteUser(self, proto, spec, message, body):
        try:
            print '--------begin delete user --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'userId : %s' % body.userId
            print '--------end change delete user----------'
            r = self.aclsql.deleteUser(body.userId)

            if r:
                (responseSpec, successResponse) = self.create("deleteuser:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("DeleteUser: userId:{0}".format(body.userId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("deleteuser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onDeleteRole(self, proto, spec, message, body):
        try:
            print '--------begin delete role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'roleId : %s' % body.roleId
            print '--------end change delete role----------'
            r = False
            if body.roleId in self.roleManager.allRoles:
                r = self.aclsql.deleteRole(body.roleId)
            if r:
                del self.roleManager.allRoles[body.roleId]
                (responseSpec, successResponse) = self.create("deleterole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("DeleteRole: roleId:{0}".format(body.roleId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("deleterole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onListRoles(self, proto, spec, message, body):
        try:
            print '--------begin list role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end list role----------'
            temp = []
            for rid, role in self.roleManager.allRoles.items():
                r = self.createGeneric("Role:ACLProto")
                r.id = rid
                r.name = role.getName()
                parents = role.getParents()
                r.parents = map(lambda x: parents[x].getName(), parents)
                r.resources = []
                for resid, resPerm in role.getResources().items():
                    res = self.createGeneric("Res:ACLProto")
                    res.id = resid
                    res.name = resPerm[0].getName()
                    res.resourceType = resPerm[0].getResourceType().getName()
                    res.contentId = resPerm[0].getContentId()
                    res.isGroup = resPerm[0].getIsGroup()
                    r.resources.append(res)
                temp.append(r)
            (responseSpec, successResponse) = self.create("listroles:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.roles = temp
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())

        except Exception as e:
            (responseSpec, failedResponse) = self.create("listroles:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onListLogin(self,proto, spec, message, body):
        try:
            print '--------begin list login --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end list login----------'
            logins = self.aclsql.listLogin()

            if logins:
                (responseSpec, successResponse) = self.create("listlogin:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                login=[]
                for i in logins:
                    r = self.createGeneric("Logged:ACLProto")
                    r.seqId = i[0]
                    r.userId = i[1]
                    login.append(r)
                successResponse.logins = login
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ListLogin: userId:{0}".format(body.session.userId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("listlogin:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onMyRole(self,proto, spec, message, body):
        try:
            print '--------begin my role --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print '--------end  my role----------'
            role = self.aclsql.myRole(body.session.userId)
            if role:
                (responseSpec, successResponse)= self.create("myrole:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.roleId = role[0]
                successResponse.roleName = role[1]
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("MyRole: userId:{0}".format(body.session.userId))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("myrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    # @checkLogin
    # @checkPermission
    def onMyInformation(self, proto, spec, message, body):
        try:
            print '--------begin my information --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            rName = []
            for i in body.reqName:
                rName.append(spec.fields['reqName'].valueSpec.value2Strings[i])
                print 'reqname: %s'% i
            print '--------end  my information----------'
            rValue = self.aclsql.myInformation(body.session.userId, rName)

            if rValue.has_key('id'):
                rValue['id'] = str(rValue['id'])

            if rValue:
                (responseSpec, successResponse) = self.create("myinformation:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.information = rValue
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("MyInformation: userId:{0}, requireName:{1}".format(body.session.userId, body.reqName))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("myinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangeMyInformation(self,proto, spec, message, body):
        try:
            print '--------begin change my information --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            rDic={}
            for k,v in body.reqDic.items():
                rDic[spec.fields['reqDic'].keySpec.value2Strings[k]] = v
                print 'reqname: %s %s'% (k,v)
            print '--------end  my information----------'

            r = self.aclsql.changeMyInformation(body.session.userId, rDic)

            if r:
                (responseSpec, successResponse) = self.create("changemyinformation:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("ChangeMyInformation: userId:{0}, info:{1}".format(body.session.userId, body.reqDic))
        except Exception as e:
            (responseSpec, failedResponse) = self.create("changemyinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onChangeMyPassword(self, proto, spec, message, body):
        try:
            print '--------begin change my password --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            print 'old password:%s' % body.oldPassword
            print 'new password:%s' % body.newPassword
            print '--------end change my password ----------'
            r = self.aclsql.changeMyPassword(body.session.userId, self.md5(body.oldPassword), self.md5(body.newPassword))

            if r == 0:
                (responseSpec, successResponse) = self.create("changemypassword:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            elif r == 1:
                raise Exception("wrong old password, place input again")

            else:
                r = 2
                raise Exception('user:{0} does not exist'.format(body.session.userId))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("changemypassword:aclproto", False)
            failedResponse.status = r
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onOtherInformation(self, proto, spec, message, body):
        try:
            print '--------begin other information --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            rName = []
            for i in body.reqName:
                rName.append(spec.fields['reqName'].valueSpec.value2Strings[i])
                print 'reqname: %s' % i
            print 'otheruserid : %s' % body.otherUserId
            print '--------end  other information----------'
            rValue = self.aclsql.myInformation(body.otherUserId, rName)

            if rValue.has_key('id'):
                rValue['id']= str(rValue['id'])

            if rValue:
                (responseSpec, successResponse) = self.create("otherinformation:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.information = rValue
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("OtherInformation: userId:{0}, requireName:{1}".format(body.session.userId, body.reqName))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("otherinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



    @checkLogin
    def onAllUserInformation(self, proto, spec, message, body):
        try:
            print '--------begin all user information --------'
            print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
            rName = []
            for i in body.reqName:
                rName.append(spec.fields['reqName'].valueSpec.value2Strings[i])
                print 'reqname: %s' % i
            print '--------end  all user information----------'
            rValue = self.aclsql.allUserInformation(rName)
            c = []
            for i in rValue:
                d = [str(j) for j in i]
                c.append(d)
            rValue = c
            if rValue:
                (responseSpec, successResponse) = self.create("alluserinformation:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                successResponse.information = rValue
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                raise Exception("AllUserInformation: userId:{0}, requireName:{1}".format(body.session.userId,body.reqName))
        except Exception as e:
            print e
            (responseSpec, failedResponse) = self.create("alluserinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = str(e)
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
