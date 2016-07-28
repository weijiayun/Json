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
        html +="<tr><td id='{0}Parent'>{1}</td></tr>".format(StructName,TypeUnitTemplate()) 
    }
    html +="</tbody></table></div></div>";
}
function TypeUnitTemplate() {
    
    
}
function boolTemplate() {
    
}
function doubleTemplate() {
    
}
function listTamplate() {
    
}
function matrixTemplate() {
    
}
function selectTemplate() {
    
}
