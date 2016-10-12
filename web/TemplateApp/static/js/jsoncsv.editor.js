$(document).ready(function (){
    $('.jsoneditor-number').blur(function(){NumberChecktips(this)});
});

function JsonFormatConvt(strNum) {
    var doubleTest = /^-*\d+.\d+$/i;
    var intTest = /^-*\d+$/i;
    var falseTest = /^False$/i;
    var trueTest = /^True$/i;
    var nulltest = /^null$/i;
    if(strNum == null)
        return strNum;
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
    else if(nulltest.test(strNum) || !strNum)
        tempvalue = null;
    else
        tempvalue = strNum;
    return tempvalue;
}



function RowsColor(rowIndex) {
    var colorBoard = ['grey','darkgray'];
    return colorBoard[rowIndex%2==0?0:1];
}


function shadowover(x) {
    x.style.backgroundColor = "gray";
    x.style.borderRadius="2px";
}
function shadowout(x) {
    x.style.backgroundColor = "#f2f2f2";
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


function selectshow(SelectElemId){
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT)["REFLIST"];
    var obj = document.getElementById(SelectElemId);
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;
    var disp1 = document.getElementById(valoption).style;
    for(var e in jsonDict){
        var tempdisp = document.getElementById(jsonDict[e]).style;
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
        if(requireList[i]  && document.getElementById(cnt+structname+memberlist[i]).innerHTML.length==0){
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
                if(requireList[i]  && document.getElementById(cnt+structname+memberlist[i]).innerHTML.length==0){
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
    var cellsLen = obj.parentNode.parentNode.cells.length-1;
    var tbrowslen = obj.parentNode.parentNode.parentNode.rows.length-1;
    for(var i1 =rowIndex;i1<tbrowslen-1;i1++)
        for(var j=0;j<cellsLen;j++)
            MouseSelect.SelectedPointRecord["r"+i1+"c"+j]=MouseSelect.SelectedPointRecord["r"+(i1+1)+"c"+j];
    for(j=0;j<cellsLen;j++)
        delete MouseSelect.SelectedPointRecord["r"+(tbrowslen-1)+"c"+j]
    var tableID = obj.parentElement.parentElement.parentElement.parentElement.id;
    var tb = document.getElementById(tableID);
    tb.deleteRow(rowIndex);
}

function  showButtonOver(obj) {
        obj.lastChild.firstChild.style.display="block";
}
function  showButtonOut(obj) {
    obj.lastChild.firstChild.style.display="none";
}
function csvAddrow(TableId) {
    var tb = document.getElementById(TableId);
    var colLen = tb.rows[0].cells.length;
    var rowIndex=tb.rows.length-1;
    var row = tb.insertRow(rowIndex);
    var bkgcolor = RowsColor(rowIndex-1);
    row.setAttribute("onmouseover","showButtonOver(this)");
    row.setAttribute("onmouseout","showButtonOut(this)");
    for(var i=0;i<colLen;i++){
        var col=row.insertCell(i);
        col.setAttribute("onblur",'NumberChecktips(this)');
        col.setAttribute("class","jsoneditor-value jsoneditor-number MouseSelectCopy");
        col.setAttribute("onmousedown","OnMouseDown(this,\'list\')");
        col.setAttribute("contenteditable","true");
        col.setAttribute("onkeypress","handleEnter(this,event)");
        col.style.textAlign="center";
        col.style.backgroundColor=bkgcolor;
        col.setAttribute("spellcheck","false");
    }
    var collast=row.insertCell(colLen);
    collast.innerHTML='<button onclick="delrow(this)" style="width: 75px;display: none" >Delete</button>';
}
function treeToCode(SelectElemId,TemplatesUnitIdPrefix) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
    var obj = document.getElementById(SelectElemId);
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;
    var ul = document.getElementById(TemplatesUnitIdPrefix+valoption);
    var ullen = ul.childNodes.length;
    var Jsoncode = Object();
    for (var i = 0; i < ullen; i++) {
        var ili = ul.childNodes[i];
        var varName = ili.childNodes[1].innerHTML;
        var varType = jsonDict[valoption].Fields[varName].Type;
        var varEleType = jsonDict[valoption].Fields[varName].EleType;
        var varReference = jsonDict[valoption]["Fields"][varName]["Reference"];
        if (varReference == null) {
            if (varType == "string" || varType == "double" || varType == "sint32" || varType == "uint32") {
                Jsoncode[varName] = JsonFormatConvt(ili.childNodes[2].rows[0].cells[4].innerHTML);
            }
            else if (varType.match("list")) {
                i = i + 1;
                Jsoncode[varName] = ReadCsvTableDict(jsonDict,TemplatesUnitIdPrefix+valoption+varName+"csv",varEleType)
            }
            else if (varType == "bool") {
                Jsoncode[varName] = JsonFormatConvt(ili.childNodes[3].innerHTML);
            }
            else if (varType.match("mat") || varType.match("vec")) {
                i = i + 1;
                var matTbl = document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "matrix");
                var matBigArr = new Array();
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
                    matSmallArr = new Array();
                    for (mj = 0; mj < matTbl.rows[0].cells.length; mj++) {
                        matSmallArr[mj] = JsonFormatConvt(matTbl.rows[0].cells[mj].innerHTML)
                    }
                    Jsoncode[varName] = matSmallArr;
                }
            }
            else if (varType.match("enum")) {
                Jsoncode[varName] = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "enumSelect").value);
            }
        }
        else {
            var refJsonDict = CombineReferenceData[TemplatesUnitIdPrefix+valoption+varName];
            if (varType.match("list")) {
                i += 1;
                var multivalue = $("#{0}".format(TemplatesUnitIdPrefix+valoption + varName + "refSelect")).multiselect("MyValues").split(",");
                var resultsref = {};
                for(var i1 in multivalue){
                    multivalue[i1]=multivalue[i1].replace(/\s+/g,"");
                    resultsref[multivalue[i1]]=ReadCsvTableDict(refJsonDict,TemplatesUnitIdPrefix+valoption+multivalue[i1]+"csv",multivalue[i1]);
                }
                Jsoncode[varName] =resultsref;
            }
            else {
                i += 1;
                var singleRefResult = JsonFormatConvt(document.getElementById(TemplatesUnitIdPrefix+valoption + varName + "refSelect").value);
                Jsoncode[varName] = ReadCsvTableDict(refJsonDict,TemplatesUnitIdPrefix+valoption+singleRefResult+"csv",singleRefResult);
            }
        }
    }
    alert(JSON.stringify(Jsoncode));
}
function  ReadCsvTableDict(jsondict,csvTableID,refType) {
    csvTableID = csvTableID.replace(/\s+/g,"");
    var listTbl = document.getElementById(csvTableID);
    var cols = jsondict[refType]["Fields"];
    var listDict = {};
    var colindex = 0;
    for (var colName in cols) {
        var listArray = [];
        if(listTbl.rows.length == 4){
            listDict[colName] = JsonFormatConvt(listTbl.rows[2].cells[colindex].innerHTML);
        }
        else {
            for (li = 2; li < listTbl.rows.length - 1; li++) {
                listArray[li - 2] = listTbl.rows[li].cells[colindex].innerHTML;
            }
            listDict[colName] = StrListConverFormatedJson(listArray);
        }
        colindex += 1;
    }
    return listDict

}
function StrListConverFormatedJson(slist){
    return slist.map(function (selem) {
        return JsonFormatConvt(selem);
    })
}

