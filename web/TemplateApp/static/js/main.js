/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    load:TypesTemplate,
    load2:HtmlExcelAll
};
var mainTable;
function HtmlExcelAll() {
    var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
    var ColumsAttr = [];
    var container1;
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
    Handsontable.renderers.registerRenderer('expandMatrix', expandMatrix);
    Handsontable.renderers.registerRenderer('expandList', expandList);
    mainTable = new Handsontable(container1, {
        data: ColumsAttr[2],
        colHeaders: ColumsAttr[0],
        columns:ColumsAttr[1],
        manualColumnMove: true,
        manualRowMove: true,
        manualColumnResize: true,
        manualRowResize: true,
        rowHeaders:true,
        colHeights:100,
        //colHeaders: true,
        //minSpareRows: 1,
        startRows:1,
        stretchH: 'all',
        contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        cells:function (row, col, prop) {
            var cellProperties = {};
            if (ColumsAttr[3][prop].Type === 'mat' || ColumsAttr[3][prop].Type === 'vec') {
                cellProperties.renderer = "expandMatrix";
            }
            else if (ColumsAttr[3][prop].Type === "list") {
                cellProperties.renderer = "expandList";
            }
            return cellProperties;
        }
    });
    mainTable.updateSettings({
        contextMenu: {
            callback: function (key, options) {
                if (key === 'json') {
                    var curRowDataDict = turnRowToJson(StrategyList[0]);

                    // app.load("TAB1","bodymodal");
                    // $('#myModal').modal('show');
                    // $(function () { $('#myModal').on('hide.bs.modal', savedata)});
                    
                }
            },
            items: {
                "row_above": {},
                "row_below": {},
                "undo":{},
                "redo":{},
                "alignment":{},
                "clear_column":{},
                "remove_row":{
                    name:"remove this row!",
                    disabled:function () {
                        return (mainTable.getSelected() && mainTable.getSelected()[0] === 0)
                    }
                },
                "json":{
                    name:"Trun row to Json"
                    // disabled:function () {
                    //     return ($(".currentRow").get(0))
                    //  }
                }
            }

        }
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
        // else {
        //     if(FieldsVarAttrs.Type.match("list"))
        //      typehtml += listRefTemplate(structname,FieldsVarAttrs);
        //     else if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32")
        //         typehtml += singleRefTemplate(structname,FieldsVarAttrs);
        //  }
    }
    return [colHeaders,ColumsAttrList,ColDataDict,FieldsVar];
}

function saveBigTableData() {
    var hot = window["mainTable"];
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
                    if (listTest.test($(td).children().eq(0).val()))
                        tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function (s) {
                            return s.map(function (se) {
                                return JsonFormatConvt(se)
                            })
                        });
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
            else if($(td).children().eq(0).get(0).tagName == "DIV"){
                tempdict[theader] = JsonFormatConvt($(td).html().split('<div')[0]);
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
    var i,j,tbl,tr,td,theader,tempdict = {},listTest = /[\[\]\{\}]/i,collen;
    tr = $(".currentRow").parent().eq(1);
    tbl = $(".currentRow").parent().parent().parent().eq(1);
    collen = tr.children().size();
    for(j=1;j<collen;j++){
        theader = $(tbl).children().eq(1).children().eq(0).children().eq(j).children().eq(0).children().eq(0).html();
        td = tr.children().eq(j).get(0);
        var a = $(td).children().size();
        if($(td).children().size() != 0){
        if($(td).children().eq(0).get(0).tagName == "BUTTON"){
            if($(td).children().eq(0).attr("data-type") === "MATRIX") {
                if (listTest.test($(td).children().eq(0).val()))
                    tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function (s) {
                        return s.map(function (se) {
                            return JsonFormatConvt(se)
                        })
                    });
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
        else if($(td).children().eq(0).get(0).tagName == "DIV"){
            tempdict[theader] = JsonFormatConvt($(td).html().split('<div')[0]);
        }
    }
    else
        {
            tempdict[theader] = JsonFormatConvt($(td).html());
        }
    }
    var data = JSON.stringify(tempdict,null,10);
    $("#showhot1data").html(data);
    var typehtml="";
    var StrategyDict = JSON.parse($("#JsonDict").html())["REFERENCES"];
    var TemplateUnitIdPrefix = "HandsontableMain";
    typehtml += "<ul id=\"{0}{1}\"></ul>".format(TemplateUnitIdPrefix,structName);
    $("#jsonlog").append(typehtml);
    var FieldsVar = StrategyDict[structName].Fields;
    var FieldsVarAttrs = {};
    for(var varName in FieldsVar){
        FieldsVarAttrs = FieldsVar[varName];
        FieldsVarAttrs["Name"] = varName;
        if(!FieldsVarAttrs.Reference){
            if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32"||FieldsVarAttrs.Type == "string")
                NumberandStringTemplate(structName,FieldsVarAttrs,TemplateUnitIdPrefix,tempdict);
            else if(FieldsVarAttrs.Type == "enum"){
                var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                enumTemplate(structName,enumList,FieldsVarAttrs,TemplateUnitIdPrefix,tempdict)
            }
            else if(FieldsVarAttrs.Type.match("mat") ||FieldsVarAttrs.Type.match("vec"))
                matrixTemplate(structName,FieldsVarAttrs,TemplateUnitIdPrefix,tempdict);
            else if(FieldsVarAttrs.Type == "bool")
                boolTemplate(structName,FieldsVarAttrs,TemplateUnitIdPrefix,tempdict);
            else if(FieldsVarAttrs.Type.match("list"))
                listTamplate(structName,StrategyDict[FieldsVarAttrs.EleType].Fields,FieldsVarAttrs,false,structName,TemplateUnitIdPrefix,tempdict);
        }
        // else {
        //     if(FieldsVarAttrs.Type.match("list"))
        //      typehtml += listRefTemplate(structName,FieldsVarAttrs,TemplateUnitIdPrefix);
        //     else if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32")
        //         typehtml += singleRefTemplate(structName,FieldsVarAttrs,TemplateUnitIdPrefix);
        //  }
    }

}

function getDataFromJsonTree() {
    var TemplatesUnitIdPrefix = "HandsontableMain";
    var valoption = "Annapurna";
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
    var ul = document.getElementById(TemplatesUnitIdPrefix+valoption);
    var ullen = ul.childNodes.length;
    var Jsoncode = Object();
    for (var i = 0; i < ullen; i++) {
        var ili = ul.childNodes[i];
        var varName = ili.childNodes[1].innerHTML;
        var varType = jsonDict[valoption].Fields[varName].Type;
        var varEleType = jsonDict[valoption].Fields[varName].EleType;
        var varReference = jsonDict[valoption]["Fields"][varName]["Reference"];
        if (varReference == null) {
            if (varType == "string" || varType == "double" || varType == "sint32" || varType == "uint32") {
                Jsoncode[varName] = JsonFormatConvt(ili.childNodes[2].rows[0].cells[4].innerHTML);
            }
            else if (varType.match("list")) {
                var table = $("#{0}".format(TemplatesUnitIdPrefix+valoption+varName)).find("table.htCore").eq(0);
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
                Jsoncode[varName] = JsonFormatConvt(ili.childNodes[3].innerHTML);
            }
            // else if (varType.match("mat") || varType.match("vec")) {
            //     i = i + 1;
            //     var matTbl = document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "matrix");
            //     var matBigArr = new Array();
            //     if (matTbl.rows.length > 1) {
            //         for (var mi = 0; mi < matTbl.rows.length; mi++) {
            //             var matSmallArr = new Array();
            //             for (var mj = 0; mj < matTbl.rows[mi].cells.length; mj++) {
            //                 matSmallArr[mj] = JsonFormatConvt(matTbl.rows[mi].cells[mj].innerHTML)
            //             }
            //             matBigArr[mi] = matSmallArr;
            //         }
            //         Jsoncode[varName] = matBigArr;
            //     }
            //     else {
            //         matSmallArr = new Array();
            //         for (mj = 0; mj < matTbl.rows[0].cells.length; mj++) {
            //             matSmallArr[mj] = JsonFormatConvt(matTbl.rows[0].cells[mj].innerHTML)
            //         }
            //         Jsoncode[varName] = matSmallArr;
            //     }
            // }
            else if (varType.match("enum")) {
                Jsoncode[varName] = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "enumSelect").value);
            }
        }
        // else {
        //     var refJsonDict = CombineReferenceData[TemplatesUnitIdPrefix+valoption+varName];
        //     if (varType.match("list")) {
        //         i += 1;
        //         var multivalue = $("#{0}".format(TemplatesUnitIdPrefix+valoption + varName + "refSelect")).multiselect("MyValues").split(",");
        //         var resultsref = {};
        //         for(var i1 in multivalue){
        //             multivalue[i1]=multivalue[i1].replace(/\s+/g,"");
        //             resultsref[multivalue[i1]]=ReadCsvTableDict(refJsonDict,TemplatesUnitIdPrefix+valoption+multivalue[i1]+"csv",multivalue[i1]);
        //         }
        //         Jsoncode[varName] =resultsref;
        //     }
        //     else {
        //         i += 1;
        //         var singleRefResult = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "refSelect").value);
        //         Jsoncode[varName] = ReadCsvTableDict(refJsonDict,TemplatesUnitIdPrefix+valoption+singleRefResult+"csv",singleRefResult);
        //     }
        // }
    }
    $("#showjsondata").html(JSON.stringify(Jsoncode));
}
function turnJsonToRow() {
    
    
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
        document.getElementById(showcheckid).innerHTML= 'true';
        document.getElementById(showcheckid+"boolval").innerHTML= 'true';
    }
    else {
        document.getElementById(showcheckid).innerHTML= 'false';
        document.getElementById(showcheckid+"boolval").innerHTML= 'false';
    }
}
function boolTemplate(structname,VarAttrs,TemplateUnitIdPrefix,valueDict) {
    if(!VarAttrs.Default)
        VarAttrs.Default = false;
    var boolhtml = "";
    boolhtml += "<li id=\"{0}{1}{2}bool\" style=\"display: block\">".format(TemplateUnitIdPrefix,structname,VarAttrs.Name);
    boolhtml += "<span>";
    if(VarAttrs.Requiredness == "bool")
        boolhtml +='<span style="color: red">*</span>';
    boolhtml += '</span>';
    boolhtml +='<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0}</span>'.format(VarAttrs.Name);
    var Ischecked = valueDict[VarAttrs.Name]?"checked":"";
    boolhtml +='<span><input type="checkbox" id="m{0}{1}{2}" onclick="get_chekbox_value(\'m{0}{1}{2}\',\'{0}{1}{2}\')\" {3}/>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,Ischecked);

    boolhtml +='<span style="color: deepskyblue" id="{0}{1}{2}"> {3}</span></span>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,valueDict[VarAttrs.Name]);
    boolhtml +='<span style="display: none" id="{0}{1}{2}boolval">{3}</span></li>'.format(TemplateUnitIdPrefix,structname,VarAttrs.name,valueDict[VarAttrs.Name]);
    $("#jsonlog").children().eq(-1).append(boolhtml)

}

