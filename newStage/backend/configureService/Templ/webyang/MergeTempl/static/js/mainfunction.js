var TEMPLATES=[],TEMPLATESNAME=[],CHECKLIST=[],OPTIONLIST = {},CountOp = 1;
//存入原始模板,后期编号，，，
Array.prototype.remove = function (val) {
    var index = $.inArray(val,this);
    if (index > -1)
        this.splice(index, 1);
};

Array.prototype.indexOf = function(val){
  for(var i=0,j; j=this[i]; i++){
    if(j==val)
        return true;
  }
  return false;
};

String.prototype.format=function()
{
    if(arguments.length==0) return this;
    for(var s=this, i=0; i<arguments.length; i++)
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
    return s;
};

window.document.onkeydown = disableRefresh;
function disableRefresh(evt) {
    evt = (evt) ? evt : window.event;
    if (evt.keyCode) {
        if (evt.keyCode == 13)
            ConfirmOption();
    }
}

function addStrategy(){
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonDict = JSON.parse(JSONDICT)["REFERENCES"];//字符串解析出content
    var obj = document.getElementById('StrategySelect');
    var index = obj.selectedIndex;
    var valoption = obj.options[index].value;//获取选择的模板
    var con = jsonDict[valoption]; //获取选定模板对应的内容列表
    var html="";
    var counttemp=0;
    TEMPLATES.push(valoption);
    for (var i0=0 ;i0< TEMPLATES.length;i0++){
        if (TEMPLATES[i0] == valoption)
            counttemp +=1;
    }
    /////////////有bug，同名模板删除前者后，再添加，名字会有重叠
    var Tname = valoption+'-'+counttemp;
    TEMPLATESNAME.push(Tname);
    html += "<div class='col-lg-6' id='{0}Templ{1}' style='padding-left: 10px;padding-right: 10px;'>".format(valoption,counttemp);
    html += "<h2 style='display: inline'>{0}-{1} </h2>".format(valoption,counttemp);
    html += "<input type='button' value='Delete' style='margin-bottom: 4px;' onclick='DeleteStategy(this);'>";
    html += "<div class='table-responsive'><table class='table table-bordered table-hover'>";
    html += "<thead><tr><th style='width:30px;'>{0}</th><th>{1}</th><th>Operate</th><th>Field</th></tr></thead><tbody>".format(" ",con[0]);
    for (var i1=2; i1 < con.length; i1++) {
        html += "<tr><td><input id='{0}_check_{1}' type='checkbox' onclick='CheckText(this);'></td><td id='{0}_text_{1}' style='width:412px;' class='text_content'>".format(Tname, i1 - 1);
        html += con[i1];
        html += "</td><td style='width:126px;'>{0}</td><td id='{1}_field_{2}' style='width:90px;'></td></tr>".format(OptionDropDown(Tname,i1-1,con[i1]),Tname,i1-1);
    }
    html += "</tbody></table></div></div>";
    $("#loadlog").append(html);
}

function OptionDropDown(Tname,index,text){
    var html= "<select id='{0}_optsel_{1}' class='tdOpt_select' onclick='Option_click(this);'><option value=''></option>".format(Tname,index);
    if(text.search("equal")!=-1){
        html += "<option value='Merge'>Merge</option></select>";
        return html;
    }
    else if(text.search("reference")!=-1){
        html+="<option value='Connected'>Connected</option></select>";
        return html;
    }
    else {
        html += "<option value='Merge'>Merge</option>";
        html += "<option value='Fixed'>Fixed</option></select>";
        return html;
    }
}

