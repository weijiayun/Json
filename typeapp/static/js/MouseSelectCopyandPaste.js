var MouseSelect = {
    "log":[],
    "resultWidth":0,
    "resultHeight":0,
    "resultWidthBegin":0,
    "resultHeightBegin":0,
    "backColor":'yellow',
    "SelectedPointRecord":{},
    "this":"",
    "stposX":0,
    "stposY":0
};
$(".MouseSelectCopy").mousedown(OnMouseDown);
function OnMouseDown(field) {
    MouseSelect.log = [];
    var tr = field.parentNode;
    var tb = field.parentNode.parentNode.parentNode;
    if(MouseSelect.this)
        if(MouseSelect.this.parentNode.parentNode.parentNode != tb) {
            if(Object.getOwnPropertyNames(MouseSelect.SelectedPointRecord).length != 0)
                for(var e in MouseSelect.SelectedPointRecord)
                    MouseSelect.this.parentNode.parentNode.parentNode.rows[MouseSelect.SelectedPointRecord[e][0]].cells[MouseSelect.SelectedPointRecord[e][1]].style.backgroundColor=MouseSelect.SelectedPointRecord[e][2];
            MouseSelect.SelectedPointRecord = {};
            for(var i=0;i<tb.rows.length-1;i++)
                for (var j = 0; j < tr.cells.length; j++)
                    MouseSelect.SelectedPointRecord["r" + i + "c" + j] = [i, j, tb.rows[i].cells[j].style.backgroundColor];
        }
        else {
            if(Object.getOwnPropertyNames(MouseSelect.SelectedPointRecord).length != 0)
                for(var e in MouseSelect.SelectedPointRecord)
                    tb.rows[MouseSelect.SelectedPointRecord[e][0]].cells[MouseSelect.SelectedPointRecord[e][1]].style.backgroundColor=MouseSelect.SelectedPointRecord[e][2];
        }
    else {
        for(var i=2;i<tb.rows.length-1;i++)
            for (var j = 0; j < tr.cells.length-1; j++)
                MouseSelect.SelectedPointRecord["r" + i + "c" + j] = [i, j, tb.rows[i].cells[j].style.backgroundColor];
        }
    field.style.backgroundColor = MouseSelect.backColor;
    MouseSelect.stposX=field.cellIndex;
    MouseSelect.stposY=field.parentNode.rowIndex;
    $(".MouseSelectCopy").mouseup(onMouseUp);
    $(".MouseSelectCopy").mouseover(onMouseOver);
}
function onMouseUp() {
    MouseSelect.this=this;
    var width = MouseSelect.resultWidth = Math.abs(this.cellIndex-MouseSelect.stposX)+1;
    var height = MouseSelect.resultHeight = Math.abs(this.parentNode.rowIndex-MouseSelect.stposY)+1;
    var colBegin = this.cellIndex>MouseSelect.stposX?MouseSelect.stposX:this.cellIndex;
    var rowBegin = this.parentNode.rowIndex>MouseSelect.stposY?MouseSelect.stposY:this.parentNode.rowIndex;
    var tempColsLog = [];
    var tb = this.parentNode.parentNode.parentNode;
    for(var i=0;i<height;i++){
        tempColsLog = [];
        for(var j=0;j<width;j++){
            tempColsLog.push(tb.rows[rowBegin+i].cells[colBegin+j].innerHTML);
        }
        MouseSelect.log.push(tempColsLog);
    }
    //alert(JSON.stringify(MouseSelect.log));
    $(".MouseSelectCopy").unbind('mouseover',onMouseOver);
    $(".MouseSelectCopy").unbind('mouseup',onMouseUp);
    return false;
}
function onMouseOver() {
    var tb = this.parentNode.parentNode.parentNode;
    var width =Math.abs(this.cellIndex-MouseSelect.stposX)+1;
    var height = Math.abs(this.parentNode.rowIndex-MouseSelect.stposY)+1;
    var colBegin = this.cellIndex>MouseSelect.stposX?MouseSelect.stposX:this.cellIndex;
    var rowBegin = this.parentNode.rowIndex>MouseSelect.stposY?MouseSelect.stposY:this.parentNode.rowIndex;
    if(Object.getOwnPropertyNames(MouseSelect.SelectedPointRecord).length != 0)
        for(var e in MouseSelect.SelectedPointRecord)
            tb.rows[MouseSelect.SelectedPointRecord[e][0]].cells[MouseSelect.SelectedPointRecord[e][1]].style.backgroundColor=MouseSelect.SelectedPointRecord[e][2];
    for(var i=0;i<height;i++){
        for(var j=0;j<width;j++){
            tb.rows[rowBegin+i].cells[colBegin+j].style.backgroundColor=MouseSelect.backColor;
        }
    }

}
function filtertable(h) {
    var rawlist = h.split(/<tr>|<\/tr>|<td>|<\/td>|<table>|<\/table>|<tbody>|<\/tbody>/);
    var trlen = (h.split(/<tr>|<\/tr>/).length-1)/2;
    var tdlen = (h.split(/<td>|<\/td>/).length-1)/2/trlen;
    var newlist = [];
    for(var i in rawlist){
        if(rawlist[i]!="")
            newlist.push(rawlist[i]);
    }
    var twoDimList = [];
    var templist =[];
    for(var r=0;r<trlen;r++){
        templist =[];
        for(var c=0;c<tdlen;c++)
            templist.push(newlist[r*tdlen+c]);
        twoDimList.push(templist)
    }
    return twoDimList;
}
    //绑定在了body上，也可以绑定在其他可用元素行，但是不是所有元素都支持copy和past事件。
