/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    load:TypesTemplate,
    load2:HtmlExcelAll
};

var WindowTables={};
function MatButoon(field) {
    var hot,container0,container,data1;
    container0 = document.getElementById('bodymodal');
    $(container0).children().remove();
    $(container0).append("<div class='handsontable htRowHeaders htColumnHeaders'></div>");
    container = $(container0).children().get(0);
    var rowlen = parseInt($(field).attr("data-dimensionRows"));
    var collen = parseInt($(field).attr("data-dimensionCols"));
    var rowindex = parseInt($(field).attr("data-Rows"));
    var colindex = parseInt($(field).attr("data-Cols"));
    var colHeader = parseInt($(field).attr("data-prop"));
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
    WindowTables['hot'+colHeader+"Row"+rowindex+"Col"+colindex] = hot;

    $('#myModal').modal('show');
    function savedata() {
        $(field).val(JSON.stringify(WindowTables['hot'+colHeader+"Row"+rowindex+"Col"+colindex].getData()))

    }
    $(function () { $('#myModal').on('hide.bs.modal', savedata)});

}

function SaveBigTableData() {
    Handsontable.Dom.addEvent(document.body, 'click', function (e) {
        var element = e.target || e.srcElement;
        if (element.nodeName == "BUTTON" && element.name == 'dump') {
            var name = element.getAttribute('data-dump');
            var instance = element.getAttribute('data-instance');
            var hot = window[instance];
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
                        if(listTest.test($(td).children().eq(0).val()))
                            tempdict[theader] = JSON.parse($(td).children().eq(0).val()).map(function(s){ return s.map(function (se){ return JsonFormatConvt(se)})});
                        else
                            tempdict[theader] = JsonFormatConvt($(td).children().eq(0).val())
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
    });
}
var hot1;
function HtmlExcelAll() {
    var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
    var ColumsAttr = [];
    var container1;
    for(var i in StrategyList){
        ColumsAttr.push(GetColumsAttrs(StrategyList[i]))
    }
    container1 = document.getElementById('loadlog');
    function InseritAttrFromColHeader(instance, td, row, col, prop, value, cellProperties) {
        //Handsontable.renderers.TextRenderer.apply(this, arguments);
        var currentRowindex = $(".currentRow").eq(0).parent().index();
        if($(td).parent().index() != currentRowindex){
            if($(td).children().length==0) {
                $(td).html("<button  onclick='MatButoon(this)'>{0}</button>".format(prop));
                $(td).children().eq(0).attr("data-dimensionRows", ColumsAttr[0][3][prop].DimensionY);
                $(td).children().eq(0).attr("data-dimensionCols", ColumsAttr[0][3][prop].DimensionX);
                $(td).children().eq(0).attr("data-Rows", row);
                $(td).children().eq(0).attr("data-Cols", col);
                $(td).children().eq(0).attr("data-Prop", prop);
            }
                var a3 = $(td).parent().parent().children().eq(currentRowindex).children().eq(col+1).children().eq(0).val();
                $(td).children().eq(0).val(a3);
            }
        SaveBigTableData();
        // else if(ColumsAttr[0][3][colheader].Type === "list"){
        // }
    }
    Handsontable.renderers.registerRenderer('InseritAttrFromColHeader', InseritAttrFromColHeader);
    hot1 = new Handsontable(container1, {
        data: ColumsAttr[0][2],
        colHeaders: ColumsAttr[0][0],
        columns:ColumsAttr[0][1],
        manualColumnMove: true,
        manualRowMove: true,
        manualColumnResize: true,
        manualRowResize: true,
        rowHeaders:true,
        colHeights:100,
        //colHeaders: true,
        //minSpareRows: 1,
        stretchH: 'all',
        contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        cells:function (row, col, prop) {
            var cellProperties = {};
            if (ColumsAttr[0][3][prop].Type === 'mat' || ColumsAttr[0][3][prop].Type === 'vec') {
                cellProperties.renderer = "InseritAttrFromColHeader";
            }
            return cellProperties;
        }
    });

        // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        function strip_tags(input, allowed) {
          var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

          // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
          allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

          return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
          });
        }
        function safeHtmlRenderer(instance, td, row, col, prop, value, cellProperties) {
          var escaped = Handsontable.helper.stringify(value);
          escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
          td.innerHTML = escaped;

          return td;
        }

}

