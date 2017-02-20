window.onload = function() // quand la fenêtre se carger lancer tout
{
    // on sort ces variables de l'init
    var canvasWidh  = 900;  
    var canvasHeight = 600 ;
    var blockSize = 30 ; // la taille d'une case du serpent
    
    var ctx;
    var delay = 100 ; // 1 seconde
    var snakee;
    var pomme;
    var widhInBlocks = canvasWidh/blockSize; //on raisonne en case et non en pixels
    var heightInBlocks = canvasHeight/blockSize; // nbre de bloc en largeur (utile pour les conditions de fin du jeu)
    
    var score;
    
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
        pomme = new Apple([10,10]);
        score = 0;
        refreshCanvas();

    }
    
    function refreshCanvas() // on va rafraichir avec cette fonction
    {
        snakee.advance();  // il avnace mais on ne le dessine qui si pas Coll
        // on le fait avancer puis on check
        
        if (snakee.checkCollision())
        {
            gameOver()
        }
        else 
        {   
            if(snakee.isEatingApple(pomme))
            {
                score +=1;
                snakee.ateApple = true;
                // il a bien mangé , on doit rajouter une autre pomme pas sur le coprs du serpent
                do
                {
                    pomme.setNewPosition();
                }
                while(pomme.isOnSnake(snakee))
                
            }
            ctx.clearRect(0,0,canvasWidh,canvasHeight); // on efface tt ce qui vient avant
            snakee.draw();
            pomme.draw();
            pomme.draw();
            drawScore();
            setTimeout(refreshCanvas,delay); // réappeler la fonction chaque seconde 
        }
        
        
    }
    
    function gameOver()
    {
        ctx.save();
        
        ctx.fillText("GAME OVER",5,15);
        ctx.fillText("Push space to play again",5,30);
        ctx.restore();
    }
        
    function restart() 
    {
        // on recrée un nouveau serpent
        // si on rapplelle init , a va crée un autre canvas
        snakee = new Snake([[6,4],[5,4],[4,4]],"right");
        pomme = new Apple([10,10]);
        score = 0;
        refreshCanvas();
    }
        
        
    function drawScore()
    {
        ctx.save();
        ctx.fillText(score.toString(),5,canvasHeight - 15);
        ctx.restore();
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
        this.ateApple = false ; // si elle change en true, le serpent avance et grandie
        
        
        
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
            
            if (!this.ateApple)
                this.body.pop(); // supprimer le dernier element du serpen s'il n'a pas mangé la pomme
            else
                this.ateApple = false
            
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
        
        this.checkCollision = function() // methode pour checker si tape dans le mur ou lui même
        {
            var wallCollision = false;
            var snakeCollision = false;
            
            var head = this.body[0] ; // si collision , c'est la tête qui prend le choc
            var rest = this.body.slice(1) ; //le reste du corps du serpent
            
            // on compare les coord de la tête par rapport à celle du cardre
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widhInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticallWalls = snakeY < minY || snakeY > maxY;
            
            if (isNotBetweenHorizontalWalls ||isNotBetweenVerticallWalls )
            {
               wallCollision = true;     
            }
            
            // s'est pris le corps : la coord de la tête existe dans le corps
            // on boucle sur ttes les coor du corps
            for(var i=0; i<rest.length;i++)
            {
                if (snakeX== rest[i][0] && snakeY== rest[i][1])
                {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
            
            
        };
        
        this.isEatingApple = function(AppleToEat)
        {
          var head = this.body[0] ;
            if (head[0] == AppleToEat.position[0] && head[1] == AppleToEat.position[1])
               return  true ;
            else
                return false;
            
        }
        
    }
    
    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save(); // pour se souvenir des anciens params du canvas, finir par restore
            
            ctx.fillStyle = "blue";
            ctx.beginPath(); // on dessine la pomme :un rond
            var radius = blockSize/2;
            // x et y vont être au milieu de la cellule
            var x = this.position[0]*blockSize + radius
            var y = this.position[1]*blockSize + radius
            ctx.arc(x,y,radius,0,Math.PI*2,true); // dessine cercle
            ctx.fill(); // remplie cercle
            ctx.restore(); // pour se souvenir des anciens params du canvas
        };
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random()* (widhInBlocks -1));
            var newY = Math.round(Math.random()* (heightInBlocks -1));
            this.position = [newX,newY];
        };
        
        // vérifier ou on va générer la pomme (pas sur le serpent)
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;
            for (var i=0;i<snakeToCheck.body.length;i++)
            {
                if (this.position[0]==snakeToCheck.body[i][0] && this.position[1]==snakeToCheck.body[i][1])
                    isOnSnake = true;
            }
            
            return isOnSnake;
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
            case 32: // le code espace pour recommencer le jeu
                restart();
                return;
             default:
                    return ;
                
        }
        snakee.setDirection(newDirection);
    }
    
}