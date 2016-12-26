
function addTr(tab, row, trHtml){

 var $tr=$("#"+tab+" tr").eq(row);
 if($tr.size()==0){
    alert("ָ����table id�����������ڣ�");
    return;
 }
 $tr.after(trHtml);
}

function delTr(ckb){
 //��ȡѡ�еĸ�ѡ��Ȼ��ѭ������ɾ��
 var ckbs=$("input[name="+ckb+"]:checked");
 if(ckbs.size()==0){
    alert("Ҫɾ��ָ���У���ѡ��Ҫɾ�����У�");
    return;
 }
       ckbs.each(function(){
          $(this).parent().parent().remove();
       });
}

/**
* ȫѡ
*
* allCkb ȫѡ��ѡ���id
* items ��ѡ���name
*/
function allCheck(allCkb, items){
$("#"+allCkb).click(function(){
  $('[name='+items+']:checkbox').attr("checked", this.checked );
});
}

////////���һ�С�ɾ��һ�в��Է���///////
$(function(){
//ȫѡ
allCheck("allCkb", "ckb");
});

function addTr2(tab, row){
var trHtml="<tr align='center'><td width='30%'><input type='checkbox' name='ckb'/></td><td width='30%'>aa</td><td width='30%'>AA</td></tr>";
addTr(tab, row, trHtml);
}

function delTr2(){
 delTr('ckb');
}


//�޸����ӵ�ֵ///
function change(){
 var a = document.getElementById("cname").innerHTML;

 if(a == "+ New User...")
 {document.getElementById("cname").innerHTML = "close"}
 else
 {document.getElementById("cname").innerHTML="+ New User..."}
}



// ��̬���Ԫ��////
$(document).ready(function()
{
var data = ["2","faker","qq@qq.com","admin"];
var html = '';
for (var i=0; i<data.length; i++ )
{
  html+="<td>" + data[i]+ "</td>";
}
$("#user").append(html);

});




function enumTemplate(structname,enumlist,VarAttrs,TemplatesUnitIdPrefix) {
    var enumhtml = "";
    enumhtml = '<li id="{0}">'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    enumhtml += '<span class="jsoneditor-readonly jsoneditor-value" onmouseover="shadowover(this)" onmouseout="shadowout(this)" >';
    if(VarAttrs.Requiredness )
        enumhtml += '<span style="color: red">*</span>';
    enumhtml +='<span >{0} </span>'.format(VarAttrs.Name);
    enumhtml +="<span class='dropdown'>";
    enumhtml +="<button type='button' class='btn dropdown-toggle btn-large btn-primary' id='{0}enumSelect' data-toggle='dropdown'>".format(TemplatesUnitIdPrefix+structname+VarAttrs.Name);
    enumhtml +="<span id=\"{0}{1}{2}buttonValue\">{2}</span><span class='caret'></span></button>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    enumhtml +="<ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">";
    for(var i in enumlist){
        enumhtml += "<li role=\"presentation\">";
        enumhtml += '<a role="menuitem" tabindex="-1" onmouseover="shadowover(this)" onmouseout="shadowout(this)" onclick="get_Drop_Select_value(\'{0}\',this)" name="{1}">{1}</a>'.format(TemplatesUnitIdPrefix+structname+VarAttrs.Name,enumlist[i]);
        enumhtml += "</li>"
    }
    enumhtml += "</ul></span></span><span id=\"m{0}{1}{2}\" style=\"display: none\">{2}</span></li>".format(TemplatesUnitIdPrefix,structname,VarAttrs.Name);
    return enumhtml;
}
function get_Drop_Select_value(ID,obj){
    var id1 = "{0}enumSelect".format(ID);
    var id2 = "{0}buttonValue".format(ID);
    document.getElementById(id1).value = obj.name;
    document.getElementById(id2).innerHTML = obj.name;
}