function enumTemplate(structname,enumlist,VarAttrs,TemplatesUnitIdPrefix,valueDict) {
    var enumhtml = "";
    enumhtml = '<li id="{0}">'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    enumhtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)" >';
    if(VarAttrs.Requiredness )
        enumhtml += '<span style="color: red">*</span>'; 
    enumhtml +='<span >{0} </span>'.format(VarAttrs.Name);
    enumhtml +="<span class='dropdown'>";
    enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}enumSelect' data-toggle='dropdown' value='{1}'>".format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,valueDict[VarAttrs.Name]);
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
    NumStrhtml += '<li style="display: block" onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    NumStrhtml += '<span style="display: none"></span><span style="display: none">{0}</span>'.format(VarAttrs.Name);
    NumStrhtml += '<table><tr>';
    NumStrhtml += '<td>';
    if(VarAttrs.Requiredness )
        NumStrhtml +='<td style="color: red">*</td>';
    NumStrhtml += '</td>';
    NumStrhtml +="<td class=\"jsoneditor-readonly jsoneditor-value\" id=\"m{0}{1}{2}\">{2}</td>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    NumStrhtml += "<td>:  </td>";
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
    listhtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    listhtml += '<button onclick="collapsewin(\'{0}\')">^</button>{1}'.format(listIdBase,name);
    listhtml += "</span>";
    listhtml += '<span style="display: none">{0}</span>'.format(name);
    listhtml += '<div id="{0}" style="display: block;margin-left: 30px" ></div></li>'.format(listIdBase);
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
function listRefTemplate(structname,VarAttrs,TemplatesUnitIdPrefix) {
    var listrefhtml ="<li onmouseover=\"shadowover(this)\" onmouseout=\"shadowout(this)\">";
    listrefhtml += '<span>';
    if(VarAttrs.Requiredness)
        listrefhtml += '<span style="color: red">*</span>';
    var jsonVarAttrs = JSON.stringify(VarAttrs);
    listrefhtml += '<span id="{3}{0}{1}singleRefVarAttrs" style="display: none">{2}</span><button onclick="get_Multi_Reference_List(\'{0}\',\'{1}\',\'{3}\')" style="width: auto">{1}</button><span id="{3}{0}{1}tdSelect"></span>'.format(structname,VarAttrs.Name,jsonVarAttrs,TemplatesUnitIdPrefix);
    listrefhtml +='</span>';
    listrefhtml +='<span  style="display: none" id="m{2}{0}{1}">{1}</span>'.format(structname,VarAttrs.Name,TemplatesUnitIdPrefix);
    listrefhtml +='<span id="{2}{0}{1}REFDATA" style="display: none"></span>'.format(structname,VarAttrs.Name,TemplatesUnitIdPrefix);
    listrefhtml +='</li>';
    return listrefhtml;
}

