#!/opt/Apps/local/Python/anaconda/bin/python2.7
#coding: utf-8
__author__ = 'luoshu'

from flask import render_template, session, redirect, url_for, g, flash, request
from myapp import app
from .forms import LoginForm, EditForm, AccountForm, KeyForm, AvatarForm
from werkzeug import secure_filename
from decorator import decorator
from configureService.configureObject.ConfigureObjectClient import ConfigureObjectClient
from configureService.acl.ACLClient import ACLClient
from ACLProto.ttypes import LoginSession
from applib import ClientBasket

#global vars
userClientBasket = ClientBasket()

def getPrivateKey():
    import os
    addr = os.path.join(os.environ["HOME"], ".ssh/configservice_rsa.pri")
    f = open(addr)
    privateKey = f.read()
    f.close()
    return privateKey


@decorator
def login_required(f, *args, **kwargs):
    #增加检查登录,防止其他人构造SESSION登录
    if session['seqId'] >= 0:
        return f(*args, **kwargs)
    else:
        return redirect(url_for('login'))

@app.before_first_request
def before_first_request():
    if not session.has_key("seqId"):
        session['seqId'] = -1
@app.before_request
def before_request():
    if not session.has_key("seqId"):
        session['seqId'] = -1

@app.route('/', methods=["GET", "POST"])
@app.route('/index', methods=["GET", "POST"])
@login_required
def index():
    return render_template('index.html')

