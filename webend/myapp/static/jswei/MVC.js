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
    changeItems: function (item,VIEW) {
        this._items = $.extend({},this._items,item);
        this.itemChanged.notify(item,VIEW)
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
    notify: function (args,VIEW) {
        for(var index = 0; index<this._listeners.length; index += 1){
            var whichView = this._listeners[index].toString().match(/VIEW\s*=\s*"([^;]*)"/);
            whichView = whichView?whichView[1]:null;
            if(whichView == VIEW || whichView == null){
                this._listeners[index](this._sender, args)
            }
        }
    }
};

/**
 *JsonView
 * the viem will display the model data, and trigger the UI Event
 *
 */

function ListView(model, elemenets,currentRowIndex) {

    this._model = model;
    this._elements = elemenets;
    this._currentRowIndex = currentRowIndex;
    this.dataInputed = new Event(this);

    var _this = this;

    this._model.itemChanged.attach(function () {
        var arg = [];
        var VIEW = "ListView";
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
                //event.stopPropagation();
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
            this._elements[key].keyup(function (event){
                var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
                var keycodes = new Set([48,49,50,51,52,53,54,55,56,57,59,190]);
                if(keycodes.has(keyCode)){

                    _this.dataInputed.notify({item:$(this).attr("box-info")});
                }

            });
        }


    }

}

