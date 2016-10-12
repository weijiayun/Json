#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template
from typeconfig import ConvertTowebFormatJson,INPUTOBJECT21,INPUTOBJECT22
from . import app
import time
import json
from configureService.configureObject.ConfigureObjectClient import ConfigureObjectClient
from configureService.acl.ACLClient import ACLClient


def getdiff(a, b):
    return list(set(a).difference(set(b)))

@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route("/templates", methods=["GET","POST"])
def getAllTemplates():
    Annapurna = ConvertTowebFormatJson(INPUTOBJECT21)
    Annapurnatest = ConvertTowebFormatJson(INPUTOBJECT22)
    JsonDict = json.dumps({"Annapurna":Annapurna, "Annapurnatest":Annapurnatest})
    return JsonDict

@app.route("/gettemplate/<category>/<templName>/<templVersion>", methods=["GET","POST"])
def getTemplate(category,templName,templVersion):
    Annapurnatest = ConvertTowebFormatJson(INPUTOBJECT22)
    Annapurna = ConvertTowebFormatJson(INPUTOBJECT21)
    if templName == "Annapurna":
        return json.dumps(Annapurna)
    elif templName == "Annapurnatest":
        return json.dumps(Annapurnatest)


@app.route("/reference/<data>", methods=["GET","POST"])
def getReference(data):
    refdata = {"market":["market1","market2","market3"],"strategy":["stagety1","stagety2","stagety3"]}
    return json.dumps(refdata[data])

@app.route("/objectList", methods=["GET", "POST"])
def listObjects():
    aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
    session = aclClient.login("aa", "1231")
    categoryDict = {}

    def listObjectSuccess(cateDict):
        categoryDict["data"] = cateDict

    def listObjectFailed(errMsg):
        print errMsg

    configClient.listObjects(session).then(listObjectSuccess).catch(listObjectFailed).wait()
    return json.dumps(categoryDict["data"])

@app.route("/userList", methods=["GET", "POST"])
def listUsers():
    aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    session = aclClient.login("aa", "1231")
    categoryDict = {}

    def listUsersSuccess(userList):
        for e in userList:
            categoryDict[e.userId] = e.userName

    def listUsersFailed(errMsg):
        print errMsg

    aclClient.listUser(session).then(listUsersSuccess).catch(listUsersFailed).wait()
    return json.dumps(categoryDict)


@app.route("/grantCollections/<userId>/<objectList>", methods=["Get", "POST"])
def grantCollectionToUser(userId, objectList):
    objectList = json.loads(objectList)
    userId = int(userId)
    objectList = map(lambda x:x.split("-"), objectList)
    aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
    session = aclClient.login("aa", "1231")
    flag = {}

    def grantCollectionSuccess(Msg):
        flag["flag"] = True

    def grantCollectionFailed(errMsg):
        flag["flag"] = False

    configClient.grantObjectsToOthers(session, userId, objectList)\
        .then(grantCollectionSuccess)\
        .catch(grantCollectionFailed).wait()
    return json.dumps(flag)

@app.route("/unGrantCollections/<userId>/<objectList>", methods=["Get", "POST"])
def unGrantCollectionOfUser(userId, objectList):
    objectList = json.loads(objectList)
    userId = int(userId)

    def str2list(strli):
        return strli.split("-")
    objectList = map(str2list, objectList)
    aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
    session = aclClient.login("aa", "1231")
    flag = {}

    def ungrantCollectionSuccess(Msg):
        flag["flag"] = True

    def ungrantCollectionFailed(errMsg):
        flag["flag"] = False

    configClient.unGrantObjectsOfOthers(session, userId, objectList)\
        .then(ungrantCollectionSuccess)\
        .catch(ungrantCollectionFailed).wait()
    return json.dumps(flag)


@app.route("/deleteObjects/<data>", methods=["GET", "POST"])
def deleteObjects(data):
    aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
    session = aclClient.login("aa", "1231")
    flag = {}

    def deleteObjectsSuccess(Msg):
        flag["flag"] = True

    def deleteObjectsFailed(errMsg):
        flag["flag"] = False

    data = json.loads(data)
    deleteList = map(lambda x:x.split("-"), data)
    configClient.deleteObject(session, deleteList).then(deleteObjectsSuccess).catch(deleteObjectsFailed).wait()
    return json.dumps(flag)

@app.route("/saveCollection/<category>/<version>/<tmplName>/<colName>/<data>", methods=["GET","POST"])
def createCollection(category, version, tmplName, colName, data):
    if data is not None:
        Flag = {}
        aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
        configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
        session = aclClient.login("aa", "1231")
        data = json.loads(data)
        objectList = []
        curtDate = time.strftime("%Y%m%d", time.localtime())
        for elem in data:
            temp = []
            temp.append(elem["name"])
            temp.append(curtDate)
            temp.append(version)
            temp.append(category)
            temp.append(tmplName)
            temp.append(colName)
            temp.append(json.dumps(elem))
            objectList.append(temp)

        def createCollectionSuccess(Msg):
            print Msg
            Flag["flag"] = True

        def createCollectionFailed(errMsg):
            print errMsg
            Flag["flag"] = False
        configClient.createObject(session, objectList)\
            .then(createCollectionSuccess)\
            .catch(createCollectionFailed).wait()

    return json.dumps(Flag)

@app.route("/getObjects/<objectList>", methods=["GET", "POST"])
def getObjects(objectList):
    aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
    session = aclClient.login("aa", "1231")
    collection = {}

    objectList = json.loads(objectList)
    objectList = map(lambda x: x.split("-"), objectList)

    def getCollectionSuccess(Content):
        collection["data"] = Content

    def getCollectionFailed(errMsg):
        print errMsg

    configClient.getObjects(session, objectList).then(getCollectionSuccess).catch(getCollectionFailed).wait()
    data = sorted(collection["data"].iteritems(), key=lambda asd: asd[0], reverse=True)
    data = map(lambda x: json.loads(x[1]), data)

    return json.dumps(data)