function csvTreeToJsonTree(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = {};
    var cols = {};
    var listIdBase = "";
    if(IsReference){
        jsonDict =  CombineReferenceData[TemplatesUnitIdPrefix+StructName+preStructName];
        cols = jsonDict[varName]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+preStructName+varName;
    }
    else{
        jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
        var varType = jsonDict[StructName]["Fields"][varName]["EleType"];
        cols = jsonDict[varType]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+varName;
    }
    var listTbl = document.getElementById(listIdBase+"csv");
    var listDict = {};
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
    var html = "<table style='margin-left: 30px' id='\{0\}'>".format(listIdBase+"jsontree");
    for(var i=0;i<listTbl.rows.length-3;i++) {
        var bkgcolor = RowsColor(i);
        var spanFlag = true;
        for (var e in listDict) {
            html += "<tr style='border-radius: 2px;background-color: \{0\}'>".format(bkgcolor);
            if(spanFlag){
                html += "<td rowspan='\{0\}\'><button onclick='jsondel(\"{1}\",\"{2}\",this,\{3\},\"{4}\",\"{5}\")' style='width: 30px'>-</button></td>".format(getPropertyCount(listDict),StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName);
                spanFlag=false
            }
            if(cols[e]["Requiredness"] )
                html += "<td class='jsoneditor-readonly'><span style='color: red'>*</span>" + e + ": " + "</td>";
            else
                html += "<td class='jsoneditor-readonly'>" + e + ": " + "</td>";
            html += "<td class='jsoneditor-value jsoneditor-number MouseSelectCopy' onmousedown='OnMouseDown(this,\"list\")' onblur='NumberChecktips(this)' onkeypress='handleEnter(this,event)' contenteditable='true' spellcheck='false' style='background-color: \{0\}'>".format(bkgcolor);
            html += listDict[e][i]+'</td>';
            html += "</tr>";
        }
    }
    html +="<tr><td style='width: 60px'><button onclick='jsonAdd(\"{0}\",\"{1}\",\{2\},\"{3}\")' style='width: 30px'>+</button></tr></td>".format(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName);
    html += "</table>";
    document.getElementById(listIdBase+"showJson").innerHTML = html;
    document.getElementById(listIdBase+"showCsv").style.display = "none";
    document.getElementById("{0}".format(listIdBase+"GoJsonButton")).innerHTML="Csv";
    document.getElementById("{0}".format(listIdBase+"GoJsonButton")).setAttribute("onclick","jsonTreeToCsvTree(\"\{0\}\",\"\{1\}\",\{2\},\"{3}\",\"{4}\")".format(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName));
}

