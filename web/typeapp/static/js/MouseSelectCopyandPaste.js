var MouseSelect = {
    "log":[],
    "resultWidth":0,
    "resultHeight":0,
    "resultWidthBegin":0,
    "resultHeightBegin":0,
    "backColor":'yellow',
    "SelectedPointRecord":{},
    "this":"",
    "tableType":"",
    "pretableType":"",
    "stposX":0,
    "stposY":0
};
//$(".MouseSelectCopy").mousedown(OnMouseDown);
function OnMouseDown(field,tbtype) {
    MouseSelect.log = [];
    MouseSelect.tableType = tbtype;
    var tr = field.parentNode;
    var tb = field.parentNode.parentNode.parentNode;
    var tbrowstart = 0;
    var prerowsend = 0;
    var tbrowsend = 0;
    var tbcellsend = 0;
    var backgroundcolor = "";
    if(tbtype=="list") {
        tbrowstart = 2;
        tbrowsend = tb.rows.length-1;
        tbcellsend = tr.cells.length-1;
    }
    else if(tbtype = 'mat'){
        tbrowstart = 0;
        tbrowsend = tb.rows.length;
        tbcellsend = tr.cells.length;
    }
    for(var i1=tbrowstart;i1<tbrowsend;i1++){
            backgroundcolor = RowsColor(i1);
            for(var j1=0;j1<tbcellsend;j1++)
            tb.rows[i1].cells[j1].style.backgroundColor = backgroundcolor;
    }
    if(MouseSelect.this){
        tr = MouseSelect.this.parentNode;
        tb = MouseSelect.this.parentNode.parentNode.parentNode;
        tbtype = MouseSelect.pretableType;
        if(tbtype=="list") {
            tbrowstart = 2;
            tbrowsend = tb.rows.length-1;
            tbcellsend = tr.cells.length-1;
        }
        else if(tbtype = 'mat'){
            tbrowstart = 0;
            tbrowsend = tb.rows.length;
            tbcellsend = tr.cells.length;
        }
        for(i1=tbrowstart;i1<tbrowsend;i1++){
            backgroundcolor = RowsColor(i1);
            for(j1=0;j1<tbcellsend;j1++)
                tb.rows[i1].cells[j1].style.backgroundColor = backgroundcolor;
        }
    }
    field.style.backgroundColor = MouseSelect.backColor;
    MouseSelect.stposX=field.cellIndex;
    MouseSelect.stposY=field.parentNode.rowIndex;
    $(".MouseSelectCopy").mouseup(onMouseUp);
    $(".MouseSelectCopy").mouseover(onMouseOver);
}
function onMouseUp() {
    MouseSelect.this=this;
    MouseSelect.pretableType = MouseSelect.tableType;
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
    var tr = this.parentNode;
    var tbrowstart = 0;
    var prerowsend = 0;
    var tbrowsend = 0;
    var tbcellsend = 0;
    var backgroundcolor = "";
    var tbtype = MouseSelect.tableType;
    if(tbtype=="list") {
        tbrowstart = 2;
        tbrowsend = tb.rows.length-1;
        tbcellsend = tr.cells.length-1;
    }
    else if(tbtype = 'mat'){
        tbrowstart = 0;
        tbrowsend = tb.rows.length;
        tbcellsend = tr.cells.length;
    }
    for(var i1=tbrowstart;i1<tbrowsend;i1++){
            backgroundcolor = RowsColor(i1);
            for(var j1=0;j1<tbcellsend;j1++)
                tb.rows[i1].cells[j1].style.backgroundColor = backgroundcolor;
    }
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
            alert(data);
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
                            if ((trIndex + i) < (tb.rows.length) && (tdIndex + j) < tb.rows[0].cells.length)
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
$(document).ready(CopyAndPaste);