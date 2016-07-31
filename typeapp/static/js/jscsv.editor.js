// $(document).ready(function (){
//     $('.handleEnter').keypress(function (event) {handleEnter(this,event)});
//     $('.jsoneditor-number').blur(function(){NumberChecktips(this)});
// });

function JsonFormatConvt(strNum) {
    var doubleTest = /^-*\d+.\d+$/i;
    var intTest = /^-*\d+$/i;
    var falseTest = /^False$/i;
    var trueTest = /^True$/i;
    strNum = strNum.replace(new RegExp("\\<br\\>","g"),"");
    var tempvalue;
    if(doubleTest.test(strNum))
        tempvalue = parseFloat(strNum);
    else if(intTest.test(strNum))
        tempvalue = parseInt(strNum);
    else if(falseTest.test(strNum))
        tempvalue = false;
    else if(trueTest.test(strNum))
        tempvalue = true;
    else
        tempvalue = strNum;
    return tempvalue;
}

var ColorCount=1;
var colorBoard = ['grey','darkgray'];
function randomColor() {
    var id = ColorCount==0?1:0;
    ColorCount=id;
    return colorBoard[id];
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

function shadowover(x) {
    x.style.backgroundColor = "gray";
    x.style.borderRadius="2px";
}
function shadowout(x) {
    x.style.backgroundColor = "white";
}
function overbutton(obj) {
    obj.childNodes.style.display="block";
}
function outbutton(obj) {
    obj.childNodes.style.display="none";
}
function collapsewin(parentid) {
    var disp = document.getElementById(parentid).style;
    if (disp.display == "none")
        disp.display = "block";
    else
        disp.display = "none";
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

function showButtonOver(obj) {
    obj.lastChild.firstChild.style.display="block";
}

function showButtonOut(obj) {
    obj.lastChild.firstChild.style.display="none";
}
function csvAddrow(structName,varName,idSufix) {
    var tableId = structName+varName+idSufix;
    var tb = document.getElementById(tableId);
    var colLen = tb.rows[0].cells.length;
    var rowIndex=tb.rows.length-1;
    var row = tb.insertRow(rowIndex);
    var bkgcolor = randomColor();
    row.setAttribute("onmouseover","showButtonOver(this)");
    row.setAttribute("onmouseout","showButtonOut(this)");
    for(var i=0;i<colLen;i++){
        var col=row.insertCell(i);
        col.setAttribute("spellcheck","false");
        col.setAttribute("onmousedown","OnMouseDown(this)");
        //col.setAttribute("onkeyup","onlyNumberAfterPress(this)");
        //col.setAttribute("onbeforepaste","onlyNumberBeforePaste(this)");
        col.setAttribute("onblur",'NumberChecktips(this)');
        col.setAttribute("class","jsoneditor-value jsoneditor-number MouseSelectCopy");
        col.setAttribute("contenteditable","true");
        col.setAttribute("onkeypress","handleEnter(this,event)");
        //col.innerHTML=document.getElementById(tableId+i).innerHTML;
        col.style.textAlign="center";
        col.style.backgroundColor=bkgcolor;
        col.setAttribute("spellcheck","false");
    }
    var collast=row.insertCell(colLen);
    collast.innerHTML='<button onclick="delrow(this)" style="width: 75px;display: none" >Delete</button>';
}
function treeToCode(SelectElemId) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var obj = document.getElementById(SelectElemId);
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;
    tbl = document.getElementById(valoption);
    Jsoncode = Object();
    for (var i = 0; i < tbl.rows.length; i++) {
        var r = tbl.rows[i];
        var varName = r.cells[1].innerHTML;
        var varType = jsonDict[valoption][valoption]["Fields"][varName]["Type"];
        var varReference = jsonDict[valoption][valoption]["Fields"][varName]["Reference"];
        if (varReference == null) {
            if (varType == "string" || varType == "double") {
                Jsoncode[varName] = JsonFormatConvt(r.cells[2].innerHTML);
            }
            else if (varType.match("list&lt;")) {
                i = i + 1;
                listTbl = document.getElementById(valoption + varName + "csv");
                var cols = jsonDict[valoption][varType.slice(8, -4)]["Fields"];
                listDict = new Object();
                var colindex = 0;
                for (colName in cols) {
                    listArray = new Array();
                    for (var li = 2; li < listTbl.rows.length - 1; li++) {
                        listArray[li - 2] = JsonFormatConvt(listTbl.rows[li].cells[colindex].innerHTML);
                    }
                    listDict[colName] = listArray;
                    colindex += 1;
                }
                Jsoncode[varName] = listDict;
            }
            else if (varType == "bool") {
                Jsoncode[varName] = JsonFormatConvt(r.cells[3].innerHTML);
            }
            else if (varType.match("mat&lt;") || varType.match("vec&lt;")) {
                i = i + 1;
                var matTbl = document.getElementById(valoption + varName + "matrix");
                var matBigArr = Array();
                if (matTbl.rows.length > 1) {
                    for (var mi = 0; mi < matTbl.rows.length; mi++) {
                        var matSmallArr = new Array();
                        for (var mj = 0; mj < matTbl.rows[mi].cells.length; mj++) {
                            matSmallArr[mj] = JsonFormatConvt(matTbl.rows[mi].cells[mj].innerHTML)
                        }
                        matBigArr[mi] = matSmallArr;
                    }
                    Jsoncode[varName] = matBigArr;
                }
                else {
                    var matSmallArr = new Array();
                    for (var mj = 0; mj < matTbl.rows[0].cells.length; mj++) {
                        matSmallArr[mj] = JsonFormatConvt(matTbl.rows[0].cells[mj].innerHTML)
                    }
                    Jsoncode[varName] = matSmallArr;
                }
            }

            else if (varType.match("::")) {
                Jsoncode[varName] = JsonFormatConvt(document.getElementById(valoption + varName + "enumSelect").value);
            }
        }
        else {
            if (varType.match("list&lt;")) {
                var multivalue = $("#{0}".format(valoption + varName + "refSelect")).multiselect("MyValues").split(",");
                var newMultivalue = new Array();
                for (var mui in multivalue) {
                    newMultivalue.push(JsonFormatConvt(multivalue[mui]));
                }
                Jsoncode[varName] = newMultivalue;
            }
            else {
                Jsoncode[varName] = JsonFormatConvt(document.getElementById(valoption + varName + "refSelect").value);
            }
        }
    }
    alert(JSON.stringify(Jsoncode));
}
function csvTreeToJsonTree(StructName,varName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var listTbl = document.getElementById(StructName+varName+"csv");
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    var listDict = Object();
    var colindex = 0;
    var listArray = [];
    for(var colName in cols){
        listArray = [];
        for(var li=2;li<listTbl.rows.length-1;li++){
            listArray[li-2] = JsonFormatConvt(listTbl.rows[li].cells[colindex].innerHTML);
        }
        listDict[colName] = listArray;
        colindex += 1;
    }
    var html = "<table style='margin-left: 30px' id='\{0\}'>".format(StructName+varName+"jsontree");
    for(var i=0;i<listTbl.rows.length-3;i++) {
        var bkgcolor = randomColor();
        var spanFlag = true;
        for (var e in listDict) {
            html += "<tr style='border-radius: 2px;background-color: \{0\}'>".format(bkgcolor);
            if(spanFlag){
                html += "<td rowspan='\{0\}\'><button onclick='jsondel(\"{1}\",\"{2}\",this)' style='width: 30px'>-</button></td>".format(getPropertyCount(listDict),StructName,varName);
                spanFlag=false
            }
            if(cols[e]["Requiredness"] == "required")
                html += "<td class='jsoneditor-readonly'><span style='color: red'>*</span>" + e + ": " + "</td>";
            else
                html += "<td class='jsoneditor-readonly'>" + e + ": " + "</td>";
            html += "<td class='jsoneditor-value jsoneditor-number MouseSelectCopy' onmousedown='OnMouseDown()' onblur='NumberChecktips(this)' onkeypress='handleEnter(this,event)' contenteditable='true' spellcheck='false' style='background-color: \{0\}'>".format(bkgcolor);
            html += listDict[e][i]+'</td>';
            html += "</tr>";
        }
    }
    html +="<tr><td style='width: 60px'><button onclick='jsonAdd(\"{0}\",\"{1}\")' style='width: 30px'>+</button></tr></td>".format(StructName,varName);
    html += "</table>";
    document.getElementById(StructName+varName+"showJson").innerHTML = html;
    document.getElementById(StructName+varName+"showCsv").style.display = "none";
    $("#{0}".format(StructName+varName+"GoJsonButton")).get(0).innerHTML="Csv";
    $("#{0}".format(StructName+varName+"GoJsonButton")).get(0).setAttribute("onclick","jsonTreeToCsvTree(\"\{0\}\",\"\{1\}\")".format(StructName,varName))
}

function jsonTreeToCsvTree(StructName,varName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var listTbl = document.getElementById(StructName+varName+"csv");
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    var tb1 = document.getElementById(StructName+varName+"jsontree");
    var listArray = [];
    var colLen = getPropertyCount(cols);
    for(var i1=0;i1<tb1.rows.length-1;i1++){
        if(i1%colLen == 0)
            listArray.push(tb1.rows[i1].cells[2].innerHTML);
        else
            listArray.push(tb1.rows[i1].cells[1].innerHTML);
    }
    var tb2 = document.getElementById(StructName+varName+"csv");

    var rowLen = listArray.length/colLen;
    var p=tb2.rows.length;
    while(tb2.rows.length>3){
        var rowindex = tb2.rows.length-2;
        tb2.deleteRow(rowindex);
    }
    for(var i2=0;i2<rowLen;i2++){
        tb2 = document.getElementById(StructName+varName+"csv");
        var rowIndex = tb2.rows.length-1;
        var row = tb2.insertRow(rowIndex);
        row.setAttribute("onmouseover","showButtonOver(this)");
        row.setAttribute("onmouseout","showButtonOut(this)");
        var bkgcolor = randomColor();
        for(var j2=0;j2<colLen;j2++){
            var col=row.insertCell(j2);
            col.style.height="30px";
            col.innerHTML=listArray[j2+i2*colLen];
            col.setAttribute("class","jsoneditor-value jsoneditor-number MouseSelectCopy");
            col.setAttribute("contenteditable","true");
            col.setAttribute("spellcheck","false");
            col.setAttribute("onkeypress","handleEnter(this,event)");
            //col.setAttribute("onkeyup","onlyNumberAfterPress(this)");
            //col.setAttribute("onbeforepaste","onlyNumberBeforePaste(this)");
            col.setAttribute("onblur",'NumberChecktips(this)');
            col.style.backgroundColor= bkgcolor;
            col.setAttribute("onmousedown","OnMouseDown()")
        }
        var collast=row.insertCell(colLen);
        collast.innerHTML='<button  onclick="delrow(this)" style="width: 75px;display: none" >Delete</button>';

    }
    document.getElementById(StructName+varName+"showCsv").style.display = "block";
    document.getElementById(StructName+varName+"jsontree").style.display = "none";
    $("#{0}".format(StructName+varName+"GoJsonButton")).get(0).innerHTML="Json";
    $("#{0}".format(StructName+varName+"GoJsonButton")).get(0).setAttribute("onclick","csvTreeToJsonTree(\"\{0\}\",\"\{1\}\")".format(StructName,varName))
}

function jsonAdd(StructName,varName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var listTbl = document.getElementById(StructName+varName+"csv");
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    var tb = document.getElementById(StructName+varName+"jsontree");
    var bkgcolor = randomColor();
    var spanFlag = true;
    for(var colelem in cols){
        rowIndex=tb.rows.length-1;
        var row = tb.insertRow(rowIndex);

        if(spanFlag){
            var col=row.insertCell(0);
            col.setAttribute("rowspan","\{0\}".format(getPropertyCount(cols)));
            col.innerHTML = "<button onclick='jsondel(\"{0}\",\"{1}\",this)' style='width: 30px'>-</button></td>".format(StructName,varName);
            spanFlag=false;
            var col1=row.insertCell(1);
            if(cols[colelem]["Requiredness"] == "required")
                col1.innerHTML = "<span style='color: red'>*</span>"+colelem+": ";
            else
                col1.innerHTML = colelem+": ";
            var col2=row.insertCell(2);
        }
        else {
            col1=row.insertCell(0);
            if(cols[colelem]["Requiredness"] == "required")
                col1.innerHTML = "<span style='color: red'>*</span>"+colelem+": ";
            else
                col1.innerHTML = colelem+": ";

            col2=row.insertCell(1);
        }
        col2.setAttribute("className","jsoneditor-number jsoneditor-value MouseSelectCopy");
        col2.setAttribute("class","jsoneditor-number jsoneditor-value MouseSelectCopy");
        col2.setAttribute("contenteditable","true");
        col2.setAttribute("spellcheck","false");
        col2.setAttribute("onkeypress","handleEnter(this,event)");
        //col2.setAttribute("onkeyup","onlyNumberAfterPress(this)");
        //col2.setAttribute("onbeforepaste","onlyNumberBeforePaste(this)");
        col2.setAttribute("onblur",'NumberChecktips(this)');
        row.style.backgroundColor= bkgcolor;
        row.style.borderRadius="5px";
    }
}
function jsondel(StructName,varName,field) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT);
    var varType = jsonDict[StructName][StructName]["Fields"][varName]["Type"];
    var cols = jsonDict[StructName][varType.slice(8,-4)]["Fields"];
    var tb = document.getElementById(StructName+varName+"jsontree");
    var colLen = getPropertyCount(cols);
    var rowIndex = field.parentNode.parentNode.rowIndex;
    for (var i = 0; i < colLen; i++) {
        tb.deleteRow(rowIndex);
    }
}

