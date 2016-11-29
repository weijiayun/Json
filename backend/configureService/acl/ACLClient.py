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

        self.handle('deleteresourcetype:aclproto', False, self._onDeleteResourceType)

        self.handle('addresource:aclproto', False, self._onAddResource)

        self.handle('getresources:aclproto', False, self._onGetResources)

        self.handle('addresourcetogroup:aclproto', False, self._onAddResourceToGroup)

        self.handle('removeresourcefromgroup:aclproto', False, self._onRemoveResourceFromGroup)

        self.handle('haspermission:aclproto', False, self._onHasPermission)

        self.handle('addrole:aclproto', False, self._onAddRole)

        self.handle('adduser:aclproto', False, self._onAddUser)

        self.handle('setroletouser:aclproto', False, self._onSetRoleToUser)

        self.handle('clearroleofuser:aclproto', False, self._onClearRoleFromUser)

        self.handle('granttorole:aclproto', False, self._onGrantToRole)

        self.handle('revokefromrole:aclproto', False, self._onRevokeFromRole)

        self.handle('grantresourcetorole:aclproto', False, self._onGrantResourceToRole)

        self.handle('revokeresourcefromrole:aclproto', False, self._onRevokeResourceFromRole)

        self.handle('changepassword:aclproto', False, self._onChangePassword)

        self.handle('listuser:aclproto', False, self._onListUser)

        self.handle('changeusername:aclproto', False, self._onChangeUserName)

        self.handle('changerolename:aclproto', False, self._onChangeRoleName)

        self.handle('changepublickey:aclproto', False, self._onChangePublicKey)

        self.handle('changeprivatekey:aclproto', False, self._onChangePrivateKey)

        self.handle('getpublickey:aclproto', False, self._onGetPublicKey)

        self.handle('deleteresource:aclproto', False, self._onDeleteResource)

        self.handle('deleteuser:aclproto', False, self._onDeleteUser)

        self.handle('deleterole:aclproto', False, self._onDeleteRole)

        self.handle('listlogin:aclproto', False, self._onListLogin)

        self.handle('myrole:aclproto', False, self._onMyRole)

        self.handle('myinformation:aclproto', False, self._onMyInformation)

        self.handle('changemyinformation:aclproto', False, self._onChangeMyInformation)

        self.handle('changemypassword:aclproto', False, self._onChangeMyPassword)

        self.handle('otherinformation:aclproto', False, self._onOtherInformation)

        self.handle('alluserinformation:aclproto', False, self._onAllUserInformation)

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
            import threading
            self.logoutEvent = threading.Event()
            self.send(self.serverId, self.proto, logoutSpec, logoutRequest, self._getRequestId(logoutRequest))

            self.logoutEvent.wait()
            if 0 != self.logoutResponse.status:
                raise Exception(self.logoutResponse.message)
            else:
                return self.logoutResponse.message
        except Exception as e:
            print e

    def _onAddResourceType(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.resourceTypeId)

    def addResourceType(self, session, name, description, permissions):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addresourcetype:aclproto", True)
            rRequest.session = session
            rRequest.name = name
            rRequest.description = description
            rRequest.permissions = permissions
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onDeleteResourceType(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def deleteResourceType(self, session, resourceTypeId, force=False):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteresourcetype:aclproto", True)
            rRequest.session = session
            rRequest.resourceTypeId = resourceTypeId
            rRequest.force = force
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
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

    def addResource(self, session, name, resourceTypeId, contentId, isGroup):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addresource:aclproto", True)
            rRequest.session = session
            rRequest.resourceTypeId = resourceTypeId
            rRequest.name = name
            rRequest.contentId = contentId
            rRequest.isGroup = isGroup
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e :
            print e

    def _onGetResources(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.resources)

    def getResources(self, session, roleId, resourceId, permissionIds):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("getresources:aclproto", True)
            rRequest.session = session
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onAddResourceToGroup(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def addResourceToGroup(self, session, groupId, resourceIds):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addresourcetogroup:aclproto", True)
            rRequest.session = session
            rRequest.groupId = groupId
            rRequest.resourceIds = resourceIds
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onRemoveResourceFromGroup(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def removeResourceFromGroup(self, session, groupId, resourceIds):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("removeresourcefromgroup:aclproto", True)
            rRequest.session = session
            rRequest.groupId = groupId
            rRequest.resourceIds = resourceIds
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onHasPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.hasPerm)

    def hasPermission(self, session, resourceId, permission):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("haspermission:aclproto", True)
            rRequest.session = session
            rRequest.resourceId = resourceId
            rRequest.permission = permission
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onAddRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.roleId)

    def addRole(self, session, roleName):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("addrole:aclproto", True)
            rRequest.session = session
            rRequest.roleName = roleName
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
                p.fulfill(body.userId)

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
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onSetRoleToUser(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def setRoleToUser(self, session, userId, roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("setroletouser:aclproto", True)
            rRequest.session = session
            rRequest.userId = userId
            rRequest.roleId = roleId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onClearRoleFromUser(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def clearRoleFromUser(self, session, userId, roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("clearroleofuser:aclproto", True)
            rRequest.session = session
            rRequest.userId = userId
            rRequest.roleId = roleId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGrantToRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def grantToRole(self, session, roleId, parentRoleIds):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("granttorole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.parentsRoleId = parentRoleIds
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onRevokeFromRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def revokeFromRole(self, session, roleId, parentRoleIds):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("revokefromrole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.parentsRoleId = parentRoleIds
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGrantResourceToRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def grantResourceToRole(self, session, roleId, resourceId, permissionIds):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantresourcetorole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.resourceId = resourceId
            rRequest.permissionIds = permissionIds
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onRevokeResourceFromRole(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.message)

    def revokeResourceFromRole(self, session, roleId, resourceId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("revokeresourcefromrole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.resourceId = resourceId
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onChangePassword(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
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
            self.send(self.serverId, self.proto, rSpec, rRequest, self._getRequestId(p))
            return p
        except Exception as e:
            print e

    def _onGrantPermission(self, proto, spec, message, body):
        requestId = message.getRequestId()
        if requestId in self.requests:
            p = self.requests[requestId]
            if 0 != body.status:
                p.reject(Exception(body.message))
            else:
                p.fulfill(body.status)

    def grantPermission(self, session, roleId, resourceId, permissionId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("grantpermission:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
            rRequest.resourceId = resourceId
            rRequest.permissionId = permissionId
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
                p.fulfill(body.status)

    def changePublicKey(self, session,publicKey):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("changepublickey:aclproto", True)
            rRequest.session = session
            rRequest.publicKey = publicKey
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
                p.fulfill(body.status)

    def deleteUser(self, session, userId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleteuser:aclproto", True)
            rRequest.session = session
            rRequest.userId = userId
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
                p.fulfill(body.status)

    def deleteRole(self, session,roleId):
        try:
            p = Promise()
            (rSpec, rRequest) = self.create("deleterole:aclproto", True)
            rRequest.session = session
            rRequest.roleId = roleId
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
        except Exception as e:
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
            p = self.requests[requestId]
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