function GetColumsAttrs(structname) {
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
                //colAttrDict.type = "html";
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
            // else if(FieldsVarAttrs.Type.match("list"))
            //     typehtml += listTamplate(structname,StrategyDict[FieldsVarAttrs.EleType].Fields,FieldsVarAttrs,false,structname);
        }
        // else {
        //     if(FieldsVarAttrs.Type.match("list"))
        //      typehtml += listRefTemplate(structname,FieldsVarAttrs);
        //     else if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32")
        //         typehtml += singleRefTemplate(structname,FieldsVarAttrs);
        //  }
    }
    return [colHeaders,ColumsAttrList,[ColDataDict],FieldsVar];
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
        $("#loadlog").append(html);
    }
    $("#loadlog").children().each(function () {
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
    $("#loadlog").append(html);
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
function boolTemplate(structname,VarAttrs,TemplateUnitIdPrefix) {
    if(!VarAttrs.Default)
        VarAttrs.Default = false;
    var boolhtml = "";
    boolhtml += "<li id=\"{0}{1}{2}bool\" style=\"display: block\">".format(TemplateUnitIdPrefix,structname,VarAttrs.Name);
    boolhtml += "<span>";
    if(VarAttrs.Requiredness == "bool")
        boolhtml +='<span style="color: red">*</span>';
    boolhtml += '</span>';
    boolhtml +='<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0}</span>'.format(VarAttrs.Name);
    boolhtml +='<span><input type="checkbox" value="0" id="m{0}{1}{2}" onclick="get_chekbox_value(\'m{0}{1}{2}\',\'{0}{1}{2}\')\"/>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name);
    boolhtml +='<span style="color: deepskyblue" id="{0}{1}{2}"> {3}</span></span>'.format(TemplateUnitIdPrefix,structname,VarAttrs.Name,VarAttrs.Default);
    boolhtml +='<span style="display: none" id="{0}{1}{2}boolval">{3}</span></li>'.format(TemplateUnitIdPrefix,structname,VarAttrs.name,VarAttrs.Default);
    return boolhtml;
}

function enumTemplate(structname,enumlist,VarAttrs,TemplatesUnitIdPrefix) {
    var enumhtml = "";
    enumhtml = '<li id="{0}">'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    enumhtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)" >';
    if(VarAttrs.Requiredness )
        enumhtml += '<span style="color: red">*</span>'; 
    enumhtml +='<span >{0} </span>'.format(VarAttrs.Name);
    enumhtml +="<span class='dropdown'>";
    enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}enumSelect' data-toggle='dropdown'>".format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    enumhtml +="<span id=\"{0}{1}{2}buttonValue\">{2}</span><span class='caret'></span></button>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    enumhtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in enumlist){
        enumhtml += "<li role=\"presentation\">";
        enumhtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_Drop_Select_value(\'{0}\',this)" name="{1}">{1}</a>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,enumlist[i]);
        enumhtml += "</li>"
    }
    enumhtml += "</ul></span></span><span id=\"m{0}{1}{2}\" style=\"display: none\">{2}</span></li>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    return enumhtml;
}
function get_Drop_Select_value(ID,obj){
    var id1 = "{0}enumSelect".format(ID);
    var id2 = "{0}buttonValue".format(ID);
    document.getElementById(id1).value = obj.name;
    document.getElementById(id2).innerHTML = obj.name;
}


