window.onload = function()
{
    var canvas; // on sort ces variables de l'init
    var ctx;
    var delay = 1000 ; // 1 seconde
    var xCoord = 0;
    var yCoord = 0;
    
    init();
    
    function init()  // fonction d'initialisation
    {
        canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas); // accrocher tag dans le canvas
        ctx = canvas.getContext('2d') ; // on le crée une fois
        refreshCanvas();

    }
    
    function refreshCanvas() // on va rafraichir avec cette fonction
    {
        xCoord +=2;
        yCoord +=2;
        ctx.clearRect(0,0,canvas.width,canvas.height); // on efface tt ce qui vient avant
        ctx.fillStyle = "#ff0000" ; // on va dessiner en rouge
        ctx.fillRect(xCoord,yCoord,100,50);
        setTimeout(refreshCanvas,delay); // réappeler la fonction chaque seconde
        
    }
    
    
    
}