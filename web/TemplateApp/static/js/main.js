/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    load:TypesTemplate,
    load2:HtmlExcelAll
};

function HtmlExcelAll(TemplatesUnitIdPrefix) {
    TemplatesUnitIdPrefix = "HandsontableMain";
    var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
    var mainTableId = "loadlog";
    $("#loadlog").eq(0).attr("handsontable-container-id",mainTableId);
    var ColumsAttr = [];
    var container1;
    var searchFiled = document.getElementById('search_field');
    var resultCount = document.getElementById('resultCount');
    ColumsAttr=getColumsAttrs(StrategyList[0]);
    container1 = document.getElementById('loadlog');
    function expandMatrix(instance, td, row, col, prop, value, cellProperties) {
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        var currentRowindex = $(".currentRow").eq(0).parent().index();
        if($(td).parent().index() != currentRowindex){
            if($(td).children().length==0) {
                $(td).html("<button  onclick='MatButton(this)'>{0}</button>".format(prop));
                $(td).children().eq(0).attr("data-dimensionRows", ColumsAttr[3][prop].DimensionY);
                $(td).children().eq(0).attr("data-dimensionCols", ColumsAttr[3][prop].DimensionX);
                $(td).children().eq(0).attr("data-type","MATRIX");
                $(td).children().eq(0).attr("data-Rows", row);
                $(td).children().eq(0).attr("data-Cols", col);
                $(td).children().eq(0).attr("data-Prop", prop);
            }
                var a3 = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).val();
                $(td).children().eq(0).val(a3);
            }
    }
    function expandList(instance, td, row, col, prop, value, cellProperties) {
        var currentRowindex = $(".currentRow").eq(0).parent().index();
        if($(td).parent().index() != currentRowindex){
            if($(td).children().length==0) {
                $(td).html("<button  onclick='ListButton(this)'>{0}</button>".format(prop));
                $(td).children().eq(0).attr("data-colNamesList",JSON.stringify(Object.getOwnPropertyNames(ColumsAttr[2][prop])));
                $(td).children().eq(0).attr("data-Rows", row);
                $(td).children().eq(0).attr("data-Cols", col);
                $(td).children().eq(0).attr("data-Prop", prop);
                $(td).children().eq(0).attr("data-type","LIST");
            }
                var a3 = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).val();
                $(td).children().eq(0).val(a3);
            }
    }
    function expandMultiRefList(instance,td,row,col,prop,value,cellProperties) {
        var currentRowindex = $(".currentRow").eq(0).parent().index();
        if($(td).parent().index() != currentRowindex){
            if($(td).children().length==0) {
                var refhtml = "<select id='{0}{1}{2}refSelect' class='selectResult' multiple='multiple' size='2'>".format(TemplatesUnitIdPrefix,row,col);
                for( var e in ColumsAttr[2][prop]){
                    refhtml += "<option value='{0}'>{0}</option>".format(ColumsAttr[2][prop][e])
                }
                refhtml += "</select>";
                $(td).html(refhtml);
                $("#{0}{1}{2}refSelect".format(TemplatesUnitIdPrefix,row,col)).multiselect({
                    noneSelectedText:"---select---",
                    checkAllText: "all",
                    uncheckAllText: 'none',
                    selectedList:1
                }).multiselectfilter({
                    label:"Search: ",
                    width:130,
                    height:25
                }).on("multiselectclick",function (event, ui) {
                    var result = $(this).multiselect("getChecked").map(function () {
                        return this.value;
                    }).get();
                    $(this).attr("data-select",JSON.stringify(result));
                    
                }).bind("multiselectbeforeopen",function () {
                    $(this).multiselect("setChecked");
                });
                $(td).children().eq(0).attr("data-Rows", row);
                $(td).children().eq(0).attr("data-Cols", col);
                $(td).children().eq(0).attr("data-Prop", prop);
                $(td).children().eq(0).attr("data-local-list",JSON.stringify(ColumsAttr[2][prop]));
                $(td).children().eq(0).attr("data-type","REFLIST");
            }
            if($(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).attr("data-select")) {
                var temp = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).attr("data-select")
                $(td).find("select").attr("data-select",temp)
            }
        }
    }
    Handsontable.renderers.registerRenderer('expandMatrix', expandMatrix);
    Handsontable.renderers.registerRenderer('expandList', expandList);
    Handsontable.renderers.registerRenderer('expandMultiRefList',expandMultiRefList);
    app[mainTableId] = new Handsontable(container1, {
        data: ColumsAttr[2],
        colHeaders: ColumsAttr[0],
        columns:ColumsAttr[1],
        manualColumnMove: true,
        manualRowMove: true,
        manualColumnResize: true,
        manualRowResize: true,
        rowHeaders:true,
        //fixedColumnsLeft: 2,
        colHeights:100,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        //colHeaders: true,
        //minSpareRows: 1,
        startRows:1,
        stretchH: 'all',
        cells:function (row, col, prop) {
            var cellProperties = {};
            if(!ColumsAttr[3][prop].Reference){
                if (ColumsAttr[3][prop].Type === 'mat' || ColumsAttr[3][prop].Type === 'vec') {
                    cellProperties.renderer = "expandMatrix";
                }
                else if (ColumsAttr[3][prop].Type === "list") {
                    cellProperties.renderer = "expandList";
                }
                
            }
            else{
                if (ColumsAttr[3][prop].Type === "list") {
                    cellProperties.renderer = "expandMultiRefList";
                }
            }
            return cellProperties;
        }
    });
  var searchResultCount = 0;

  var searchResultCounter = function (instance, row, col, value, result) {

      Handsontable.Search.DEFAULT_CALLBACK.apply(this, arguments);
      if (result) {
          searchResultCount++;
      }
  };
    app[mainTableId].updateSettings({
        search:{
            callback:searchResultCounter
        },
        contextMenu: {
            callback: function (key, options) {
                if (key === 'json') {
                    var curRowDataDict = turnRowToJson(StrategyList[0]);
                }
            },
            items: {
                "row_above": {},
                "row_below": {},
                "hsep1":"---------",
                "undo":{},
                "redo":{},
                "hsep2":"---------",
                "alignment":{},
                "clear_column":{},
                "remove_row":{
                    name:"remove this row!",
                    disabled:function () {
                        return (app[mainTableId].getSelected() && app[mainTableId].getSelected()[0] === 0)
                    }
                },
                "hsep3":"---------",
                "json":{name:"Trun row to Json"}
            }

        }
    });

    Handsontable.Dom.addEvent(searchFiled, 'keyup', function (event) {
        searchResultCount = 0;
        var queryResult = app[mainTableId].search.query(this.value);
        resultCount.innerHTML = searchResultCount.toString();
        app[mainTableId].render();
    });

}

