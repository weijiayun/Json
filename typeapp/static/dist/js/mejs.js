
function getvalue(id) {
    var value = document.getElementById(id).innerHTML;
}

function get_chekbox_value(checkboxid,showcheckid) {
    if(document.getElementById(checkboxid).checked){
        document.getElementById(showcheckid).innerHTML= 'True';
    }
    else document.getElementById(showcheckid).innerHTML= 'False';
}
function hightlightBack() {
    ;
}