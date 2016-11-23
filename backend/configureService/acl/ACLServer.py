#coding: utf-8
from MessageHandler import MessagePlugin
from mypostgresql import mysql
import psycopg2
import hashlib
from decorator import decorator
import os
import time
import logging

class ACLServer(MessagePlugin):

    conn = psycopg2.connect(database="acl2", user="postgres", password="powerup", host="127.0.0.1", port="5432")
    aclsql = mysql(conn)

    def __init__(self, messageHandle):
        super(ACLServer, self).__init__(messageHandle)

        global T
        T = {}

        logging.basicConfig(
            filename=os.path.join('log/', time.strftime('%Y-%m-%d-') + 'log.txt'),
            level=logging.ERROR,
            filemode='a',
            format='错误时间：%(asctime)s  %(message)s',
            datefmt='%a, %d %b %Y %H:%M:%S')

        #按照下面的顺序将函数写入t_permission中，如addRole:3 addUser:4

        self.handle('addresourcetype:aclproto', True, self.onAddResourceType)
        self.handle('addresource:aclproto', True, self.onAddResource)
        self.handle('addrole:aclproto', True, self.onAddRole)
        self.handle('adduser:aclproto', True, self.onAddUser)

        self.handle('setroletouser:aclproto', True, self.onSetRoleToUser)
        self.handle('clearroleofuser:aclproto', True, self.onClearRoleOfUser)
        self.handle('deleteuser:aclproto', True, self.onDeleteUser)
        self.handle('deleterole:aclproto', True, self.onDeleteRole)
        self.handle('grantroletorole:aclproto', True, self.onGrantToRole)
        self.handle('revokerolefromrole:aclproto', True, self.onRevokeFromRole)

        self.handle('myrole:aclproto', True, self.onMyRole)
        self.handle('listrole:aclproto', True, self.onListRole)
        self.handle('listuser:aclproto', True, self.onListUser)

        self.handle('login:aclproto', True, self.onLogin)
        self.handle('logout:aclproto', True, self.onLogout)
        self.handle('listlogin:aclproto', True, self.onListLogin)

        self.handle('listresource:aclproto', True, self.onListResource)
        self.handle('grantpermission:aclproto', True, self.onGrantPermission)
        self.handle('listpermission:aclproto', True, self.onListPermission)

        self.handle('changepassword:aclproto', True, self.onChangePassword)
        self.handle('changeusername:aclproto', True, self.onChangeUserName)
        self.handle('changerolename:aclproto', True, self.onChangeRoleName)
        self.handle('changepublickey:aclproto', True, self.onChangePublicKey)
        self.handle('changeprivatekey:aclproto', True, self.onChangePrivateKey)
        self.handle('getpublickey:aclproto', True, self.onGetPublicKey)
        self.handle('deleteresource:aclproto', True, self.onDeleteResource)

        self.handle('listotherresource:aclproto', True, self.onListOtherResource)
        self.handle('listotherpermission:aclproto', True, self.onListOtherPermission)

        self.handle('listresourcetype:aclproto', True, self.onListResourceType)
        self.handle('haspermission:aclproto', True, self.onHasPermission)
        self.handle('listtyperesource:aclproto', True, self.onListTypeResource)

        self.handle('myinformation:aclproto', True, self.onMyInformation)
        self.handle('changemyinformation:aclproto', True, self.onChangeMyInformation)
        self.handle('changemypassword:aclproto', True, self.onChangeMyPassword)
        self.handle('otherinformation:aclproto', True, self.onOtherInformation)
        self.handle('alluserinformation:aclproto', True, self.onAllUserInformation)
        self.handle('allresourceinformation:aclproto', True, self.onAllResourceInformation)

    def write_log(self,log_type, userId, message):
        logger = '\n用户ID：%s\n错误信息：%s\n%s\n' % (userId, message, '-'*50)
        if log_type == 'error':
            logging.error(logger)

    @decorator
    def checkLogin(f, self, proto, spec, message, body):
        #增加检查登录,防止其他人构造SESSION登录
        if self.isLogin( proto, spec, message, body):
            try:
                #设置100无操作掉线
                global T
                t = time.time()-T[body.session.userId]
                print t
                if t<600 :
                    T[body.session.userId] = time.time()
                    print time.ctime()
                    f( self, proto, spec, message, body)
                    print spec.messageName
                else:
                    ACLServer.aclsql.sessionTimeOut(body.session.userId)
                    T.pop(body.session.userId, 'already logout!')
                    (responseSpec, failedResponse) = self.create(spec.messageName, False)
                    failedResponse.status = 1
                    failedResponse.message = 'time out. please log in again.'
                    self.write_log('error', body.session.userId, failedResponse.message )
                    self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

            except:
                ACLServer.aclsql.sessionTimeOut(body.session.userId)
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
            # print 'Not logged in'

    # 对session值进行检查，确定是否可以进行后续操作
    def isLogin(self, proto, spec, message, body):
        login = ACLServer.aclsql.checkLogin(body.session.userId, body.session.seqId)
        if login :
            return True
        else:
            return False

    @decorator
    def checkPermission(f, self, proto, spec, message, body):
        #增加检查登录,防止其他人构造SESSION登录
        if self.permission( proto, spec, message, body):
            f( self, proto, spec, message, body)
            print 'call %s() ' % f.__name__
        else:
            (responseSpec, successResponse) = self.create(spec.messageName, False)
            successResponse.status = 1
            successResponse.message = 'No permission '
            self.write_log('error', body.session.userId, successResponse.message)
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            # print 'No permission'
    #检查是否有权限使用这一函数
    def permission(self, proto, spec, message, body):
        p =  ACLServer.aclsql.checkPermission(body.session.userId, spec.name)
        if p :
            return True
        else:
            return False
    #加密算法
    def md5(self,str):
        self.str = str
        m = hashlib.md5()
        m.update(self.str)
        return m.hexdigest()

    def onLogin(self, proto, spec, message, body):
        print '--------begin login   --------'
        print 'userName:%s' % body.userName
        print 'password:%s' % body.password
        print '--------end login ----------'

        seqId, userId = ACLServer.aclsql.login(body.userName, self.md5(body.password))

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

    @checkLogin
    @checkPermission
    def onAddResourceType(self, proto, spec, message, body):
        print '------begin add resource type------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'name:%s' % body.name
        print 'description:%s' %body.description
        for permission in body.permissions:
            print 'permission:%s-%s' % (permission.name, permission.description)
        print '------end add resource type--------'

        resourceTypeId = ACLServer.aclsql.insertResourceType(body.name, body.description) #返回列表
        if resourceTypeId != False:
            (responseSpec, successResponse) = self.create("addresourcetype:aclproto", False)
            for permission in body.permissions:
                ACLServer.aclsql.insertPermission(permission.name, permission.description,resourceTypeId)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.resourceTypeId = resourceTypeId[0]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("addresourcetype:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onAddResource(self, proto, spec, message, body):
        print '--------begin add resource --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'resourceTypeId:%s' % body.resourceTypeId
        print 'name:%s' % body.name
        print 'description : %s' % body.description
        print '--------end add resource ----------'

        resourceId=ACLServer.aclsql.insertResource(body.session.userId,body.resourceTypeId, body.name, body.description)
        
        # resourceId 返回可能是id 也可能是 exception
        if resourceId != False:
            (responseSpec, successResponse) = self.create("addresource:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.resourceId = resourceId[0]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("addresource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onAddRole(self, proto, spec, message, body):
        
        print '--------begin add role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'roleName:%s' % body.roleName
        for resourcePermission in body.resourcePermissions:
            print 'resourceId:%s' % resourcePermission.resourceId
            for PId in resourcePermission.permissionIds:
                 print 'permissionId%s' % (PId.permissionId)
        print '-------end add role  --------'


        roleId = ACLServer.aclsql.insertRole(body.roleName)
        if roleId != False:
            (responseSpec, successResponse) = self.create("addrole:aclproto", False)
            for resourcePermission in body.resourcePermissions:
                for PId in resourcePermission.permissionIds:
                    ACLServer.aclsql.insertRPR(roleId, PId.permissionId, resourcePermission.resourceId)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.roleId = roleId[0]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("addrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onAddUser(self, proto, spec, message, body):
        print '--------begin add user --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userName:%s' % body.userName
        print 'phoneNumber:%s' % body.phoneNumber
        print 'privateKey : %s' % body.privateKey
        print 'publicKey : %s' % body.publicKey
        print 'password: %s '% body.password
        print '--------end add user ----------'

        userId=ACLServer.aclsql.insertUser(body.userName, body.phoneNumber, self.md5(body.password), body.privateKey, body.publicKey)
        
        if userId != False:
            (responseSpec, successResponse) = self.create("adduser:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.userId = userId[0]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("adduser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onSetRoleToUser(self, proto, spec, message, body):
        print '--------begin grant role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userId:%s' % body.userId
        print 'roleId:%s' % body.roleId
        print '--------end grant user ----------'

        r = ACLServer.aclsql.setRoleToUser(body.userId, body.roleId)

        if r != False:
            (responseSpec, successResponse) = self.create("setroletouser:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("setroletouser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onClearRoleOfUser(self, proto, spec, message, body):
        print '--------begin grant role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userId:%s' % body.userId
        print 'roleId:%s' % body.roleId
        print '--------end grant user ----------'

        r = ACLServer.aclsql.clearRoleOfUser(body.userId, body.roleId)

        if r != False:
            (responseSpec, successResponse) = self.create("clearroleofuser:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("clearroleofuser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onGrantToRole(self, proto, spec, message, body):
        print '--------begin grant role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userId:%s' % body.userId
        print 'roleId:%s' % body.roleId
        print 'parent role id: {0}'.format(str(body.parentsRoleId))
        print '--------end grant user ----------'

        r = ACLServer.aclsql.grantRoleToRole(body.roleId, body.parentsRoleId)

        if r != False:
            (responseSpec, successResponse) = self.create("granttorole:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("granttorole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onRevokeFromRole(self, proto, spec, message, body):
        print '--------begin grant role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userId:%s' % body.userId
        print 'roleId:%s' % body.roleId
        print 'parent role id: {0}'.format(str(body.parentsRoleId))
        print '--------end grant user ----------'

        r = ACLServer.aclsql.revokeRoleFromRole(body.roleId, body.parentsRoleId)

        if r != False:
            (responseSpec, successResponse) = self.create("revokefromrole:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("revokefromrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error:repeat adding'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onChangePassword(self, proto, spec, message, body):
        print '--------begin change password --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        #print 'userId:%s' % body.userId
        print 'password:%s' % body.password
        print '--------end change password ----------'
        r = ACLServer.aclsql.changePassword(body.session.userId, self.md5(body.password) )
       
        if r != False:
            (responseSpec, successResponse) = self.create("changepassword:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("changepassword:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'user does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



    @checkLogin
    @checkPermission
    def onLogout(self, proto, spec, message, body):
        print '--------begin logout  --------'
        # for s in body.session:
        #     print 'userId-seqId: %s-%s' % (s.userId, s.seqId)
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end logout----------'

        global T
        T.pop(body.session.userId,'already logout!')

        r = ACLServer.aclsql.logout(body.session.userId, body.session.seqId)
        
        if r == True:
            (responseSpec, successResponse) = self.create("logout:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("logout:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onListResource(self, proto, spec, message, body):
        print '--------begin list resource  --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list resource----------'
        resource = ACLServer.aclsql.listResource(body.session.userId)
        if reduce != False:
            (responseSpec, successResponse) = self.create("listresource:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            resources=[]
            for i in resource:
                resource1 = self.createGeneric("Resource:ACLProto")
                resource1.resourceId = i[0]
                resource1.resourceName = i[1]
                resources.append(resource1)
            successResponse.resources = resources
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("listresource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onListOtherResource(self, proto, spec, message, body):
        print '--------begin list Other resource  --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'roleId:%s' % body.roleId
        print '--------end listOther  resource----------'
        resource = ACLServer.aclsql.listOtherResource(body.roleId)
        
        if resource != False:
            (responseSpec, successResponse) = self.create("listotherresource:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            resources=[]
            for i in resource:
                resource1 = self.createGeneric("Resource:ACLProto")
                resource1.resourceId = i[0]
                resource1.resourceName = i[1]
                resources.append(resource1)
            successResponse.resources = resources
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("listotherresource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)

            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onGrantPermission(self, proto, spec, message, body):
        print '--------begin grant permission  --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'roleId:%s' % body.roleId
        print 'permissionId:%s' % body.permissionId
        print 'resourceId:%s' % body.resourceId
        print '--------end grant permission----------'

        r = ACLServer.aclsql.grantPermission(body.roleId, body.permissionId, body.resourceId)
        
        if r != False:
            (responseSpec, successResponse) = self.create("grantpermission:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("grantpermission:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'already has this permission'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onListRole(self, proto, spec, message, body):
        print '--------begin list role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list role----------'
        roles = ACLServer.aclsql.listRole()
        
        if roles != False:
            (responseSpec, successResponse) = self.create("listrole:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            role = []
            for i in roles:
                r = self.createGeneric("Role:ACLProto")
                r.roleId = i[0]
                r.roleName = i[1]
                role.append(r)
            successResponse.roles = role
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("listrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onListUser(self, proto, spec, message, body):
        print '--------begin list user --------'
        # print 'roleId : %s ' % body.roleId
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list user----------'

        users=ACLServer.aclsql.listUser()
        
        if users != False:
            (responseSpec, successResponse)= self.create("listuser:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            user=[]
            for i in users:
                r = self.createGeneric("User:ACLProto")
                r.userId = i[0]
                r.userName = i[1]
                user.append(r)
            successResponse.users = user
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("listuser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onListPermission(self, proto, spec, message, body):
        print '--------begin list permission --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list permission----------'
        pemissions = ACLServer.aclsql.listPermission(body.session.userId)
        
        if pemissions != False:
            (responseSpec, successResponse)= self.create("listpermission:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            permission=[]
            for i in pemissions:
                r = self.createGeneric("P:ACLProto")
                r.permissionId = i[0]
                r.name= i[1]
                permission.append(r)
            successResponse.permissions = permission
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("listpermission:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onListOtherPermission(self, proto, spec, message, body):
        print '--------begin list Other permission --------'
        print 'roleId : %s ' % body.roleId
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list Other permission----------'
        pemissions = ACLServer.aclsql.listOtherPermission(body.roleId)
        
        if pemissions != False:
            (responseSpec, successResponse)= self.create("listotherpermission:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            permission=[]
            for i in pemissions:
                r = self.createGeneric("P:ACLProto")
                r.permissionId = i[0]
                r.name= i[1]
                permission.append(r)
            successResponse.permissions = permission
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("listotherpermission:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onChangeUserName(self, proto, spec, message, body):
        print '--------begin change user nanme --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        #print 'userId : %s ' % body.userId
        print 'userName : %s' % body.userName
        print '--------end change user name----------'
        r = ACLServer.aclsql.changeUserName(body.session.userId, body.userName)
        
        if r ==  True:
            (responseSpec, successResponse)= self.create("changeusername:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("changeusername:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'user does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onChangeRoleName(self, proto, spec, message, body):
        print '--------begin change role nanme --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'roleId : %s ' % body.roleId
        print 'roleName : %s' % body.roleName
        print '--------end change role name----------'
        r = ACLServer.aclsql.changeRoleName(body.roleId, body.roleName)
        
        if  r==True:
            (responseSpec, successResponse)= self.create("changerolename:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("changerolename:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'role does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onChangePublicKey(self, proto, spec, message, body):
        print '--------begin change public key --------'
        print 'new publickey : %s ' % body.publicKey
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end change public key----------'
        r = ACLServer.aclsql.changePublicKey(body.session.userId,body.publicKey )
        
        if r == True:
            (responseSpec, successResponse)= self.create("changepublickey:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("changepublickey:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'user does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onChangePrivateKey(self, proto, spec, message, body):
        print '--------begin change public key --------'
        print 'new privatekey : %s ' % body.privateKey
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end change private key----------'
        r = ACLServer.aclsql.changePrivateKey(body.session.userId, body.privateKey )
        
        if r == True:
            (responseSpec, successResponse)= self.create("changeprivatekey:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("changeprivatekey:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'user does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    def onGetPublicKey(self, proto, spec, message, body):
        print '--------begin get public key --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userId: {0}'.format(body.userId)
        print '--------end get public key----------'

        publickey = ACLServer.aclsql.getPublicKey(body.userId)
        if publickey[0]:
            (responseSpec, successResponse) = self.create("getpublickey:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.publicKey = publickey[1]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("getpublickey:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = publickey[1]
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onDeleteResource(self, proto, spec, message, body):
        print '--------begin delete resource --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'resourceId : %s' % body.resourceId
        print '--------end change delete resource----------'

        ###  重要东西  不能删系统
        if body.resourceId == 5 :
            (responseSpec, failedResponse)= self.create("deleteresource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = '删系统！！！'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        else:
            r = ACLServer.aclsql.deleteResource(body.resourceId)

            if r == True:
                (responseSpec, successResponse)= self.create("deleteresource:aclproto", False)
                successResponse.status = 0
                successResponse.message = 'ok'
                self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
            else:
                (responseSpec, failedResponse)= self.create("deleteresource:aclproto", False)
                failedResponse.status = 1
                failedResponse.message = 'resource does not exist'
                self.write_log('error', body.session.userId, failedResponse.message)
                self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onDeleteUser(self, proto, spec, message, body):
        print '--------begin delete user --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'userId : %s' % body.userId
        print '--------end change delete user----------'
        r = ACLServer.aclsql.deleteUser(body.userId)
        
        if r == True:
            (responseSpec, successResponse)= self.create("deleteuser:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("deleteuser:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'user does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onDeleteRole(self, proto, spec, message, body):
        print '--------begin delete role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'roleId : %s' % body.roleId
        print '--------end change delete role----------'
        r = ACLServer.aclsql.deleteRole(body.roleId)
        
        if r == True:
            (responseSpec, successResponse) = self.create("deleterole:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("deleterole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'role does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onListLogin(self,proto, spec, message, body):
        print '--------begin list login --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list login----------'
        logins = ACLServer.aclsql.listLogin()
        
        if logins != False:
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
            (responseSpec, failedResponse)= self.create("listlogin:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onMyRole(self,proto, spec, message, body):
        print '--------begin my role --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end  my role----------'
        role = ACLServer.aclsql.myRole(body.session.userId)
    
        if role != False:
            (responseSpec, successResponse)= self.create("myrole:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.roleId = role[0]
            successResponse.roleName = role[1]
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("myrole:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onListResourceType(self,proto, spec, message, body):
        print '--------begin list resource type --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end list resource type----------'
        r =ACLServer.aclsql.listResourceType()
        
        if r != False:
            (responseSpec, successResponse)= self.create("listresourcetype:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            resourcetypes =[]
            for i in r :
                resourcetype = self.createGeneric("ResourceType:ACLProto")
                resourcetype.id = i[0]
                resourcetype.name = i[1]
                resourcetypes.append(resourcetype)
            successResponse.resourceTypes = resourcetypes
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("listresourcetype:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    @checkLogin
    @checkPermission
    def onHasPermission(self, proto, spec, message, body):
        print '--------begin has permission  --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print 'roleId:%s' % body.roleId
        print 'permissionId:%s' % body.permissionId
        print 'resourceId:%s' % body.resourceId
        print '--------end has permission----------'

        r = ACLServer.aclsql.hasPermission(body.roleId, body.permissionId, body.resourceId )
        
        if r != False:
            (responseSpec, successResponse) = self.create("haspermission:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.result = True
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, successResponse) = self.create("haspermission:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.result = False
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())


    @checkLogin
    @checkPermission
    def onListTypeResource(self, proto, spec, message, body):
        print '--------begin list type resource  --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        #print 'roleId:%s' % body.roleId
        print 'resourceTypeId:%s' % body.resourceTypeId
        print '--------end list type resource----------'
        resource = ACLServer.aclsql.listTypeResource( body.session.userId,body.resourceTypeId )
        
        if reduce != False:
            (responseSpec, successResponse) = self.create("listtyperesource:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            resources=[]
            for i in resource:
                resource1 = self.createGeneric("Resource:ACLProto")
                resource1.resourceId = i[0]
                resource1.resourceName = i[1]
                resources.append(resource1)
            successResponse.resources = resources
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("listtyperesource:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())

    # @checkLogin
    # @checkPermission
    def onMyInformation(self, proto, spec, message, body):
        print '--------begin my information --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        rName = []
        for i in body.reqName:
            rName.append(spec.fields['reqName'].valueSpec.value2Strings[i])
            print 'reqname: %s'% i
        print '--------end  my information----------'
        rValue = ACLServer.aclsql.myInformation(body.session.userId, rName)

        if rValue.has_key('id'):
            rValue['id'] = str(rValue['id'])

        if rValue:
            (responseSpec, successResponse) = self.create("myinformation:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            # for key, value in rValue.items():
            #     successResponse.information[key] = value
            # for i in rName:
            successResponse.information = rValue
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("myinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    # @checkLogin
    # @checkPermission
    def onChangeMyInformation(self,proto, spec, message, body):
        print '--------begin change my information --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        rDic={}
        for k,v in body.reqDic.items():
            rDic[spec.fields['reqDic'].keySpec.value2Strings[k]]=v
            print 'reqname: %s %s'% (k,v)
        print '--------end  my information----------'

        # if rDic.has_key('avatar'):
        #     rDic['avatar']=psycopg2.Binary(rDic['avatar'])

        r = ACLServer.aclsql.changeMyInformation(body.session.userId, rDic)

        if r != False:
            (responseSpec, successResponse)= self.create("changemyinformation:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse)= self.create("changemyinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    # @checkLogin
    # @checkPermission
    def onChangeMyPassword(self, proto, spec, message, body):
        print '--------begin change my password --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        #print 'userId:%s' % body.userId
        print 'old password:%s' % body.oldPassword
        print 'new password:%s' % body.newPassword
        print '--------end change my password ----------'
        r = ACLServer.aclsql.changeMyPassword(body.session.userId, self.md5(body.oldPassword), self.md5(body.newPassword) )

        if r == 0:
            (responseSpec, successResponse) = self.create("changemypassword:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        elif r == 1:
            (responseSpec, failedResponse) = self.create("changemypassword:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'wrong old password, place input again'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("changemypassword:aclproto", False)
            failedResponse.status = 2
            failedResponse.message = 'user does not exist'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    # @checkLogin
    # @checkPermission
    def onOtherInformation(self, proto, spec, message, body):
        print '--------begin other information --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        rName = []
        for i in body.reqName:
            rName.append(spec.fields['reqName'].valueSpec.value2Strings[i])
            print 'reqname: %s' % i
        print 'otheruserid : %s' % body.otherUserId
        print '--------end  other information----------'
        rValue = ACLServer.aclsql.myInformation(body.otherUserId, rName)

        if rValue.has_key('id'):
            rValue['id']= str(rValue['id'])

        if rValue != False:
            (responseSpec, successResponse) = self.create("otherinformation:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            successResponse.information = rValue
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("otherinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())


    # @checkLogin
    # @checkPermission
    def onAllUserInformation(self, proto, spec, message, body):
        print '--------begin all user information --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        rName = []
        for i in body.reqName:
            rName.append(spec.fields['reqName'].valueSpec.value2Strings[i])
            print 'reqname: %s' % i
        print '--------end  all user information----------'
        rValue = ACLServer.aclsql.allUserInformation(rName)
        c=[]
        for i in rValue:
            d= [str(j) for j in i ]
            c.append(d)

        rValue = c
        # if rValue.has_key('id'):
        #     rValue['id'] = [str(j) for j in rValue['id']]
        if rValue != False:
            (responseSpec, successResponse) = self.create("alluserinformation:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            # for key, value in rValue.items():
            #     successResponse.information[key] = value
            # for i in rName:
            successResponse.information = rValue
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("alluserinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())



    def onAllResourceInformation(self, proto, spec, message, body):
        print '--------begin all resource information --------'
        print 'userId-seqId: %s-%s' % (body.session.userId, body.session.seqId)
        print '--------end  all resource information----------'
        rValue = ACLServer.aclsql.allResourceInformation()
        rtype= ACLServer.aclsql.listResourceType()
        typeDict={}
        for i in rtype:
            typeDict[i[0]]=i[1]


        c=[]
        l=len(rValue)
        for i in range(l):
            a=[]
            a.append( str(rValue[i][0]))
            a.append(rValue[i][1])
            a.append(typeDict[rValue[i][2]])
            c.append(a)

        # c = []
        # for i in rValue:
        #     d = [str(j) for j in i]
        #     c.append(d)

        rValue = c
        # if rValue.has_key('id'):
        #     rValue['id'] = [str(j) for j in rValue['id']]
        if rValue != False:
            (responseSpec, successResponse) = self.create("allresourceinformation:aclproto", False)
            successResponse.status = 0
            successResponse.message = 'ok'
            # for key, value in rValue.items():
            #     successResponse.information[key] = value
            # for i in rName:
            successResponse.information = rValue
            self.send(message.getSource(), proto, responseSpec, successResponse, message.getRequestId())
        else:
            (responseSpec, failedResponse) = self.create("allresourceinformation:aclproto", False)
            failedResponse.status = 1
            failedResponse.message = 'error'
            self.write_log('error', body.session.userId, failedResponse.message)
            self.send(message.getSource(), proto, responseSpec, failedResponse, message.getRequestId())











































































