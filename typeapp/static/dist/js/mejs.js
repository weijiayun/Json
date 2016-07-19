function JsonFormatConvt(strNum) {
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
String.prototype.format=function()
{
    if(arguments.length==0) return this;
    for(var s=this, i=0; i<arguments.length; i++)
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
    return s;
};

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
            tempDict[header[j]]=JsonFormatConvt(t.rows[i].cells[j].innerHTML)
        }
        valueList[i-2]=tempDict;
        tempDict=null;
        tempDict = new Object();
    }
    var tempObj=new Object();
    tempObj[listName]=valueList;

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
            newjsoncode[memberlist[i]] = JsonFormatConvt(tempvalue);
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
function selectshow(SelectElemId){
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var obj = document.getElementById(SelectElemId);
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;
    var disp1 = document.getElementById(valoption).style;
    for(var e in jsonDict){
        var tempdisp = document.getElementById(e).style;
        if(e == valoption){
            tempdisp.display = "block";
        }
        else
            tempdisp.display = "none";
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
        //col.contentEditable="true";
        col.innerHTML=document.getElementById(tableId+i).value;
    }
    var collast=row.insertCell(collength);
    collast.innerHTML='<button onclick="delrow(this)" style="width: 55px">Delete</button>';
}
function treeToCode(SelectElemId) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var obj = document.getElementById(SelectElemId);
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;
    tbl = document.getElementById(valoption);
    Jsoncode = Object();
    for(var i=0;i<tbl.rows.length;i++){
        var r=tbl.rows[i];
        var varName = r.cells[1].innerHTML;
        var varType = jsonDict[valoption][valoption]["Fields"][varName]["Type"];
        if(varType == "string" || varType == "double"){
            Jsoncode[varName]=JsonFormatConvt(r.cells[3].innerHTML);
        }
        else if(varType.match("list&lt;")){
            i=i+1;
            listTbl = document.getElementById(valoption+varName+"csv");
            var cols = jsonDict[valoption][varType.slice(8,-4)]["Fields"];
            listDict = new Object();
            listArray = new Array();
            var colindex = 0;
            for(colName in cols){
                for(var li=2;li<listTbl.rows.length-1;li++){
                    listArray[li-2] = JsonFormatConvt(listTbl.rows[li].cells[colindex].innerHTML);
                }
                listDict[colName] = listArray;
                colindex += 1;
            }
            Jsoncode[varName]=listDict;
        }
        else if(varType == "bool"){
            Jsoncode[varName]=JsonFormatConvt(r.cells[3].innerHTML);
        }
        else if(varType.match("mat&lt;")||varType.match("vec&lt;")){
            i=i+1;
            matTbl = document.getElementById(valoption+varName+"matrix");
            matBigArr = new Array();
            matSmallArr = new Array();
            for(var mi=0;mi<matTbl.rows.length;mi++){
                for(var mj=0;mj<matTbl.rows[mi].cells.length;mj++){
                    matSmallArr[mj] = JsonFormatConvt(matTbl.rows[mi].cells[mj].innerHTML)
                }
                matBigArr[mi] = matSmallArr;
            }
            Jsoncode[varName] = matBigArr;
        }
        else if(varType.match("::")){
            Jsoncode[varName]=JsonFormatConvt(document.getElementById(valoption+varName+"select").value);
        }
    }
    
}
function csvTreeToJsonTree(StructName,varName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var listTbl = document.getElementById(StructName+varName+"csv");
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    var listDict = new Object();
    var listArray = new Array();
    var colindex = 0;
    for(var colName in cols){
        for(var li=2;li<listTbl.rows.length-1;li++){
            listArray[li-2] = JsonFormatConvt(listTbl.rows[li].cells[colindex].innerHTML);
        }
        listDict[colName] = listArray;
        colindex += 1;
    }
    var html = "<table style='margin-left: 40px' id='{0}'>".format(StructName+varName+"jsontree");
    for(var i=0;i<listTbl.rows.length-3;i++) {
        for (var e in listDict) {
            html += "<tr>";
            html += "<td class='jsoneditor-readonly'>" + e + ": " + "</td>";
            html += '<td class="jsoneditor-value.jsoneditor-number" contenteditable="true" spellcheck="false" style="width: 60px">'+listDict[e][i]+'</td>';
            html += "</tr>";
        }
    }
    html +="<tr><td><button onclick='jsonAdd(\"{0}\",\"{1}\")'>+</button>".format(StructName,varName);
    html +="<button onclick='jsondel(\"{0}\",\"{1}\")'>-</button></td></tr>".format(StructName,varName);
    html += "</table>";
    document.getElementById(StructName+varName+"showJson").innerHTML = html;
    document.getElementById(StructName+varName+"showCsv").style.display = "none";
}
function getPropertyCount(o){  
    var n, count = 0;  
    for(n in o){  
        if(o.hasOwnProperty(n)){  
            count++;  
        }  
    }  
    return count;  
}  
function jsonTreeToCodeTree(StructName,varName) {

    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var listTbl = document.getElementById(StructName+varName+"csv");
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    var tb1 = document.getElementById(StructName+varName+"jsontree");
    var listArray = new Array();
    for(var i1=0;i1<tb1.rows.length-1;i1++){
            listArray.push(tb1.rows[i1].cells[1].innerHTML);
    }
    document.getElementById(StructName+varName+"showCsv").style.display = "block";
    var colLen = getPropertyCount(cols);
    var rowLen = listArray.length/colLen;
    for(var k1=2;k1<tb2.rows.length-1;k1++){
        tb2.deleteRow(rowIndex-2);
    } 
    var tb2 = document.getElementById(StructName+varName+"csv");
    for(var i2=0;i2<rowLen;i2++){
        var row = tb2.insertRow(rowIndex);
        for(var j2=0;i<collength;j2++){
            var col=row.insertCell(j2);
            col.style.height="30px";
            col.innerHTML=listArray[j2+i2*colLen];
        }
        var collast=row.insertCell(collength);
        collast.innerHTML='<button onclick="delrow(this)" style="width: 55px">Delete</button>';
    }
    document.getElementById(StructName+varName+"showCsv").style.display = "block";
}

function jsonAdd(StructName,varName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var listTbl = document.getElementById(StructName+varName+"csv");
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    tb=document.getElementById(StructName+varName+"jsontree");
    for(var colelem in cols){
        rowIndex=tb.rows.length-1;
        var row = tb.insertRow(rowIndex);
        var col1=row.insertCell(0);
        col1.innerHTML = colelem+": ";
        var col2=row.insertCell(1);
        col2.setAttribute("contenteditable","true");
        col2.style.width="60px";
    }
}
function jsondel(StructName,varName) {
    var tb = document.getElementById(StructName+varName+"jsontree");
    var rowIndex = tb.rows.length;
    tb.deleteRow(rowIndex-2);
    tb.deleteRow(rowIndex-3);
}