function MatButton(field) {
    var hot,container0,container,data1;
    container0 = document.getElementById('bodymodal');
    $(container0).children().remove();
    $(container0).append("<div class='handsontable htRowHeaders htColumnHeaders'></div>");
    container = $(container0).children().get(0);
    var rowlen = parseInt($(field).attr("data-dimensionRows"));
    var collen = parseInt($(field).attr("data-dimensionCols"));
    var rowindex = parseInt($(field).attr("data-Rows"));
    var colindex = parseInt($(field).attr("data-Cols"));
    var colHeader = $(field).attr("data-prop");
    if( $(field).val())
        data1 = JSON.parse($(field).val());
    hot = new Handsontable(container, {
        data:data1,
        startRows:rowlen,
        startCols:collen,
        maxRows:rowlen,
        rowHeaders:true,
        colHeaders: true,
        contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        autoWrapRow: true
        });
    $('#myModal').modal('show');
    function savedata() {
        $(field).val(JSON.stringify(hot.getData()))

    }
    $(function () {
        $('#myModal').off('hide.bs.modal', savedata);
        $('#myModal').on('hide.bs.modal', savedata)}
    );

}

function ListButton(field) {
    var hot,container0,container,data1;
    container0 = document.getElementById('bodymodal');
    $(container0).children().remove();
    $(container0).append("<div class='handsontable htRowHeaders htColumnHeaders'></div>");
    container = $(container0).children().get(0);
    var colHeadsList = JSON.parse($(field).attr("data-colNamesList"));
    var rowindex = parseInt($(field).attr("data-Rows"));
    var colindex = parseInt($(field).attr("data-Cols"));
    var colHeader = $(field).attr("data-prop");
    if( $(field).val())
        data1 = JSON.parse($(field).val());
    var columnsAttrsList = [];
    for(var i in colHeadsList){
        columnsAttrsList.push({data:colHeadsList[i],type:"numeric"})
    }
    hot = new Handsontable(container, {
        data:data1,
        rowHeaders:true,
        colHeaders:colHeadsList,
        columns:columnsAttrsList,
        contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        //minSpareRows: 1,
        startRows:1
        //autoWrapRow: true
        });
    $('#myModal').modal('show');
    function savedata() {
        var a1 = [];
        var tempDict = {};
        var a2 = hot.getData();
        for(var i in a2){
            tempDict = {};
            for(var j in a2[i] ){
                tempDict[colHeadsList[j]]=a2[i][j];
            }
            a1.push(tempDict)
        }
        $(field).val(JSON.stringify(a1))
    }
    $(function () {
        $('#myModal').off('hide.bs.modal', savedata);
        $('#myModal').on('hide.bs.modal', savedata)});

}


function getColumsAttrs(structname) {
    var StrategyDict = JSON.parse($("#JsonDict").html())["REFERENCES"];
    var FieldsVar = StrategyDict[structname].Fields;
    var FieldsVarAttrs = {};
    var ColumsAttrList = new Array();
    var ColDataDict = {};
    var colAttrDict = {};
    var colHeaders = new Array();
    for(var varName in FieldsVar){
        colAttrDict = {};
        FieldsVarAttrs = FieldsVar[varName];
        FieldsVarAttrs["Name"] = varName;
        if(!FieldsVarAttrs.Reference){
            if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32") {
                colAttrDict.data = FieldsVarAttrs.Name;
                colAttrDict.type = "numeric";
                ColumsAttrList.push(colAttrDict);
                colHeaders.push(FieldsVarAttrs.Name);
                ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
            }
            else if(FieldsVarAttrs.Type == "string") {
                colAttrDict.data = FieldsVarAttrs.Name;
                ColumsAttrList.push(colAttrDict);
                colHeaders.push(FieldsVarAttrs.Name);
                ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
            }
            else if(FieldsVarAttrs.Type == "enum"){
                var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                colAttrDict.data = FieldsVarAttrs.Name;
                colAttrDict.type = "dropdown";
                colAttrDict.source = enumList;
                ColumsAttrList.push(colAttrDict);
                colHeaders.push(FieldsVarAttrs.Name);
                ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
            }
            else if(FieldsVarAttrs.Type.match("mat") ||FieldsVarAttrs.Type.match("vec")){
                colAttrDict.data = FieldsVarAttrs.Name;
                ColumsAttrList.push(colAttrDict);
                colHeaders.push(FieldsVarAttrs.Name);
                ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
            }
            else if(FieldsVarAttrs.Type == "bool"){
                colAttrDict.data = FieldsVarAttrs.Name;
                colAttrDict.type = "checkbox";
                ColumsAttrList.push(colAttrDict);
                colHeaders.push(FieldsVarAttrs.Name);
                ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
            }
            else if(FieldsVarAttrs.Type == "list"){
                colAttrDict.data = FieldsVarAttrs.Name;
                ColumsAttrList.push(colAttrDict);
                colHeaders.push(FieldsVarAttrs.Name);
                ColDataDict[FieldsVarAttrs.Name] = StrategyDict[FieldsVarAttrs.EleType].Fields;
            }
        }
        else {
            if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32"){
                colAttrDict.data = FieldsVarAttrs.Name;
                var reference = FieldsVarAttrs.Reference;
                var refFeedback = $.ajax("/reference/{0}".format(reference), {
                    dataType: 'json',
                    async:false
                }).done(function (data) {
                    colAttrDict.type= "dropdown";
                    colAttrDict.source = data;
                    ColumsAttrList.push(colAttrDict);
                    colHeaders.push(FieldsVarAttrs.Name);
                    ColDataDict[FieldsVarAttrs.Name] = FieldsVarAttrs.Default;
                }).fail(function (xhr,status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status,status));
                });
            }
            else if(FieldsVarAttrs.Type == "list"){
                colAttrDict.data = FieldsVarAttrs.Name;
                reference = FieldsVarAttrs.Reference;
                refFeedback = $.ajax("/reference/{0}".format(reference), {
                    dataType: 'json',
                    async:false
                }).done(function (data) {
                    ColumsAttrList.push(colAttrDict);
                    colHeaders.push(FieldsVarAttrs.Name);
                    ColDataDict[FieldsVarAttrs.Name] = data;
                }).fail(function (xhr,status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status,status));
                });
            }
        }
    }
    return [colHeaders,ColumsAttrList,ColDataDict,FieldsVar];
}
function saveBigTableData() {
    var hot = window["app"]["loadlog"];
    var tbl = hot.table;
    var tbody = $(tbl).children().eq(2).get(0);
    var rowlen = $(tbl).children().eq(2).children().size();
    var collen = $(tbl).children().eq(2).children().eq(0).children().size();//start of row is 1
    var i,j,td,theader,datalist = [],tempdict = {},listTest = /[\[\]\{\}]/i;
    for(i=0;i<rowlen;i++){
        tempdict = {};
        for(j=1;j<collen;j++){
            theader = $(tbl).children().eq(1).children().eq(0).children().eq(j).children().eq(0).children().eq(0).html();
            td = $(tbody).children().eq(i).children().eq(j).get(0);
            var a = $(td).children().size();
            if($(td).children().size() != 0){
            if($(td).children().eq(0).get(0).tagName == "BUTTON"){
                if($(td).children().eq(0).attr("data-type") === "MATRIX") {
                    if (listTest.test($(td).children().eq(0).val())) {
                        var aaaa =  $(td).children().eq(0).val();
                        tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function (s) {
                            return s.map(function (se) {
                                return JsonFormatConvt(se)
                            })
                        });
                    }
                    else
                        tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                }
                else if($(td).children().eq(0).attr("data-type") === "LIST") {
                    if (listTest.test($(td).children().eq(0).val()))
                        tempdict[theader] = JSON.parse($(td).children().eq(0).val());
                    else
                        tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                }
            }
            else if($(td).children().eq(0).get(0).tagName == "INPUT"){
                tempdict[theader] = $(td).children().eq(0).get(0).checked;
            }
            else if($(td).children().eq(0).get(0).tagName == "DIV") {
                tempdict[theader] = JsonFormatConvt($(td).html().split('<div')[0]);
            }
            else if($(td).children().eq(0).get(0).tagName == "SELECT"){
                if($(td).children().eq(0).attr("data-select"))
                    tempdict[theader] = JSON.parse($(td).children().eq(0).attr("data-select"));
                else
                    tempdict[theader] = $(td).children().eq(0).attr("data-select");
            }
        }
        else
            {
                tempdict[theader] = JsonFormatConvt($(td).html());
            }
        }
        datalist.push(tempdict);

    }
    var data = JSON.stringify(datalist,null,10);
    $("#showhot1data").html(data)
}