function singleRefTemplate(structname,VarAttrs,TemplatesUnitIdPrefix) {
    var srefhtml ='<li>';
    srefhtml += '<span onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    var jsonVarAttrs = JSON.stringify(VarAttrs);
    if(VarAttrs.Requiredness)
        srefhtml +='<span style="color: red">*</span>';
    srefhtml += '<span id="{0}singleRefVarAttrs" style="display: none">{1}</span>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,jsonVarAttrs);
    srefhtml += '<button onclick="get_Reference_List(\'{0}\',\'{1}\',\'{2}\')" style="width: auto">{1}</button><span id="{2}{0}{1}tdSelect"></span>'.format(structname,VarAttrs.Name,TemplatesUnitIdPrefix);
    srefhtml += '</span>';
    srefhtml += '<span style="display: none"  id="m{0}{1}">{1}</span>'.format(TemplatesUnitIdPrefix+structname,VarAttrs.Name);
    srefhtml += '<span id="{0}{1}REFDATA" style="display: none"></span>'.format(TemplatesUnitIdPrefix+structname,VarAttrs.Name);
    srefhtml += '</li>';
    return srefhtml;
}

function matrixTemplate(structname,VarAttrs,TemplatesUnitIdPrefix,valueDict) {
    var mathtml = "",hot,container,data1;
    mathtml +="<li>";
    if(VarAttrs.Requiredness)
        mathtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)"><span style="color: red">*</span>{0} [{1}x{2}]</span>'.format(VarAttrs.Name,VarAttrs.DimensionY,VarAttrs.DimensionX);
    else
        mathtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0} [{1}x{2}]</span>'.format(VarAttrs.Name,VarAttrs.DimensionY,VarAttrs.DimensionX);
    mathtml +='<span style="display: none">{0}</span>'.format(VarAttrs.Name);
    mathtml +='<div id="{0}matrix" style="margin-left: 30px"></div></li>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
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
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        autoWrapRow: true
        });
}