function Option_click(obj){
    var index = obj.selectedIndex;
    var valtemp = obj.options[index].value;//获取选择的操作
    var fieldid = obj.id.replace(/optsel/,"field");
    var JSONDICT = document.getElementById("JsonDict").innerHTML;
    var jsonList = JSON.parse(JSONDICT)["JSONLIST"];//字符串解析出json
    var refid = obj.id.replace(/optsel/,"text");
    var context = $.trim(document.getElementById(refid).innerHTML).split(" ");
    var html="";
    $("#"+fieldid).empty();
    if (valtemp == "Fixed"){
        if(context[1]=="bool"){
            html +="<select id='{0}'><option value=''></option>".format(obj.id.replace(/optsel/,"boolsel"));
            html += "<option value='true'>true</option><option value='false'>false</option></select>";
            $("#"+fieldid).append(html);
        }
        else if ((context[1] != "string") && (context[1] != "uint32")&& (context[1] != "sint32")
            && (context[1] != "uint32_t") && (context[1] != "int32_t")&&(context[1] != "double")&& (context[1] != "uint16")){
            var ii;
            var textid = obj.id.replace(/optsel/,"text");
            var text = $.trim(document.getElementById(textid).innerHTML).split(" ");
            var StrategyList = JSON.parse($("#JsonDict").html())["REFLIST"];
            if(StrategyList.indexOf(text[1])){
                html +="<select id='{0}'><option value=''></option>".format(obj.id.replace(/optsel/,"enum"));
                var enumcon = jsonList[text[1]];
                var enumfield = enumcon['Fields'];
                for(ii in enumfield)
                    html += "<option value='{1}={0}'>{1}={0}</option>".format(enumfield[ii],ii);//field_value
                html += "</select>";
                $("#"+fieldid).append(html);
            }
            else
                alert("该类型不在数据库中！");
        }
        else  {
            html +="<input class='form-control' id='{0}' style='height:29px' placeholder='Enter'>".format(obj.id.replace(/optsel/,"input"));
            $("#"+fieldid).append(html);
        }
    }
    else if(valtemp == "Connected"){
        var conref = context[4].replace(/\;|\,/g, '');//reference的类型
        var i,isIn=false;
        html +="<select id='{0}'><option value=''></option>".format(obj.id.replace(/optsel/,"refer"));
        for (i=0 ;i< TEMPLATES.length;i++){
            var temp = jsonList[TEMPLATES[i]];
            if((temp["Category"]==conref)||(temp["BaseName"]==conref)){
                isIn=true;
                html += "<option value='{0}'>{0}</option>".format(TEMPLATESNAME[i]);
            }
        }
        html +="</select>";
        if(isIn)
            $("#"+fieldid).append(html);
        else{
            alert("无可用reference模板！");
            obj.selectedIndex=0;
        }
    }
}

