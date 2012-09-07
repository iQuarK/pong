// class Player defines players
function Player(name, color, position) {
   this.offset = 5;
   this.name = (name!=null)?name:"Player";
   this.color = (color!=null)?color:"#000";
   this.size = {w: 20, h: 100};
   this.position = (position!=null)?position:{x:0, y:0};
   this.score = 0;
   this.getScore = function() {
      return this.score;
   };
   this.getCentralPoint = function() {
      var central = {x: this.position.x+this.size.w/2, y:this.position.y+this.size.h/2};
      return central;
   };
   this.addScore = function() {
      this.score = this.score + 1;
   };
   // movement of player
   this.move = function(moveUp) {
      if(moveUp) {
         if (this.position.y > 0) {
            this.position.y -= this.offset;
         }
      } else {
         if (this.position.y+this.size.h < stage.canvas.height) {
            this.position.y += this.offset;
         }
      }
   };
   // automatic movement for one player game
   this.moveAutomatic = function() {
      var middle = this.getCentralPoint();
      if (stage.ball.position.y > middle.y) {
         this.move (false);
      } else {
         if (stage.ball.position.y < middle.y) {
            this.move (true);
         }
      }
   };
   // draws the player
   this.draw = function(context) {
      context.beginPath();
      context.rect(this.position.x, this.position.y, this.size.w, this.size.h);
      context.fillStyle = this.color;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();
   }
}

var stage = {
   canvas: null,
   context: null,
   center: {x: 0, y: 0},         
   ball : {
      radius : 10,
      lineWidth: 2,
      position: {x: 0, y:0},
      offset: 5,
      angle: 1, // 0 to 90
      quadrant: 1, // 1 to 4
      move: function() {
         var sin = Math.sin(this.angle);
         var cos = Math.cos(this.angle);
         var h1 = this.offset;
         var x1 = Math.floor(h1/cos);
         var y1 = Math.floor(h1/sin);
         
         switch (this.quadrant) {
            case 1:
                  this.position.x += Math.abs(x1);
                  this.position.y -= Math.abs(y1);
               break;
            case 2:
                  this.position.x -= Math.abs(x1);
                  this.position.y -= Math.abs(y1);
               break;
            case 3:
                  this.position.x -= Math.abs(x1);
                  this.position.y += Math.abs(y1);
               break;
            case 4:
                  this.position.x += Math.abs(x1);
                  this.position.y += Math.abs(y1);
               break;
               
         }
         
         this.checkCollisionPlayer(stage.player.one);
         this.checkCollisionPlayer(stage.player.two);
         var collisionCode = this.checkCollisionEdges();
         
         if (collisionCode == 3) {
            stage.player.one.addScore();
         } else {
            if (collisionCode == 4) {
               stage.player.two.addScore();
            }
         }
      },
      checkCollisionPlayer: function(player) {
         // check collision with players
         var playerw = player.position.x+player.size.w;
         var playerh = player.position.y+player.size.h;
         
         if (this.position.x-this.radius <= playerw && this.position.x > playerw) {
            if ((this.quadrant == 2 || this.quadrant == 3)
               && this.position.y>=player.position.y && this.position.y<=playerh) {
               this.quadrant = (this.quadrant==2)?1:4;
            }
         } else {
            if (this.position.x+this.radius >= player.position.x && this.position.x < player.position.x
               && (this.quadrant == 1 || this.quadrant == 4)
               && this.position.y>=player.position.y && this.position.y<=playerh) {
               this.quadrant = (this.quadrant==1)?2:3;
            }
         }
      },
      // check collision with edges
      checkCollisionEdges: function() {
         var collisionCode = 0;  // 0 none, 1:top, 2:bottom, 3:right, 4:left
         if (this.position.y > stage.canvas.height - this.radius) {
            this.quadrant = (this.quadrant==3)?2:1;
            collisionCode = 1;
         }
         if (this.position.y <  this.radius) {
            this.quadrant = (this.quadrant==1)?4:3;
            collisionCode = 2;
         }
         if (this.position.x > stage.canvas.width - this.radius) {
            this.quadrant = (this.quadrant==1)?2:3;
            collisionCode = 3;
         }
         if (this.position.x < this.radius) {
            this.quadrant = (this.quadrant==2)?1:4;
            collisionCode = 4;
         }
         
         return collisionCode;
      },
      startMovement: function() {
         // this function sets an angle in degrees fom 15 to 45
         // and after that a quadrant, to ensure the ball starts
         // in a proper angle to start playing
         this.angle = Math.PI/4;
         this.quadrant = Math.floor((Math.random()*4)+1);
      },
      draw: function (context) {            
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        context.fillStyle = "#8ED6FF";
        context.fill();
        context.lineWidth = this.lineWidth;
        context.strokeStyle = "black";
        context.stroke(); 
        context.stroke();
      }
   },
   player: {
      one: null,
      two: null
   },
   scoreboard: {
      draw: function(context) {
         var withCharacter = 40;
         var bottom = stage.canvas.height-withCharacter;
         var offsetRight = withCharacter*(stage.player.two.getScore()+"").length;
         var right = stage.canvas.width-offsetRight;
         
         context.font = "72px Calibri";
         context.fillStyle = stage.player.one.color;
         context.fillText(stage.player.one.getScore(), 0, bottom);
         context.fillStyle = stage.player.two.color;
         context.fillText(stage.player.two.getScore(), right, bottom);
      }
   },
   interaction: function (e) {
      var evtobj=window.event? event : e;
      var unicode=evtobj.charCode? evtobj.charCode : evtobj.keyCode

      if (unicode != 116 && unicode != 123) {
         e.preventDefault();
         switch (unicode) {
            case 38:
               stage.player.one.move(true);
               break;
            case 40:
               stage.player.one.move(false);
               break;
         }
         
         return true;
       }
   
   },
   clear: function() {
     this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
     var w = this.canvas.width;
     this.canvas.width = 1;
     this.canvas.width = w;
   },
   init: function() {
      this.canvas = document.getElementById("canvas");
      this.context = this.canvas.getContext("2d");
      this.center = {x: this.canvas.width / 2, y: this.canvas.height / 2};
      this.ball.position = {x: this.center.x, y:this.center.y};
      this.ball.startMovement();
      this.player.one = new Player("player 1", "#0000FF");
      this.player.two = new Player("player 2", "#FF0000", {x:this.canvas.width-20, y:100});
 
   },
   render: function() {
      stage.clear();
      stage.scoreboard.draw(stage.context);
      stage.player.one.draw(stage.context);
      stage.player.two.moveAutomatic();
      stage.player.two.draw(stage.context);
      stage.ball.move();
      stage.ball.draw(stage.context);
   }
};

window.onload = function() {
   stage.init();
   document.body.addEventListener("keydown", stage.interaction);
   setInterval(stage.render, 40);
   
};