function jsonTreeToCsvTree(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = {};
    var cols = {};
    var listIdBase = "";
    if(IsReference){
        jsonDict =  CombineReferenceData[TemplatesUnitIdPrefix+StructName+preStructName];
        cols = jsonDict[varName]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+preStructName+varName;
    }
    else{
        jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
        var varType = jsonDict[StructName]["Fields"][varName]["EleType"];
        cols = jsonDict[varType]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+varName;
    }
    var tb1 = document.getElementById(listIdBase+"jsontree");
    var listArray = [];
    var colLen = getPropertyCount(cols);
    for(var i1=0;i1<tb1.rows.length-1;i1++){
        if(i1%colLen == 0)
            listArray.push(tb1.rows[i1].cells[2].innerHTML);
        else
            listArray.push(tb1.rows[i1].cells[1].innerHTML);
    }
    var tb2 = document.getElementById(listIdBase+"csv");
    var rowLen = listArray.length/colLen;
    var p=tb2.rows.length;
    while(tb2.rows.length>3){
        var rowindex = tb2.rows.length-2;
        tb2.deleteRow(rowindex);
    }
    for(var i2=0;i2<rowLen;i2++){
        tb2 = document.getElementById(listIdBase+"csv");
        var rowIndex = tb2.rows.length-1;
        var row = tb2.insertRow(rowIndex);
        row.setAttribute("onmouseover","showButtonOver(this)");
        row.setAttribute("onmouseout","showButtonOut(this)");
        var bkgcolor = RowsColor(rowIndex+1);
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
            col.setAttribute("onmousedown","OnMouseDown(this,\"list\")");
        }
        var collast=row.insertCell(colLen);
        collast.innerHTML='<button  onclick="delrow(this)" style="width: 75px;display: none" >Delete</button>';
    }
    document.getElementById(listIdBase+"showCsv").style.display = "block";
    document.getElementById(listIdBase+"jsontree").style.display = "none";
    document.getElementById("{0}".format(listIdBase+"GoJsonButton")).innerHTML="Json";
    document.getElementById("{0}".format(listIdBase+"GoJsonButton")).setAttribute("onclick","csvTreeToJsonTree(\"\{0\}\",\"\{1\}\",\{2\},\"{3}\",\"{4}\")".format(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName))
}

