var canvas,ctx,w,h,enemy=[],player,tmpenm = [],cols = [],clk,ty=0,gamOver = false,score = 0,scoreLabel,paused=false;
var yposs = [-300,-600,-400,-500,-250,-450];
var imglocs=[
    "https://image.ibb.co/hV2Bha/Ambulance.png",
    "https://image.ibb.co/gqVxNa/Audi.png",
    "https://image.ibb.co/dm58TF/Black_viper.png",
    "https://image.ibb.co/mup2oF/Mini_truck.png",
    "https://image.ibb.co/cuTv8F/Mini_van.png",
    "https://image.ibb.co/jOXNoF/Police.png",
    "https://image.ibb.co/cp4rha/taxi.png",
    "https://image.ibb.co/fv1F8F/truck.png"
];
    var scl = 0;
function Vector(x,y){
    this.x = x;    this.y = y;
    this.add = function(vec){this.x+=vec.x;this.y+=vec.y;}
}//Vector class
function constrain(n,max,min){return Math.max(min,Math.min(n,max));}// get Value in range
function Load(){
    w = window.innerWidth;
    if(w > 400) w = 400;
    h = window.innerHeight-30-30;
    if(h > 600) h = 640-60;
    for(var i=0;i<3;i++) cols.push(i*w/3+10);
    canvas = document.getElementById("mycanvas");
    scoreLabel = document.getElementById("updatescore");
    ctx = canvas.getContext("2d");
    window.addEventListener("keydown",KeyDown,true);
    canvas.height = h;    canvas.width  = w; // set canvas height
    ctx.strokeStyle = "#ffffff";// line color
    ctx.lineWidth = 10;// line width
    ctx.setLineDash([h/5,10]);// set Dashed Line
    scl = h/580;
    if(scl>1)sc = 1;
    //ctx.scale(scl,scl);
    var carImg = new Image();
    carImg.src = "https://image.ibb.co/gOuP2a/Car.png";
   // carImg.src= "Car.png";
    carImg.onload = function(){
        player = new vechcile(carImg);
        player.width = carImg.width;
        player.height = carImg.height;
        player.pos = new Vector(0,(h-player.height*scl));
        setupImages();
    }
}
function setupImages(){
    for(var i=0;i<imglocs.length;i++){
        var tmpimg = new Image();
        tmpimg.src = imglocs[i];
        if(i==imglocs.length-1)tmpimg.onload = function(){document.getElementById("Waitscreen").style ="display:none";}
        var tmp = new vechcile(tmpimg);
        tmp.width = tmpimg.width;
        tmp.height = tmpimg.height;
        tmp.vel = new Vector(0,2);
        enemy.push(tmp);
        setupEnemy();
    }
}
function vechcile(img){
    this.pos = new Vector(0,0);
    this.image = img;
    this.vel = new Vector(0,0);
    this.width = img.width;
    this.height = img.height;
    this.show = function(){
                if(this.height == 0) this.height = 214;
                if(this.width == 0) this.width = 96;
                
                this.pos.x = constrain(this.pos.x,w-(this.width*scl),0);   // Check position within a range
                ctx.drawImage(this.image,this.pos.x,this.pos.y,this.width*scl,this.height*scl);// drawImage image at selected position
                }
    this.update = function(){   this.pos.add(this.vel);     }
    this.end = function(){      return (this.pos.y > h);    }
}
function line(sx,sy,ex,ey){
    ctx.beginPath();
    ctx.moveTo(sx,sy);
    ctx.lineTo(ex,ey);
    ctx.stroke();
}
// setup each enemy on selected index
function setup1Enemy(i){
    var ypos = yposs[Math.floor((yposs.length-1)*Math.random())];
    var xpos = cols[Math.floor(3*Math.random())];
    if(i==0&&tmpenm[i]!=undefined && xpos == tmpenm[1].pos.x) setup1Enemy(i);
    else if(i>0 && tmpenm[i]!=undefined &&  xpos == tmpenm[i-1].pos.x) setup1Enemy(i);
    else {
        var index = Math.floor((enemy.length-1)*Math.random());
        enemy[index].pos = new Vector(xpos,ypos);
        tmpenm[i] = enemy[index];
        ypos -= (2*player.height+100);
    }
}
//setup all enemy
function setupEnemy(){  for(var i=0;i<2;i++)    setup1Enemy(i); }
function loop(){
    ctx.clearRect(0,0,w/scl,h/scl); // clear canvas
    ty += 5;    if(ty > 100) ty=0; // update ty for line animation
    line(w/3,ty,w/3,h);
    line(2*w/3,ty-10,2*w/3,h);
    for(var i=0;i<tmpenm.length;i++){
        tmpenm[i].show();
        tmpenm[i].update();
        if(tmpenm[i].end()) {setup1Enemy(i); updatescore(); }
        if(checkColision(player,tmpenm[i])) {
            gamOver = true;
            stopGame();
            gameOver();
        }
    }
    player.show();
    if(!gamOver)clk = window.requestAnimationFrame(loop);
}

function checkColision(obj1,obj2){ // Check Colision Between two object
    return ((obj1.pos.x+obj1.width*scl >= obj2.pos.x)  &&  (obj2.pos.x+obj2.width*scl >= obj1.pos.x) && (obj1.pos.y+obj1.height*scl >= obj2.pos.y) && (obj2.pos.y+obj2.height*scl >= obj1.pos.y));
}
function updatescore(){ score++; scoreLabel.innerText = score;} // update Score to score label
function moveLeft(){   if(!paused) player.pos.add(new Vector(-10,0)); } // Move Left
function moveRight(){  if(!paused)  player.pos.add(new Vector(10,0)); } // Move right
function KeyDown(e){ // KeyDown on keyboard
    var key = e.keyCode || e.charCode;
             if(key == 39)      moveRight();
        else if(key == 37)      moveLeft();
}
function stopGame(){    window.cancelAnimationFrame(clk); } //stop the game
function togglestop(e){ // Pause Button
    if(e.innerText == "❚❚") {            e.innerText = "▶";        stopGame();  paused = true;}
    else if(e.innerText == "▶"){        e.innerText = "❚❚";        loop();      paused = false;}
}
//start the game
function startGame(){
    document.getElementById("startingscreen").style = "display:none;"; loop();
}
function gameOver(){
    document.getElementById("finalscore").innerText = "GameOver!!!!!!!\n Score:"+score;   
    document.getElementById("gameoverscreen").style = "display:block;";   
}
function restartGame(){
    score = 0;scoreLabel.innerText = score;
    Load();    gamOver = false;
    document.getElementById("gameoverscreen").style = "display:none;";   
    document.getElementById("startingscreen").style = "display:block;";
}