function turnRowToJson(structName) {
    var i, j, tbl, tr, td, theader, tempdict = {}, listTest = /[\[\]\{\}]/i, collen;
    tr = $(".currentRow").parent().eq(1);
    tbl = $(".currentRow").parent().parent().parent().eq(1);
    collen = tr.children().size();
    for (j = 1; j < collen; j++) {
        theader = $(tbl).children().eq(1).children().eq(0).children().eq(j).children().eq(0).children().eq(0).html();
        td = tr.children().eq(j).get(0);
        var a = $(td).children().size();
        if ($(td).children().size() != 0) {
            if ($(td).children().eq(0).get(0).tagName == "BUTTON") {
                if ($(td).children().eq(0).attr("data-type") === "MATRIX") {
                    if (listTest.test($(td).children().eq(0).val()))
                        tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function (s) {
                            return s.map(function (se) {
                                return JsonFormatConvt(se)
                            })
                        });
                    else
                        tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                }
                else if ($(td).children().eq(0).attr("data-type") === "LIST") {
                    if (listTest.test($(td).children().eq(0).val()))
                        tempdict[theader] = JSON.parse($(td).children().eq(0).val());
                    else
                        tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
                }
            }
            else if ($(td).children().eq(0).get(0).tagName == "INPUT") {
                tempdict[theader] = $(td).children().eq(0).get(0).checked;
            }
            else if ($(td).children().eq(0).get(0).tagName == "DIV") {
                tempdict[theader] = JsonFormatConvt($(td).html().split('<div')[0]);
            }
            else if ($(td).children().eq(0).get(0).tagName == "SELECT") {
                if ($(td).children().eq(0).attr("data-select"))
                    tempdict[theader] = JSON.parse($(td).children().eq(0).attr("data-select"));
                else
                    tempdict[theader] = $(td).children().eq(0).attr("data-select");
            }
        }
        else {
            tempdict[theader] = JsonFormatConvt($(td).html());
        }
    }
    var data = JSON.stringify(tempdict, null, 10);
    $("#showhot1data").html(data);
    var typehtml = "";
    var StrategyDict = JSON.parse($("#JsonDict").html())["REFERENCES"];
    var TemplateUnitIdPrefix = "HandsontableMain";
    typehtml += "<ul id=\"{0}{1}\"></ul>".format(TemplateUnitIdPrefix, structName);
    $("#jsonlog").eq(0).html(typehtml);
    $("#{0}".format(TemplateUnitIdPrefix + structName)).eq(0).attr("index-currentRow", $(".currentRow").parent().eq(1).index());
    $("#{0}".format(TemplateUnitIdPrefix + structName)).eq(0).attr("handsontable-container-id", $(".currentRow").parents("div.handsontable-container").eq(0).attr("id"));
    var FieldsVar = StrategyDict[structName].Fields;
    var FieldsVarAttrs = {};
    for (var varName in FieldsVar) {
        FieldsVarAttrs = FieldsVar[varName];
        FieldsVarAttrs["Name"] = varName;
        if (!FieldsVarAttrs.Reference) {
            if (FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32" || FieldsVarAttrs.Type == "string")
                NumberandStringTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict);
            else if (FieldsVarAttrs.Type == "enum") {
                var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                enumTemplate(structName, enumList, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict)
            }
            else if (FieldsVarAttrs.Type.match("mat") || FieldsVarAttrs.Type.match("vec"))
                matrixTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict);
            else if (FieldsVarAttrs.Type == "bool")
                boolTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict);
            else if (FieldsVarAttrs.Type.match("list"))
                listTamplate(structName, StrategyDict[FieldsVarAttrs.EleType].Fields, FieldsVarAttrs, false, structName, TemplateUnitIdPrefix, tempdict);
        }
        else {
            if (FieldsVarAttrs.Type.match("list"))
                listRefTemplate(structName, FieldsVarAttrs, TemplateUnitIdPrefix, tempdict);
            else if (FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32") {
                var reference = FieldsVarAttrs.Reference;
                var refFeedback = $.ajax("/reference/{0}".format(reference), {
                    dataType: 'json',
                    async:false
                }).done(function (data) {
                    enumTemplate(structName,data,FieldsVarAttrs, TemplateUnitIdPrefix, tempdict);
                }).fail(function (xhr,status) {
                    alert("Failed: {0}\n Reason: {1}\n".format(xhr.status,status));
                });
            }
        }

    }
}

