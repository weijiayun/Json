/**
 * Created by linus on 16-7-31.
 */
function getPropertyCount(o){
    var n, count = 0;
    for(n in o){
        if(o.hasOwnProperty(n)){
            count++;
        }
    }
    return count;
}
String.prototype.format=function()
{
    if(arguments.length==0) return this;
    for(var s=this, i=0; i<arguments.length; i++)
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
    return s;
};