function NumberandStringTemplate(structname,VarAttrs,TemplatesUnitIdPrefix) {
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
    if(VarAttrs.Default == null)
        VarAttrs.Default = "";
    NumStrhtml +='<td contenteditable="true" spellcheck="false" class="jsoneditor-number jsoneditor-value jsoneditor-listinput handleEnter" onkeypress="handleEnter(this,event)" onblur="NumberChecktips(this)" id="{0}{1}{2}">{3}</td></li>'.format(TemplatesUnitIdPrefix,structname,VarAttrs.Name,VarAttrs.Default);
    NumStrhtml += '</tr></table>';
    return NumStrhtml;
}
function listTamplate(structname,listTypeFieldsDict,VarAttrs,IsReference,preStructName,TemplatesUnitIdPrefix) {
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
    listhtml += '<button id="{3}{0}{1}GoJsonButton" onclick="csvTreeToJsonTree(\'{0}\',\'{1}\',\{2\},\'{4}\',\'{3}\')" style="width: 60px;">Json</button>'.format(struct,name,IsReference,TemplatesUnitIdPrefix,preStructName);
    listhtml += "</span>";
    listhtml += '<span style="display: none">{0}</span>'.format(name);
    listhtml += '</li>';
    listhtml += '<li id="{0}" style="display: block">'.format(listIdBase);
    listhtml += '<span id="{0}showCsv">'.format(listIdBase);
    //listtable
    listhtml += '<table style="margin-left: 30px" id="{0}csv">'.format(listIdBase);
    listhtml += '<tbody>';
    listhtml += '<tr style="display: none">';
    var listheadername = "";
    for(listheadername in listTypeFieldsDict)
        listhtml += '<th>{0}</th>'.format(listheadername);
    listhtml += '</tr>';
    listhtml += '<tr style="height: 30px">';
    for(listheadername in listTypeFieldsDict){
        var listVars = listTypeFieldsDict[listheadername];
        listhtml += '<th style="text-align: center">';
        if(listVars.Requiredness )
            listhtml += '<span style="color: red">*</span>{0}'.format(listheadername);
        else
            listhtml += '<span>{0}</span>'.format(listheadername);
        listhtml += '</th>';
    }
    listhtml +='</tr>';
    listhtml +='<tr>';
    for(listheadername in listTypeFieldsDict)
        listhtml += '<td class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter MouseSelectCopy" contenteditable="true" onkeypress="handleEnter(this,event)" onblur="NumberChecktips(this)" onmousedown="OnMouseDown(this,\'list\')"  spellcheck="false" ></td>'
    listhtml += '<td style="display: none"></td>';
    listhtml += '</tr>';
    listhtml += '<tr>';
    listhtml += '<td><button style="width: 75px;" onclick="csvAddrow(\'{0}\')" >Add</button></td>'.format(listIdBase+"csv");
    listhtml += '</tr></tbody></table>';
    listhtml += "</span>";
    listhtml += '<span id="{0}showJson"></span>'.format(listIdBase);
    listhtml += '</li>';
    return listhtml;
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

function matrixTemplate(structname,VarAttrs,TemplatesUnitIdPrefix) {
    var mathtml = "";
    mathtml +="<li>";
    if(VarAttrs.Requiredness)
        mathtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)"><span style="color: red">*</span>{0} [{1}x{2}]</span>'.format(VarAttrs.Name,VarAttrs.DimensionY,VarAttrs.DimensionX);
    else
        mathtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0} [{1}x{2}]</span>'.format(VarAttrs.Name,VarAttrs.DimensionY,VarAttrs.DimensionX);
    mathtml +='<span style="display: none">{0}</span>'.format(VarAttrs.Name);
    mathtml +='</li>';
    mathtml +='<li>';
    mathtml +='<span>';
    mathtml += '<table border="1" id="{0}{1}matrix" style="margin-left: 30px">'.format(TemplatesUnitIdPrefix+structname,VarAttrs.Name);
    mathtml += '<tbody>';
    for(var i=0;i<parseInt(VarAttrs.DimensionY);i++){
        var backgroundcolor = RowsColor(i+1);
        mathtml += '<tr style="height: 30px;">';
        for(var j=0;j<parseInt(VarAttrs.DimensionX);j++){
            mathtml += '<td class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter MouseSelectCopy" style="background-color: {0}"   onkeypress="handleEnter(this,event)" onblur="NumberChecktips(this)" onmousedown="OnMouseDown(this,\'mat\')"  spellcheck="false" contenteditable="true"></td>'.format(backgroundcolor);
        }
        mathtml += '</tr>';
    }
    mathtml +='</tbody></table></span></li>';
    return mathtml;
}