function ajaxLog(s) {
    alert(s)
}

function returnval(ID,obj){
    $("#{0}refSelect".format(ID)).get(0).value=obj.name;
    $("#{0}buttonValue".format(ID)).get(0).innerHTML=obj.name;
}
function get_Reference_List(structName,varName) {
    var refFeedback = $.ajax("/reference/market", {
        dataType: 'json'
    }).done(function (data) {
        var html = "<span class='dropdown'>";
        html += "<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}' data-toggle='dropdown'>".format(structName+varName+"refSelect");
        html += "<span id='{0}'>{1}</span>".format(structName+varName+"buttonValue",varName);
        html += "<span class='caret'></span></button>";
        html +="<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>";
        for(var e in data){
            html +="<li role='presentation'>";
            html +="<a role='menuitem' tabindex='-1' onmouseover='shadowover(this)' onmouseout='shadowout(this)' onclick='returnval(\"{0}\",this)' name='{1}'>{1}</a></li>".format(structName+varName,data[e]);
        }
        html +="</ul></span>";
        document.getElementById(structName+varName+"tdSelect").innerHTML = html;
    }).fail(function (xhr,status) {
        ajaxLog("失败: "+xhr.status+'\n原因: '+status);
    });
}
function SelectItemsShow(field){
        $(field).tips({
            side:2,  //1,2,3,4 分别代表 上右下左
            msg:"sdfsdf",//tips的文本内容
            color:'',//文字颜色，默认为白色
            bg:'#00A1CB',//背景色，默认为红色
            time:0,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
            x:0,// 默认为0 横向偏移 正数向右偏移 负数向左偏移
            y:0 // 默认为0 纵向偏移 正数向下偏移 负数向上偏移
        });
}