function ConfirmOption(){
    if (CHECKLIST.length == 0)
        alert("没有勾选字段！");
    else {
        var i,html = '',sub;
        var checktemplist = [],Merge={},Mergedict={};
        var judge = true,isOperate = false,isMerge =false;
        for (i = 0; i < CHECKLIST.length; i++) {
            var result=[];
            var textid = CHECKLIST[i].id.replace(/check/,"text");//获取与checkbox对应的text id
            var text = $.trim(document.getElementById(textid).innerHTML);
            var textsplit = text.split(" ");//获取对应的text的字段类型

            var optselid = CHECKLIST[i].id.replace(/check/,"optsel");//获取与checkbox对应的oprate id
            var optsel_obj = document.getElementById(optselid);//获取对应的optsel的对象
            var optsel_index = optsel_obj.selectedIndex;
            var optval = optsel_obj.options[optsel_index].value;

            var field_id = CHECKLIST[i].id.replace(/check/,"field");//获取与checkbox对应的field id
            var field_obj = $("#"+field_id);
            switch (optval){
                case "Fixed":
                    result = FIXED(judge,textsplit[1],field_obj,text);
                    isOperate = true;
                    break;
                case "Connected":
                    result=CONNECTED(judge,field_obj,text,textsplit[2]);
                    isOperate = true;
                    break;
                case "Merge":
                    Merge[CHECKLIST[i].id] = text;
                    isMerge= true;
                    isOperate = true;
                    break;
                default:
                    Mergedict[CHECKLIST[i].id] = text;
            }
            if(result!=[] && result[0]){
                sub = result[1];
                OPTIONLIST["Option_"+CountOp] = sub;
                if((sub['Operate']&& sub['Field']&& sub['Value']&& sub['Source'])!="") {
                    document.getElementById(CHECKLIST[i].id).checked = false;
                    html += "<div id='Option_{0}'>{0} <input type='button' value='Delete' style='margin-bottom: 4px;' onclick='DeleteOption(this);'>".format(CountOp);
                    html += "<div class='table-responsive'><table class='table table-bordered table-hover'>";
                    html += "<tbody><tr><td style='font-weight:bold;'>Operate</td><td>{0}</td></tr>".format(sub['Operate']);
                    html += "<tr><td style='font-weight:bold;'>Field</td><td>{0}</td></tr>".format(sub['Field']);
                    html += "<tr><td style='font-weight:bold;'>Value</td><td>{0}</td></tr>".format(sub['Value']);
                    html += "<tr><td style='font-weight:bold;'>Source</td><td>{0}</td></tr></tbody></table></div></div>".format(sub['Source']);
                    $("#OptionLists").append(html);
                    html = '';
                    CountOp++;
                    CHECKLIST.remove(CHECKLIST[i]);
                }
                else
                    alert("有操作未选择完整！")
            }
        }
        if(DictLength(Merge) ==1 && DictLength(Mergedict) >0){
            result = MERGE(judge,Merge,Mergedict);
            if (result[0]) {
                for (i = 0; i < CHECKLIST.length; i++)
                    document.getElementById(CHECKLIST[i].id).checked = false;
                for (var q in Mergedict) {
                    document.getElementById(q).disabled = true;
                    checktemplist.push(q);
                }
                var temp = result[1];
                temp['DisableID'] = checktemplist;
                sub = result[1];
                OPTIONLIST["Option_"+CountOp] = sub;
                html+="<div id='Option_{0}'>{0} <input type='button' value='Delete' style='margin-bottom: 4px;' onclick='DeleteOption(this);'>".format(CountOp);
                html+="<div class='table-responsive'><table class='table table-bordered table-hover'>";
                html += "<tbody><tr><td style='font-weight:bold;'>Operate</td><td>{0}</td></tr>".format(sub['Operate']);
                html += "<tr><td style='font-weight:bold;'>Field</td><td>{0}</td></tr>".format(sub['Field']);
                html += "<tr><td style='font-weight:bold;'>Value</td><td>{0}</td></tr>".format(sub['Value']);
                html += "<tr><td style='font-weight:bold;'>Source</td><td>{0}</td></tr></tbody></table></div></div>".format(JSON.stringify(sub['Source']));
                $("#OptionLists").append(html);
                html = '';
                CountOp++;
                CHECKLIST.length = 0;
            }
        }
        else if (DictLength(Merge) >1)
            alert("只能选择一个需要被Merge的字段，该字段的名字将默认为合并后字段的名字！");
        else if(DictLength(Mergedict)==0&&isMerge)
            alert("至少选择两个字段进行Merge!");
        else if(isOperate&&isMerge==false&&DictLength(Mergedict)>0)
            alert("有字段没有选择需要进行的Operate!");
        else if(isOperate==false)
            alert("字段没有选择需要进行的Operate!");
        // else
        //     alert("Merge.length ="+DictLength(Merge)+"\nMergedict.length="+ DictLength(Mergedict)+
        //         "\nisOperate="+isOperate+"\nisMerge="+isMerge);
    }
}

function DictLength(obj){
    var i=0;
    for (var e in obj)
        i++;
    return i;
}

