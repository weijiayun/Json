function numberConvt(strNum) {
    var doubleTest = /^-*\d+.\d+$/;
    var intTest = /^-*\d+$/;
    var tempvalue;
    if(doubleTest.test(strNum))
        tempvalue = parseFloat(strNum);
    else if(intTest.test(strNum))
        tempvalue = parseInt(strNum);
    else
        tempvalue = strNum;
    return tempvalue;
}
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
function get_table_values(tableId,listName) {
    var t = document.getElementById(tableId);
    var header= new Array();
    for(var k=0;k<t.rows[0].cells.length;k++){
        header[k]=t.rows[0].cells[k].innerHTML;
    }
    var valueList = new Array();
    var tempDict = new Object();
    for(var i=2;i< t.rows.length-1;i++)
    {
        for(var j=0;j<t.rows[i].cells.length-1;j++)
        {
            tempDict[header[j]]=numberConvt(t.rows[i].cells[j].innerHTML)
        }
        valueList[i-2]=tempDict;
        tempDict=null;
        tempDict = new Object();
    }
    var tempObj=new Object();
    tempObj[listName]=valueList;

     alert(JSON.stringify(tempObj));
    
}

function get0bj(cnt) {
    var selectValue = document.getElementById(cnt+"typeselect").value;
    var structvalue = document.getElementById(selectValue+"jsoncodeid").innerHTML;
    var jsonobj = JSON.parse(structvalue);
    var structname = jsonobj[0];
    var memberlist = jsonobj[1];
    newjsoncode=Object();
    for(var i=0;i<memberlist.length;i++) {
        if (memberlist[i] == "Type")
            newjsoncode[memberlist[i]] = structname;
        else {
            var tempvalue = document.getElementById(cnt + structname + memberlist[i]).innerHTML;
            newjsoncode[memberlist[i]] = numberConvt(tempvalue);
        }
    }
    return [newjsoncode,JSON.stringify(newjsoncode)];
}
function clearObj(cnt) {
    var selectValue = document.getElementById(cnt+"typeselect").value;
    var structvalue = document.getElementById(selectValue+"jsoncodeid").innerHTML;
    var jsonobj = JSON.parse(structvalue);
    var structname = jsonobj[0];
    var memberlist = jsonobj[1];
    for(var i=0;i<memberlist.length;i++){
        if(memberlist[i]=="Type")
            document.getElementById(cnt+structname+memberlist[i]).innerHTML=structname;
        else
            document.getElementById(cnt+structname+memberlist[i]).innerHTML=null;
    }
}

