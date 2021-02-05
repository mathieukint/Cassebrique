
// ***  Declaration des varaibles globales  **********************************


var balls = [];                                                         // creation d'un tableau de balles qui contiendra autant d'elements que de balles
var playfieldWidth, playfieldHeight;                                    // dimensions de l'aire de jeu 
var gameRefresh;                                                        // gameRefresh permet de rafraichir la page du jeu
var ballSize;                                                           // ballSize permet de gerer les rebonds de la balle
var curLevel;                                                           // curLevel permet de gerer le niveau du joueur
var bricks = [];                                                        // creation du tableau de briques repertoriees dans le json
var racket;                                                             // racket permet de gerer le deplacement de la raquette


// ***  Initialisation du jeu  ***********************************************

$(document).ready(init);                                                // initialisation


function init(){
    
    curLevel = 0;
    playfieldWidth = $('.Aire2Jeu').width();
    playfieldHeight = $('.Aire2Jeu').height();
    drawPlayfield();
    showGamePanel();
    //gameRefresh = setInterval(drawBalls, 17);                           // vitesse initiale de la balle : plus le nombre est grand, plus la balle est lente
    racket = {width: $('.racket').width(), top: $('.racket').offset().top - $('.Aire2Jeu').offset().top};
    $(window).on('mousemove', drawRacket);                              // controle de la raquette par la souris
    //addBall();                                                        // l'appelle de la méthode est realise a l'interieur de drawPlayfield une fois que les briques sont apparues
    setInterval(addBall, 5000);                                         // ajout d'une balle toutes les 5 secondes

    
}

/*****************************************************************************
 *                            ECRAN D'ACCUEIL  
 *****************************************************************************
*/
// ***  Creation de l'ecran d'accueil  ***************************************

function gameMessage(title, messageText, messageButton, buttonFunction){

    $('body').append(                                                   // injection de balises dans le main.html pour afficher une fenetre d'accueil du joueur
        '<div class="messageBox">' +
            '<label class="lblMessageTitle">' + title + '</label>' +
            '<label class="lblMessage">' + messageText + '</label>' +
            '<button class="btnMessage">' + messageButton + '</button>' +
        '</div>'
    );
    $('.btnMessage').on ('click', buttonFunction);

}

// ***  Affichage de l'ecran d'accueil  **************************************

function showGamePanel(){

    gameMessage(
        "Casse-briques",
        "Petit jeu de casse-briques simple et minimaliste",
        "Cliquer pour lancer une partie",
        startGame
    );

}

// ***  Nettoyage de la fenetre d'accueil ************************************

function cleanMessage(){

    $('.btnMessage').off();                                             // supprime tous les ecouteurs sur btnMessage ramenes par le selecteur de la fonction gameMessage()
    $('.messageBox').remove();                                          // retire le message d'accueil

}

// ***  Lancement de partie  *************************************************

function startGame(){

    cleanMessage();
    drawPlayfield();
    addBall();
    gameRefresh = setInterval(drawBalls, 17);

}


// ***  Affichage du niveau courant  *****************************************

function showCurrentLevel()
{
     $('.lblCurrentLevel')
        .text('Niveau ' + (curLevel + 1))
            .fadeOut(2300);
}


// ***  Affichage de la raquette  ********************************************

function drawRacket(e)
{
	if(gameRefresh != undefined){                                       // accepte le mouvement de la raquette que si gameRefresh est defini
        racket.left = Math.min(playfieldWidth - racket.width, Math.max(2, e.offsetX));
        $('.racket').css ('left', racket.left + 'px');
    }
}


// ***  Creation de la balle  ************************************************

function addBall(){
    
    var j = 1;                                                          // nombre maximum de balles 
    
    if(balls.length<j){
        
        //var idBall = createId();
        $('.Aire2Jeu')
            .prepend('<div class="ball" data-id="' + balls.length + '"></div>');
        ballSize = $('.ball:first').width();
        balls.push(
                {
                    id: balls.length,
                    left: 0.5 * playfieldWidth,
                    top: ($('.brickLine').length * 40) + ballSize,      // 0.7 * playfieldHeight,
                    hSpeed: 2,//Math.random() > 0.5 ? 2 : -2,           // vitesse horizontale de la balle
                    vSpeed: 2                                           // vitesse verticale de la balle
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


// ***  Affichage de la balle  ***********************************************

function drawBalls(){

    balls.forEach(function(e){

        var nearBricks;
        moveBall(e);                                                    // Trajectoire de la balle
        nearBricks= getNearBricks(e);                                   // Contact entre la balle et une brique
        touchBrick(e, nearBricks);                                      // |
        checkBorders(e);                                                // Rebonds sur les bords de l'aire de jeu
        checkRacket(e);                                                 // Rebonds sur la raquette

    });

}


// ***  Trajectoire de la balle  *********************************************

function moveBall(e){

    e.left += e.hSpeed;
    e.top += e.vSpeed;

    $('.ball[data-id="' + e.id + '"]')
        .css({
            left: e.left + 'px',
            top: e.top + 'px'
        });

}


// ***  Contact entre la balle et une brique  ********************************

function getNearBricks(e){

    return bricks.filter(function (f){
        return f.top + 34 > e.top && f.left <= e.left && f.left + 100 >= e.left + ballSize;
    });

}

function touchBrick(e, nearBricks){

    if(nearBricks.length > 0){
        e.vSpeed = -e.vSpeed;
        $('.brick[data-id="' + nearBricks[0].id + '"]').remove();       // supprime l'affichage des briques touchees par la balle
        bricks.splice(bricks.indexOf(nearBricks[0]), 1);                // supprime les briques touchees dans le tableau des briques
        const d = 1;
        const a = 0.2;                                                             
        if(d==1){                                                       // acceleration de la balle a chaque brique detruite
            e.vSpeed = a + e.vSpeed;
            e.hSpeed = a + e.hSpeed;
        }
    }

}


// ***  Rebonds sur les bords de l'aire de jeu  ******************************

function checkBorders(e){

    if(e.left < 0){
        e.hSpeed = -e.hSpeed;
    }
    if(e.left > playfieldWidth-ballSize){
        e.hSpeed = -e.hSpeed;
    }

    if(e.top < 0){
        e.vSpeed = -e.vSpeed;
    }
    if(e.top > playfieldHeight-ballSize){
        e.vSpeed = -e.vSpeed;
    }

}


// ***  Rebonds sur la raquette  *********************************************

function checkRacket(e){

    if (e.top > racket.top){                                            // gestion de la disparition de la balle qui tombe sous la raquette         
        $('.ball[data-id="' + e.id + '"]').remove();
        balls.splice(balls.indexOf(e), 1);
    }
    if (e.top + ballSize >= racket.top){                                // gestion du rebond sur la raquette
        if (e.left >= racket.left && e.left <= racket.left + racket.width - ballSize){
            e.vSpeed = -e.vSpeed;
        }
    }

}


// *** Affichage et gestion de l'aire de jeu  ******************************************

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
            0                                                           // délai d'apparition des briques sur la hauteur
        );
    });

    bricks.forEach(function(e,i){
        $('.brick[data-id="' + e.id + '"]').animate(
            {
                left: e.left + 'px'
            },
            0,                                                          // délai d'apparition des briques sur la largeur

            function (){                                                // appel de la methode addBall une fois que les briques sont apparues
			    if (i == bricks.length - 1){
			        addBall();
                }
            }

        );
    });
    
}