function getDataFromJsonTree() {
    var TemplatesUnitIdPrefix = "HandsontableMain";
    var valoption = "Annapurna";
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
    var ul = document.getElementById(TemplatesUnitIdPrefix+valoption);
    var ullen = ul.childNodes.length;
    var Jsoncode = {};
    var currentRowIndex = $("#{0}".format(TemplatesUnitIdPrefix+valoption)).eq(0).attr("index-currentRow");
    var currentContainerId = $("#{0}".format(TemplatesUnitIdPrefix+valoption)).eq(0).attr("handsontable-container-id");
    var j,tr,td,table;


    var hot = window["app"][currentContainerId];
    for (var i = 0; i < ullen; i++) {
        var ili = ul.childNodes[i];
        var varName = ili.childNodes[1].innerHTML;
        var varType = jsonDict[valoption].Fields[varName].Type;
        var varEleType = jsonDict[valoption].Fields[varName].EleType;
        var varReference = jsonDict[valoption]["Fields"][varName]["Reference"];
        if (varReference == null) {
            if (varType == "string" || varType == "double" || varType == "sint_32" || varType == "uint_32") {
                Jsoncode[varName] =JsonFormatConvt(ili.childNodes[2].rows[0].cells[4].innerHTML);
            }
            else if (varType.match("list")) {
                table = $("#{0}".format(TemplatesUnitIdPrefix+valoption+varName)).find("table.htCore").eq(0);
                var theader = table.children().eq(1);
                var tbody = table.children().eq(2);
                var headName="";
                var bodyDict = {};
                var bodyDataList = [];
                var tdvalue = "";
                var rowlen = tbody.eq(0).children().size();
                var collen = tbody.eq(0).children().eq(0).children().size();
                for(var ti=0;ti<rowlen;ti++ ){
                    bodyDict = {};
                    for (var tj=1;tj<collen;tj++){
                        headName = theader.eq(0).children().eq(0).children().eq(tj).find("span.colHeader").eq(0).html();
                        tdvalue = tbody.eq(0).children().eq(ti).children().eq(tj).eq(0).html();
                        bodyDict[headName] = tdvalue;
                    }
                    bodyDataList.push(bodyDict);
                }
                Jsoncode[varName] = bodyDataList;
            }
            else if (varType == "bool") {
                Jsoncode[varName] = $(ili).eq(0).children().eq(-1).html();
                
            }
            else if (varType.match("mat") || varType.match("vec")) {
                table = $("#{0}matrix".format(TemplatesUnitIdPrefix+valoption+varName)).find("table.htCore").eq(0);
                tbody = table.children().eq(2);
                var tmplist = [];
                bodyDataList = [];
                tdvalue = "";
                rowlen = tbody.eq(0).children().size();
                collen = tbody.eq(0).children().eq(0).children().size();
                for( ti=0;ti<rowlen;ti++ ){
                    tmplist = [];
                    for ( tj=1;tj<collen;tj++){
                        tmplist.push( tbody.eq(0).children().eq(ti).children().eq(tj).eq(0).html());
                    }
                    bodyDataList.push(tmplist);
                }
                Jsoncode[varName] = bodyDataList;
            }
            else if (varType.match("enum")) {
                Jsoncode[varName] = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "enumSelect").value);
            }
        }
        else {
            if(varType == "list"){
                for(j=1;j<collen;j++){
                    table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
                    tr = table.find("tbody").children().eq(currentRowIndex);
                    collen = tr.children().size();
                    theader = table.eq(0).children().eq(1).children().eq(0).children().eq(j).find("span.colHeader").eq(0).html();
                    if(varName == theader){
                        j=j-1;
                        var tempselect = $("#{0}refSelect".format(TemplatesUnitIdPrefix+currentRowIndex+j)).attr("data-select")
                        if(tempselect) {
                            Jsoncode[varName] = JSON.parse(tempselect);
                        }
                        else
                            Jsoncode[varName] = null;
                        break;
                    }
                }
            }
            else if(varType == "uint_32" || varType == "sint_32"){
                Jsoncode[varName] = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "enumSelect").value);
            }
        }
    }
    table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
    tr = table.find("tbody").children().eq(currentRowIndex);
    collen = tr.children().size();
    for(j=1;j<collen;j++){
        theader = table.eq(0).children().eq(1).children().eq(0).children().eq(j).find("span.colHeader").eq(0).html();
        td = tr.children().eq(j).get(0);
        if($(td).children().size() != 0){
            if($(td).children().eq(0).get(0).tagName == "BUTTON")
                $(td).children().eq(0).val(JSON.stringify(Jsoncode[theader]));
            else if($(td).children().eq(0).get(0).tagName == "INPUT")
                hot.setDataAtCell(currentRowIndex,j-1,Jsoncode[theader]);
            else if($(td).children().eq(0).get(0).tagName == "DIV")
                hot.setDataAtCell(currentRowIndex,j-1,Jsoncode[theader]);
        }
        else
        {
            hot.setDataAtCell(currentRowIndex,j-1,Jsoncode[theader]);
        }
    }
    $("#showjsondata").html(JSON.stringify(Jsoncode));
}

function SelectTypeTemplate(TemplatesUnitIdPrefix,typeslist) {
    var typeshtml = "";
    typeshtml +="<span class='dropdown'>";
    typeshtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='StrategyTypesSelect' data-toggle='dropdown'>";
    typeshtml +="<span id=\"{0}StrategyTypesButtonValue\">Types</span><span class='caret'></span></button>".format(TemplatesUnitIdPrefix);
    typeshtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in typeslist){
        typeshtml += "<li role=\"presentation\">";
        typeshtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_TypesSelect_Result(\'{0}\',this)" name="{1}">{1}</a>'.format(TemplatesUnitIdPrefix,typeslist[i]);
        typeshtml += "</li>"
    }
    typeshtml += "</ul></span>";
    return typeshtml;
}
function get_TypesSelect_Result(TemplatesUnitIdPrefix,obj) {
    $("#{0}".format(TemplatesUnitIdPrefix+"StrategyTypesButtonValue")).get(0).innerHTML=obj.name;
    var Typelist = JSON.parse($("#JsonDict").html())["REFLIST"];
    $(".chrome-tab-current").children().get(1).innerHTML = obj.name;
    var IsNewTemplateContent = document.getElementById(TemplatesUnitIdPrefix+obj.name+"TemplateContent")?false:true;
    if(IsNewTemplateContent) {
        var html = "<div id='{0}{1}TemplateContent' style=\"display: none;\">{2}</div>".format(TemplatesUnitIdPrefix, obj.name, TypeUnitTemplate(obj.name, TemplatesUnitIdPrefix));
        $("#jsonlog").append(html);
    }
    $("#jsonlog").children().each(function () {
        if(this.id.match(TemplatesUnitIdPrefix)) {
            if(this.id == (TemplatesUnitIdPrefix+obj.name+"TemplateContent"))
                this.style.display = "block";
            else if(this.id == TemplatesUnitIdPrefix+"TemplatesSelection")
                this.style.display = "block";
            else
                this.style.display = "none";
        }
        else {
            this.style.display = "none";
        }
    });
}


