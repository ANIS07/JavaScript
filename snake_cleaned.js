/* variable globales */
var snake;
var apple;
var snakeGame;

// deux fcts evenement au départ
// le point de départ du jeu
window.onload = function() // quand la fenêtre se carger lancer tout
{
    // on sort ces variables de l'init
    snakeGame = new SnakeGame(900,600,30,100);
    snake =  new Snake([[6,4],[5,4],[4,4]],"right");
    apple = new Apple([10,10]);
    snakeGame.init(snake,apple); // prends serpent + pomme et attache au game 
};
document.onkeydown = function handleKeyDown(e)
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
            // recréer un nouveau serpent
            snake =  new Snake([[6,4],[5,4],[4,4]],"right");
            apple = new Apple([10,10]);
            snakeGame.init(snake,apple); // prends serpent + pomme et attache au game
            return;
        default:
            return ;
                
        }
        snakeGame.snake.setDirection(newDirection);
};

// 3 fct constructeur
function SnakeGame(canvasWidh,canvasHeight,blockSize,delay)
{   // différentes méthodes pour le jeu et propriétés
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvasWidh;
    this.canvas.height = canvasHeight;
    
    // Style 
    this.canvas.style.border = "30px solid gray"
    this.canvas.style.margin = "50px auto"; // le centrer
    this.canvas.style.margin = "50px auto"; // le centrer
    this.canvas.style.display = "bloc";
    this.canvas.style.backgroundColor = "#ddd";
    
    document.body.appendChild(this.canvas); // accrocher tag dans le canvas (ce n'est pas une propriété)
    this.ctx = this.canvas.getContext('2d');   // MODIF
    
    this.blockSize = blockSize ; // la taille d'une case du serpent
    this.delay = delay ; // 1 seconde
    
    this.snake ;
    this.apple ;
    
    this.widhInBlocks = canvasWidh/blockSize; //on raisonne en case et non en pixels
    this.heightInBlocks = canvasHeight/blockSize; // nbre de bloc en largeur (utile pour les conditions de fin du jeu)
    
    this.score;
    
    var instance = this;  // quand je dis this : c'est le jeu
    var timeout;
    
    
    this.init = function(snake,apple)  // fonction d'initialisation (serpend et pomme input)
    {
        this.snake = snake ; // on ratache le snake à celui du jeu
        this.apple = apple;
        this.score = 0;
        clearTimeout(timeout); // remettre le time out à 0 sinon , il ira 2 * plus vite
        
        refreshCanvas();  // va poser un prob pq le this est rattaché à la fenêtre
        // on va la laisser comme variable

    }
    
    var refreshCanvas = function() // on va rafraichir avec cette fonction
    {
        instance.snake.advance();  
        // il avnace mais on ne le dessine qui si pas Coll
        // on le fait avancer puis on check  (instance : le serpent du jeu ,sinon prob avec le this de la windox)
        
        if (instance.checkCollision())
        {
            instance.gameOver();
        }
        else 
        {   
            if(instance.snake.isEatingApple(instance.apple))
            {
                instance.score +=1;
                instance.snake.ateApple = true;
                // il a bien mangé , on doit rajouter une autre pomme pas sur le coprs du serpent
                do
                {
                    instance.apple.setNewPosition(instance.widhInBlocks,instance.heightInBlocks);
                }
                while(instance.apple.isOnSnake(instance.snake)) // !!! !!!!!
                
            }
            instance.ctx.clearRect(0,0,instance.canvas.width,instance.canvas.height); // on efface tt ce qui vient avant
            instance.drawScore(); // on draw score avant pour que snake passe devant
            instance.snake.draw(instance.ctx,instance.blockSize); // tt ça à cause du time out
            instance.apple.draw(instance.ctx,instance.blockSize);
            
            timeout =setTimeout(refreshCanvas,delay); // réappeler la fonction chaque seconde 
        }
        
        
    }
    this.checkCollision = function() // methode pour checker si tape dans le mur ou lui même
        {
            var wallCollision = false;
            var snakeCollision = false;
            
            var head = this.snake.body[0] ; // si collision , c'est la tête qui prend le choc
            var rest = this.snake.body.slice(1) ; //le reste du corps du serpent 
            
            // on compare les coord de la tête par rapport à celle du cardre
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = this.widhInBlocks - 1;
            var maxY = this.heightInBlocks - 1;
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
    this.gameOver = function()
    {
        this.ctx.save();
        
        this.ctx.font = "bold 70px sans-serif";
        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        var centreX = this.canvas.width /2;
        var centreY = this.canvas.height /2;
        this.ctx.strokeText("GAME OVER",centreX,centreY-180); // le stroke autour
        this.ctx.fillText("GAME OVER",centreX,centreY-180);
        
        this.ctx.font = "bold 30px sans-serif";
        this.ctx.strokeText("Push space to play again",centreX,centreY-120); // le stroke autour
        this.ctx.fillText("Push space to play again",centreX,centreY-120);
        this.ctx.restore();
    };
    this.drawScore = function()
    {
        this.ctx.save();
        this.ctx.font = "bold 100px sans-serif";
        this.ctx.fillStyle = "gray";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = "middle";
        // on veut centrer le score
        var centreX = this.canvas.width /2;
        var centreY = this.canvas.height /2;
        
        this.ctx.fillText(this.score.toString(),centreX,centreY);
        this.ctx.restore();
    };
    
};
    
function Snake(body,direction)
    {
        this.body = body; // le corp du serpent donc toutes les coord
        
        this.direction = direction;
        this.ateApple = false ; // si elle change en true, le serpent avance et grandie
        
        
        
        this.draw = function(ctx,blockSize) // la fonction qui dessine le serpent (methode)
        {
            // le ctx d'argument ; pas besoin de this
            ctx.save(); // on sauvegarde ce qur'il y a avant
            ctx.fillStyle = "green" ;
            
            for(var i=0; i<this.body.length; i++) // un bloc coodonée , serpent = plusiers blocs
            // je boucle sur toutes les cordon pour les affichier
            {
                // prend le context et coord , dessine un bloc du serpejnt
                var xCoord = this.body[i][0]*blockSize;    // on tranforme en pixelle 
                var yCoord = this.body[i][1]*blockSize;
                ctx.fillRect(xCoord,yCoord,blockSize,blockSize);
                    
            }
            ctx.restore(); // garder le context et le garder comme il était avant
                
        };
        
        this.advance = function()  // pour faire avancer
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
        
        
        
        this.isEatingApple = function(AppleToEat)
        {
          var head = this.body[0] ;
            if (head[0] == AppleToEat.position[0] && head[1] == AppleToEat.position[1])
               return  true ;
            else
                return false;
            
        }
        
    };
    

function Apple(position)
    {
        this.position = position;
        this.draw = function(ctx,blockSize)
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
        this.setNewPosition = function(widhInBlocks,heightInBlocks)
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
    };