function get_Multi_Reference_List(structName,varName) {
    var refFeedback = $.ajax("/reference/market", {
        dataType: 'json'
    }).done(function (data) {
        var html = "<select id='{0}' class='selectResult' multiple='multiple' size='5'>".format(structName+varName+"refSelect");
        for(var e in data){
            html += "<option value='{0}'>{0}</option>".format(data[e]);
        }
        html +="</select>";
        document.getElementById(structName+varName+"tdSelect").innerHTML = html;
        $("#{0}".format(structName+varName+"refSelect")).multiselect({
            noneSelectedText: varName,
            checkAllText: "全选",
            uncheckAllText: '全不选',
            selectedList:2
        });
    }).fail(function (xhr,status) {
        ajaxLog("失败: "+xhr.status+'\n原因: '+status);
    });
}
function onlyNumberBeforePaste(field) {
    var clipboard = window.clipboardData.getData("Text");
    var message = "there are some non-number characters in clipboard";
    if (/[^0-9\.]/.test(clipboard)){
        field.innerHTML="";
        $(field).tips({
            side:1,  //1,2,3,4 分别代表 上右下左
            msg:message,
            color:'#FFF',//文字颜色，默认为白色
            bg:'',//背景色，默认为红色
            time:0.3,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
            x:0,// 默认为0 横向偏移 正数向右偏移 负数向左偏移
            y:0 // 默认为0 纵向偏移 正数向下偏移 负数向上偏移
        });

    }

}
function onlyNumberAfterPress(field) {
    if (/[^0-9\.]/.test(field.innerHTML)){
        field.innerHTML=field.innerHTML.replace(/[^0-9\.]/g,'');
        var message = "Character is forbiden!!!";
        $(field).tips({
            side:1,  //1,2,3,4 分别代表 上右下左
            msg:message,
            color:'#FFF',//文字颜色，默认为白色
            bg:'red',//背景色，默认为红色
            time:0.3,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
            x:0,// 默认为0 横向偏移 正数向右偏移 负数向左偏移
            y:0 // 默认为0 纵向偏移 正数向下偏移 负数向上偏移
        });
    }
}
function handleEnter(field,event) {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    var colIndex = field.cellIndex;
    var rowIndex = field.parentNode.rowIndex;
    var rowLength = field.parentNode.parentNode.children.length;
    var tb = field.parentNode.parentNode.parentNode;
    var texta = "";
    if (keyCode == 13 || keyCode == 40) {
        if (rowIndex < rowLength - 2){
            var pre =tb.rows[rowIndex].cells.length;
            var next = tb.rows[rowIndex+1].cells.length;
            if(pre>next)
                colIndex -=1;
            rowIndex += 1;
        }
        texta = field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML;
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML = texta.replace(new RegExp("\\<br\\>", "g"), "");
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].focus();
    }
    else if (keyCode == 38) {
        if (rowIndex > 0 && field.parentNode.parentNode.children[rowIndex - 1].tagName != "TH")
            rowIndex -= 1;
        texta = field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML;
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML = texta.replace(new RegExp("\\<br\\>", "g"), "");
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].focus();
    }

}
function NumberChecktips(field){
    var number = field.innerHTML;
    number = number.replace(new RegExp("\\<br\\>","g"),"");
    var doubleTest = /^-*\d+.\d+$/i;
    var intTest = /^-*\d+$/i;
    var message = "";
    var check = false;
    var backgroundColor="";
    if(number.length == 0){
        message = "It's empty!";
        check = true;
        backgroundColor="#00A1CB"
    }
    else if(!(doubleTest.test(number) || intTest.test(number))){
        message = 'Error:STRING!!! Please input number';
        check = true;
        backgroundColor="#FF0000";
    }
    if(check){
        $(field).tips({
        side:2,  //1,2,3,4 分别代表 上右下左
        msg:message,
        color:'#FFF',//文字颜色，默认为白色
        bg:backgroundColor,//背景色，默认为红色
        time:0.3,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
        x:0,// 默认为0 横向偏移 正数向右偏移 负数向左偏移
        y:0 // 默认为0 纵向偏移 正数向下偏移 负数向上偏移
    });
    }
}