function TypesTemplate(TemplateUnitIdPrefix) {
    var html = "";
    var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
    html += "<div class='jsoneditor-selecttype' id='{0}TemplatesSelection' style='display: block'>{1}</div>".format(TemplateUnitIdPrefix,SelectTypeTemplate(TemplateUnitIdPrefix,StrategyList));
    $("#jsonlog").append(html);
}
function TypeUnitTemplate(structname,TemplateUnitIdPrefix){
    var typehtml="";
    var StrategyDict = JSON.parse($("#JsonDict").html())["REFERENCES"];
    typehtml += "<ul id=\"{0}{1}\">".format(TemplateUnitIdPrefix,structname);
    var FieldsVar = StrategyDict[structname].Fields;
    var FieldsVarAttrs = {};
    for(var varName in FieldsVar){
        FieldsVarAttrs = FieldsVar[varName];
        FieldsVarAttrs["Name"] = varName;
        if(!FieldsVarAttrs.Reference){
            if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32"||FieldsVarAttrs.Type == "string")
               typehtml += NumberandStringTemplate(structname,FieldsVarAttrs,TemplateUnitIdPrefix);
            else if(FieldsVarAttrs.Type == "enum"){
                var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                typehtml += enumTemplate(structname,enumList,FieldsVarAttrs,TemplateUnitIdPrefix)
            }
            else if(FieldsVarAttrs.Type.match("mat") ||FieldsVarAttrs.Type.match("vec"))
                typehtml += matrixTemplate(structname,FieldsVarAttrs,TemplateUnitIdPrefix);
            else if(FieldsVarAttrs.Type == "bool")
                typehtml += boolTemplate(structname,FieldsVarAttrs,TemplateUnitIdPrefix);
            else if(FieldsVarAttrs.Type.match("list"))
                typehtml += listTamplate(structname,StrategyDict[FieldsVarAttrs.EleType].Fields,FieldsVarAttrs,false,structname,TemplateUnitIdPrefix);
        }
        else {
            if(FieldsVarAttrs.Type.match("list"))
             typehtml += listRefTemplate(structname,FieldsVarAttrs,TemplateUnitIdPrefix);
            else if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32")
                typehtml += singleRefTemplate(structname,FieldsVarAttrs,TemplateUnitIdPrefix);
         }
    }
    typehtml += "</ul>";
    return typehtml;
}
function get_chekbox_value(checkboxid,showcheckid) {
    if(document.getElementById(checkboxid).checked){
        document.getElementById(showcheckid+"boolval").innerHTML= 'true';
    }
    else {
        document.getElementById(showcheckid+"boolval").innerHTML= 'false';
    }
}
function boolTemplate(structname,VarAttrs,TemplateUnitIdPrefix,valueDict) {
    var Ischecked = valueDict[VarAttrs.Name]?"checked":"";
    var boolhtml = "";
    boolhtml += "<li id=\"{0}{1}{2}bool\" style=\"display: block\">".format(TemplateUnitIdPrefix,structname,VarAttrs.Name);
    if(VarAttrs.Requiredness == "bool")
        boolhtml += '<span style="color: red">*</span>';
    else
        boolhtml += '<span></span>';
    boolhtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
    boolhtml += '<span><span class="glyphicon glyphicon-check"></span><span class=" jsoneditor-readonly jsoneditor-value" ;color: white">{0}</span></span>'.format(VarAttrs.Name);
    boolhtml += '<input type="checkbox" id="m{0}{1}{2}" onclick="get_chekbox_value(\'m{0}{1}{2}\',\'{0}{1}{2}\')\" \{3\}/>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,Ischecked);
    boolhtml += '<span>  </span>';
    boolhtml +='<span style="color: deepskyblue" id="{0}{1}{2}boolval">{3}</span></li>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,valueDict[VarAttrs.Name]);
    $("#jsonlog").children().eq(-1).append(boolhtml)

}

function enumTemplate(structname,enumlist,VarAttrs,TemplatesUnitIdPrefix,valueDict) {
    var enumhtml = "";
    enumhtml = '<li id="{0}">'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    enumhtml += '<span class="jsoneditor-readonly jsoneditor-value" >';
    if(VarAttrs.Requiredness )
        enumhtml += '<span style="color: red">*</span>'; 
    enumhtml +='<span >{0} </span>'.format(VarAttrs.Name);
    enumhtml +="<span class='dropdown'>";
    enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' style='background-color: lightslategray;height: 28px' id='{0}enumSelect' data-toggle='dropdown' value='{1}'>".format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,valueDict[VarAttrs.Name]);
    valueDict[VarAttrs.Name] = valueDict[VarAttrs.Name]?valueDict[VarAttrs.Name]:"select";
    enumhtml +="<span id=\"{0}{1}{2}buttonValue\">{3}</span><span class='caret'></span></button>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name,valueDict[VarAttrs.Name]);
    enumhtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in enumlist){
        enumhtml += "<li role=\"presentation\">";
        enumhtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_Drop_Select_value(\'{0}\',this)" name="{1}">{1}</a>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,enumlist[i]);
        enumhtml += "</li>"
    }
    enumhtml += "</ul></span></span><span id=\"m{0}{1}{2}\" style=\"display: none\">{2}</span></li>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    $("#jsonlog").children().eq(-1).append(enumhtml);
}
function get_Drop_Select_value(ID,obj){
    var id1 = "{0}enumSelect".format(ID);
    var id2 = "{0}buttonValue".format(ID);
    document.getElementById(id1).value = obj.name;
    document.getElementById(id2).innerHTML = obj.name;
}

function NumberandStringTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict) {
    var NumStrhtml = "";
    NumStrhtml += '<li style="display: block" >';
    NumStrhtml += '<span style="display: none"></span><span style="display: none">{0}</span>'.format(VarAttrs.Name);
    NumStrhtml += '<table><tr>';
    NumStrhtml += '<td>';
    if(VarAttrs.Requiredness )
        NumStrhtml +='<td style="color: red">*</td>';
    NumStrhtml += '</td>';
    NumStrhtml +="<td class=\"jsoneditor-readonly jsoneditor-value\" id=\"m{0}{1}{2}\">{2}</td>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    NumStrhtml += "<td style='width: 8px'>:</td>";
    VarAttrs.Default = valueDict[VarAttrs.Name];
    if(VarAttrs.Default == null)
        VarAttrs.Default = "";
    NumStrhtml +='<td contenteditable="true" spellcheck="false" class="jsoneditor-number jsoneditor-value jsoneditor-listinput handleEnter" onkeypress="handleEnter(this,event)" onblur="NumberChecktips(this)" id="{0}{1}{2}">{3}</td>'.format(TemplatesUnitIdPrefix,structname,VarAttrs.Name,VarAttrs.Default);
    NumStrhtml += '</tr></table></li>';
    $("#jsonlog").children().eq(-1).append(NumStrhtml)
}
function listTamplate(structname,listTypeFieldsDict,VarAttrs,IsReference,preStructName,TemplatesUnitIdPrefix,valueDict) {
    var struct = "";
    var name = "";
    var listIdBase = "";
    if(IsReference){
        struct = preStructName;
        name = structname;
        preStructName = VarAttrs.Name;
        listIdBase = TemplatesUnitIdPrefix+struct+preStructName+name;
    }
    else {
        struct = structname;
        name = VarAttrs.Name;
        listIdBase = TemplatesUnitIdPrefix+struct+name;
    }
    var listhtml = "<li id='{0}ListHeader'>".format(listIdBase);
    if(VarAttrs.Requiredness)
        listhtml += '<span style="color: red">*</span>';
    else
        listhtml += '<span></span>';
    listhtml += '<span style="display: none">{0}</span>'.format(name);
    listhtml += '<span><span class="glyphicon glyphicon-list" style="height: 30px"></span><span data-toggle="collapse" data-target="#{0}" class=" jsoneditor-readonly jsoneditor-value " ;color: white">{1}</span></span>'.format(listIdBase,name);
    listhtml += '<span><div id="{0}" style="margin-left: 30px" class="handsontable htRowHeaders htColumnHeaders collapse in" ></div></span></li>'.format(listIdBase);
    $("#jsonlog").children().eq(-1).append(listhtml);
    var hot,container,data1;
    container = document.getElementById('{0}'.format(listIdBase));
    var colHeadsList = Object.getOwnPropertyNames(listTypeFieldsDict);
    var columnsAttrsList = [];
    for(var i in colHeadsList){
        columnsAttrsList.push({data:colHeadsList[i],type:"numeric"})
    }
    hot = new Handsontable(container, {
        data:valueDict[VarAttrs.Name],
        rowHeaders:true,
        colHeaders:colHeadsList,
        columns:columnsAttrsList,
        contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        //minSpareRows: 1,
        startRows:1
        //autoWrapRow: true
        });
}
function listRefTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict) {
    var row,col,table,tr,collen,AllSelectItemsList,headName,currentContainerId;
    var listrefhtml ="<li>";
    if(VarAttrs.Requiredness)
        listrefhtml += '<span style="color: red">*</span>';
    else
        listrefhtml += '<span></span>';
    listrefhtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
    row = $("#{0}{1}".format(TemplatesUnitIdPrefix,structname)).eq(0).attr("index-currentRow");
    currentContainerId = $("#{0}{1}".format(TemplatesUnitIdPrefix,structname)).eq(0).attr("handsontable-container-id");
    table = $("#{0}".format(currentContainerId)).find("table.htCore").eq(0);
    var theader = table.children().eq(1);
    tr = table.find("thead").children().eq(0).children().each(function (index) {
        headName = theader.eq(0).children().eq(0).children().eq(index).find("span.colHeader").eq(0).html();
        if(headName == VarAttrs.Name)
            col = index
    });
    col = col-1;
    listrefhtml +='<span class="jsoneditor-readonly jsoneditor-value" style="display: block" id="m{2}{0}{1}">{1}: '.format(structname,VarAttrs.Name,TemplatesUnitIdPrefix);
    listrefhtml += "<select id='{0}{1}{2}JsonrefSelect' class='selectResult' multiple='multiple' size='2'>".format(TemplatesUnitIdPrefix,row,col);
    AllSelectItemsList = JSON.parse($("#{0}".format(TemplatesUnitIdPrefix+row+col+"refSelect")).eq(0).attr("data-local-list"));
    for( var e in AllSelectItemsList){
        listrefhtml += "<option value='{0}'>{0}</option>".format(AllSelectItemsList[e])
    }
    listrefhtml += "</select>";
    listrefhtml += "<input type='text' data-role='tagsinput' style='display: none' class='collection-elements-tagsinput'/></span></li>".format(TemplatesUnitIdPrefix+row+col);
    $("#jsonlog").children().eq(-1).append(listrefhtml);

    $("#{0}{1}{2}JsonrefSelect".format(TemplatesUnitIdPrefix,row,col)).multiselect({
        // noneSelectedText:"---select---",
        // checkAllText: "all",
        // uncheckAllText: 'none',
        // selectedList:1
    }).multiselectfilter({
                label:"Search: ",
                width:130,
                height:25
    }).on("multiselectclick",function (event,ui) {
        var result = $(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();

        var elt1 =$(this).parent().find("input.collection-elements-tagsinput");
        elt1.tagsinput("removeAll");
        result.unshift(0);
        if(result.length > 1){
            for(var i in result){
                elt1.tagsinput('add',result[i]);
            }
        }
        elt1.tagsinput("refresh");
        var that = this;//select
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
        $(this).multiselect("setChecked");
        elt1.on("itemRemoved",function () {
            $(that).multiselect("setChecked");
        });
    }).bind("multiselectoptgrouptoggle",function (event,ui) {
        var result = $(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();
        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
        elt1.tagsinput("removeAll");
        result.unshift(0);
        if (result.length > 1) {
            for (var i in result) {
                elt1.tagsinput('add', result[i]);
            }
        }
        elt1.tagsinput("refresh");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
        var that = this;//select
        $(this).multiselect("setChecked");
        elt1.on("itemRemoved", function () {
            $(that).multiselect("setChecked");
        });
    }
    ).bind("multiselectuncheckall",function () {
        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
        elt1.tagsinput("removeAll");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
        $(this).multiselect("setChecked");

    }).bind("multiselectcheckall",function () {
        var result = $(this).multiselect("getChecked").map(function () {
            return this.value;
        }).get();
        var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
        elt1.tagsinput("removeAll");
        result.unshift(0);
        if (result.length > 1) {
            for (var i in result) {
                elt1.tagsinput('add', result[i]);
            }
        }
        elt1.tagsinput("refresh");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
        $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
        var that = this;//select
        $(this).multiselect("setChecked");
        elt1.on("itemRemoved", function () {
            $(that).multiselect("setChecked");
        });

    }).bind("multiselectbeforeopen",function () {
        var initDataSelectList = $("#{0}refSelect".format(TemplatesUnitIdPrefix+row+col)).eq(0).attr("data-select");
        if(initDataSelectList){
            var elt = $(this).parent().find("input.collection-elements-tagsinput");
            initDataSelectList = JSON.parse(initDataSelectList);
            initDataSelectList.unshift(0);
            for(var i in initDataSelectList){
                elt.tagsinput('add',initDataSelectList[i]);
            }
            $(this).multiselect("setChecked");

        }
    });

}


function matrixTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict) {
    var mathtml = "",hot,container,data1;
    mathtml +="<li>";
    if(VarAttrs.Requiredness)
        mathtml += '<span style="color: red">*</span>';
    else
        mathtml += '<span></span>';
    mathtml += '<span style="display: none">{0}</span>'.format(VarAttrs.Name);
    mathtml += '<span><span class="glyphicon glyphicon-th" style="height: 30px"></span><span data-toggle="collapse" data-target="#{0}matrix" class=" jsoneditor-readonly jsoneditor-value " ;color: white">{1}[{2}x{3}]</span></span>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,VarAttrs.Name,VarAttrs.DimensionY,VarAttrs.DimensionX);
    mathtml += '<span><div id="{0}matrix" style="margin-left: 30px" class="handsontable htRowHeaders htColumnHeaders collapse in"></span></div></li>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    $("#jsonlog").children().eq(-1).append(mathtml);
    container = document.getElementById('{0}matrix'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name));
    var rowlen = parseInt(VarAttrs.DimensionY);
    var collen = parseInt(VarAttrs.DimensionX);
    hot = new Handsontable(container, {
        data:valueDict[VarAttrs.Name],
        startRows:rowlen,
        startCols:collen,
        maxRows:rowlen,
        rowHeaders:true,
        colHeaders: true,
        //columns:a,
        contextMenu: true,
        // currentRowClassName: 'currentRow',
        // currentColClassName: 'currentCol',
        autoWrapRow: true
        });
}

