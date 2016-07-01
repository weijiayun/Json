function get_chekbox_value(checkboxid,showcheckid) {
    if(document.getElementById(checkboxid).checked){
        document.getElementById(showcheckid).innerHTML= 'true';
    }
    else document.getElementById(showcheckid).innerHTML= 'false';
}

function shadowover(x) {
    x.style.backgroundColor = "gray";
}
function shadowout(x) {
    x.style.backgroundColor = "white";
}
function collapsewin(parentid) {
    var disp = document.getElementById(parentid).style;
    if (disp.display == "none")
        disp.display = "block";
    else 
        disp.display = "none";
}
function requiredInput(x) {
    var a = x.innerHTML;
    if (a == null || a == ""){
        alert("This is required!");
        return false;
    }
}
function get0bj(cnt,structid) {
    var structvalue = document.getElementById(structid).innerHTML;
    var jsonobj = JSON.parse(structvalue);
    var structname = jsonobj[0];
    var memberlist = jsonobj[1];

    newjsoncode=Object();
    for(var i=0;i<memberlist.length;i++){
        newjsoncode[memberlist[i]]=document.getElementById(cnt+structname+memberlist[i]).innerHTML;
    }

    return newjsoncode;
}
function convertToJson(obj) {
    return JSON.stringify(obj)
}
function showJson(cnt,structid,showjsonid){
    var result = get0bj(cnt,structid);
    var html = '<table class="jsoneditor-value">';
    for(var x in result){

        html += '<tr class="jsoneditor-tree"><td class="jsoneditor-tree"><div class="jsoneditor-readonly" style="margin-left: 24px">' + x+' = '+'<span style="color: coral">'+result[x]+'</span>'+ '</div></td></tr>';
    }
    html += '</table>';
    document.getElementById(showjsonid).innerHTML = html;
}
function selectshow(SelectElemId){
    var structvalue = document.getElementById("StructNameJson").innerHTML;
    var structNameList = JSON.parse(structvalue);
    for(var cnt = 0;cnt<structNameList.length;cnt++)
    {
        for(var elem of structNameList){
            document.getElementById(cnt+elem).style.display = "none";
            document.getElementById(cnt+elem+"ShowJsonWin").style.display = "none";
        }
    }
    var obj = document.getElementById(SelectElemId);
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;
    var disp1 = document.getElementById(valoption).style;
    var disp2 = document.getElementById(valoption+"ShowJsonWin").style;
    if (disp1.display == "none"){
        disp1.display = "block";
        disp2.display = "block";
    }
    else{
        disp1.display = "none";
        disp2.display = "none";
    }


}