ListView.prototype = {
    rebuildList: function (elem) {
        var nameInfo = elem[0].split("-");
        var $imgItem,canvas,ctx,data;
        var mvchot,table,tr,td,currentContainerId;
        var modeldata = this._model._items[elem[0]];
        if(nameInfo[0] === "mat"){
            currentContainerId = $("#{0}".format(nameInfo[1]+nameInfo[2])).eq(0).attr("handsontable-container-id");
            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
            tr = table.find("tbody").children().eq(nameInfo[3]);
            td = tr.children().eq(parseInt(nameInfo[4])+1).get(0);
            $imgItem = $(td).children().eq(0);
            $imgItem.val(JSON.stringify(modeldata));
            canvas = document.createElement("canvas");
            ctx =  canvas.getContext("2d");
            configureObjectContext.descriptScaledView(ctx,modeldata);
            $imgItem.height($(td).height());
            $imgItem.width($(td).width());
            $imgItem.attr("src", canvas.toDataURL());
        }
        else if(nameInfo[0] === "list"){
            currentContainerId = $("#{0}".format(nameInfo[1]+nameInfo[2])).eq(0).attr("handsontable-container-id");
            table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
            tr = table.find("tbody").children().eq(nameInfo[3]);
            td = tr.children().eq(parseInt(nameInfo[4])+1).get(0);
            $imgItem = $(td).children().eq(0);
            $imgItem.val(JSON.stringify(modeldata));
            canvas = document.createElement("canvas");
            ctx =  canvas.getContext("2d");
            var dataList = JSON.parse($imgItem.attr("data-colNamesList"));
            data = [];
            for(var i=0;i<modeldata[dataList[0]].length;i++){
                var temp = [];
                for(var j=0;j<dataList.length;j++ ){
                    temp.push(modeldata[dataList[j]][i]);
                }
                data.push(temp);
            }
            configureObjectContext.descriptScaledView(ctx,data);
            $imgItem.height($(td).height());
            $imgItem.width($(td).width());
            $imgItem.attr("src", canvas.toDataURL());
        }
        else {
            mvchot = configureObjectContext.getMainHandsonInst(nameInfo[1]);
            mvchot.setDataAtCell(parseInt(nameInfo[3]),parseInt(nameInfo[4]),modeldata);
        }
        //do somthing when the model is changed!
     }
};
function TblView(model,TAB,Struct,currentRowIndex) {

    this._model = model;
    this.dataInputed = new Event(this);
    this._TAB = TAB;
    this._Struct = Struct;
    this._currentRowIndex = currentRowIndex;

    var _this = this;
    this._model.itemChanged.attach(function () {
        var arg = [];
        var VIEW = "TblView";
        for(var elem in arguments[1]){
            arg.push(elem);
            arg.push(arguments[1][elem]);
        }
        _this.rebuildList(arg,_this._TAB);
    });
    //bind to html

    var mainHotInst = configureObjectContext.getMainHandsonInst(_this._TAB);
    var $checkbox = $(mainHotInst.table).find("td.current.highlight").parent().find("input.htCheckboxRendererInput");
    var $matrix = $(mainHotInst.table).find("td.current.highlight").parent().find("img.Matrix");
    var $list = $(mainHotInst.table).find("td.current.highlight").parent().find("img.List");
    var $container = $("#"+_this._TAB+"loadlog");

    $container.get(0).addEventListener("keyup",function (event) {
        var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
        var keycodes = Set([48,49,50,51,52,53,54,55,56,57,59,190]);
        var mainHotInst = configureObjectContext.getMainHandsonInst(_this._TAB);
        var $td = $(mainHotInst.table).find("td.highlight.current");
        var header = mainHotInst.getColHeader($td.index() - 1);
        var colIndex = $td.index() - 1;
        var rowIndex = $td.parent().index();
        if(mainHotInst.getCellEditor(rowIndex,colIndex).name !== "DropdownEditor") {
            _this.dataInputed.notify({item: "string" + "-" + _this._TAB + "-" + _this._Struct + "-" + rowIndex + "-" + colIndex + "-" + header});
        }
    },true);
    $container.get(0).addEventListener("blur",function (e) {
        var mainHotInst = configureObjectContext.getMainHandsonInst(_this._TAB);
        var $td = $(mainHotInst.table).find("td.highlight.current");
        var header = mainHotInst.getColHeader($td.index()-1);
        var colIndex = $td.index()-1;
        var rowIndex = $td.parent().index();
        if(mainHotInst.getCellEditor(rowIndex,colIndex).name === "DropdownEditor"){
            _this.dataInputed.notify({
                item:"enum"+"-"+_this._TAB+"-"+_this._Struct+"-"+rowIndex+"-"+colIndex+"-"+header,
                selectedItem:e.explicitOriginalTarget.data
            });
        }
    },true);
    $container.get(0).addEventListener("change",function () {
        var mainHotInst = configureObjectContext.getMainHandsonInst(_this._TAB);
        var $td = $(mainHotInst.table).find("td.highlight.current");
        var header = mainHotInst.getColHeader($td.index()-1);
        var colIndex = $td.index()-1;
        var rowIndex = $td.parent().index();
        if(mainHotInst.getCellEditor(rowIndex,colIndex).name !== "DropdownEditor") {
            _this.dataInputed.notify({item: "string" + "-" + _this._TAB + "-" + _this._Struct + "-" + rowIndex + "-" + colIndex + "-" + header});
        }
    },true);

    $checkbox.parent().on("click",function (event) {
        event.stopPropagation();
        var mainHotInst = configureObjectContext.getMainHandsonInst(_this._TAB);
        var $td = $(mainHotInst.table).find("td.highlight.current");
        var header = mainHotInst.getColHeader($td.index()-1);
        var colIndex = $td.index()-1;
        var rowIndex = $td.parent().index();
        _this.dataInputed.notify({item:"boolean"+"-"+_this._TAB+"-"+_this._Struct+"-"+rowIndex+"-"+colIndex+"-"+header});
    });
    $matrix.on("click",function (event) {
        event.stopPropagation();
        var prop = $(this).attr("data-Prop");
        var row = $(this).attr("data-Rows");
        var col = $(this).attr("data-Cols");
        $("#popupContent").find("div.handsontable.Matrix").on("keyup",function (event) {
            event.stopPropagation();
            _this.dataInputed.notify({item:"mat"+"-"+_this._TAB+"-"+_this._Struct+"-"+row+"-"+col+"-"+prop});
        })
    });
    $list.on("click",function (event) {
        event.stopPropagation();
        var prop = $(this).attr("data-Prop");
        var row = $(this).attr("data-Rows");
        var col = $(this).attr("data-Cols");
        $("#popupContent").find("div.handsontable.List").on("keyup",function (event) {
            event.stopPropagation();
            _this.dataInputed.notify({item:"list"+"-"+_this._TAB+"-"+_this._Struct+"-"+row+"-"+col+"-"+prop});
        })
    })
}
TblView.prototype = {
    rebuildList: function (elem) {
        var nameInfo = elem[0].split("-");
        var colIndex = nameInfo[4],hotInstance;
        var modeldata = this._model._items[elem[0]];
        var $jsonTree = $("div.json-right-tree."+nameInfo[1]).find("ul.jsoneditor");
        if(nameInfo[3] == this._currentRowIndex){
            if(nameInfo[0] === 'string'){
                $jsonTree.children().eq(colIndex).find("td.jsoneditor-text").html(modeldata);
            }
            else if(nameInfo[0] === "enum"){
                $jsonTree.children().eq(colIndex).find("span.jsoneditor-text").html(modeldata);
            }
            else if(nameInfo[0] === 'boolean'){
                $jsonTree.children().eq(colIndex).find("input").eq(0).get(0).checked = modeldata;
                $jsonTree.children().eq(colIndex).find("span.boolResult").html(modeldata);
            }
            else if(nameInfo[0] === "mat"){
                hotInstance = $("#"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]+"matrix").handsontable("getInstance");
                hotInstance.loadData(modeldata);
            }
            else if(nameInfo[0] === "list"){
                hotInstance = $("#"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]).handsontable("getInstance");
                hotInstance.loadData(modeldata);
            }
        }
        $("div.wtHolder").css("height","auto");
        //do somthing when the model is changed!
     }
};