function jsonAdd(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = {};
    var cols = {};
    var listIdBase = "";
    if(IsReference){
        jsonDict =  CombineReferenceData[TemplatesUnitIdPrefix+StructName+preStructName];
        cols = jsonDict[varName]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+preStructName+varName;
    }
    else{
        jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
        var varType = jsonDict[StructName]["Fields"][varName]["EleType"];
        cols = jsonDict[varType]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+varName;
    }
    var listTbl = document.getElementById(listIdBase+"csv");
    var tb = document.getElementById(listIdBase+"jsontree");
    var bkgcolor = RowsColor((tb.rows.length-1)/Object.getOwnPropertyNames(cols).length);
    var spanFlag = true;
    for(var colelem in cols){
        var rowIndex=tb.rows.length-1;
        var row = tb.insertRow(rowIndex);
        if(spanFlag){
            var col=row.insertCell(0);
            col.setAttribute("rowspan","\{0\}".format(getPropertyCount(cols)));
            col.innerHTML = "<button onclick='jsondel(\"{0}\",\"{1}\",this,\"{2}\",\"{3}\",\"{4}\")' style='width: 30px'>-</button></td>".format(StructName,varName,IsReference,TemplatesUnitIdPrefix,preStructName);
            spanFlag=false;
            var col1=row.insertCell(1);
            if(cols[colelem]["Requiredness"] )
                col1.innerHTML = "<span style='color: red'>*</span>"+colelem+": ";
            else
                col1.innerHTML = colelem+": ";
            var col2=row.insertCell(2);
        }
        else {
            col1=row.insertCell(0);
            if(cols[colelem]["Requiredness"] )
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
function jsondel(StructName,varName,field,IsReference,TemplatesUnitIdPrefix,preStructName) {
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = {};
    var cols = {};
    var listIdBase = "";
    if(IsReference){
        jsonDict =  CombineReferenceData[TemplatesUnitIdPrefix+StructName+preStructName];
        cols = jsonDict[varName]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+preStructName+varName;
    }
    else{
        jsonDict = JSON.parse(JSONDICT)["REFERENCES"];
        var varType = jsonDict[StructName]["Fields"][varName]["EleType"];
        cols = jsonDict[varType]["Fields"];
        listIdBase = TemplatesUnitIdPrefix+StructName+varName;
    }
    var tb = document.getElementById(listIdBase+"jsontree");
    var colLen = getPropertyCount(cols);
    var rowIndex = field.parentNode.parentNode.rowIndex;
    for (var i = 0; i < colLen; i++) {
        tb.deleteRow(rowIndex);
    }
}

function ajaxLog(s) {
    alert(s)
}
var CombineReferenceData = {};
function get_Reference_List(structName,varName,TemplatesUnitIdPrefix) {
    var refFeedback = $.ajax("/reference/market", {
        dataType: 'json'
    }).done(function (data) {
        CombineReferenceData["BASEREFERENCE"]=JSON.parse($("#JsonDict").html());
        CombineReferenceData[TemplatesUnitIdPrefix+structName+varName]=$.extend({},data,CombineReferenceData.BASEREFERENCE["REFERENCES"]);
        var html = "<span class='dropdown'>";
        html += "<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}' data-toggle='dropdown'>".format(TemplatesUnitIdPrefix+structName+varName+"refSelect");
        html += "<span id='{0}'>{1}</span>".format(TemplatesUnitIdPrefix+structName+varName+"buttonValue",varName);
        html += "<span class='caret'></span></button>";
        html +="<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>";
        for(var e in CombineReferenceData[TemplatesUnitIdPrefix+structName+varName]){
            html +="<li role='presentation'>";
            html +="<a role='menuitem' tabindex='-1' onmouseover='shadowover(this)' onmouseout='shadowout(this)' onclick='expandSelectRefernce(\"{0}\",\"{1}\",this,true,\"{3}\")' name='{2}'>{2}</a></li>".format(structName,varName,e,TemplatesUnitIdPrefix);
        }
        html +="</ul></span>";
        document.getElementById(TemplatesUnitIdPrefix+structName+varName+"tdSelect").innerHTML = html;
    }).fail(function (xhr,status) {
        ajaxLog("失败: "+xhr.status+'\n原因: '+status);
    });
}
function expandSelectRefernce(structName,varName,obj,IsSingleRef,TemplatesUnitIdPrefix) {
    var localli = $("#{0}".format(TemplatesUnitIdPrefix+structName + varName + "REFDATA")).parent();
    var tag = "";
    var SelectedRefDict = {};
    var VarAttrs = JSON.parse($("#{0}singleRefVarAttrs".format(TemplatesUnitIdPrefix+structName + varName)).get(0).innerHTML);
    if (IsSingleRef) {
        SelectedRefDict = CombineReferenceData[TemplatesUnitIdPrefix+structName + varName][obj.name]["Fields"];
        var id1 = "{2}{0}{1}refSelect".format(structName, varName,TemplatesUnitIdPrefix);
        var id2 = "{2}{0}{1}buttonValue".format(structName, varName,TemplatesUnitIdPrefix);
        document.getElementById(id1).value = obj.name;
        document.getElementById(id2).innerHTML = obj.name;
        if (localli.next().get(0)) {
            tag = localli.next().get(0).childNodes[0].tagName;
            if (tag == "UL") {
                var tempID = localli.next().children().first().children().first().get(0).id;
                if ((TemplatesUnitIdPrefix+structName + varName + obj.name) != tempID)
                    localli.next().remove();
                else
                    return null;
            }
        }
        localli.after("<li><ul>" + listTamplate(obj.name, SelectedRefDict, VarAttrs, true, structName,TemplatesUnitIdPrefix) + "</ul></li>");
    }
    else {
        var StructDict = CombineReferenceData[TemplatesUnitIdPrefix+structName + varName];
        var multihtml = "";
        var showedSet = [];
        if (localli.next().get(0)) {
            tag = localli.next().get(0).childNodes[0].tagName;
            if (tag == "UL") {
                localli.next().children().first().children().each(function (index,DomEle) {
                    showedSet.push($(this).attr('id'));
                });
                var i1 = 0;
                for (var elem in StructDict) {
                    var checkbox = $("#ui-multiselect-{3}{0}{1}refSelect-option-{2}".format(structName, varName, i1,TemplatesUnitIdPrefix));
                    var Ischecked = document.getElementById("ui-multiselect-{3}{0}{1}refSelect-option-{2}".format(structName, varName, i1,TemplatesUnitIdPrefix)).checked;
                    if(Ischecked&&!Set(showedSet).has(TemplatesUnitIdPrefix+structName+varName+checkbox.val())) {
                        SelectedRefDict = StructDict[checkbox.val()]["Fields"];
                        multihtml += listTamplate(checkbox.val(), SelectedRefDict, VarAttrs, true, structName,TemplatesUnitIdPrefix);
                    }
                    if(!Ischecked){
                        if(document.getElementById("{0}{1}{2}".format(TemplatesUnitIdPrefix+structName, varName, String(checkbox.val())))&&document.getElementById("{0}{1}".format(TemplatesUnitIdPrefix+structName, String(checkbox.val())))){
                            document.getElementById("{0}{1}{2}".format(TemplatesUnitIdPrefix+structName, varName, String(checkbox.val()))).remove();
                            document.getElementById("{0}{1}".format(TemplatesUnitIdPrefix+structName, String(checkbox.val()))).remove();
                        }
                    }
                    i1 += 1;
                }
                localli.next().children().append(multihtml);
            }
            else {
                localli.after('<li><ul></ul></li>')
            }
        }
        // localli.parent().children().eq(localli.index()+2).attr("class","jsoneditor-ref");
        // localli.parent().children().eq(localli.index()+1).attr("class","jsoneditor-ref");
    }
    return null;
}
function get_Multi_Reference_List(structName,varName,TemplatesUnitIdPrefix) {
    var refFeedback = $.ajax("/reference/market", {
        dataType: 'json'
    }).done(function (data) {
        CombineReferenceData["BASEREFERENCE"]=JSON.parse($("#JsonDict").html());
        CombineReferenceData[TemplatesUnitIdPrefix+structName+varName]=$.extend({},data,CombineReferenceData.BASEREFERENCE["REFERENCES"]);
        var html = "<select id='{2}{0}{1}refSelect' class='selectResult' multiple='multiple' size='5'>".format(structName,varName,TemplatesUnitIdPrefix);
        for(var e in CombineReferenceData[TemplatesUnitIdPrefix+structName+varName]){
            html += "<option value='{0}'>{0}</option>".format(e);
        }
        html +="</select>";
        document.getElementById(TemplatesUnitIdPrefix+structName+varName+"tdSelect").innerHTML = html;
        $("#{0}".format(TemplatesUnitIdPrefix+structName+varName+"refSelect")).multiselect({
            noneSelectedText: varName,
            checkAllText: "全选",
            uncheckAllText: '全不选',
            selectedList:1
        });
        var i1 = 0;
        for(var elem in CombineReferenceData[TemplatesUnitIdPrefix+structName+varName]){
            $("#ui-multiselect-{3}{0}{1}refSelect-option-{2}".format(structName,varName,i1,TemplatesUnitIdPrefix)).parent().attr("onclick","expandSelectRefernce(\"{0}\",\"{1}\",this,false,\"{2}\")".format(structName,varName,TemplatesUnitIdPrefix));
            i1+=1;
        }
        $("#ui-multiselect-{3}{0}{1}refSelect-option-0".format(structName,varName,i1,TemplatesUnitIdPrefix)).parent().parent().parent().prev().attr("onclick","expandSelectRefernce(\"{0}\",\"{1}\",this,false,\"{2}\")".format(structName,varName,TemplatesUnitIdPrefix));
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
            var downpre =tb.rows[rowIndex].cells.length;
            var downnext = tb.rows[rowIndex+1].cells.length;
            if(downpre>downnext)
                colIndex -=1;
            rowIndex += 1;
        }
        texta = field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML;
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML = texta.replace(new RegExp("\\<br\\>", "g"), "");
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].focus();
    }
    else if (keyCode == 38) {
        if (rowIndex > 0 && field.parentNode.parentNode.children[rowIndex - 1].tagName != "TH"){
            var uppre =tb.rows[rowIndex].cells.length;
            var upnext = tb.rows[rowIndex-1].cells.length;
            if(upnext>uppre)
                colIndex +=1;
            rowIndex -= 1;

        }
        texta = field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML;
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].innerHTML = texta.replace(new RegExp("\\<br\\>", "g"), "");
        field.parentNode.parentNode.parentNode.rows[rowIndex].cells[colIndex].focus();
    }

}
function get_Drop_Select_value(ID,obj){
    var id1 = "{0}enumSelect".format(ID);
    var id2 = "{0}buttonValue".format(ID);
    document.getElementById(id1).value = obj.name;
    document.getElementById(id2).innerHTML = obj.name;
}
function inputTypeChecktips(field){
    var tdValue = $(field).text();
    var tdType = $(field).attr("data-type");
    tdValue = tdValue.replace(new RegExp("\\<br\\>","g"),"");
    var doubleTest = /^-*\d+.\d+$/i;
    var sintTest = /^-*\d+$/i;
    var uintTest = /^\d+$/i;
    var stringTest = /^[a-zA-Z0-9]+$/i;
    var message = "";
    var check = false;
    var backgroundColor="";
    var aaa = stringTest.test(tdValue);
    if(tdValue.length == 0){
        message = "It's empty!";
        check = true;
        backgroundColor = "#00A1CB"
    }
    else if(tdType === "string" && !stringTest.test(tdValue)){
        message = 'Please input string';
        check = true;
        backgroundColor = "#FF0000";
    }
    else if(tdType === "uint" && !uintTest.test(tdValue)){
        message = 'Please input positive number!';
        check = true;
        backgroundColor = "#FF0000";
    }
    else if(tdType === "sint" && !sintTest.test(tdValue)){
        message = 'Please input number(positive or negative)!';
        check = true;
        backgroundColor = "#FF0000";
    }
    else if(tdType === "date" && !moment(tdValue,["YYYY/MM/DD","YYYY/M/DD","YYYY/MM/D","YYYY/M/D"],true).isValid()){
        message = "Date formate is YYYY/MM/DD. eg '2016/09/26'.";
        check = true;
        backgroundColor = "#FF0000";
    }
    else if(tdType === "time" && !moment(tdValue,["HH:mm:ss:SSS","hh:mm:ss:SSS a"],true).isValid()){
        message = "Date formate is HH:mm:ss:SSS or hh:mm:ss:SSS a. eg '23:09:26:123' or '11:00:00:123 pm'.";
        check = true;
        backgroundColor = "#FF0000";
    }
    else if(tdType === "timespan" && !moment(tdValue,"HH:mm:ss",true).isValid()){
        message = "Date formate is HH:mm:ss. eg '1:45:56'.";
        check = true;
        backgroundColor = "#FF0000";
    }
    //alert(moment.duration("35:34","seconds").hours());
    if(check){
        $(field).tips({
        side:2,  //1,2,3,4 分别代表 上右下左
        msg:message,
        color:'#FFF',//文字颜色，默认为白色
        bg:backgroundColor,//背景色，默认为红色
        time:0.6,//默认为2 自动关闭时间 单位为秒 0为不关闭 （点击提示也可以关闭）
        x:0,// 默认为0 横向偏移 正数向右偏移 负数向左偏移
        y:0 // 默认为0 纵向偏移 正数向下偏移 负数向上偏移
    });
    }
}
