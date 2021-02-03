var balls = []; // creation d'un tableau de balles qui contiendra autant d'elements que de balles
var playfieldWidth, playfieldHeight;
var gameRefresh; // gameRefresh permet de rafraichir la page du jeu
var ballSize; // ballSize permet de gerer les rebonds de la balle
var curLevel; //curLevel permet de gerer le niveau du joueur
var bricks = []; //  creation du tableau de briques repertoriees dans le json



$(document).ready(init); // initialisation


function init(){
    
    curLevel = 0;
    playfieldWidth = $('.Aire2Jeu').width();
    playfieldHeight = $('.Aire2Jeu').height();
    drawPlayfield();
    addBall();
    setInterval(addBall, 5000); // ajout d'une balle toutes les 5 secondes
    gameRefresh = setInterval(drawBalls, 17); // vitesse initiale de la balle : plus le nombre est grand, plus la balle est lente
    $(window).on('mousemove', drawRacket);
	racket = {width: $('.racket').width(), top: $('.racket').offset().top - $('.Aire2Jeu').offset().top};
}


function addBall(){
    
    var j = 1; // nombre maximum de balles 
    
    if(balls.length<j){
        
        //var idBall = createId();
        $('.Aire2Jeu')
            .prepend('<div class="ball" data-id="' + balls.length + '"></div>');
        ballSize = $('.ball:first').width();
        balls.push(
                {
                    id: balls.length,
                    left: 100,
                    top: 100,
                    hSpeed: 2,
                    vSpeed: 2
                },
            );
    }

}

/*
function createId(){

    var code = "";
    
    for(var $compteur = 0; $compteur < 8; $compteur++){
        code += String.fromCharCode(65+Math.random()*26);
    }
    return code;

}
*/

function drawRacket(e)
{
	racket.left = Math.min(playfieldWidth - racket.width, Math.max(2, e.offsetX));
	$('.racket').css ('left', racket.left + 'px');
}

function drawBalls(){
    
    balls.forEach(function(e){
        
        //trajectoire de la balle et rebond sur les bords du cadre

        e.left += e.hSpeed;
        e.top += e.vSpeed;
        
        if(e.left<0){
            e.hSpeed = -e.hSpeed;
        }
        if(e.left>playfieldWidth-ballSize){
            e.hSpeed = -e.hSpeed;
        }

        if(e.top<0){
            e.vSpeed = -e.vSpeed;
        }
        if(e.top>playfieldHeight-ballSize){
            e.vSpeed = -e.vSpeed;
        }

        // rebond sur la raquette

        if (e.top > racket.top){
			$('.ball[data-id="' + e.id + '"]').remove();
			balls.splice(balls.indexOf(e), 1);
        }
		if (e.top + ballSize >= racket.top){
			if (e.left >= racket.left && e.left <= racket.left + racket.width - ballSize){
				e.vSpeed = -e.vSpeed;
			}
		}

        // *************

        $('.ball[data-id="' + e.id + '"]')
            .css({
                left: e.left + 'px',
                top: e.top + 'px'
            });
        }
    );

}

function drawPlayfield(){

    showCurrentLevel();

    levels[curLevel].forEach(function (e, i){
        var line = $('<div class="brickLine"></div>');
		e.forEach (function (f, j){
            bricks.push ({
                id: i + '-' + j,
                top: i * 34,
                left: j * 104
	        }) ;
	        line.append('<div class="brick ' + f + 'Brick" data-id="' + i + '-' + j + '"></div>');
		});
	    $('.Aire2Jeu').prepend(line);
	});

    bricks.forEach(function(e,i){
        $('.brick[data-id="' + e.id + '"]').animate(
            {
                top: e.top + 'px'
            },
            500
        );
    });

    bricks.forEach(function(e,i){
        $('.brick[data-id="' + e.id + '"]').animate(
            {
                left: e.left + 'px'
            },
            1000,
            function (){
			    if (i == bricks.length - 1){
			        addBall();
                }
            }
        );
    });
    
}

function showCurrentLevel()
{
 	$('.lblCurrentLevel')
 		.text('Niveau ' + (curLevel + 1))
 		.fadeOut(1700);
}