function ListController(model,view,tblView) {
    this._model = model;
    this._view = view;
    this._tblview = tblView;
    var _this = this;
    this._view.dataInputed.attach(function () {
        _this.changeItems(arguments[1]);
    });

    this._tblview.dataInputed.attach(function () {
        _this.changeTblItems(arguments[1]);
    });
}

ListController.prototype = {
    changeItems: function (obj) {
        $("div.wtHolder").css("height","auto");
        var VIEW = "ListView";
        var nameInfo,value,temp={},data, hotInstance,activeEditor;
        nameInfo = obj.item.split("-");
        if(nameInfo[0] === "string"){
            value = $("#"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]).text();
            if(value){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "enum"){
            value = $("#"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]+"enumSelect").val();
            if(value){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "boolean"){
            value = $("#m"+nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1]).get(0).checked;
            if(value != null && value != undefined){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "mat"){
            hotInstance = $("#{0}matrix".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).handsontable("getInstance");
            activeEditor = hotInstance.getActiveEditor();
            data = hotInstance.getData();
            data[activeEditor.row][activeEditor.col] = $(activeEditor.TEXTAREA).val();
            if(data){
                temp = {};
                temp[obj.item] = data;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "list"){
            hotInstance = $("#{0}".format(nameInfo[1]+nameInfo[2]+nameInfo[nameInfo.length-1])).handsontable("getInstance");
            var activeEditor1 = hotInstance.getActiveEditor();
            temp = {};
            data = {};
            var col = hotInstance.countCols();
            for(var i=0;i<col;i++){
                data[hotInstance.getColHeader(i)] = hotInstance.getDataAtCol(i)
            }
            data[activeEditor1.prop][activeEditor1.row] = $(activeEditor1.TEXTAREA).val();
            if(data){
                temp = {};
                temp[obj.item] = data;
                this._model.changeItems(temp, VIEW);
            }
        }
    },
    changeTblItems:function (obj) {
        $("div.wtHolder").css("height","auto");
        var VIEW = "TblView";
        var value,hotInstance,data,temp={};
        var mainHotInst = configureObjectContext.getMainHandsonInst(this._tblview._TAB);
        var activeEditor = mainHotInst.getActiveEditor();
        var nameInfo = obj.item.split("-");
        if(nameInfo[0] === "string"){
            value = $(activeEditor.TEXTAREA).val();
            if(value){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "enum"){
            value = obj.selectedItem;
            if(value){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "boolean"){
            value = !activeEditor.originalValue;
            if(value != null){
                temp = {};
                temp[obj.item] = value;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "mat"){
            hotInstance = $("#popupContent").children().eq(0).handsontable("getInstance");
            activeEditor = hotInstance.getActiveEditor();
            data = hotInstance.getData();
            data[activeEditor.row][activeEditor.col] = $(activeEditor.TEXTAREA).val();
            if(data){
                temp = {};
                temp[obj.item] = data;
                this._model.changeItems(temp, VIEW);
            }
        }
        else if(nameInfo[0] === "list"){
            hotInstance = $("#popupContent").children().eq(0).handsontable("getInstance");
            activeEditor = hotInstance.getActiveEditor();
            temp = {};
            data = {};
            var col = hotInstance.countCols();
            for(var i=0;i<col;i++){
                data[hotInstance.getColHeader(i)] = hotInstance.getDataAtCol(i)
            }
            data[activeEditor.prop][activeEditor.row] = $(activeEditor.TEXTAREA).val();
            if(data){
                temp = {};
                temp[obj.item] = data;
                this._model.changeItems(temp, VIEW);
            }
        }
    }
};

