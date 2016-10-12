/**
 * Created by jiayun.wei on 9/30/16.
 */
function ListModel(items) {
    this._items = items;
    this.itemChanged = new Event(this);
}

ListModel.prototype = {
    getItems: function () {
        return this._items;
    },
    changeItems: function (item) {
        this._items = $.extend({},this._items,item);
        this.itemChanged.notify(item)
    }
};

function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    attach: function (listener) {
        this._listeners.push(listener)
    },
    notify: function (args) {
        var index;
        for(index = 0; index<this._listeners.length; index += 1){
            this._listeners[index](this._sender, args)
        }

    }
};

/**
 *JsonView
 * the viem will display the model data, and trigger the UI Event
 *
 */

function ListView(model, elemenets) {

    this._model = model;
    this._elements = elemenets;
    this.dataInputed = new Event(this);

    var _this = this;

    this._model.itemChanged.attach(function () {
        var arg = [];
        for(var elem in arguments[1]){
            arg.push(elem);
            arg.push(arguments[1][elem]);
        }
        _this.rebuildList(arg);
    });
    //bind to html
    var key;
    for(key in this._elements){
        if(key.match("string")){
            this._elements[key].keyup(function (event) {
                event.stopPropagation();
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }
        else if(key.match("enum")){
            this._elements[key].click(function (event) {
                var selectItem = $(event.target).text();
                var nameInfo = $(this).attr("box-info").split("-");
                $("#{0}enumSelect".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).val(selectItem);
                $("#{0}buttonValue".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).html(selectItem);
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }
        else if(key.match("boolean")){
            this._elements[key].click(function (event) {
                event.stopPropagation();
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }
        else if(key.match("mat")||key.match("list")){
            this._elements[key].change(function (event){
                event.stopPropagation();
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }


    }

}

ListView.prototype = {
    rebuildList: function (elem) {
        var nameInfo = elem[0].split("-");
        var mvchot,table,tr,td,currentContainerId;
        if(nameInfo[0] === "mat"||nameInfo[0] === "list"){
            currentContainerId = $("#{0}".format(nameInfo[1]+nameInfo[2])).eq(0).attr("handsontable-container-id");
            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
            tr = table.find("tbody").children().eq(nameInfo[3]);
            td = tr.children().eq(parseInt(nameInfo[4])+1).get(0);
            $(td).children().eq(0).val(JSON.stringify(elem[1]));
        }
        else {
            mvchot = configureObjectContext.getMainHandsonInst(nameInfo[1]);
            mvchot.setDataAtCell(parseInt(nameInfo[3]),parseInt(nameInfo[4]),elem[1]);
        }
        //do somthing when the model is changed!
     }
};
/**
 *View
 * the viem will display the model data, and trigger the UI Event
 *
 */

function JsonView(model, elemenets) {

    this._model = model;
    this._elements = elemenets;
    this.dataInputed = new Event(this);

    var _this = this;

    this._model.itemChanged.attach(function () {
        var arg = [];
        for(var elem in arguments[1]){
            arg.push(elem);
            arg.push(arguments[1][elem]);
        }
        _this.rebuildList(arg);
    });
    //bind to html
    var key;
    for(key in this._elements){
        if(key.match("string")){
            this._elements[key].keyup(function (event) {
                event.stopPropagation();
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }
        else if(key.match("enum")){
            this._elements[key].click(function (event) {
                var selectItem = $(event.target).text();
                var nameInfo = $(this).attr("box-info").split("-");
                $("#{0}enumSelect".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).val(selectItem);
                $("#{0}buttonValue".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).html(selectItem);
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }
        else if(key.match("boolean")){
            this._elements[key].click(function (event) {
                event.stopPropagation();
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }
        else if(key.match("mat")||key.match("list")){
            this._elements[key].change(function (event){
                event.stopPropagation();
                _this.dataInputed.notify({item:$(this).attr("box-info")});
            });
        }


    }

}

JsonView.prototype = {
    rebuildList: function (elem) {
        var nameInfo = elem[0].split("-");
        var mvchot,table,tr,td,currentContainerId;
        if(nameInfo[0] === "mat"||nameInfo[0] === "list"){
            currentContainerId = $("#{0}".format(nameInfo[1]+nameInfo[2])).eq(0).attr("handsontable-container-id");
            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
            tr = table.find("tbody").children().eq(nameInfo[3]);
            td = tr.children().eq(parseInt(nameInfo[4])+1).get(0);
            $(td).children().eq(0).val(JSON.stringify(elem[1]));
        }
        else {
            mvchot = configureObjectContext.getMainHandsonInst(nameInfo[1]);
            mvchot.setDataAtCell(parseInt(nameInfo[3]),parseInt(nameInfo[4]),elem[1]);
        }
        //do somthing when the model is changed!
     }
};


/**
 * Controller
 * the controller will response the user's operation, and callback changed functions of Model
 */

function ListController(model,view) {
    this._model = model;
    this._veiw = view;
    var _this = this;
    this._veiw.dataInputed.attach(function () {
        _this.changeItems(arguments[1]);
    });
}

ListController.prototype = {
    changeItems: function (obj) {
        var nameInfo,value,temp={},table,tbody,td,tr,theader,headName;
        nameInfo = obj.item.split("-");
        if(obj.item.match("string")){
            value = $("#"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]).text();
            if(value){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp);
            }
        }
        else if(obj.item.match("enum")){
            value = $("#"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]+"enumSelect").val();
            if(value){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp);
            }
        }
        else if(obj.item.match("boolean")){
            value = $("#m"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]).get(0).checked;
            if(value != null && value != undefined){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp);
            }
        }
        else if(obj.item.match("mat")){
            table = $("#{0}matrix".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).find("table.htCore").eq(0);
            tbody = table.children().eq(2);
            var tmplist = [];
            var bodyDataList = [];
            var rowlen = tbody.eq(0).children().size();
            var collen = tbody.eq(0).children().eq(0).children().size();
            for( var ti=0;ti<rowlen;ti++ ){
                tmplist = [];
                for ( var tj=1;tj<collen;tj++){
                    tmplist.push( tbody.eq(0).children().eq(ti).children().eq(tj).eq(0).html());
                }
                bodyDataList.push(tmplist);
            }
            value = bodyDataList;
            if(value != null && value != undefined){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp);
            }
        }
        else if(obj.item.match("list")){
            table = $("#{0}".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).find("table.htCore").eq(0);
            theader = table.children().eq(1);
            tbody = table.children().eq(2);
            var bodyDict = {};
            bodyDataList = [];
            var tdvalue = "";
            rowlen = tbody.eq(0).children().size();
            collen = tbody.eq(0).children().eq(0).children().size();
            for(ti=0;ti<rowlen;ti++ ){
                bodyDict = {};
                for (tj=1;tj<collen;tj++){
                    headName = theader.eq(0).children().eq(0).children().eq(tj).find("span.colHeader").eq(0).html();
                    tdvalue = tbody.children().eq(ti).children().eq(tj).eq(0).html();
                    bodyDict[headName] = tdvalue;
                }
                bodyDataList.push(bodyDict);
            }
            temp[obj.item] = bodyDataList;
            this._model.changeItems(temp);
            }
        }
};