function FIXED(judge,type,field_obj,text){
    var result = [],op = {};
    if (field_obj[0].firstChild.id.indexOf("input") != -1) { //input
        if (field_obj[0].firstChild.value == ''){
            alert("没有输入值!");
            judge = false;
        }
        else {
            var s = /^-?\d+$/;//整数
            var is = /^((-\d+)|(0+))$/;　　//非正整数
            var dou = /^(-?\d+)(\.\d+)?$/;//浮点数
            var inputvalue = Number(field_obj[0].firstChild.value);
            if ((isNaN(inputvalue)) && ((type=='uint32_t')||(type=='uint32')||(type=="uint16")
                    ||(type=="int32_t")||(type=="sint32")||(type=="double"))){//输入为字符串
                alert("字段类型不一致:输入为字符串，字段里有Number类型!");
                judge = false;
            }
            else if (isNaN(inputvalue) == false) { //输入为数字
                if ((s.test(inputvalue)) && (type=='double')) {//判断整型
                    alert("字段类型不一致：输入为整数，字段里有double类型!");
                    judge = false;
                }
                else if ((s.test(inputvalue)) && (type=='string')) {
                    alert("字段类型不一致：输入为整数，字段里有string类型!");
                    judge = false;
                }
                else if (is.test(inputvalue) && ((type=='uint32_t')||(type=='uint32')||(type=="uint16"))) {//非正整数
                    alert("字段类型不一致：输入为非正整数，字段里有正整数类型!");
                    judge = false;
                }
                else if (dou.test(inputvalue) && ((type=='uint32_t')||(type=='uint32')||(type=="uint16")
                    ||(type=="int32_t")||(type=="sint32")||(type=="string"))) {//浮点数
                    alert("字段类型不一致：输入为double类型，字段里有整数/字符串类型!");
                    judge = false;
                }
                else{
                    op['Value'] = inputvalue;
                    field_obj[0].firstChild.value = '';
                }
            }
            else if((isNaN(inputvalue)) && (type=='string')){
                op['Value'] = field_obj[0].firstChild.value;
                field_obj[0].firstChild.value = '';
            }
            else
                judge = false;
        }
    }
    else {
        var index = field_obj[0].firstChild.selectedIndex;
        var valtemp = field_obj[0].firstChild.options[index].value;
        if (field_obj[0].firstChild.id.indexOf("enum") != -1) { //enum
            //获取Fixed选择的操作
            op['Value'] = valtemp;
            field_obj[0].firstChild.selectedIndex = 0;
        }
        else if (field_obj[0].firstChild.id.indexOf("boolsel") != -1) { //boolsel
            op['Value'] = valtemp;
            field_obj[0].firstChild.selectedIndex = 0;
        }
        else
            judge = false;
    }
    var dex = field_obj[0].firstChild.id.split("_");
    op['Operate'] = 'Fixed';
    op['Field'] = text;
    op['Source'] = dex[0];
    result.push(judge);
    result.push(op);
    return result;
}

function CONNECTED(judge,field_obj,text,valuename){
    var op = {},result = [];
    var index = field_obj[0].firstChild.selectedIndex;
    var valtemp = field_obj[0].firstChild.options[index].value;
    if (valtemp == "") {
        alert("没有选择需要connect的strategy!");
        judge = false;
    }
    else {
        op['Operate'] = 'Connected';
        op['Field'] = text;
        op['Value'] = valuename;
        op['Source'] = valtemp;
    }
    result.push(judge);
    result.push(op);
    return result;
}