function CopyAndPaste() {
    $("body").bind({
        copy: function (e) {//copy事件
            var csv = "";
            if (MouseSelect.resultHeight == 1 && MouseSelect.resultWidth == 1)
                csv = MouseSelect.log[0][0];
            else {
                for (var i2 = 0; i2 < MouseSelect.resultHeight; i2++) {
                    csv += MouseSelect.log[i2].join(",") + "\n";
                }
            }
            var clipboardData = window.clipboardData; //for IE
            if (!clipboardData) { // for chrome
                clipboardData = e.originalEvent.clipboardData;
            }
            clipboardData.setData('Text', csv);
            return false;//否则设不生效
        }, paste: function (e) {//paste事件
            var eve = e.originalEvent;
            var cp = eve.clipboardData;
            var data = null;
            var clipboardData = window.clipboardData; // IE
            if (!clipboardData) { //chrome
                clipboardData = e.originalEvent.clipboardData
            }
            data = clipboardData.getData('Text');
            //clipboardData.clearData('Text');
            var tdIndex = MouseSelect.this.cellIndex;
            var trIndex = MouseSelect.this.parentNode.rowIndex;
            var tb = MouseSelect.this.parentNode.parentNode.parentNode;
            var row = data.split("\n");
            var rowlist = row.map(function (s) {
                return s.split(/\s+|,|\t/)
            });
            if (rowlist[rowlist.length - 1][0] == "")rowlist.pop();
            var setrowslen = new Set(rowlist.map(function (s) {return s.length;})).size;
            rowlist=rowlist.map(function (s) {return s.map(function (e) { return e.replace(new RegExp("\\<br\\>","g"),"");})});
            if (setrowslen == 1) {
                if (rowlist.length == 1 && rowlist[0].length == 1) {
                    tb.rows[trIndex].cells[tdIndex].innerHTML = rowlist[0][0];
                }
                else {
                    for (var i = 0; i < rowlist.length; i++) {
                        for (var j = 0; j < rowlist[0].length; j++) {
                            if ((trIndex + i) < (tb.rows.length - 1) && (tdIndex + j) < tb.rows[0].cells.length)
                                tb.rows[trIndex + i].cells[tdIndex + j].innerHTML = rowlist[i][j];
                        }
                    }
                }
                return false;
            }
            else return true;

        }
    });
}
//$(document).ready(CopyAndPaste);