function checkCollectionName(name) {
    return name
}
function saveCollection(field) {
    if($(field).parent().find(".Object-multiselect").find(".bootstrap-tagsinput").children().size()>1){
        var elt1 = $(field).parent().find(".Object-multiselect").find("input.collection-elements-tagsinput");
        var result = elt1.tagsinput("items");
        var elt2 = $(field).parent().find(".collectionTags");
        var collectionName = elt2.tagsinput("items");
        var aj = $.ajax("/saveCollection/{0}".format(JSON.stringify([collectionName[0],result])),{
            dataType:"text",
            type:"POST"
        }).done(function (data) {
            alert(data)

        }).fail(function (xhr,status) {
            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
        });


    }
}
function createCollection(field) {
    var colhtml = "",elt;
    var labelName = $(field).next().children().text();
    if(checkCollectionName(labelName)) {
        var myObjectList = "myObjectList";
        var refFeedback = $.ajax("/objects/{0}".format(myObjectList), {
            dataType: 'json',
            //async: false
        }).done(function (data) {
            elt = $(field).next().parent().find(".collectionTags");
            if($(field).next().parent().attr("class") === "newCollection") {
                elt.on('itemRemoved', function (event) {
                    $(this).parent().remove();
                });
            }
            colhtml = '<button style="position: absolute;right: 62.5%" onclick="saveCollection(this)"><span class="glyphicon glyphicon-send" ></span></button>';
            $(field).parent().append(colhtml);

            colhtml = "<div style='margin-left: 6px' class='Object-multiselect'><select class='selectResult' multiple='multiple' size='2'>";
            for (var e in data) {
                colhtml += "<optgroup label='{0}'>".format(data[e][0]);
                for(var i in data[e][1]) {
                    colhtml += "<option value='{0}'>{0}</option>".format(data[e][1][i])
                }
                colhtml += "</optgroup>";
            }
            colhtml += "</select>";
            colhtml += "<input type='text' class='collection-elements-tagsinput' data-role='tagsinput'  style='display: none'/></div>";
            $(field).parent().append(colhtml);
            $(field).parent().find("div.Object-multiselect").find("select").multiselect({
                // noneSelectedText: "---select---",
                // checkAllText: "all",
                // uncheckAllText: 'none',
                // selectedList: 1,
            }
            ).multiselectfilter({
                label:"Search: ",
                width:130,
                height:25
            }).on("multiselectclick",function (event,ui) {

                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 =$(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if(result.length > 1){
                    for(var i in result){
                        elt1.tagsinput('add',result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                elt1.on("itemRemoved",function () {
                    $(that).multiselect("setChecked");
                });
            }).bind("multiselectoptgrouptoggle",function (event,ui) {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select$(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });
            }
            ).bind("multiselectuncheckall",function () {

                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");

            }).bind("multiselectcheckall",function () {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });

            });
            colhtml = '<span class="newCollection"><button style="width: 30px; border: transparent;font-size: 25px;" onclick="createCollection(this)"><span class="glyphicon glyphicon-plus-sign" style="color:lightgreen;top: 3px;" ></span></button><input class="collectionTags label label-success" type="text"  data-role="tagsinput" /></span>';
            $(field).parent().find("div.Object-multiselect").find("select").next().css("vertical-align","top");
            $(field).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
            $(field).parent().parent().append(colhtml);
            $(field).remove();

            $('.collectionTags').tagsinput({
                maxTags:1,
                tagClass:'label label-primary'
            });
            $(".collectionTags").prev().css("border","transparent");

        }).fail(function (xhr, status) {
            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
        });
    }
}
function createConfigure(field) {
    var colhtml = "",elt;
    var labelName = $(field).next().children().text();
    if(checkCollectionName(labelName)) {
        var myObjectList = "myObjectList";
        var refFeedback = $.ajax("/objects/{0}".format(myObjectList), {
            dataType: 'json',
        }).done(function (data) {
            elt = $(field).parent().find(".configureTags");
            if($(field).next().parent().attr("class") === "newCollection") {
                elt.on('itemRemoved', function (event) {
                    $(this).parent().remove();
                });
            }

            $(field).parent().next()
            colhtml = '<button style="position: absolute;right: 62.5%" onclick="saveCollection(this)"><span class="glyphicon glyphicon-send" ></span></button>';
            $(field).parent().append(colhtml);

            colhtml = "<div style='margin-left: 6px' class='Object-multiselect'><select class='selectResult' multiple='multiple' size='2'>";

            for (var e in data) {
                colhtml += "<optgroup label='{0}'>".format(data[e][0]);
                for(var i in data[e][1]) {
                    colhtml += "<option value='{0}'>{0}</option>".format(data[e][1][i])
                }
                colhtml += "</optgroup>";
            }
            colhtml += "</select>";
            colhtml += "<input type='text' class='collection-elements-tagsinput' data-role='tagsinput'  style='display: none'/></div>";
            $(field).parent().append(colhtml);
            $(field).parent().find("div.Object-multiselect").find("select").multiselect({
                // noneSelectedText: "---select---",
                // checkAllText: "all",
                // uncheckAllText: 'none',
                // selectedList: 1,
            }
            ).multiselectfilter({
                label:"Search: ",
                width:130,
                height:25
            }).on("multiselectclick",function (event,ui) {

                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 =$(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if(result.length > 1){
                    for(var i in result){
                        elt1.tagsinput('add',result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                elt1.on("itemRemoved",function () {
                    $(that).multiselect("setChecked");
                });
            }).bind("multiselectoptgrouptoggle",function (event,ui) {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select$(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });
            }
            ).bind("multiselectuncheckall",function () {

                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");

            }).bind("multiselectcheckall",function () {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });

            });
            colhtml = '<span class="newCollection"><button style="width: 30px; border: transparent;font-size: 25px;" onclick="createConfigure(this)"><span class="glyphicon glyphicon-plus-sign" style="color:lightgreen;top: 3px;" ></span></button><input class="configureTags" type="text"  data-role="tagsinput" /></span>';
            $(field).parent().find("div.Object-multiselect").find("select").next().css("vertical-align","top");
            $(field).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
            $(field).parent().parent().append(colhtml);
            $(field).remove();
            $("input.configureTags").tagsinput({
                maxTags:1,
                tagClass:'label label-success'
            });
            $("input.configureTags").prev().css("border","transparent");


        }).fail(function (xhr, status) {
            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
        });
    }
}

function createGrid(field) {
    var colhtml = "",elt;
    var labelName = $(field).next().children().text();
    if(checkCollectionName(labelName)) {
        var myObjectList = "myObjectList";
        var refFeedback = $.ajax("/objects/{0}".format(myObjectList), {
            dataType: 'json',
        }).done(function (data) {
            elt = $(field).parent().find(".gridTags");
            if($(field).next().parent().attr("class") === "newCollection") {
                elt.on('itemRemoved', function (event) {
                    $(this).parent().remove();
                });
            }

            $(field).parent().next()
            colhtml = '<button style="position: absolute;right: 62.5%" onclick="saveCollection(this)"><span class="glyphicon glyphicon-send" ></span></button>';
            $(field).parent().append(colhtml);

            colhtml = "<div style='margin-left: 6px' class='Object-multiselect'><select class='selectResult' multiple='multiple' size='2'>";

            for (var e in data) {
                colhtml += "<option value='{0}'>{0}</option>".format(data[e])
            }
            colhtml += "</select>";
            colhtml += "<input type='text' class='collection-elements-tagsinput' data-role='tagsinput'  style='display: none'/></div>";
            $(field).parent().append(colhtml);
            $(field).parent().find("div.Object-multiselect").find("select").multiselect({
                // noneSelectedText: "---select---",
                // checkAllText: "all",
                // uncheckAllText: 'none',
                // selectedList: 1,
            }
            ).multiselectfilter({
                label:"Search: ",
                width:130,
                height:25
            }).on("multiselectclick",function (event,ui) {

                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 =$(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if(result.length > 1){
                    for(var i in result){
                        elt1.tagsinput('add',result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                elt1.on("itemRemoved",function () {
                    $(that).multiselect("setChecked");
                });
            }).bind("multiselectoptgrouptoggle",function (event,ui) {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select$(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });
            }
            ).bind("multiselectuncheckall",function () {

                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");

            }).bind("multiselectcheckall",function () {
                var result = $(this).multiselect("getChecked").map(function () {
                    return this.value;
                }).get();
                var elt1 = $(this).parent().find("input.collection-elements-tagsinput");
                elt1.tagsinput("removeAll");
                result.unshift(0);
                if (result.length > 1) {
                    for (var i in result) {
                        elt1.tagsinput('add', result[i]);
                    }
                }
                elt1.tagsinput("refresh");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
                $(this).parent().find("div.bootstrap-tagsinput").find("input").css("width","2px");
                var that = this;//select
                elt1.on("itemRemoved", function () {
                    $(that).multiselect("setChecked");
                });

            });
            colhtml = '<span class="newCollection"><button style="width: 30px; border: transparent;font-size: 25px;" onclick="createGrid(this)"><span class="glyphicon glyphicon-plus-sign" style="color:lightgreen;top: 3px;" ></span></button><input class="gridTags" type="text"  data-role="tagsinput" /></span>';
            $(field).parent().find("div.Object-multiselect").find("select").next().css("vertical-align","top");
            $(field).parent().find("div.bootstrap-tagsinput").find("input").css("background-color","transparent");
            $(field).parent().parent().append(colhtml);
            $(field).remove();
            $("input.gridTags").tagsinput({
                maxTags:1,
                tagClass:'label label-warning'
            });
            $("input.gridTags").prev().css("border","transparent");

        }).fail(function (xhr, status) {
            alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
        });
    }
}
function ajaxtest() {
    var selRollBack = 1;
    var selOperatorsCode = 2;
    var PROVINCECODE = "0859";
    var pass2 = "passcode";
    var senddata={
        selRollBack : selRollBack,
        selOperatorsCode : selOperatorsCode,
        PROVINCECODE : PROVINCECODE,
        pass2 : pass2
        };
    var aj = $.ajax("/testajax/{0}".format(JSON.stringify(senddata)),{
        dataType:"json",
        type:"POST",

    }).done(function (data) {
        alert(JSON.stringify(data))
    }).fail(function (xhr,status) {
        alert("Failed: {0}\n Reason: {1}\n".format(xhr.status, status));
    });
}