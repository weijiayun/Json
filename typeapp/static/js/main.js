/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    "load":TypesTemplate
};

function TypesTemplate(obj) {
    var html = "";
    html += '<div class="jsoneditor jsoneditor-mode-tree">';
    html +='<div class="jsoneditor-tree">';
    html += '<table id="oTable" width="100%"><tbody>';
    var StrategyDict = JSON.parse($("#JsonDict").html());
    var StructName="";
    for(StructName in StrategyDict){
        html +="<tr><td id='{0}Parent'>{1}</td></tr>".format(StructName,TypeUnitTemplate(StructName)) 
    }
    html +="</tbody></table></div></div>";
    $("#loadlog").html(html);
}
var FieldsVarAttrs= {
    "Name":"",
    "Type":"",
    "Required":"",
    "IsFixed":"",
    "Default":"",
    "Reference":""
};
function TypeUnitTemplate(structname){
    var typehtml="";
    var StrategyDict = JSON.parse($("#JsonDict").html());
    typehtml += "<table id={0} style=\"display: block;margin-left: 40px\"><tbody>".format(structname); 
    var FieldsVar = StrategyDict[structname][structname].Fields;
    for(var varName in FieldsVar){
        FieldsVarAttrs.Name = varName;
        FieldsVarAttrs.Type = FieldsVar[varName].Type;
        FieldsVarAttrs.Required = FieldsVar[varName].Requiredness;
        FieldsVarAttrs.IsFixed = FieldsVar[varName].IsFixed;//tostring
        FieldsVarAttrs.Default = FieldsVar[varName].Default;//tostring
        FieldsVarAttrs.Reference = String(FieldsVar[varName].Reference);//tostring
        if(FieldsVarAttrs.Reference == "null"){
            if(FieldsVarAttrs.Type == "sint32" || FieldsVarAttrs.Type == "uint32"||FieldsVarAttrs.Type == "string")
               typehtml += NuberandStringTemplate(structname);
            else if(FieldsVarAttrs.Type.match("::")){
                var enumList = Object.getOwnPropertyNames(StrategyDict[structname][FieldsVarAttrs.Type]);
                typehtml += enumTemplate(structname,enumList)
            }
            //
            // else if(FieldsVarAttrs.Type.match("mat<") ||FieldsVarAttrs.Type.match("vec<"))
            //     typehtml += matrixTemplate();
            else if(FieldsVarAttrs.Type == "bool")
                typehtml += boolTemplate(structname);
        }
        // else {
        //     if(FieldsVarAttrs.Type.match("list<"))
        //         typehtml += listTamplate();
        //     else if(FieldsVarAttrs.Type == "sint32" || FieldsVarAttrs.Type == "uint32")
        //         typehtml += singleRefTemplate();
        // }
    }
    typehtml += "</tbody></table>";
    return typehtml;
}
function boolTemplate(structname) {
    var boolhtml = "";
    boolhtml += "<tr id=\"{0}{1}bool\" style=\"display: block\"><td>".format(structname,FieldsVarAttrs.Name);
    if(FieldsVarAttrs.Required == "bool")
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
    if(FieldsVarAttrs.Required == "required")
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

function NuberandStringTemplate(structname) {
    var NumStrhtml = "";
    NumStrhtml += '<tr style="display: block" onmouseover="shadowover(this)" onmouseout="shadowout(this)"><td>'; 
    if(FieldsVarAttrs.Required == "required")
        NumStrhtml +='<span style="color: red">*</span>'; 
    NumStrhtml +="</td><td class=\"jsoneditor-readonly jsoneditor-value\"  id=\"m{0}{1}\">{1}: </td>".format(structname,FieldsVarAttrs.Name);
    NumStrhtml +='<td contenteditable="true" spellcheck="false" class="jsoneditor-value jsoneditor-number jsoneditor-listinput handleEnter" id="{0}{1}">{2}</td></tr>'.format(structname,FieldsVarAttrs.Name,FieldsVarAttrs.Default);
    return NumStrhtml;
}
function listTamplate() {
    
    
}
function listRefTemplate() {
    
}
function singleRefTemplate() {
    
}
function matrixTemplate() {
    
}
function selectTemplate() {
    
}
