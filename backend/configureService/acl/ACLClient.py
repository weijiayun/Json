#coding: utf-8
from MessageHandler import MessagePlugin
from promise import Promise
import hashlib
from decorator import decorator
import os
import time
import logging
from network.DSignal import DSignal

class ACLClient(MessagePlugin):
    def __init__(self, proto, messageHandle, serverId):
        super(ACLClient, self).__init__(messageHandle)
        self.proto = proto


        self.handle('login:aclproto', False, self._onLogin)
        self.handle('logout:aclproto', False, self._onLogout)

        self.handle('addresourcetype:aclproto', False, self._onAddResourceType)

        self.handle('addresource:aclproto', False, self._onAddResource)

        self.handle('addrole:aclproto', False, self._onAddRole)

        self.handle('adduser:aclproto', False, self._onAddUser)

        self.handle('grantrole:aclproto', False, self._onGrantRole)

        self.handle('changepassword:aclproto', False, self._onChangePassword)

        self.handle('listresource:aclproto', False, self._onListResource)

        self.handle('listotherresource:aclproto', False, self._onListOtherResource)

        self.handle('grantpermission:aclproto', False, self._onGrantPermission)

        self.handle('listrole:aclproto', False, self._onListRole)

        self.handle('listuser:aclproto', False, self._onListUser)

        self.handle('listpermission:aclproto', False, self._onListPermission)

        self.handle('listotherpermission:aclproto', False, self._onListOtherPermission)

        self.handle('changeusername:aclproto', False, self._onChangeUserName)

        self.handle('changerolename:aclproto', False, self._onChangeRoleName)

        self.handle('changepublickey:aclproto', False, self._onChangePublicKey)

        self.handle('changeprivatekey:aclproto', False, self._onChangePrivateKey)

        self.handle('getpublickey:aclproto', False, self._onGetPublicKey)

        self.handle('deleteresource:aclproto', False, self._onDeleteResource)

        self.handle('deleteuser:aclproto', False, self._onDeleteUser)

        self.handle('deleterole:aclproto', False, self._onDeleteRole)

        self.handle('listlogin:aclproto', False, self._onListLogin)

        self.handle('inheritpermission:aclproto', False, self._onInheritPermission)

        self.handle('releaserole:aclproto', False, self._onReleaseRole)

        self.handle('myrole:aclproto', False, self._onMyRole)

        self.handle('listresourcetype:aclproto', False, self._onListResourceType)

        self.handle('haspermission:aclproto', False, self._onHasPermission)

        self.handle('listtyperesource:aclproto', False, self._onListTypeResource)

        self.handle('myinformation:aclproto', False, self._onMyInformation)

        self.handle('changemyinformation:aclproto', False, self._onChangeMyInformation)

        self.handle('changemypassword:aclproto', False, self._onChangeMyPassword)

        self.handle('otherinformation:aclproto', False, self._onOtherInformation)

        self.handle('alluserinformation:aclproto', False, self._onAllUserInformation)

        self.handle('allresourceinformation:aclproto', False, self._onAllResourceInformation)


        self.currentRequestId = 1
        self.requests = {}
        self.serverId = serverId

    def _getRequestId(self, request):
        requestId = self.currentRequestId
        self.currentRequestId += 1
        self.requests[requestId] = request
        return requestId

    def _onLogin(self, proto, spec, message, body):
        self.loginResponse = body
        self.loginEvent.set()

    def login(self, userName, password):
        try:
            (loginSpec, loginRequest) = self.create("login:aclproto", True)
            loginRequest.userName = userName
            loginRequest.password = password
            self.loginResponse = None

            import threading
            self.loginEvent = threading.Event()
            self.send(self.serverId, self.proto, loginSpec, loginRequest, self._getRequestId(loginRequest))

            self.loginEvent.wait()

            if 0 != self.loginResponse.status:
                raise Exception(self.loginResponse.message)

            else:
                return self.loginResponse.session
        except Exception as e :
            print e
            # 返回 0-0 这一假session
            return self.loginResponse.session

    def _onLogout(self, proto, spec, message, body):
        self.logoutResponse = body
        self.logoutEvent.set()

    def logout(self,session):
        try:
            (logoutSpec, logoutRequest) = self.create("logout:aclproto", True)
            logoutRequest.session = session
            self.logoutResponse = None
            import threading
            self.logoutEvent = threading.Event()
            self.send(self.serverId, self.proto, logoutSpec, logoutRequest, self._getRequestId(logoutRequest))

            self.logoutEvent.wait()
            if 0 != self.logoutResponse.status:
                raise Exception(self.logoutResponse.message)
            else:
                return self.logoutResponse.message
        except Exception as e :
            print e

    def _onAddResourceType(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceTypeId)

    def addResourceType(self,  session, name, description, permissions):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addresourcetype:aclproto", True)
            rRequest.session = session
            rRequest.name = name
            rRequest.description = description
            permission=[]
            for i in permissions:
                perm = self.createGeneric("Permission:ACLProto")
                perm.name = i[0]
                perm.description = i[1]
                permission.append(perm)
            rRequest.permissions = permission
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onAddResource(self, proto, spec, message, body):
        # self.addResourceResponse = body
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.resourceId)

    def addResource(self, session ,resourceTypeId, name, description):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addresource:aclproto", True)
            rRequest.session = session
            rRequest.resourceTypeId = resourceTypeId
            rRequest.name = name
            rRequest.description = description
            self.addResourceResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onAddRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.roleId)

    def addRole(self, session ,roleName, resourcePermissions):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addrole:aclproto", True)
            rRequest.session = session
            rRequest.roleName = roleName
            rp=[]
            for i in resourcePermissions:
                r = self.createGeneric("ResourcePermission:ACLProto")
                r.resourceId = i[0]
                r.permissionIds = []
                for j in i[1]:
                    perm= self.createGeneric("PId:ACLProto")
                    perm.permissionId = j
                    r.permissionIds.append(perm)
                rp.append(r)
            rRequest.resourcePermissions = rp
            self.addRoleResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return  p
        except Exception as e :
            print e


    def _onAddUser(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.userId)

    def addUser(self, session ,userName, phoneNumber, privateKey, publicKey, password):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("adduser:aclproto", True)
            rRequest.session = session
            rRequest.userName = userName
            rRequest.phoneNumber = phoneNumber
            rRequest.privateKey = privateKey
            rRequest.publicKey = publicKey
            rRequest.password = password
            self.addUserResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onGrantRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )


    def grantRole(self, session ,userId, roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantrole:aclproto", True)
            rRequest.session = session
            rRequest.userId = userId
            rRequest.roleId = roleId
            self.grantRoleResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onChangePassword(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p  = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.status)

    def changePassword(self, session,password):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changepassword:aclproto", True)
            rRequest.session = session
            rRequest.password = password
            self.changePasswordResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onListResource(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resources)

    def listResource(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listresource:aclproto", True)
            rRequest.session = session
            self.listResourceResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onListOtherResource(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resources)

    def listOtherResource(self, session,roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listotherresource:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            self.listOtherResourceResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return  p
        except Exception as e :
            print e

    def _onGrantPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )

    def grantPermission(self, session ,roleId, resourceId, permissionId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantpermission:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.resourceId = resourceId
            rRequest.permissionId = permissionId
            self.grantPermissionResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onListRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.roles)

    def listRole(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listrole:aclproto", True)
            rRequest.session = session
            self.listRoleResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onListUser(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.users)

    def listUser(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listuser:aclproto", True)
            rRequest.session = session
            self.listUserResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onListPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.permissions)

    def listPermission(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listpermission:aclproto", True)
            rRequest.session = session
            self.listPermissionResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onListOtherPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p  = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.permissions)

    def listOtherPermission(self, session,roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listotherpermission:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            self.listOtherPermissionResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onChangeUserName(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status)

    def changeUserName(self, session,userName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changeusername:aclproto", True)
            rRequest.session = session
            rRequest.userName = userName
            self.changeUserNameResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onChangeRoleName(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )

    def changeRoleName(self, session,roleId,roleName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changerolename:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.roleName = roleName
            self.changeRoleNameResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onChangePublicKey(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )

    def changePublicKey(self, session,publicKey):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changepublickey:aclproto", True)
            rRequest.session = session
            rRequest.publicKey = publicKey
            self.changePublicKeyResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onChangePrivateKey(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.status)

    def changePrivateKey(self, session,privateKey):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changeprivatekey:aclproto", True)
            rRequest.session = session
            rRequest.privateKey = privateKey
            self.changePrivateKeyResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGetPublicKey(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.publicKey)

    def getPublicKey(self, session, userId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getpublickey:aclproto", True)
            rRequest.userId = userId
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onDeleteResource(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.status)

    def deleteResource(self, session, resourceId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteresource:aclproto", True)
            rRequest.session = session
            rRequest.resourceId = resourceId
            self.deleteResourceResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onDeleteUser(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )


    def deleteUser(self, session,userId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteuser:aclproto", True)
            rRequest.session = session
            rRequest.userId = userId
            self.deleteUserResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onDeleteRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )

    def deleteRole(self, session,roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleterole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            self.deleteRoleResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return  p
        except Exception as e :
            print e


    def _onListLogin(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.logins)

    def listLogin(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listlogin:aclproto", True)
            rRequest.session = session
            self.listLoginResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onInheritPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )

    def inheritPermission(self, session,pRoleId,cRoleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("inheritpermission:aclproto", True)
            rRequest.session = session
            rRequest.pRoleId = pRoleId
            rRequest.cRoleId = cRoleId
            self.inheritPermissionResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onReleaseRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.status )

    def releaseRole(self, session,roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("releaserole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            self.releaseRoleResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onMyRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill([body.roleId,body.roleName])

    def myRole(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("myrole:aclproto", True)
            rRequest.session = session
            self.myRoleResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onListResourceType(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.resourceTypes)

    def listResourceType(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listresourcetype:aclproto", True)
            rRequest.session = session
            self.listResourceTypeResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onHasPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill( body.result)


    def hasPermission(self, session,roleId,resourceId,permissionId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("haspermission:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.resourceId = resourceId
            rRequest.permissionId = permissionId
            self.hasPermissionResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return  p
        except Exception as e :
            print e


    def _onListTypeResource(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
               p.fulfill( body.resources)

    def listTypeResource(self, session,resourceTypeId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("listtyperesource:aclproto", True)
            rRequest.session = session
            rRequest.resourceTypeId = resourceTypeId
            self.listTypeResourceResponse = None
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onMyInformation(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.information)

    def myInformation(self, session, reqName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("myinformation:aclproto", True)
            rRequest.session = session
            rRequest.reqName = reqName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onChangeMyInformation(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)


    def changeMyInformation(self, session, reqDic):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changemyinformation:aclproto", True)
            rRequest.session = session
            rRequest.reqDic = reqDic
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onChangeMyPassword(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p  = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.status)

    def changeMyPassword(self, session,oldPassword, newPassword):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changemypassword:aclproto", True)
            rRequest.session = session
            rRequest.oldPassword = oldPassword
            rRequest.newPassword = newPassword
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e


    def _onOtherInformation(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.information)

    def otherInformation(self, session, reqName, otherUserId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("otherinformation:aclproto", True)
            rRequest.session = session
            rRequest.reqName = reqName
            rRequest.otherUserId = otherUserId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e


    def _onAllUserInformation(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.information)

    def allUserInformation(self, session, reqName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("alluserinformation:aclproto", True)
            rRequest.session = session
            rRequest.reqName = reqName
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e


    def _onAllResourceInformation(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.information)


    def allResourceInformation(self, session):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("allresourceinformation:aclproto", True)
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e





