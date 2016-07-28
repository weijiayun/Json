/**
 * Created by jiayun.wei on 7/28/16.
 */
var app = {
    "load":""
};

function TypesTemplate() {
    var html = "";
    html += '<div class="jsoneditor jsoneditor-mode-tree">';
    html +='<div class="jsoneditor-tree">';
    html += '<table id="oTable" width="100%"><tbody>';
    var StrategyDict = JSON.parse($("#JsonDict"));
    var StructName="";
    for(StructName in StrategyDict){
        html +="<tr><td id='{0}Parent'>{1}</td></tr>".format(StructName,TypeUnitTemplate(StructName)) 
    }
    html +="</tbody></table></div></div>";
    return html;
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
    var html="";
    var StrategyDict = JSON.parse($("#JsonDict"));
    html += "<table id={0} style=\"display: none;margin-left: 40px\"><tbody>".format(structname); 
    var FieldsVar = StrategyDict[structname][structname].Fields;
    for(var varName in FieldsVar){
        FieldsVarAttrs.Name = varName;
        FieldsVarAttrs.Type = FieldsVar[varName].Type;
        FieldsVarAttrs.Required = FieldsVar[varName].Requiredness;
        FieldsVarAttrs.IsFixed = FieldsVar[varName].IsFixed;//tostring
        FieldsVarAttrs.Default = FieldsVar[varName].Default;//tostring
        FieldsVarAttrs.Reference = FieldsVar[varName].Reference;//tostring
        if(FieldsVarAttrs.Reference == "None"){
            if(FieldsVarAttrs.Type == "sint32" || FieldsVarAttrs.Type == "uint32"||FieldsVarAttrs.Type == "string")
               html += NuberandStringTemplate();
            else if(FieldsVarAttrs.Type.match("::"))
                html += enumTemplate();
            else if(FieldsVarAttrs.Type.match("mat<") ||FieldsVarAttrs.Type.match("vec<"))
                html += matrixTemplate();
            else if(FieldsVarAttrs.Type == "bool")
                html += boolTemplate();
        }
        else {
            if(FieldsVarAttrs.Type.match("list<"))
                html += listTamplate();
            else if(FieldsVarAttrs.Type == "sint32" || FieldsVarAttrs.Type == "uint32")
                html += singleRefTemplate();
        }
    }
    html += "</tbody></table>";
    return html;
}
function boolTemplate(structname) {
    var html = "";
    html += "<tr id=\"{0}{1}bool\" style=\"display: block\"><td>".format(structname,varAttrs.Name);
    if(varAttrs.Required == )
        {% if Required == "required" %}
            <span style="color: red">*</span>
        {% endif %}
    </td>
    <td class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)">{{ varName }}</td>
    <td class="jsoneditor-tree">
        <input type="checkbox" value="0" id="m{{ StructName }}{{ varName }}"
               onclick="get_chekbox_value('m{{ StructName }}{{ varName }}','{{ StructName }}{{ varName }}')"/>
        <span style="color: deepskyblue" id="{{ StructName }}{{ varName }}">{{ Default }}</span>
    </td>
    <td style="display: none" id="{{ StructName }}{{ varName }}boolval">{{ Default }}</td>
</tr>
}
function enumTemplate() {
    
}
function NuberandStringTemplate() {
    
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
