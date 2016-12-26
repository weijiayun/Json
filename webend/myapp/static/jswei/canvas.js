/**
 * Created by jiayun.wei on 10/25/16.
 */

function draw1(id) {
    var canvas = document.getElementById("tutorial");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
    }
    else
        return false;
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10,10,55,50);

    ctx.fillStyle = "rgba(0,0,200,0.5)";
    ctx.fillRect(30,30,55,50);

    canvas = document.getElementById("stockGraph");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    ctx.fillRect(25,25,100,100);
    ctx.clearRect(45,45,60,60);
    ctx.strokeRect(50,50,50,50);

    canvas = document.getElementById("path");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    ctx.beginPath();
    ctx.moveTo(75,50);
    ctx.lineTo(100,75);
    ctx.lineTo(100,25);
    ctx.fill();

    canvas = document.getElementById("smileface");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI*2, true);
    ctx.moveTo(110,75);
    ctx.arc(75, 75, 35, 0, Math.PI,false);
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI*2, true);
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI*2, true);
    ctx.stroke();

    canvas = document.getElementById("clock");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    for(var i=0; i<4;i++){
        for(var j=0;j<3;j++){
            var x = 25+j*50;
            var y = 25+i*50;
            var radius = 20;
            var starAngle = 0;
            var endAngle = Math.PI+(Math.PI*j)/2;
            var anticlockwise = i%2!=0;
            ctx.beginPath();
            ctx.arc(x, y, radius, starAngle, endAngle,anticlockwise);
            if(i>1){
                ctx.fill();
            }
            else {
                ctx.stroke();
            }
        }
    }

    canvas = document.getElementById("bezier");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;
    ctx.beginPath();
    ctx.moveTo(75,25);
    ctx.quadraticCurveTo(25,25,25,62.5);
    ctx.quadraticCurveTo(25,100,50,100);
    ctx.quadraticCurveTo(50,120,30,125);
    ctx.quadraticCurveTo(60,120,65,100);
    ctx.quadraticCurveTo(125,100,125,62.5);
    ctx.quadraticCurveTo(125,25,75,25);
    ctx.stroke();

    canvas = document.getElementById("roundedrec");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    for(j=0;j<6;j++){
        roundedRect(ctx,10+j*10,10+j*10,130-j*20,130-j*20,10);
    }


    canvas = document.getElementById("path2d");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    var rectangle = new Path2D();
    rectangle.rect(20,50,50,50);

    var circle = new Path2D();
    circle.moveTo(125, 35);
    circle.arc(100, 75, 25,0, 2*Math.PI);
    ctx.stroke(rectangle);
    ctx.fill(circle);

    //var p = new Path2D("M10 10 h 80 v 80 h -80 Z")
    //ctx.fill(p)

    canvas = document.getElementById("style1");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    for(i=0;i<6;i++){
        for(j=0;j<6;j++){
            ctx.fillStyle = 'rgb({0},{1},0)'.format(Math.floor(255-42.5*i),Math.floor(255-42.5*j));
            ctx.fillRect(j*25,i*25,25,25)
        }
    }

    canvas = document.getElementById("style2");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    for(i=0;i<6;i++){
        for(j=0;j<6;j++){
            ctx.strokeStyle = 'rgb(0,{0},{1})'.format(Math.floor(255-42.5*i),Math.floor(255-42.5*j));
            ctx.beginPath()
            ctx.arc(j*25+12.5,i*25+12.5,10,0,Math.PI*2,true);
            ctx.stroke();
        }
    }

    canvas = document.getElementById("trans");
    if(canvas.getContext){
        ctx = canvas.getContext("2d");
    }
    else
        return false;

    ctx.fillStyle = '#FD0';
    ctx.fillRect(0,0,75,75);
    ctx.fillStyle = '#6C0';
    ctx.fillRect(75,0,75,75);
    ctx.fillStyle = '#09F';
    ctx.fillRect(0,75,75,75);
    ctx.fillStyle = '#F30';
    ctx.fillRect(75,75,75,75);
    ctx.fillStyle = '#FFF';
    ctx.globalAlpha = 0.2;

    for(i=0;i<7;i++){
        ctx.beginPath();
        ctx.arc(75,75,10+10*i,0,Math.PI*2,true);
        ctx.fill();
    }


    ctx = document.getElementById('line1').getContext('2d');
    for (i = 0; i < 10; i++){
        ctx.lineWidth = 1+i;
        ctx.beginPath();
        ctx.moveTo(5+i*14,5.5);
        ctx.lineTo(5+i*14,140.5);
        ctx.stroke();
    }

    ctx = document.getElementById('linecap').getContext('2d');
    ctx.strokeStyle = '#09f';
    ctx.beginPath();
    ctx.moveTo(10,10);
    ctx.lineTo(140,10);
    ctx.moveTo(10,140);
    ctx.lineTo(140,140);
    ctx.stroke();
    var lineCap = ['butt','round','square'];
    ctx.strokeStyle = 'black';
    for (i = 0; i < lineCap.length; i++){
        ctx.lineWidth = 15;
        ctx.lineCap = lineCap[i];
        ctx.beginPath();
        ctx.moveTo(25+i*50,10);
        ctx.lineTo(25+i*50,140);
        ctx.stroke();
    }
    //ctx.clear();


    ctx = document.getElementById('linejoin').getContext('2d');
    var lineJoin = ['round','bevel','miter'];
    ctx.lineWidth = 10;
    for ( i=0;i<lineJoin.length;i++){
        ctx.lineJoin = lineJoin[i];
        ctx.beginPath();
        ctx.moveTo(-5,5+i*40);
        ctx.lineTo(35,45+i*40);
        ctx.lineTo(75,5+i*40);
        ctx.lineTo(115,45+i*40);
        ctx.lineTo(155,5+i*40);
        ctx.stroke();
    }


    ctx = document.getElementById('dashline').getContext('2d');
    var offset = 0;

    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.setLineDash([4,2]);
        ctx.lineDashOffset = -offset;
        ctx.strokeRect(10,10,100,100);
    }

    function march() {
        offset++;
        if(offset>16){
            offset = 0;
        }
        draw();
        setTimeout(march,20);
    }
    march();

}
function roundedRect(ctx,x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x,y+radius);
  ctx.lineTo(x,y+height-radius);
  ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
  ctx.lineTo(x+width-radius,y+height);
  ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
  ctx.lineTo(x+width,y+radius);
  ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
  ctx.lineTo(x+radius,y);
  ctx.quadraticCurveTo(x,y,x,y+radius);
  ctx.stroke();
}


