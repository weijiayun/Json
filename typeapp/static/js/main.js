/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    load1:TypesTemplate,
    load2:HtmlExcelAll
};
var PreloadFuncDict = {
    "MouseSelectCopyorPaste":function () {
        $(".MouseSelectCopy").mousedown(OnMouseDown(this));
        CopyAndPaste();
    },
    "InputCheck":function () {
        $('.jsoneditor-number').blur(function () {
          NumberChecktips(this);
        });
    },
    "HandleEnter":function () {
        $('span').keypress(function () {
            handleEnter(this,e);
        });
    }
};
function MatButoon(field) {
    $('#myModal').modal('show');
    var rowlen = parseInt($(field).attr("data-dimensionRows"));
    var collen = parseInt($(field).attr("data-dimensionCols"));
    var hot,container,data1;
    var datalist=[];
    var templlist = [];

    container = document.getElementById('bodymodal');
    hot = new Handsontable(container, {
        startRows:rowlen,
        startCols:collen,
        data:[],
        //columns:true,
        rowHeaders:true,
        colHeaders: true,
        minSpareRows:1,
        // //stretchH: 'all',
        // contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol'
        });
}
function HtmlExcelAll() {
    var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
    var ColumsAttr = [];
    var hot1,container1;
    for(var i in StrategyList){
        ColumsAttr.push(GetColumsAttrs(StrategyList[i]))
    }
    container1 = document.getElementById('loadlog');
    function InseritAttrFromColHeader(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (ColumsAttr[0][3][prop].Type === 'mat' || ColumsAttr[0][3][prop].Type === 'vec'){
            $(td).append("<button style='width: 100%;height: 100%' onclick='MatButoon(this)'  class=\"btn btn-primary btn-lg\">{0}</button>".format(prop));
            $(td).children().eq(0).attr("data-dimensionRows",ColumsAttr[0][3][prop].DimensionY);
            $(td).children().eq(0).attr("data-dimensionCols",ColumsAttr[0][3][prop].DimensionX);

        }
        // else if(ColumsAttr[0][3][colheader].Type === "list"){
        // }
    }
    Handsontable.renderers.registerRenderer('InseritAttrFromColHeader', InseritAttrFromColHeader);
    hot1 = new Handsontable(container1, {
        data: ColumsAttr[0][2],
        colHeaders: ColumsAttr[0][0],
        columns:ColumsAttr[0][1],
        rowHeaders:true,
        //colHeaders: true,
        minSpareRows: 1,
        stretchH: 'all',
        contextMenu: true,
        currentRowClassName: 'currentRow',
        currentColClassName: 'currentCol',
        cells:function (row, col, prop) {
            var cellProperties = {};
            if(ColumsAttr[0][3][prop].Type === 'mat' || ColumsAttr[0][3][prop].Type === 'vec') {
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
function TypesTemplate() {
    var html = "";
    html += '<div class="jsoneditor jsoneditor-mode-tree jsoneditor-tree">';
    var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
    html += "<div class='jsoneditor-selecttype'><span>{0}</span></div>".format(SelectTypeTemplate(StrategyList));
    for(var i in StrategyList){
        html += "<div><span id='{0}Parent'>{1}</span></div>".format(StrategyList[i],TypeUnitTemplate(StrategyList[i]));
    }
    html +="</div>";
    $("#loadlog").html(html);
    PreloadFuncDict.MouseSelectCopyorPaste();
    PreloadFuncDict.HandleEnter();
    PreloadFuncDict.InputCheck();
}
function TypeUnitTemplate(structname){
    var typehtml="";
    var StrategyDict = JSON.parse($("#JsonDict").html())["REFERENCES"];
    typehtml += "<ul id=\"{0}\" style=\"display: none;\">".format(structname);
    var FieldsVar = StrategyDict[structname].Fields;
    var FieldsVarAttrs = {};
    for(var varName in FieldsVar){
        FieldsVarAttrs = FieldsVar[varName];
        FieldsVarAttrs["Name"] = varName;
        if(!FieldsVarAttrs.Reference){
            if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32"||FieldsVarAttrs.Type == "string")
               typehtml += NumberandStringTemplate(structname,FieldsVarAttrs);
            else if(FieldsVarAttrs.Type == "enum"){
                var enumList = Object.getOwnPropertyNames(StrategyDict[FieldsVarAttrs.EleType].Fields);
                typehtml += enumTemplate(structname,enumList,FieldsVarAttrs)
            }
            else if(FieldsVarAttrs.Type.match("mat") ||FieldsVarAttrs.Type.match("vec"))
                typehtml += matrixTemplate(structname,FieldsVarAttrs);
            else if(FieldsVarAttrs.Type == "bool")
                typehtml += boolTemplate(structname,FieldsVarAttrs);
            else if(FieldsVarAttrs.Type.match("list"))
                typehtml += listTamplate(structname,StrategyDict[FieldsVarAttrs.EleType].Fields,FieldsVarAttrs,false,structname);
        }
        else {
            if(FieldsVarAttrs.Type.match("list"))
             typehtml += listRefTemplate(structname,FieldsVarAttrs);
            else if(FieldsVarAttrs.Type == "sint_32" || FieldsVarAttrs.Type == "uint_32")
                typehtml += singleRefTemplate(structname,FieldsVarAttrs);
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
function boolTemplate(structname,VarAttrs) {
    if(!VarAttrs.Default)
        VarAttrs.Default = false;
    var boolhtml = "";
    boolhtml += "<li id=\"{0}{1}bool\" style=\"display: block\">".format(structname,VarAttrs.Name);
    boolhtml += "<span>";
    if(VarAttrs.Requiredness == "bool")
        boolhtml +='<span style="color: red">*</span>';
    boolhtml += '</span>';
    boolhtml +='<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0}</span>'.format(VarAttrs.Name);
    boolhtml +='<span><input type="checkbox" value="0" id="m{0}{1}" onclick="get_chekbox_value(\'m{0}{1}\',\'{0}{1}\')\"/>'.format(structname,VarAttrs.Name);
    boolhtml +='<span style="color: deepskyblue" id="{0}{1}">{2}</span></span>'.format(structname,VarAttrs.Name,VarAttrs.Default);
    boolhtml +='<span style="display: none" id="{0}{1}boolval">{2}</span></li>'.format(structname,VarAttrs.name,VarAttrs.Default);
    return boolhtml;
}

function enumTemplate(structname,enumlist,VarAttrs) {
    var enumhtml = "";
    enumhtml = '<li id="{0}">'.format(structname+VarAttrs.Name);
    enumhtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)" >';
    if(VarAttrs.Requiredness )
        enumhtml += '<span style="color: red">*</span>';
    enumhtml +='<span >{0} </span>'.format(VarAttrs.Name);
    enumhtml +="<span class='dropdown'>";
    enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}enumSelect' data-toggle='dropdown'>".format(structname+VarAttrs.Name);
    enumhtml +="<span id=\"{0}{1}buttonValue\">{1}</span><span class='caret'></span></button>".format(structname,VarAttrs.Name);
    enumhtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in enumlist){
        enumhtml += "<li role=\"presentation\">";
        enumhtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_Drop_Select_value(\'{0}\',this)" name="{1}">{1}</a>'.format(structname+VarAttrs.Name,enumlist[i]);
        enumhtml += "</li>"
    }
    enumhtml += "</ul></span></span><span id=\"m{0}{1}\" style=\"display: none\">{1}</span></li>".format(structname,VarAttrs.Name);
    return enumhtml;
}
function get_Drop_Select_value(ID,obj){
    var id1 = "{0}enumSelect".format(ID);
    var id2 = "{0}buttonValue".format(ID);
    document.getElementById(id1).value = obj.name;
    document.getElementById(id2).innerHTML = obj.name;
}
function get_TypesSelect_Result(id,obj) {
    $("#{0}".format(id)).get(0).innerHTML=obj.name;
    var Typelist = JSON.parse($("#JsonDict").html())["REFLIST"];
    for(var e in Typelist){
        var tempdisp = document.getElementById(Typelist[e]).style;
        if(Typelist[e] == obj.name){
            tempdisp.display = "block";
        }
        else
            tempdisp.display = "none";
    }
}
function SelectTypeTemplate(typeslist) {
    var typeshtml = "<div>";
    typeshtml +="<span class='dropdown'>";
    typeshtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='StrategyTypesSelect' data-toggle='dropdown'>";
    typeshtml +="<span id=\"StrategyTypesButtonValue\">Types</span><span class='caret'></span></button>";
    typeshtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in typeslist){
        typeshtml += "<li role=\"presentation\">";
        typeshtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_TypesSelect_Result(\'{0}\',this)" name="{1}">{1}</a>'.format("StrategyTypesButtonValue",typeslist[i]);
        typeshtml += "</li>"
    }
    typeshtml += "</ul></span></div>";
    return typeshtml;
}

function NumberandStringTemplate(structname,VarAttrs) {
    var NumStrhtml = "";
    NumStrhtml += '<li style="display: block" onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    NumStrhtml += '<span>';
    if(VarAttrs.Requiredness )
        NumStrhtml +='<span style="color: red">*</span>';
    NumStrhtml += '</span>';
    NumStrhtml +="<span class=\"jsoneditor-readonly jsoneditor-value\"  id=\"m{0}{1}\">{1}</span>".format(structname,VarAttrs.Name);
    NumStrhtml += "<span>: </span>";
    NumStrhtml +='<span contenteditable="true" spellcheck="false" class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter" onkeypress="handleEnter(this,event)" id="{0}{1}">{2}</span></li>'.format(structname,VarAttrs.Name,VarAttrs.Default);
    return NumStrhtml;
}
function listTamplate(structname,listTypeFieldsDict,VarAttrs,IsReference,preStructName) {
    var struct = "";
    var name = "";
    var liId = "";
    if(IsReference){
        struct = preStructName;
        name = structname;
        preStructName=VarAttrs.Name;
        liId = struct+preStructName+name;
    }
    else {
        struct = structname;
        name = VarAttrs.Name;
        liId = struct+name;
    }
    var listhtml = "<li id='{0}'>".format(liId);
    listhtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    listhtml += '<button onclick="collapsewin(\'{0}{1}\')">^</button>{1}'.format(struct,name);
    listhtml += '<button id="{0}{1}GoJsonButton" onclick="csvTreeToJsonTree(\'{0}\',\'{1}\',\{2\},\'{3}\')" style="width: 60px;">Json</button>'.format(struct,name,IsReference,preStructName);
    listhtml += "</span>";
    listhtml += '<span style="display: none">{0}</span>'.format(name);
    listhtml += '</li>';
    listhtml += '<li id="{0}{1}" style="display: block">'.format(struct,name);
    listhtml += '<span id="{0}{1}showCsv">'.format(struct,name);
    //listtable
    listhtml += '<table style="margin-left: 30px" id="{0}{1}csv">'.format(struct,name);
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
        listhtml += '<td class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter MouseSelectCopy" contenteditable="true" onkeypress="handleEnter(this,event)" spellcheck="false" ></td>'
    listhtml += '</tr>';
    listhtml += '<tr>';
    listhtml += '<td><button style="width: 75px;" onclick="csvAddrow(\'{0}\',\'{1}\',\'csv\')" >Add</button></td>'.format(struct,name);
    listhtml += '</tr></tbody></table>';
    listhtml += "</span>";
    listhtml += '<span id="{0}{1}showJson"></span>'.format(struct,name);
    listhtml += '</li>';
    return listhtml;
}
function listRefTemplate(structname,VarAttrs) {
    var listrefhtml ="<li>";
    listrefhtml += '<span onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    if(VarAttrs.Requiredness)
        listrefhtml += '<span style="color: red">*</span>';
    var jsonVarAttrs = JSON.stringify(VarAttrs);
    listrefhtml += '<span id="{0}{1}singleRefVarAttrs" style="display: none">{2}</span><button onclick="get_Multi_Reference_List(\'{0}\',\'{1}\')" style="width: auto">{1}</button><span id="{0}{1}tdSelect"></span>'.format(structname,VarAttrs.Name,jsonVarAttrs);
    listrefhtml +='</span>';
    listrefhtml +='<span  style="display: none" id="m{0}{1}">{1}</span>'.format(structname,VarAttrs.Name);
    listrefhtml +='<span id="{0}{1}REFDATA" style="display: none"></span>'.format(structname,VarAttrs.Name);
    listrefhtml +='</li>';
    return listrefhtml;
}

function singleRefTemplate(structname,VarAttrs) {
    var srefhtml ='<li>';
    srefhtml += '<span onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    var jsonVarAttrs = JSON.stringify(VarAttrs);
    if(VarAttrs.Requiredness)
        srefhtml +='<span style="color: red">*</span>';
    srefhtml += '<span id="{0}singleRefVarAttrs" style="display: none">{1}</span>'.format(structname+VarAttrs.Name,jsonVarAttrs);
    srefhtml += '<button onclick="get_Reference_List(\'{0}\',\'{1}\')" style="width: auto">{1}</button><span id="{0}{1}tdSelect"></span>'.format(structname,VarAttrs.Name);
    srefhtml += '</span>';
    srefhtml += '<span style="display: none"  id="m{0}{1}">{1}</span>'.format(structname,VarAttrs.Name);
    srefhtml += '<span id="{0}{1}REFDATA" style="display: none"></span>'.format(structname,VarAttrs.Name);
    srefhtml += '</li>';
    return srefhtml;
}
function getDimention(vartype) {
    var typeSplit=vartype.split(/&lt;|&gt;|,/);
    if(typeSplit.length == 3)
        return [1,parseInt(typeSplit[1])];
    else
        return [parseInt(typeSplit[1]),parseInt(typeSplit[2])];
}
function matrixTemplate(structname,VarAttrs) {
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
    mathtml += '<table border="1" id="{0}{1}matrix" style="margin-left: 30px">'.format(structname,VarAttrs.Name);
    mathtml += '<tbody>';
    for(var i=0;i<parseInt(VarAttrs.DimensionY);i++){
        mathtml += '<tr style="height: 30px;">';
        for(var j=0;j<parseInt(VarAttrs.DimensionX);j++){
            mathtml += '<td class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter" onkeypress="handleEnter(this,event)"  contenteditable="true" spellcheck="false" ></td>'
        }
        mathtml += '</tr>';
    }

    mathtml +='<tr style="display: none"><td></td></tr>';
    mathtml +='</tbody></table></span></li>';
    return mathtml;
}

