$(document).ready(function(){

  // skilgreini global breytur
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  var direction = [1,-1];
  var asteroids = [];
  var bullets = [];
  var degree = 0;
  var speed = 0;
  var cooldown = false;
  var shipLeft;
  var shipTop;
  var bulletLeft ;
  var bulletTop ;
  var speedFractionX;
  var speedFractionY ;
  var rocket = new Image();
  rocket.src = "rocket.png";
  var shipWidth = 50;
  var shipHeight = 87;
  var gameOver = false;
  var gameStart = false;

  // stilli stærð leiksins
  canvas.height = $(window).height();
  canvas.width = $(window).width();


  // leikurinn byrjar þegar ýtt er á K
    $(document).on('keydown', function(event) {
      if (!gameStart) {
      var start = String.fromCharCode(event.which);
      if (start === "K") {

        gameStart = true;
        // leiðbeiningarnar hverfa eftir 7 sekúndur
        setTimeout(function(){
          $('.instructions').fadeOut(2000);
        },10000)

        // skilgreini geimsteina smið
        function Asteroid(radius, speedX, speedY) {
          this.radius = radius;
          this.x = Math.random()* parseInt($(window).width());
          this.y = -100;
          this.speedX = speedX;
          this.speedY = speedY;
        }

        // færa geimsteina
        Asteroid.prototype.move = function() {
          this.y += this.speedX;
          this.x += this.speedY;
          if(this.y > $(window).height()) {
            this.y = 0;
          } else if (this.y < 0) {
            this.y = $(window).height();
          } else if (this.x > $(window).width()) {
            this.x = 0;
          } else if (this.x < 0) {
            this.x = $(window).width();
          }
        }

        // teikna geimsteina
        Asteroid.prototype.draw = function() {
          var picture = document.getElementById('asteroid');
          var pattern = ctx.createPattern(picture,'repeat');
          ctx.beginPath();
          ctx.fillStyle = pattern;
          ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
          ctx.closePath();
          ctx.fill();
        }

        // skilgreini skot smið
        function Bullet(radius, speed) {
          this.radius = radius;
          this.x = parseInt($('#rocket').css('left'))+20;
          this.y = parseInt($('#rocket').css('top'))+35;
          this.speedX = speed * parseFloat($('#rocket').css('transform').split(",")[1]);
          this.speedY = speed * parseFloat($('#rocket').css('transform').split(",")[3]);
        }

        // færa skot
        Bullet.prototype.move = function() {
          this.x += this.speedX;
          this.y -= this.speedY;
        }

        // teikna skot
        Bullet.prototype.draw = function() {
            ctx.beginPath();
            ctx.fillStyle = "lime";
            ctx.arc(this.x, this.y, this.radius, 0, 3*Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }



        // fall sem býr til geimsteina á ákveðnum fresti
        setInterval(function(){
          asteroids.push(new Asteroid(Math.random()*20 + 20, Math.random()* 5 * direction[Math.round(Math.random())], Math.random()* 5   * direction[Math.round(Math.random())]));
        }, 1000 );


        // skilgreini input frá notanda
        $(document).on('keydown', function(event) {
          var key = String.fromCharCode(event.which);

          // hraði skipsins
          if (key === "W" && speed < 100) {
            speed += 20;
          } else if(key === "S" && speed > -40) {
            speed -= 20;
          }

          // takmarkar hversu hratt er hægt að skjóta
          if (event.which == 32 && cooldown === false) {
            bullets.push(new Bullet(5,15));
            cooldown = true;
            setTimeout(function(){
              cooldown = false;
            }, 200)
          }
        });

        // fall fyrir skot/geimsteina collision
        function bulletCollisionDetection() {
          for (var a=0; a<asteroids.length; a++) {
            for (var b=0; b<bullets.length; b++) {
              if (bullets[b].x > asteroids[a].x-5 && bullets[b].x < asteroids[a].x+5+2*asteroids[a].radius && bullets[b].y > asteroids[a].y-10 && bullets[b].y < asteroids[a].y+5 + 2*asteroids[a].radius){
                asteroids.splice(a,1);
                bullets.splice(b,1);
              }
            }
          }
        }


        // klukka til að stjórna stökum í leiknum
        var gameClockFast = setInterval(function(){
          // hreinsar skjáinn til ap teikna skotin og geimsteinana fyrir næsta "ramma"
          ctx.clearRect(0, 0, $(window).width(), $(window).height());

          // sækir X og Y átt skipsins (sem tölu milli -1 og 1)
          speedFractionX = parseFloat($('#rocket').css('transform').split(",")[1]);
          speedFractionY = parseFloat($('#rocket').css('transform').split(",")[3]);
          bulletLeft = parseInt($('.firing').css('left'));
          bulletTop = parseInt($('.firing').css('top'));
          // Getting ship's current X and Y coordinates
          shipLeft = parseInt($('#rocket').css('left'));
          shipTop = parseInt($('#rocket').css('top'));

          // stoppar skipið á enda skjásins 
          if ((parseInt($('#rocket').css('left')) < 0) && speedFractionX < 0)  {
            speedFractionX = 0;
          } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-87)) && speedFractionX > 0) {
            speedFractionX = 0;
          } else if  ((parseInt($('#rocket').css('left')) < 0) && (speedFractionX > 0 && speed < 0)) {
            speedFractionX = 0;
          } else if ((parseInt($('#rocket').css('left')) > ($(window).width()-87)) && (speedFractionX < 0 && speed < 0)) {
            speedFractionX = 0;
          }
          if ((parseInt($('#rocket').css('top')) < 0) && speedFractionY > 0)  {
            speedFractionY = 0;
          } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-87)) && speedFractionY < 0) {
            speedFractionY = 0;
          } else if  ((parseInt($('#rocket').css('top')) < 0) && (speedFractionY < 0 && speed < 0)) {
            speedFractionY = 0;
          } else if ((parseInt($('#rocket').css('top')) > ($(window).height()-87)) && (speedFractionY > 0 && speed < 0)) {
            speedFractionY = 0;
          }


          // reiknar staðsetningu skipsins í næsta ramma
          $('#rocket').css("top", shipTop - (speed * speedFractionY));
          $('#rocket').css("left", shipLeft + (speed * speedFractionX));

          // sýnir hraða skipsins
          $('#speed').html(speed);

          // kveikit á skot/geimsteinn collision skynjararnum
          bulletCollisionDetection();

          // eyðir skotum eftir að þau fara út af skjánum
          for(var i = 0; i < bullets.length; i++) {
            if (bullets[i].x > $(window).width() || bullets[i].x < 0 || bullets[i].y < 0 || bullets[i].y > $(window).height()) {
              bullets.splice(i,1);
            }
          }

          // færir geimsteinana fyrir næsta ramma
          for(var i = 0; i < asteroids.length; i++) {
              asteroids[i].move();
              asteroids[i].draw();
          }

          // færir skot fyrir næsta ramma
          for(var i = 0; i < bullets.length; i++) {
            bullets[i].move();
            bullets[i].draw();
          }

          // miðar skipinu miðað við músina
          $( document ).on( "mousemove", function( event ) {
            var mouseShipDiffX = event.pageX - (shipLeft + 20);
            var mouseShipDiffY = event.pageY - (shipTop + 20);
            if (Math.sqrt(mouseShipDiffY*mouseShipDiffY + mouseShipDiffX*mouseShipDiffX) < 50) {
              $('#warning').css('visibility', 'visible');
            } else {
              var angle = Math.atan(mouseShipDiffX/mouseShipDiffY) * (-180/Math.PI);
              if (mouseShipDiffY > 0) { angle += 180};
              $('#warning').css('visibility', 'hidden');
              $('#rocket').css("transform", 'rotateZ(' + angle + 'deg)');
            }
          });

        },40)
      }
    }
  })
});
