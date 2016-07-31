/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    "load":TypesTemplate
};
var PreloadFuncDict = {
    "MouseSelectCopyorPaste":function () {
        $(".MouseSelectCopy").mousedown(OnMouseDown);
        CopyAndPaste();
    },
    "InputCheck":function () {
        $('.jsoneditor-number').blur(function () {
          NumberChecktips(this);
        });
    },
    "HandleEnter":function () {
        $('td').keypress(function () {
            handleEnter(this,e);
        });
    }

};
function TypesTemplate() {
    var html = "";
    html += '<div class="jsoneditor jsoneditor-mode-tree">';
    html +='<div class="jsoneditor-tree">';
    html += '<table id="oTable" width="100%"><tbody>';
    var StrategyDict = JSON.parse($("#JsonDict").html());
    var StructName="";
    html += "<tr><td>{0}</td></tr>".format(SelectTypeTemplate(Object.getOwnPropertyNames(StrategyDict)));
    for(StructName in StrategyDict){
        html +="<tr><td id='{0}Parent'>{1}</td></tr>".format(StructName,TypeUnitTemplate(StructName)) 
    }
    html +="</tbody></table></div></div>";
    $("#loadlog").html(html);
    PreloadFuncDict.MouseSelectCopyorPaste();
    PreloadFuncDict.HandleEnter();
    PreloadFuncDict.InputCheck();
}
var FieldsVarAttrs = {};
function TypeUnitTemplate(structname){
    var typehtml="";
    var StrategyDict = JSON.parse($("#JsonDict").html());
    typehtml += "<table id=\"{0}\" style=\"display: none;margin-left: 40px\"><tbody>".format(structname);
    var FieldsVar = StrategyDict[structname][structname].Fields;
    for(var varName in FieldsVar){
        FieldsVarAttrs = FieldsVar[varName];
        FieldsVarAttrs["Name"] = varName;

        if(!FieldsVarAttrs.Reference){
            if(FieldsVarAttrs.Type == "sint32" || FieldsVarAttrs.Type == "uint32"||FieldsVarAttrs.Type == "string")
               typehtml += NumberandStringTemplate(structname);
            else if(FieldsVarAttrs.Type.match("::")){
                var enumList = Object.getOwnPropertyNames(StrategyDict[structname][FieldsVarAttrs.Type]);
                typehtml += enumTemplate(structname,enumList)
            }
            else if(FieldsVarAttrs.Type.match("mat&lt;") ||FieldsVarAttrs.Type.match("vec&lt;"))
                typehtml += matrixTemplate(structname);
            else if(FieldsVarAttrs.Type == "bool")
                typehtml += boolTemplate(structname);
            else if(FieldsVarAttrs.Type.match("list&lt;"))
                typehtml += listTamplate(structname,StrategyDict[structname][FieldsVarAttrs.Type.split(/&lt;|&gt;/g)[1]].Fields);
        }
        else {
            if(FieldsVarAttrs.Type.match("list&lt;"))
             typehtml += listRefTemplate(structname);
            else if(FieldsVarAttrs.Type == "sint32" || FieldsVarAttrs.Type == "uint32")
                typehtml += singleRefTemplate(structname);
         }
    }
    typehtml += "</tbody></table>";
    return typehtml;
}
function boolTemplate(structname) {
    var boolhtml = "";
    boolhtml += "<tr id=\"{0}{1}bool\" style=\"display: block\"><td>".format(structname,FieldsVarAttrs.Name);
    if(FieldsVarAttrs.Requiredness == "bool")
            boolhtml +='<span style="color: red">*</span></td>';
    boolhtml +='<td class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0}</td>'.format(FieldsVarAttrs.Name);
    boolhtml +='<td class="jsoneditor-tree">';
    boolhtml +='<input type="checkbox" value="0" id="m{0}{1}" onclick="get_chekbox_value(\'m{0}{1}\',\'{0}{1}\')\"/> ';
    boolhtml +='<span style="color: deepskyblue" id="{0}{1}">{2}</span></td>'.format(structname,FieldsVarAttrs.Name,FieldsVarAttrs.Default);
    boolhtml +='<td style="display: none" id="{0}{1}boolval">{2}</td></tr>'.format(structname,FieldsVarAttrs.name,FieldsVarAttrs.Default);
    return boolhtml;
}
function enumTemplate(structname,enumlist) {
    var enumhtml = "";
    enumhtml = '<tr id="{0}">'.format(structname+FieldsVarAttrs.Name);
    enumhtml += '<td class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)" >';
    if(FieldsVarAttrs.Requiredness == "required")
        enumhtml += '<span style="color: red">*</span>'; 
    enumhtml +='<span >{0} </span>'.format(FieldsVarAttrs.Name);
    enumhtml +="<span class='dropdown'>";
    enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}enumSelect' data-toggle='dropdown'>".format(structname+FieldsVarAttrs.Name);
    enumhtml +="<span id=\"{0}{1}buttonValue\">{1}</span><span class='caret'></span></button>".format(structname,FieldsVarAttrs.Name);
    enumhtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in enumlist){
        enumhtml += "<li role=\"presentation\">";
        enumhtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="returnval(\'{0}{1}\',this)" name="{2}">{2}</a>'.format(structname,FieldsVarAttrs.Name,enumlist[i]);
        enumhtml += "</li>"
    }
    enumhtml += "</ul></span></td><td id=\"m{0}{1}\" style=\"display: none\">{1}</td></tr>".format(structname,FieldsVarAttrs.Name);
    return enumhtml;
}
function get_TypesSelect_Result(id,obj) {
    $("#{0}".format(id)).get(0).innerHTML=obj.name;
    var Typelist = Object.getOwnPropertyNames(JSON.parse($("#JsonDict").html()));
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
    //var jsontypelist = JSON.stringify(typeslist);
    for(var i in typeslist){
        typeshtml += "<li role=\"presentation\">";
        typeshtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_TypesSelect_Result(\'{0}\',this)" name="{1}">{1}</a>'.format("StrategyTypesButtonValue",typeslist[i]);
        typeshtml += "</li>"
    }
    typeshtml += "</ul></span></div>";
    return typeshtml;
}

function NumberandStringTemplate(structname) {
    var NumStrhtml = "";
    NumStrhtml += '<tr style="display: block" onmouseover="shadowover(this)" onmouseout="shadowout(this)"><td>'; 
    if(FieldsVarAttrs.Requiredness == "required")
        NumStrhtml +='<span style="color: red">*</span>'; 
    NumStrhtml +="</td><td class=\"jsoneditor-readonly jsoneditor-value\"  id=\"m{0}{1}\">{1}: </td>".format(structname,FieldsVarAttrs.Name);
    NumStrhtml +='<td contenteditable="true" spellcheck="false" class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter" onkeypress="handleEnter(this,event)" id="{0}{1}">{2}</td></tr>'.format(structname,FieldsVarAttrs.Name,FieldsVarAttrs.Default);
    return NumStrhtml;
}
function listTamplate(structname,listTypeFieldsDict) {
    var listhtml = "<tr>";
    listhtml += '<td class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    listhtml += '<button onclick="collapsewin(\'{0}{1}\')">^</button>{1}'.format(structname,FieldsVarAttrs.Name);
    listhtml += '<button id="{0}{1}GoJsonButton" onclick="csvTreeToJsonTree(\'{0}\',\'{1}\')" style="width: 60px;">Json</button>'.format(structname,FieldsVarAttrs.Name);
    listhtml += "</td>";
    listhtml += '<td style="display: none">{0}</td>'.format(FieldsVarAttrs.Name);
    listhtml += '</tr>';
    listhtml += '<tr id="{0}{1}" style="display: block">'.format(structname,FieldsVarAttrs.Name);
    listhtml += '<td id="{0}{1}showCsv">'.format(structname,FieldsVarAttrs.Name);

    //listtable
    listhtml += '<table style="margin-left: 30px" id="{0}{1}csv">'.format(structname,FieldsVarAttrs.Name);
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
        if(listVars.Requiredness == "required")
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
    listhtml += '<td><button style="width: 75px;" onclick="csvAddrow(\'{0}\',\'{1}\',\'csv\')" >Add</button></td>'.format(structname,FieldsVarAttrs.Name);
    listhtml += '</tr></tbody></table>';
    listhtml += "</td>";
    listhtml += '<td id="{0}{1}showJson"></td>'.format(structname,FieldsVarAttrs.Name);
    listhtml += '</tr>';
    return listhtml;
}
function listRefTemplate(structname) {
    var listrefhtml ="<tr>";
    listrefhtml += '<td onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    if(FieldsVarAttrs.Requiredness == "required")
        listrefhtml += '<span style="color: red">*</span> <button onclick="get_Multi_Reference_List(\'{0}\',\'{1}\')" style="width: auto">{1}</button><span  id="{0}{1}tdSelect"></span>'.format(structname,FieldsVarAttrs.Name);
    listrefhtml +='</td>';
    listrefhtml +='<td  style="display: none" id="m{0}{1}">{1}</td>'.format(structname,FieldsVarAttrs.Name);
    listrefhtml +='<td id="{0}{1}REFDATA" style="display: none"></td>'.format(structname,FieldsVarAttrs.Name);
    listrefhtml +='</tr>';
    return listrefhtml;
}
function singleRefTemplate(structname) {
    var srefhtml ='<tr>';
    srefhtml += '<td onmouseover="shadowover(this)" onmouseout="shadowout(this)">';
    if(FieldsVarAttrs.Requiredness == 'required')
            srefhtml +='<span style="color: red">*</span><button onclick="get_Reference_List(\'{0}\',\'{1}\')" style="width: auto">{1}</button><span id="{0}{1}tdSelect"></span>'.format(structname,FieldsVarAttrs.Name);
    srefhtml += '</td>';
    srefhtml += '<td style="display: none"  id="m{0}{1}">{1}</td>'.format(structname,FieldsVarAttrs.Name);
    srefhtml += '<td id="{0}{1}REFDATA" style="display: none"></td>'.format(structname,FieldsVarAttrs.Name);
    srefhtml += '</tr>';
    return srefhtml;
}
function getDimention(vartype) {
    var typeSplit=FieldsVarAttrs.Type.split(/&lt;|&gt;|,/);
    if(typeSplit.length == 3)
        return [1,parseInt(typeSplit[1])];
    else
        return [parseInt(typeSplit[1]),parseInt(typeSplit[2])];
}
function matrixTemplate(structname) {
    var mathtml = "";
    mathtml +="<tr>";
    var matDim = getDimention(FieldsVarAttrs.Type);
    if(FieldsVarAttrs.Requiredness == "required")
        mathtml += '<td class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)"><span style="color: red">*</span>{0} [{1}x{2}]</td>'.format(FieldsVarAttrs.Name,matDim[0],matDim[1]);
    else
        mathtml += '<td class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{0} [{1}x{2} }}]</td>'.format(FieldsVarAttrs.Name,matDim[0],matDim[1]);
    mathtml +='<td style="display: none">{0}</td>'.format(FieldsVarAttrs.Name);
    mathtml +='</tr>';
    mathtml +='<tr>';
    mathtml +='<td>';
    mathtml += '<table border="1" id="{0}{1}matrix" style="margin-left: 30px">'.format(structname,FieldsVarAttrs.Name);
    mathtml += '<tbody>';
    for(var i=0;i<matDim[0];i++){
        mathtml += '<tr style="height: 30px;">';
        for(var j=0;j<matDim[1];j++){
            mathtml += '<td class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter MouseSelectCopy" onkeypress="handleEnter(this,event)"  contenteditable="true" spellcheck="false" ></td>'
        }
        mathtml += '</tr>';
    }
    mathtml +='<tr style="display: none"><td></td></tr>';
    mathtml +='</tbody></table></td></tr>';
    return mathtml;
}
function selectTemplate() {

}
