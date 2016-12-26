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
// Object.prototype.size = function () {
//     var n, count = 0;
//     for(n in this){
//         if(this.hasOwnProperty(n)){
//             count++;
//         }
//     }
//     return count;
// };
String.prototype.format=function()
{
    if(arguments.length==0) return this;
    for(var s=this, i=0; i<arguments.length; i++)
        s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
    return s;
};

Function.prototype.getName = function () {
    return this.name || this.toString().match(/function\s*([^(]*)\(/)[1]
}