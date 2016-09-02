#!/opt/Apps/local/Python/anaconda/bin/python
#coding: utf-8

import os
import sys
import subprocess
myRoot = os.path.split(os.path.realpath(__file__))[0]
sys.path.append(os.path.dirname(myRoot))
from configureService.acl.ACLClient import ACLClient
from  twisted.internet import reactor, defer
from  MessageHandler import Factory
from  PeagunCmd import Peagun
from  PeaView import PeaView
import argparse
from  network.DMessage import DMessageType


def generateProto(protoPathList):
    #generate py source
    for p in protoPathList:
        files = os.listdir(p)
        for f in files:
            stem,ext = os.path.splitext(f)
            if ext == '.thrift':
                subprocess.call(['thrift','-gen','py','-o',metaPath,os.path.join(p,f)],stdout=sys.stdout,stderr=sys.stderr)



scriptPath,peagunName = os.path.split(os.path.abspath(sys.argv[0]))
print scriptPath

# configureFile = open(os.path.join(scriptPath,'config.txt'), 'r')
configureFile = open(os.path.join(scriptPath,'../config.txt'), 'r')
import json
confs = json.load(configureFile)
configureFile.close()

pluginPath1 = os.path.join(scriptPath, 'configureService/acl/\w+Server')
pluginPath2 = os.path.join(scriptPath, 'configureService/security/\w+Server')
metaPath = '/tmp'
generateProto([confs['PATH']])
sys.path.append(metaPath + '/gen-py')

sourceId = 605

pea = PeaView([confs['PATH']], Factory.createMessageHandles([pluginPath1, pluginPath2]),['LMFHFProto.thrift','PluginManage.thrift'],
              sourceId,  requestId=0)

def sendHeartbeat(pea, proto):
    #pea.sendHeartbeat(proto)
    reactor.callLater(30, sendHeartbeat, pea, proto)

