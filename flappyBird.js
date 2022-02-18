const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
let frames = 0;
const Degree = Math.PI/180;
const sprite = new Image();
sprite.src = "img/sprite.png";

//load audio

const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";



const pipes = {
    bottom : {
        sX : 502,
        sY : 0
    },

    top : {
        sX : 553,
        sY : 0
    },

    position : [],
    w : 53,
    h : 400,
    maxYPosistion : -150,
    gap : 85,
    dx : 2,

    x : canvas.width,
    y: (Math.random()+1)*this.maxYPosistion,
    
    draw : function(){
        for(let i = 0 ; i < this.position.length; i++){
            let p = this.position[i];
            
            let topPos = p.y;
            let botPos = p.y + this.h + this.gap;

            ctx.drawImage(sprite,this.top.sX,this.top.sY,this.w,this.h,p.x,topPos,this.w,this.h);
            ctx.drawImage(sprite,this.bottom.sX,this.bottom.sY,this.w,this.h,p.x,botPos,this.w,this.h);
            //ctx.drawImage(sprite,this.bottom.sX,this.bottom.sY,this.w,p.x,botPos,this.w,this.h);

        }
    },
    
    reset : function(){
        this.position = [];
    },

    update : function() {
        if(states.current === states.game){
            if(frames % 100 == 0){
                    this.position.push({
                    x : canvas.width,
                    y : (Math.random()+1)*this.maxYPosistion
                    });
            }
            for(let i = 0 ; i < this.position.length; i++){
                let p = this.position[i];
                p.x -= this.dx;

                //kolizja
                let bottomPipeYPos = p.y + this.gap + this.h;
                //top pipe
                console.log(p.y+this.h);
                console.log(bird.y);

                if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                        states.current = states.gameOver;
                        HIT.play();
                    }
               //  bot pipie
                if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                        states.current = states.gameOver;
                        HIT.play();
                 }

                if(p.x + this.w <= 0){
                    this.position.shift();
                    score.value ++;
                    SCORE_S.play();
                }
            }
        }

    }
}

const states = {
    current : 0 ,
    ready : 0,
    game : 1,
    gameOver : 2
}

const backGround = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y: canvas.height - 226,
    dx: 1,

    draw : function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);
    }

    

}

const foreGround = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y: canvas.height - 112,
    dx: 2,

    draw : function(){
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x+this.w,this.y,this.w,this.h);

    },
    
    update : function(){
        if(states.current != states.gameOver){
        this.x -= this.dx;
        if(this.x <= -this.h)
            this.x = 0;
    }
}

}

const getReadyMsg = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : canvas.width/2 -173/2,
    y: 80, 

    draw : function(){
        if(states.current == states.ready)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);

    }
}

const gameOveryMsg = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : canvas.width/2 -225/2,
    y: 90, 
    draw : function(){
        if(states.current == states.gameOver)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);

    }
}

const score = {
    value : 0,
    bestScore : 0,
    reset : function(){
        this.value = 0;
    },

    drawMedal : function(){
        if(this.value > 0){
            bronzeMedal.draw();
        }
        if(this.value > 5){
            silverMedal.draw();
        }
        if(this.value > 15){
            goldMedal.draw();
        }
    },

    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(states.current == states.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, canvas.width/2,50);
            //ctx.strokeText(this.value,canvas.width/2,50);
        }
        else if(states.current == states.gameOver){
            ctx.lineWidth = 2;
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225,186);

            if(this.value > this.bestScore)
                this.bestScore = this.value;
            
            ctx.fillText(this.bestScore, 225-5,186+40);


            
            //ctx.strokeText(this.value,canvas.width/2,50);
        }
    }
}

const bird = {
    animation : [
        {sX : 276, sY : 112},
        {sX : 276, sY : 139},
        {sX : 276, sY : 164},
        {sX : 276, sY : 139}
    ],

     speed: 0,
     gravity: 0.25,
     jump: 4.6,
     radius : 12,

     x: 50,
     y: 150,
     w: 34,
     h: 26,

     frame: 0,
     rotation: 0,
     draw : function(){
        let bird = this.animation[this.frame];
      
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sX,bird.sY,this.w,this.h,-this.w/2,- this.h/2,this.w,this.h);

        ctx.restore();
     },

     update : function(){

        if(states.current == states.ready){
            this.y = 150;
            this.rotation = 0 * Degree;
        }
        else{
            this.speed += this.gravity;
            this.y += this.speed;
            if(this.y+this.h/2 >= canvas.height - foreGround.h){
                this.y = canvas.height - foreGround.h - this.h/2;
                if(states.current == states.game){
                    DIE.play();
                    states.current = states.gameOver;
                }
            }
        }   

        let peroid = (states.current == states.ready) ? 10 : 5;
        if(frames % peroid === 0){
            this.frame++;
            if(this.frame >= this.animation.length)
                this.frame = 0;
        }

        if(this.speed >= this.jump){
            this.rotation = 90*Degree;
            this.frame = 1;
        }
        else{
            this.rotation = -25*Degree;
        }

     },
     reset : function(){
         this.speed = 0;
     },

     flap : function(){
        this.speed = -this.jump;
     }
}

const silverMedal = {
    sX : 311+46+1,
    sY : 112,
    w : 46,
    h : 46,
    x : canvas.width/2 -225/2 + 22,
    y : canvas.height/3+18,

    draw : function(){
        if(states.current == states.gameOver)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);

    }
}

const goldMedal = {
    sX : 311,
    sY : 112+46+1,
    w : 46,
    h : 46,
    x : canvas.width/2 -225/2 + 22,
    y : canvas.height/3+18,

    draw : function(){
        if(states.current == states.gameOver)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);

    }
}

const bronzeMedal = {
    sX : 311+46+1,
    sY : 112+46+1,
    w : 46,
    h : 46,
    x : canvas.width/2 -225/2 + 22,
    y : canvas.height/3+18,

    draw : function(){
        if(states.current == states.gameOver)
        ctx.drawImage(sprite,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h);

    }
}
//kontrola gry

document.addEventListener("click", function(e){
    switch (states.current) {
        case states.ready:
            states.current = states.game;
            break;
        case states.game:
            bird.flap();
            FLAP.play();
            break;
        case states.gameOver:
            states.current = states.ready;
            pipes.reset();
            bird.reset();
            score.reset();
            
            break;
    }
});

function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    backGround.draw();
    pipes.draw();
    foreGround.draw();
    bird.draw();
    gameOveryMsg.draw();
    getReadyMsg.draw();
    score.draw();

    if(states.current == states.gameOver){
        score.drawMedal();
    }

}

function update(){
    bird.update();
    foreGround.update();
    pipes.update();
    
}

function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}

loop();