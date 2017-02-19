window.onload = function() // quand la fenêtre se carger lancer tout
{
    // on sort ces variables de l'init
    var canvasWidh  = 900;  
    var canvasHeight = 600 ;
    var blockSize = 30 ; // la taille d'une case du serpent
    
    var ctx;
    var delay = 100 ; // 1 seconde
    var snakee;
    
    init();
    
    function init()  // fonction d'initialisation
    {
        var canvas = document.createElement('canvas'); // le canvas crée dans l'Init
        canvas.width = canvasWidh;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas); // accrocher tag dans le canvas
        ctx = canvas.getContext('2d') ; // on le crée une fois
        // premier et la tête
        
        snakee = new Snake([[6,4],[5,4],[4,4]],"right");
        refreshCanvas();

    }
    
    function refreshCanvas() // on va rafraichir avec cette fonction
    {

        ctx.clearRect(0,0,canvasWidh,canvasHeight); // on efface tt ce qui vient avant
        snakee.advance();
        snakee.draw();
        setTimeout(refreshCanvas,delay); // réappeler la fonction chaque seconde
        
    }
    
    
    function drawBlock(ctx,position) // position = array , pour dessiner un bloc du serpent
    {
        var xCoord = position[0]*blockSize;    // on tranforme en pixelle 
        var yCoord = position[1]*blockSize;
        ctx.fillRect(xCoord,yCoord,blockSize,blockSize);
    }
    
    
    function Snake(body,direction)
    {
        this.body = body; // le corp du serpent donc toutes les coord
        
        this.direction = direction;
        
        this.draw = function() // la fonction qui dessine le serpent (methode)
        {
            ctx.save(); // on sauvegarde ce qur'il y a avant
            ctx.fillStyle = "green" ;
            
            for(var i=0; i<this.body.length; i++) // un bloc coodonée , serpent = plusiers blocs
            // je boucle sur toutes les cordon pour les affichier
            {
                drawBlock(ctx , this.body[i]); // prend le context et coord
                    
            }
            ctx.restore(); // garder le context et le garder comme il était avant
                
        };
        
        this.advance = function() // pour faire avancer , on avance la tête et on vire le                           dernier element du corps
        
        {
            var nextPosition = this.body[0].slice() ; // je prend ma copie
            // on le fait avancer selon direction
            switch(this.direction)
            {
                case 'left':
                    nextPosition[0] -=1;
                    break;
                case 'right':
                    nextPosition[0] +=1;
                    break;
                case 'down':
                    nextPosition[1] +=1; // y
                    break;
                case 'up':
                    nextPosition[1] -=1;
                    break;
                default:
                    throw('invalid direction');
            }
            //nextPosition[0] +=1 ; // on fait avancer 
            this.body.unshift(nextPosition) ; // unshift : rajouter à l'array ce bloc en première pos
            this.body.pop(); // supprimer le dernier element du serpen
            
        };
        this.setDirection = function(newDirection)
        {
            var allowDirection;
            switch(this.direction)
            {
                case 'left':
                case 'right':
                    allowDirection = ["up","down"];
                    break;
                case 'down':
                case 'up':
                    allowDirection = ["left","right"];
                    break;
                 default:
                    throw('invalid direction');
            }
            if (allowDirection.indexOf(newDirection)>-1) // si existe retourne index
            {
                this.direction = newDirection;
            }
        };
        
    }
    
    document.onkeydown = function handleKeyDown(e)
    // evenement : une touche appuyée
    {
        var key= e.keyCode;
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
             default:
                    return ;
                
        }
        snakee.setDirection(newDirection);
    }
    
}