


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
    disp = document.getElementById(parentid).style;
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
function get0bj(structid) {
    var structvalue = document.getElementById(structid).innerHTML;
    var jsonobj = JSON.parse(structvalue);
    var structname = jsonobj[0];
    var memberlist = jsonobj[1];
    newjsoncode=new Object();
    for(var i=0;i<memberlist.length;i++){
        newjsoncode[memberlist[i]]=document.getElementById(structname+memberlist[i]).innerHTML;
    }
    return newjsoncode;
}
function convertToJson(obj) {
    return JSON.stringify(obj)
}
function showJson(structid) {
    var result = get0bj(structid);
    var html = '<ul>';
    for(var x in result){
        html += '<li>' + x+'='+result[x]+ '</li>';
    }
    html += '</ul>';
    document.getElementById('showjsondiv').innerHTML = html;
    
}