function MERGE(judge,Merge,Mergedict){
    var op = {},i,result = [],type,typetemp,typelist=[],text,sourcetemp,sourceDict ={};
    for (var e in Merge){
        sourcetemp= e.split("_");
        text = Merge[e];
        type = text.split(" ");
        sourceDict[sourcetemp[0]]=type[2].replace(/\;|\,/g, '');
    }
    for (i in Mergedict){
        sourcetemp= i.split("_");
        typetemp = Mergedict[i].split(" ");
        typelist.push(typetemp[1]);
        sourceDict[sourcetemp[0]]=typetemp[2].replace(/\;|\,/g, '');
    }
    if (type[1]=="bool" && (typelist.indexOf('uint32_t')||typelist.indexOf('uint32')||typelist.indexOf('string')
        ||typelist.indexOf('int32_t')||typelist.indexOf('sint32')||typelist.indexOf('double')||typelist.indexOf('uint16'))){
        alert(" 该字段的bool类型不能和其他字段进行Merge!");
        judge = false;
    }
    else if (type[1]=="string" && (typelist.indexOf('uint32_t')||typelist.indexOf('uint32')||typelist.indexOf('bool')
        ||typelist.indexOf('int32_t')||typelist.indexOf('sint32')||typelist.indexOf('double')||typelist.indexOf('uint16'))){
        alert(" 该字段的string类型不能和其他字段进行Merge!");
        judge = false;
    }
    else if (type[1]=="double" && (typelist.indexOf('uint32_t')||typelist.indexOf('uint32')||typelist.indexOf('bool')
        ||typelist.indexOf('int32_t')||typelist.indexOf('sint32')||typelist.indexOf('string')||typelist.indexOf('uint16'))){
        alert(" 该字段的double类型不能和其他字段进行Merge!");
        judge = false;
    }
    else if (type[1]=="uint32_t" && (typelist.indexOf('double')||typelist.indexOf('uint32')||typelist.indexOf('bool')
        ||typelist.indexOf('int32_t')||typelist.indexOf('sint32')||typelist.indexOf('string')||typelist.indexOf('uint16'))){
        alert(" 该字段的uint32_t类型不能和其他字段进行Merge!");
        judge = false;
    }
    else if (type[1]=="uint16" && (typelist.indexOf('double')||typelist.indexOf('uint32')||typelist.indexOf('bool')
        ||typelist.indexOf('int32_t')||typelist.indexOf('sint32')||typelist.indexOf('string')||typelist.indexOf('uint32_t'))){
        alert(" 该字段的uint16类型不能和其他字段进行Merge!");
        judge = false;
    }
    else if (type[1] == "uint32") {
        if (typelist.indexOf('double') || typelist.indexOf('uint32_t') || typelist.indexOf('bool')
            || typelist.indexOf('int32_t') || typelist.indexOf('sint32') || typelist.indexOf('string')) {
            alert(" 该字段的uint32类型不能和其他字段进行Merge!");
            judge = false;
        }
        else if (typelist.indexOf("uint16"))
            text.replace(/sint32/, "uint16");
    }
    else if (type[1] == "sint32") {
        if (typelist.indexOf('double') || typelist.indexOf('uint32_t') || typelist.indexOf('bool')
            || typelist.indexOf('int32_t') || typelist.indexOf('string')||typelist.indexOf('uint16')) {
            alert(" 该字段的sint32类型不能和其他字段进行Merge!");
            judge = false;
        }
        else if (typelist.indexOf("uint32"))
            text.replace(/sint32/, "uint32");
    }
    else if (type[1] == "int32_t") {
        if (typelist.indexOf('double') || typelist.indexOf('uint32_t') || typelist.indexOf('bool')
            || typelist.indexOf('sint32') || typelist.indexOf('string')||typelist.indexOf('uint16')) {
            alert(" 该字段的int32_t类型不能和其他字段进行Merge!");
            judge = false;
        }
        else if (typelist.indexOf("uint32_t"))
            text.replace(/int32_t/, "uint32_t");
    }
    op['Operate'] = 'Merge';
    op['Field'] = text;
    op['Value'] = type[2].replace(/\;|\,/g, '');
    op['Source'] = sourceDict;
    result.push(judge);
    result.push(op);
    return result;
}

function CheckText(obj){
    if (obj.checked)
        CHECKLIST.push(obj);
    else
        CHECKLIST.remove(obj);
}

function DeleteStategy(obj){
    var name_num = obj.parentNode.id.split('Templ');
    var checkid = name_num[0] + '_check_';//获取与checkbox_id
    for (var i = 0; i < CHECKLIST.length; i++) {
        if(CHECKLIST[i].id.search(checkid)!=-1)
            CHECKLIST.remove(CHECKLIST[i]);
    }
    obj.parentNode.remove();
    TEMPLATESNAME.remove(name_num[0]+'-'+name_num[1]);
    TEMPLATES.remove(name_num[0]);
    UpdateTemplDropDown();
}

function DeleteOption(obj){
    var id = obj.parentNode.id,i;
    var optionid = OPTIONLIST[id];
    if(optionid["Operate"]=="Merge"){
        var disableid = optionid['DisableID'];
        for (i = 0; i < disableid.length; i++)
            document.getElementById(disableid[i]).disabled = false;
    }
    delete OPTIONLIST[id];
    obj.parentNode.remove();
}

function Finish(){
    var oplist = JSON.stringify(OPTIONLIST);
    var refFeedback = $.ajax("/finish/{0}".format(oplist), {
        dataType: 'text'
    }).done(function (data) {
        alert(data);
    }).fail(function (xhr,status) {
        ajaxLog("失败: "+xhr.status+'\n原因: '+status);
    });
}

function ajaxLog(s) {
    alert(s);
}