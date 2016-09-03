#!/opt/Apps/local/Python/anaconda/bin/python2.7
__author__ = 'jiayun.wei'
from flask import render_template
from typeconfig import INPUTOBJECT2,ConvertTowebFormatJson
from . import app
from datetime import datetime
import json
# from configureService.configureObject.ConfigureObjectClient import ConfigureObjectClient
# from configureService.acl.ACLClient import ACLClient


def getdiff(a, b):
    return list(set(a).difference(set(b)))

@app.route('/', methods=["GET","POST"])
def index():
    newInput = ConvertTowebFormatJson(INPUTOBJECT2)
    JsonDict = json.dumps({"REFLIST": ["Annapurna", "Annapurnatest"], "REFERENCES": newInput})
    # if request.method == "POST":
    #     if len(StructName) == 0:
    #         print request.form["SubmitAllInput"]
    #     else:
    #         print request.form["{0}input".format(StructName)]
    #     return redirect(url_for('index'))

    return render_template('index.html', JsonDict=JsonDict,)

@app.route("/reference/<type>",methods=["GET","POST"])
def ref(type):
    refdata = {"market":["market1","market2","market3"],"strategy":["stagety1","stagety2","stagety3"]}
    return json.dumps(refdata[type])

@app.route("/objectList", methods=["GET", "POST"])
def getobjects():
    # aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
    # configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
    # session = aclClient.login("aa", "1231")
    # categoryDict = {}
    # def listObjectSuccess(cateDict):
    #     categoryDict["Category"] = cateDict
    #
    # def listObjectFailed(errMsg):
    #     print errMsg
    #
    # configClient.listObjects(session).then(listObjectSuccess).catch(listObjectFailed).wait()
    categoryDict = {}
    categoryDict = {
        "strategy":{
            "stcol11": ["sobj1", "obj2", "obj3"],
            "stcol12": ["sobj1", "obj2", "obj3"],
            "stcol13": ["sobj1", "obj2", "obj3"],
            "stcol14": ["siobj1", "obj2", "obj3"]
        },
        "signal": {
            "sicol11": ["siobj1", "obj2", "obj3"],
            "sicol12": ["siobj1", "obj2", "obj3"],

        },
        "market": {
            "mcol11": ["mobj1", "obj2", "obj3"],
            "mcol12": ["mobj1", "obj2", "obj3"],
            "mcol13": ["mobj1", "obj2", "obj3"]
        }
    }
    # a = sorted(categoryDict.iteritems(), key=lambda asd: asd[0], reverse=False)
    return json.dumps(categoryDict)

@app.route("/configureList", methods=["GET", "POST"])
def getconfigures():

    refdata = ["2016-08-11-v0.1","2016-08-11-v0.2","2016-08-11-v0.3","2016-08-11-v0.4","2016-08-11-v0.5",
               "2016-08-12-v0.1", "2016-08-12-v0.2", "2016-08-12-v0.3", "2016-08-12-v0.4", "2016-08-12-v0.5",
               "2016-08-13-v0.1", "2016-08-13-v0.2", "2016-08-13-v0.3"]
    return json.dumps(refdata)



@app.route("/saveObject/<data>",methods=["POST"])
def createObject(data):
    if data is not None:
        data = json.loads(data)
        objectName = data[0]
        #need to know about api from Yang
        print data
        return "True"
    else:
        return False

@app.route("/saveCollection/<data>", methods=["POST"])
def createCollection(data):
    if data is not None:
        data = json.loads(data)

        def str2list(strli):
            return strli.split("-")

        collectionName = data[0]
        objectNameList = map(str2list, data[1])
        aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
        configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
        session = aclClient.login("aa", "1231")
        flag = set()

        def createCollectionSuccess(Msg):
            print Msg
            flag.add(True)

        def createCollectionFailed(errMsg):
            print errMsg
            flag.add(True)

        configClient.addObjectListToCollection(session, objectNameList, collectionName)\
            .then(createCollectionSuccess).catch(createCollectionFailed).wait()
        if list(flag)[0]:
            return "True"
        else:
            return "False"


@app.route("/saveConfigure/<data>", methods=["POST"])
def createConfigure(data):
    if data is not None:
        data = json.loads(data)
        # version = data[0]
        # createDate = str(datetime.today())[0:10]
        # objectNameList = data[1]
        #
        # def str2list(strli):
        #     return strli.split("-")
        #
        # collectionName = data[0]
        # objectNameList = map(str2list, data[1])
        # aclClient = ACLClient(app.proto, app.pea.customHandle, 609)
        # configClient = ConfigureObjectClient(app.proto, app.pea.customHandle, 612)
        # session = aclClient.login("aa", "1231")
        # flag = set()
        #
        # def createCollectionSuccess(Msg):
        #     print Msg
        #     flag.add(True)
        #
        # def createCollectionFailed(errMsg):
        #     print errMsg
        #     flag.add(True)
        #
        # configClient.createConfigure(session, , collectionName) \
        #     .then(createCollectionSuccess).catch(createCollectionFailed).wait()
        #
        # if list(flag)[0]:
        #     return "True"
        # else:
        #     return "False"



@app.route("/saveGrid/<data>",methods=["POST"])
def createGrid(data):
    data = json.loads(data)
    gridName = data[0]
    configureList = data[1]
    print data
    return "True"