def test(pea, proto):
    client = ACLClient(proto, pea.customHandle, 609)

    session = client.login('cc', '1234')
    print 'login %s'% session
    # from twisted.internet import reactor, defer

    # def changeMyInformationSuccess(information):
    #     print 'changeMyInformationSuccess : %s ' % information
    # def changeMyInformationFailed(errMesg):
    #     print 'changeMyInformation  failed:%s' % ( errMesg)
    # client.changeMyInformation(session,{6: 'fas123123',2:'12312312331'})\
    #         .then(changeMyInformationSuccess).catch(changeMyInformationFailed)




    def myInformationSuccess(information):
        for k,v in information.items():
            print 'myInformationSuccess : %s-%s' % (k,v)
    def myInformationFailed(errMesg):
        print 'myInformationFailed :%s' % ( errMesg)
    client.myInformation(session,[1,2,3,4,5,6,7]).then(myInformationSuccess).catch(myInformationFailed)



    # def addResourceTypeSuccess( id):
    #     print 'addResourceType success:%d' % ( id)
    # def addResourceTypeFailed( errMesg):
    #     print 'addaddResourceType %s failed:%s' % ( errMesg)
    # client.addResourceType( session,'reqq','qq',(['q','qq'],))\
    #         .then(addResourceTypeSuccess).catch(addResourceTypeFailed)
    #
    #
    # def addResourceSuccess( id):
    #     print 'addResource success: %d' % ( id)
    # def addResourceFailed( errMesg):
    #     print 'addResource  failed:%s' % ( errMesg)
    #
    # client.addResource( session,3,'zzz','zzzz')\
    #         .then(addResourceSuccess).catch(addResourceFailed)
    #
    #
    # def addRoleSuccess( id):
    #     print 'addRole %s success: %d' % ( id)
    # def addroleFailed( errMesg):
    #     print 'addRole %s failed: %s' % (errMesg)
    # client.addRole( session,'trader',((5,(8,14)),))\
    #         .then(addRoleSuccess).catch(addroleFailed)
    #
    # def addUserSuccess( id):
    #     print 'addUser  success: %d' % ( id)
    # def addUserFailed( errMesg):
    #     print 'addUser %s failed: %s' % ( errMesg)
    # client.addUser( session,'qq','12345678912','sdfs12','sdf12','sdf123')\
    #         .then(addUserSuccess).catch(addUserFailed)
    #
    # def grantRoleSuccess(a):
    #     print 'grantRole to userId=%s success'
    # def grantRoleFailed(errMesg):
    #     print 'grantRole to userId=%s failed: %s' % ( errMesg)
    # client.grantRole( session,4,1)\
    #         .then(grantRoleSuccess).catch(grantRoleFailed)
    #
    # def changePasswordSuccess():
    #     print 'changePassword  success'
    # def changePasswordFailed( errMesg):
    #     print 'changePassword %s failed: %s' % ( errMesg)
    # client.changePassword( session,'1232')\
    #         .then(changePasswordSuccess).catch(changePasswordFailed)
    #
    # def listResourceSuccess(resources):
    #     print 'listResource  success :'
    #     for i in  resources:
    #         print i
    # def listResourceFailed(errMesg):
    #     print 'listResource  failed: %s' % ( errMesg)
    # client.listResource( session)\
    #         .then(listResourceSuccess).catch(listResourceFailed)
    #
    #
    # def listOtherResourceSuccess(resources):
    #     print 'listotherResource   success: '
    #     for i in  resources:
    #         print i
    # def listOtherResourceFailed( errMesg):
    #     print 'listotherResource  failed: %s' % ( errMesg)
    # client.listOtherResource( session,1)\
    #         .then(listOtherResourceSuccess).catch(listOtherResourceFailed)
    #
    # def grantPermissionSuccess(a):
    #     print 'grantPermission to roleId success'
    # def grantPermissionFailed(errMesg):
    #     print 'grantPermission to  failed: %s' % ( errMesg)
    # client.grantPermission( session,2,1,2)\
    #         .then(grantPermissionSuccess).catch(grantPermissionFailed)
    #
    #
    # def listRoleSuccess(roles):
    #     print 'listRole  success :'
    #     for i in  roles:
    #         print i
    # def listRoleFailed(errMesg):
    #     print 'listRole failed: %s' % ( errMesg)
    # client.listRole(  session)\
    #         .then(listRoleSuccess).catch(listRoleFailed)
    #
    # def listUserSuccess(users):
    #     print 'listUser  success :'
    #     for i in  users:
    #         print i
    # def listUserFailed(errMesg):
    #     print 'listUser failed: %s' % ( errMesg)
    # client.listUser( session)\
    #         .then(listUserSuccess).catch(listUserFailed)
    #
    #
    # def listPermissionSuccess(permissions):
    #     print 'listPermission  success :'
    #     for i in  permissions:
    #         print i
    # def listPermissionFailed(errMesg):
    #     print 'listPermission failed: %s' % ( errMesg)
    # client.listPermission( session)\
    #         .then(listPermissionSuccess).catch(listPermissionFailed)
    #
    # def listOtherPermissionSuccess(permissions):
    #     print 'list roleId Permission  success :'
    #     for i in  permissions:
    #         print i
    # def listOtherPermissionFailed( errMesg):
    #     print 'list roleId Permission failed: %s' % ( errMesg)
    # client.listOtherPermission( session,2)\
    #         .then(listOtherPermissionSuccess).catch(listOtherPermissionFailed)
    #
    # def changeUserNameSuccess(a):
    #     print 'changeUserName  success'
    # def changeUserNameFailed( errMesg):
    #     print 'changeUserName  failed: %s' % ( errMesg)
    # client.changeUserName(session,'bb')\
    #         .then(changeUserNameSuccess).catch(changeUserNameFailed)
    #
    # def changeRoleNameSuccess(a):
    #     print 'changeRoleName  success'
    # def changeRoleNameFailed( errMesg):
    #     print 'changeRoleName failed: %s' % ( errMesg)
    # client.changeRoleName( session,3,'ad')\
    #         .then(changeRoleNameSuccess).catch(changeRoleNameFailed)
    #
    #
    # def changePublicKeySuccess(a):
    #     print 'changePublicKey success'
    # def changePublicKeyFailed( errMesg):
    #     print 'changePublicKey %s failed: %s' % ( errMesg)
    # client.changePublicKey( session,'adddddddddd234')\
    #         .then(changePublicKeySuccess).catch(changePublicKeyFailed)
    #
    #
    #
    # def changePrivateKeySuccess(a):
    #     print 'changePrivateKey  success'
    # def changePrivateKeyFailed( errMesg):
    #     print 'changePrivateKey failed: %s'  % errMesg
    # client.changePrivateKey( session,'adddddddddd234')\
    #         .then(changePrivateKeySuccess).catch(changePrivateKeyFailed)
    #
    # def deleteResourceSuccess(a):
    #     print 'deleteResource success'
    # def deleteResourceFailed( errMesg):
    #     print 'deleteResource  failed: %s' % ( errMesg)
    # client.deleteResource( session,4)\
    #         .then(deleteResourceSuccess).catch(deleteResourceFailed)
    #
    #
    # def deleteUserSuccess(a):
    #     print 'deleteUser  success'
    # def deleteUserFailed( errMesg):
    #     print 'deleteUser  failed: %s' % ( errMesg)
    # client.deleteUser( session,5)\
    #         .then(deleteUserSuccess).catch(deleteUserFailed)
    #
    #
    # def deleteRoleSuccess(a):
    #     print 'deleteRole  success'
    # def deleteRoleFailed( errMesg):
    #     print 'deleteRole  failed: %s' % ( errMesg)
    # client.deleteRole( session,5)\
    #         .then(deleteRoleSuccess).catch(deleteRoleFailed)
    #
    #
    # def listLoginSuccess(Logins):
    #     print 'listLogin  success :'
    #     for i in  Logins:
    #         print i
    # def listLoginFailed(errMesg):
    #     print 'listLogin failed: %s' % ( errMesg)
    # client.listLogin( session)\
    #         .then(listLoginSuccess).catch(listLoginFailed)
    #
    # def inheritPermissionSuccess():
    #     print 'inheritPermission from roleId  success :'
    # def inheritPermissionFailed( errMesg):
    #     print 'inheritPermission from roleId   failed: %s' % ( errMesg)
    # client.inheritPermission( session,2,3)\
    #         .then(inheritPermissionSuccess).catch(inheritPermissionFailed)
    #
    #
    # def releaseRoleSuccess():
    #     print 'releaseRole  success '
    # def releaseRoleFailed( errMesg):
    #     print 'releaseRole  failed: %s' % ( errMesg)
    # client.releaseRole(session,4)\
    #         .then(releaseRoleSuccess).catch(releaseRoleFailed)
    #
    #
    # def myRoleSuccess(roles):
    #     print 'myRoleId-name  is %s -%s '% (roles[0],roles[1])
    # def myRoleFailed( errMesg):
    #     print 'myRole failed: %s' % ( errMesg)
    # client.myRole( session)\
    #         .then(myRoleSuccess).catch(myRoleFailed)
    #
    #
    # def listResourceTypeSuccess(ResourceTypes):
    #     print 'listResourceType  success :'
    #     for i in  ResourceTypes:
    #         print i
    # def listResourceTypeFailed(errMesg):
    #     print 'listResourceType failed: %s' % ( errMesg)
    # client.listResourceType( session)\
    #         .then(listResourceTypeSuccess).catch(listResourceTypeFailed)
    #
    #
    # def hasPermissionSuccess( result):
    #     print 'hasPermission  id is %s '% (result)
    # def hasPermissionFailed( errMesg):
    #     print 'hasPermission  id failed: %s' % ( errMesg)
    # client.hasPermission( session, 1,1,1)\
    #         .then(hasPermissionSuccess).catch(hasPermissionFailed)
    #
    # def listTypeResourceSuccess(id,resources):
    #     print 'list TypeId= %s  success :' % id
    #     for i in  resources:
    #         print i
    # def listTypeResourceFailed(id, errMesg):
    #     print 'list TypeId= %s failed: %s' % (id, errMesg)
    # client.listTypeResource(session,4)\
    #         .then(listTypeResourceSuccess).catch(listTypeResourceFailed)
    print "begin logout"
    client.logout(session)

    print 'ACLClient test success!!! '





def onConnected(connectionManager, proto):
    from aclSystem.ttypes import Session
    session = Session()
    session.sessionID = 100
    session.userID = 8
    session.appID = sourceId
    session.AppGroupId = 2

    from TTProto.ttypes import Registe
    registeMsg = Registe(session, 'acl', 'a acl')
    connectionManager.send(proto, 0, sourceId, 0, registeMsg)
    # connectionManager.send(proto, 0, sourceId, 0, registeMsg,requestId)

    reactor.callLater(30, sendHeartbeat, pea, proto)
    reactor.callInThread(test, pea, proto)

def doConnect(pea):
    pea.connectionManager.connect(confs['TTHOST'], confs['TTPORT'])

pea.onConnected.connect(onConnected)
reactor.callLater(2, doConnect, pea )
reactor.run()