@app.route("/login", methods=["POST", "GET"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        uname = form.username.data
        pwd = form.password.data
        aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
        configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
        loginResult = aclClient.login(uname, pwd)

        if loginResult is not None and loginResult.seqId > 0:
            session['uname'] = form.username.data
            session['seqId'] = loginResult.seqId
            session['userId'] = loginResult.userId
            global userClientBasket
            userClientBasket.registClient(session, aclClient, "aclClient")
            userClientBasket.registClient(session, loginResult, "session")
            userClientBasket.registClient(session, configClient, "configClient")

            return redirect(url_for("index"))

        flash('Invalid username or password!')
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
@login_required
def logout():
    global userClientBasket
    userClientBasket.unRegistClient(session)
    session.clear()
    session['seqId'] = -1
    flash('You have been logged out.')
    return redirect(url_for('login'))


@app.route('/user/<nickname>', methods=["POST","GET"])
@login_required
def user(nickname):
    if nickname != session["uname"]:
        flash("you should login with acount: {0} firstly".format(nickname))
        return redirect(url_for("login"))

    user = dict()
    
    def myInformationSuccess(a):
        for k,v in a.items():
            user[k] = v
    
    def myInformationFailed(errMesg):
        print 'b'
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session,"session")
    aclClient.myInformation(loginSession, [1, 3, 2, 4, 8])\
            .then(myInformationSuccess).catch(myInformationFailed).wait()

    form = EditForm()
    if form.validate_on_submit():
        userUpdate = dict()
        userUpdate[1] = form.username.data
        userUpdate[3] = form.email.data
        userUpdate[2] = form.telephone.data
        userUpdate[4] = form.introduction.data
        userUpdate[4] = userUpdate[4].encode('utf-8')

        def changeMyInformationSuccess(a):
            print a

        def changeMyInformationFailed(errMesg):
            print errMesg

        aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
        aclClient.changeMyInformation(loginSession, userUpdate)\
            .then(changeMyInformationSuccess).catch(changeMyInformationFailed).wait()
        flash('Your changes have been saved.')
        return redirect(url_for('user',nickname = user['name']))
    else:
        user['intro'] = user['intro'].decode('utf-8')
        return render_template('user.html', user = user, form=form )

@app.route('/account',methods=['GET','POST'])
@login_required
def account():

    user = dict()

    def myInformationSuccess(info):
        for k, v in info.items():
            user[k] = v
        print 'read my info. success'

    def myInformationFailed(errMesg):
        print 'read my info failed!!!'
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    aclClient.myInformation(loginSession, [6,7]).\
        then(myInformationSuccess).catch(myInformationFailed).wait()
    form_password = AccountForm()
    form_key = KeyForm()
    return render_template('account.html',
                           user=user,
                           form_password=form_password,
                           form_key=form_key)


@app.route('/password', methods=['GET', 'POST'])
@login_required
def password():
    form = AccountForm()
    if form.validate_on_submit():
        if form.newpassword.data == form.confirmpassword.data:
            flag = {}
            global userClientBasket
            aclClient = userClientBasket.getClient(session, "aclClient")
            loginSession = userClientBasket.getClient(session, "session")

            def success(a):
                flag["flag"] = True

            def failed(errMesg):
                flag["flag"] = False

            aclClient.changeMyPassword(loginSession,
                                         form.oldpassword.data,
                                         form.newpassword.data).then(success).catch(failed).wait()
            if flag["flag"]:
                flash('Your changes have been saved.')
            else:
                flash('The old password is not correct.')
        else:
            flash('The new password and confirmed password do not match.')
    return redirect(url_for("account"))

@app.route('/key', methods=['GET', 'POST'])
@login_required
def key():
    form = KeyForm()
    if form.validate_on_submit():
        flag = {}
        global userClientBasket
        aclClient = userClientBasket.getClient(session, "aclClient")
        loginSession = userClientBasket.getClient(session, "session")

        def changePublicKeySuccess(a):
            flag["pub"] = True
            print 'changePublicKey success'

        def changePublicKeyFailed(errMesg):
            flag["pub"] = False
            print 'changePublicKey failed: %s' % errMesg

        aclClient.changePublicKey(loginSession, form.publickey.data)\
            .then(changePublicKeySuccess).catch(changePublicKeyFailed).wait()

        def changePrivateKeySuccess(a):
            flag["pri"] = True
            print 'changePrivateKey success'

        def changePrivateKeyFailed(errMesg):
            flag["pri"] = False
            print 'changePrivateKey failed: %s' % errMesg

        aclClient.changePrivateKey(loginSession, form.privatekey.data)\
            .then(changePrivateKeySuccess)\
            .catch(changePrivateKeyFailed).wait()
        if flag["pri"] and flag["pub"]:
            flash('Your publickey and privatekey have been saved.')
    return redirect(url_for('account'))

@app.route('/avatar/', methods=["POST","GET"])
@login_required
def avatar():
    user = dict()

    def myInformationSuccess(a):
        for k, v in a.items():
            user[k] = v
    
    def myInformationFailed(errMesg):
        print 'b'

    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")

    aclClient.myInformation(loginSession, [1])\
            .then(myInformationSuccess).catch(myInformationFailed).wait()

    form = AvatarForm()
    if form.validate_on_submit():
        filename = secure_filename(form.avatar.data.filename)
        form.avatar.data.save('myapp/static/upload/' + filename)
        userUpdate = dict()

        userUpdate[8] = '/static/upload/'+ filename
    
        def changeMyInformationSuccess(a):
            print a
    
        def changeMyInformationFailed(errMesg):
            print errMesg
        aclClient.changeMyInformation(loginSession, userUpdate)\
            .then(changeMyInformationSuccess).catch(changeMyInformationFailed).wait()
        flash('Your changes have been saved.')
    return redirect(url_for('user', nickname=user['name']))

@app.route('/admin/', methods=["POST","GET"])
@login_required
def admin():
    return render_template('admin.html')

@app.route('/getResources/', methods=["GET", "POST"])
@login_required
def getResources():
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def getResourcesSuccess(resources):
        data["data"] = []
        for res in resources:
            data["data"].append([res.id, res.name, res.resourceType, res.contentId, res.isGroup])
        data["flag"] = True

    def getResourcesFailed(errMsg):
        data["flag"] = False

    aclClient.getResources(loginSession).then(getResourcesSuccess).catch(getResourcesFailed).wait()
    return json.dumps(data)

@app.route('/getResourceTypes/', methods=["GET", "POST"])
@login_required
def getResourceType():
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def listResourceTypeSuccess(resourceTypes):
        data["data"] = []
        for resT in resourceTypes:
            data["data"].append([resT.id, resT.name, resT.description, resT.permissions])
        data["flag"] = True

    def listResourceTypeFailed(errMsg):
        data["flag"] = False

    aclClient.listResourceType(loginSession).then(listResourceTypeSuccess).catch(listResourceTypeFailed).wait()

    return json.dumps(data)

@app.route('/addResource/<data>', methods=["GET", "POST"])
@login_required
def addNewResource(data):
    a = json.loads(data)
    allType = {}

    def allTypeSuccess(v):
        for i in v:
            allType[i.name] = i.id
    
    def allTypeFailed(errMesg):
        print 'b'
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")

    aclClient.listResourceType(loginSession) \
        .then(allTypeSuccess).catch(allTypeFailed).wait()
    newId = {}
    
    def addResourceSuccess(id):
        newId[0]=id
        print 'addResource success: %d'%(id)
    
    def addResourceFailed( errMesg):
        print 'addResource  failed:%s'%(errMesg)

    aclClient.addResource(loginSession, allType[a[1]], a[0], a[2])\
            .then(addResourceSuccess).catch(addResourceFailed).wait()
    c = [newId[0], a[0], a[1], a[2]]
    b = json.dumps(c)
    print a
    return b


@app.route('/showUserInfo/<uid>', methods=["GET", "POST"])
@login_required
def showUserInfo(uid):
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def listUserSuccess(users):
        data["user"] = []
        for elem in users:
            data["user"].append([elem.avatar, elem.userId,
                                 elem.userName, elem.email,
                                 elem.phoneNumber, elem.description,
                                 elem.roleName])
            data["flag"] = False

    def listUserFailed(errMsg):
        data["flag"] = False
        print errMsg

    aclClient.listUser(loginSession,int(uid)).then(listUserSuccess).catch(listUserFailed).wait()

    return json.dumps(data)



@app.route('/showTypeInfo/<typeid>', methods=["GET", "POST"])
# # @login_required
def showTypeInfo(typeid):
    a = json.loads(typeid)
    c = ['1','syszhang', ['UseAcl', 'UserSec']]
    b=json.dumps(c)
    print a
    return b


@app.route('/listRoles/', methods=["GET", "POST"])
@login_required
def listRoles():
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def listRolesSuccess(roles):
        data["data"] = []
        for r in roles:
            data["data"].append([r.id, r.name, r.parents, map(lambda x:[x.id, x.name, x.resourceType, x.contentId, x.isGroup], r.resources)])
        data["flag"] = True

    def listRolesFailed(errMsg):
        data["flag"] = False

    aclClient.listRoles(loginSession).then(listRolesSuccess).catch(listRolesFailed).wait()
    return json.dumps(data)

@app.route('/addUser/<name>/<email>/<passwd>/<ownRole>', methods=["GET", "POST"])
@login_required
def addUser(name, email, passwd, ownRole):
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def addUserSuccess(userId):
        data["flag"] = True
        data["id"] = userId

    def addUserFailed(errMsg):
        data["flag"] = False
        print errMsg

    aclClient.addUser(loginSession, name, email, passwd, int(ownRole)).then(addUserSuccess).catch(addUserFailed).wait()

    return json.dumps(data)

@app.route('/deleteUser/<userId>', methods=["GET", "POST"])
@login_required
def deleteUser(userId):
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def deleteUserSuccess(message):
        data["flag"] = True
        print message

    def deleteUserFailed(errMsg):
        data["flag"] = False
        print errMsg

    aclClient.deleteUser(loginSession, int(userId)).then(deleteUserSuccess).catch(deleteUserFailed).wait()
    return json.dumps(data)

@app.route('/listUsers', methods=["GET", "POST"])
@login_required
def listUsersInAdmin():
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")

    data = {}

    data["flag"] = True

    def listRolesSuccess(roles):
        data["roles"] = []
        for r in roles:
            data["roles"].append([r.id, r.name, r.parents, map(lambda x:[x.id, x.name, x.resourceType, x.contentId, x.isGroup], r.resources)])

    def listRolesFailed(errMsg):
        data["flag"] = data["flag"] and False
        print errMsg

    def listUserSuccess(users):
        data["users"] = []
        for elem in users:
            data["users"].append([elem.userId, elem.userName, elem.email, elem.roleName])

    def listUserFailed(errMsg):
        data["flag"] = data["flag"] and False
        print errMsg

    aclClient.listRoles(loginSession).then(listRolesSuccess).catch(listRolesFailed).wait()
    aclClient.listUser(loginSession).then(listUserSuccess).catch(listUserFailed).wait()
    return json.dumps(data)

@app.route('/changeUserRole/<userId>/<roleId>', methods=["GET", "POST"])
@login_required
def changeUserRole(userId, roleId):
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    data = {}

    def changeUserRoleSuccess(message):
        data["flag"] = True
        print message

    def changeUserRoleFailed(errMsg):
        print errMsg
        data["flag"] = False

    aclClient.changeRoleOfUser(loginSession, int(userId), int(roleId)).then(changeUserRoleSuccess).catch(changeUserRoleFailed).wait()
    return json.dumps(data)

@app.route('/editRole/<resourceName>', methods=["GET", "POST"])
# # @login_required
def editRole(resourceName):
    a = json.loads(resourceName)
    c = [['aa', ['p11', 'p12', 'p13']], ['bb', ['p21','p22','p23']],['cc',['p31','p32','p33']]]
    b = json.dumps(c)
    return b


@app.route('/showRoleInfo/<roleid>' ,methods=["GET", "POST"])
# # @login_required
def showRoleInfo(roleid):
    a = json.loads(roleid)
    c = ['1','admin','sysacl',['add','del','sel']]
    b = json.dumps(c)
    return b

@app.route('/showResourceInfo/<resourceid>', methods=["GET", "POST"])
# # @login_required
def showResourceInfo(resourceid):
    a=json.loads(resourceid)
    c=['1','aclsystem','syszhang','100']
    b=json.dumps(c)
    return b

##############################################################################################
#
#Collection part
#
#
#############################################################################################
from typeconfig import ConvertTowebFormatJson,INPUTOBJECT21,INPUTOBJECT22
from . import app
import time
import json

def getdiff(a, b):
    return list(set(a).difference(set(b)))

@app.route("/collection/templates", methods=["GET", "POST"])
@login_required
def getAllTemplates():
    Annapurna = ConvertTowebFormatJson(INPUTOBJECT21)
    Annapurnatest = ConvertTowebFormatJson(INPUTOBJECT22)
    templates = {"signal": {"Annapurna":Annapurna, "Annapurnatest": Annapurnatest},
                 "strategy": {"Annapurna":Annapurna, "Annapurnatest": Annapurnatest}
                 }
    JsonDict = json.dumps(templates)
    return JsonDict

@app.route("/collection/gettemplate/<category>/<templName>/<templVersion>", methods=["GET", "POST"])
@login_required
def getTemplate(category,templName,templVersion):
    Annapurnatest = ConvertTowebFormatJson(INPUTOBJECT22)
    Annapurna = ConvertTowebFormatJson(INPUTOBJECT21)
    if templName == "Annapurna":
        return json.dumps(Annapurna)
    elif templName == "Annapurnatest":
        return json.dumps(Annapurnatest)


@app.route("/collection/reference/<data>", methods=["GET", "POST"])
@login_required
def getReference(data):
    refdata = {"market":["market1","market2","market3"],"strategy":["stagety1","stagety2","stagety3"]}
    return json.dumps(refdata[data])

@app.route("/collection/collectionList", methods=["GET", "POST"])
@login_required
def listCollection():
    global userClientBasket
    loginSession = userClientBasket.getClient(session, "session")
    configClient = userClientBasket.getClient(session, "configClient")

    categoryDict = {}

    def listSuccess(cateDict):
        temp = {}
        for k, val in cateDict.items():
            if not temp.has_key(k):
                temp[k] = []
            for x in val:
                temp[k].append([x.Name, x.Date, x.Version, x.TemplateName, x.Category])
        categoryDict["data"] = temp
        if not categoryDict["data"].has_key("signal"):
            categoryDict["data"]["signal"] = []
        if not categoryDict["data"].has_key("strategy"):
            categoryDict["data"]["strategy"] = []
        if not categoryDict["data"].has_key("market"):
            categoryDict["data"]["market"] = []

    def listFailed(errMsg):
        print errMsg
        categoryDict["data"] = False

    configClient.listCollections(loginSession).then(listSuccess).catch(listFailed).wait()
    if categoryDict['data']:
        return json.dumps(categoryDict["data"])
    else:
        emptyTree = {"signal":[], "strategy":[], "market":[]}
        return json.dumps(emptyTree)

@app.route("/collection/userList", methods=["GET", "POST"])
@login_required
def listUsers():
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")

    categoryDict = {}

    def listUsersSuccess(userList):
        for e in userList:
            categoryDict[e.userId] = e.userName

    def listUsersFailed(errMsg):
        print errMsg

    aclClient.listUser(loginSession).then(listUsersSuccess).catch(listUsersFailed).wait()
    return json.dumps(categoryDict)


@app.route("/collection/grantCollections/<userId>/<collectionList>", methods=["Get", "POST"])
@login_required
def grantCollectionToUser(userId, collectionList):
    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    configClient = userClientBasket.getClient(session, "configClient")
    collectionList = json.loads(collectionList)
    userId = int(userId)
    collectionList = map(lambda x:x.split("-"), collectionList)
    flag = {}

    def grantCollectionSuccess(Msg):
        flag["flag"] = True

    def grantCollectionFailed(errMsg):
        flag["flag"] = False

    Rsakey = {}

    def getOthersPublicKeySuccess(publicKey):
        Rsakey["othersPublicKey"] = publicKey
        flag["flag"] = True

    def getOthersPublicKeyFailed(errMsg):
        flag["flag"] = False

    aclClient.getPublicKey(loginSession, userId)\
        .then(getOthersPublicKeySuccess).catch(getOthersPublicKeyFailed).wait()

    user = {}

    def getInfoSuccess(info):
        for k, val in info.items():
            user[k] = val

    def getInfoFailed(Msg):
        print "Error:get public key failed!!!"

    aclClient.myInformation(loginSession, [6]). \
        then(getInfoSuccess).catch(getInfoFailed).wait()

    configClient.grantCollection(loginSession,
                                 userId,
                                 collectionList,
                                 user["private_key"],
                                 Rsakey["othersPublicKey"])\
        .then(grantCollectionSuccess)\
        .catch(grantCollectionFailed).wait()
    return json.dumps(flag)

@app.route("/collection/unGrantCollections/<userId>/<collectionList>", methods=["Get", "POST"])
@login_required
def unGrantCollectionOfUser(userId, collectionList):
    global userClientBasket
    loginSession = userClientBasket.getClient(session, "session")
    configClient = userClientBasket.getClient(session, "configClient")
    collectionList = json.loads(collectionList)
    userId = int(userId)

    def str2list(strli):
        return strli.split("-")
    collectionList = map(str2list, collectionList)
    flag = {}

    def ungrantCollectionSuccess(Msg):
        flag["flag"] = True

    def ungrantCollectionFailed(errMsg):
        flag["flag"] = False

    configClient.revokeCollection(loginSession, userId, collectionList)\
        .then(ungrantCollectionSuccess)\
        .catch(ungrantCollectionFailed).wait()
    return json.dumps(flag)

@app.route("/collection/deleteCollection/<data>", methods=["GET", "POST"])
@login_required
def deleteObjects(data):
    global userClientBasket
    loginSession = userClientBasket.getClient(session, "session")
    configClient = userClientBasket.getClient(session, "configClient")
    flag = {}

    def deleteObjectsSuccess(Msg):
        flag["flag"] = True

    def deleteObjectsFailed(errMsg):
        flag["flag"] = False

    data = json.loads(data)
    deleteList = [data[0].split("-")]
    configClient.deleteCollection(loginSession, deleteList).then(deleteObjectsSuccess).catch(deleteObjectsFailed).wait()
    return json.dumps(flag)

@app.route("/collection/saveCollection/<category>/<version>/<tmplName>/<colName>/<data>", methods=["GET", "POST"])
@login_required
def createCollection(category, version, tmplName, colName, data):
    if data is not None:
        global userClientBasket
        aclClient = userClientBasket.getClient(session, "aclClient")
        loginSession = userClientBasket.getClient(session, "session")
        configClient = userClientBasket.getClient(session, "configClient")
        Flag = {}
        curtDate = time.strftime("%Y%m%d", time.localtime())
        user = {}

        def getInfoSuccess(info):
            for k, val in info.items():
                user[k] = val

        def getInfoFailed(Msg):
            print "Error:get public key failed!!!"

        aclClient.myInformation(loginSession, [7]).\
            then(getInfoSuccess).catch(getInfoFailed).wait()
        
        def createCollectionSuccess(Msg):
            print Msg
            Flag["flag"] = True

        def createCollectionFailed(errMsg):
            print errMsg
            Flag["flag"] = False

        configClient.createCollection(loginSession, colName, curtDate, version, category, tmplName, data, user["public_key"])\
            .then(createCollectionSuccess)\
            .catch(createCollectionFailed).wait()
    return json.dumps(Flag)

@app.route("/collection/getCollection/<collectionList>", methods=["GET", "POST"])
@login_required
def getCollections(collectionList):

    global userClientBasket
    aclClient = userClientBasket.getClient(session, "aclClient")
    loginSession = userClientBasket.getClient(session, "session")
    configClient = userClientBasket.getClient(session, "configClient")

    collection = {}

    collectionList = json.loads(collectionList)
    collectionList = map(lambda x: x.split("-"), collectionList)

    user = {}

    def getInfoSuccess(info):
        for k, val in info.items():
            user[k] = val

    def getInfoFailed(Msg):
        print "Error:get public key failed!!!"

    aclClient.myInformation(loginSession, [6]).then(getInfoSuccess).catch(getInfoFailed).wait()

    readCollectionFlag = {}

    def getCollectionSuccess(Content):
        collection["data"] = Content
        readCollectionFlag["flag"] = True

    def getCollectionFailed(errMsg):
        readCollectionFlag["flag"] = False
        print errMsg

    configClient.getCollection(loginSession, collectionList, user["private_key"])\
        .then(getCollectionSuccess).catch(getCollectionFailed).wait()
    if readCollectionFlag["flag"]:
        data = sorted(collection["data"].iteritems(), key=lambda asd: asd[0], reverse=True)
        data = map(lambda x: json.loads(x[1]), data)

        return json.dumps(data[0])
    else:
        return json.dumps(readCollectionFlag)