function showJson(cnt,showjsonid){
    var DictAndJson = get0bj(cnt);
    var result =DictAndJson[0];
    var html = '<table class="jsoneditor-value">';
    for(var x in result){
        html += '<tr class="jsoneditor-tree"><td class="jsoneditor-tree"><div class="jsoneditor-readonly" style="margin-left: 24px">' + x+' = '+'<span style="color: coral">'+result[x]+'</span>'+ '</div></td></tr>';
    }
    html += '</table>';
    html += '<p class="jsoneditor-readonly" style="width: 460px">'+DictAndJson[1]+'</p>';
    document.getElementById(showjsonid).innerHTML = html;
}
function ButtonShowJson(cnt,showjsonid) {
    collapsewin(showjsonid + "ShowJsonWin");
    var DictAndJson = get0bj(cnt);
    var result = DictAndJson[0];
    var html = '<table class="jsoneditor-value">';
    for (var x in result) {
        html += '<tr class="jsoneditor-tree"><td class="jsoneditor-tree"><div class="jsoneditor-readonly" style="margin-left: 24px">' + x + ' = ' + '<span style="color: coral">' + result[x] + '</span>' + '</div></td></tr>';
    }
    html += '</table>';
    html += '<p class="jsoneditor-readonly" style="width: 460px">' + DictAndJson[1] + '</p>';
    document.getElementById(showjsonid + "showjsondiv").innerHTML = html;
}
function selectshow(item,SelectElemId){
    var structvalue = document.getElementById("StructNameJson").innerHTML;
    var structNameList = JSON.parse(structvalue);
    for(var cnt = 0;cnt<structNameList.length;cnt++)
    {
        for(var elem of structNameList){
            if(cnt == item){
                document.getElementById(cnt+elem).style.display = "none";
                document.getElementById(cnt+elem+"ShowJsonWin").style.display = "none";}
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
        //disp3.display = "none";
    }
}
function addItem(itemId) {
    var cnt = parseInt(itemId)+1;
    var disp = document.getElementById(cnt+"item").style.display = "block";
}
function deleteItem(itemId) {
    document.getElementById(itemId+"item").style.display = "none";
    clearObj(itemId);
}
function submitform(formName,inputValueID,cnt) {
    var selectValue = document.getElementById(cnt+"typeselect").value;
    var structvalue = document.getElementById(selectValue+"jsoncodeid").innerHTML;
    var jsonReqList = document.getElementById(selectValue+"jsonRequireId").innerHTML;
    var requireList = JSON.parse(jsonReqList);
    var jsonobj = JSON.parse(structvalue);
    var structname = jsonobj[0];
    var memberlist = jsonobj[1];
    FLAG=false;
    for(var i=0;i<memberlist.length;i++){
        if(requireList[i] == "required" && document.getElementById(cnt+structname+memberlist[i]).innerHTML.length==0){
            alert('You must insert the required * values');
            FLAG=false;
            break;
        }
        else
            FLAG=true;
    }
    if(FLAG){
        document.getElementById(inputValueID).value =get0bj(cnt)[1];
        // alert(document.getElementById(inputValueID).value =get0bj(cnt)[1]);
        document.forms[formName].submit();
    }

}
function submitAllForm(formName,inputValueID,totalStruct) {
    var allSelectedJsonStructInfo=Object();
    FLAG=false;
    for(var cnt=0;cnt<totalStruct;cnt++){
        if(document.getElementById(cnt+"item").style.display == "block"){
            var selectValue = document.getElementById(cnt+"typeselect").value;
            var structvalue = document.getElementById(selectValue+"jsoncodeid").innerHTML;
            var jsonReqList = document.getElementById(selectValue+"jsonRequireId").innerHTML;
            var requireList = JSON.parse(jsonReqList);
            var jsonobj = JSON.parse(structvalue);
            var structname = jsonobj[0];
            var memberlist = jsonobj[1];
            FLAG=false;
            for(var i=0;i<memberlist.length;i++){
                if(requireList[i] == "required" && document.getElementById(cnt+structname+memberlist[i]).innerHTML.length==0){
                    alert('You must insert the required * values of '+structname);
                    FLAG=false;
                    break;
                }
                else
                    FLAG=true;
            }
            if(FLAG){
                allSelectedJsonStructInfo[structname]=get0bj(cnt)[1];
            }
        }
    }
    if(FLAG){
        document.getElementById(inputValueID).value =JSON.stringify(allSelectedJsonStructInfo);
        // alert(document.getElementById(inputValueID).value =get0bj(cnt)[1]);
        document.forms[formName].submit();
    }
}
function delrow(obj) {
    var rowIndex = obj.parentNode.parentNode.rowIndex;
    var tableID = obj.parentElement.parentElement.parentElement.parentElement.id;
    var tb = document.getElementById(tableID);
    tb.deleteRow(rowIndex);
}

function addrow(tableId,collength,rowIndex,listName) {
    var tb = document.getElementById(tableId);
    if(rowIndex=="-1")
        rowIndex=tb.rows.length-1;
    var row = tb.insertRow(rowIndex);
    for(var i=0;i<collength;i++){
        var col=row.insertCell(i);
        col.style.height="30px";
        col.innerHTML=document.getElementById(tableId+i).value;
    }
    var collast=row.insertCell(collength);
    collast.innerHTML='<button onclick="delrow(this)" style="width: 55px">Delete</button>';
    alert(listName);
    get_table_values(tableId,listName)
}
