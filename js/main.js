//********************************//
//********* JESTER JIVES *********//
//***** CREATED BY SECTION C *****//
//********************************//

//********************************//
//********** SECTION C ***********//
//********************************//
//****** DAVID LAFANTAISIE *******//
//**** INDERDEEP SINGH KHANNA ****//
//******* SHERALD LINQUICO *******//
//********* MAC MAUNDER **********//
//********************************//

//********************************//
//********* LAST UPDATE **********//
//******* MARCH 13th 2017 ********//
//********************************//

//LEGEND
// Main section of code === //*****HEADING*****//
// Sub section of code === //-----Sub Heading-----//

//Variables that are directly related to a section of code
//are placed underneath the main heading

//General order of events
/*
- Assets are loaded
- Splash screen displayed, then game initialized
- Event listeners are initialized
- Menu state is entered via state machine
- Next state is entered based on button player clicks
- When game state is entered, generate functions are called
- When player enters a door, traps array is cleared and new room generated, repositions player
- If player dies, die function is called, state is changed to game over state
*/

var vid1 = document.createElement('VIDEO');
var vid1Playing = false;
var vid2 = document.createElement('VIDEO');
var vid2Playing = false;
vid1.src = "video/first.mp4";
vid2.src = "video/end.mp4";


//IIFE
(function (){

//*****GLOBAL VARIABLES*****//

//-----Constants-----//

var FPS = 16.67;//30 FPS = 33.34, 60 FPS = 16.67
var SIZE = 32;
var ROWS = 16;
var COLS = 16;
var BROWS = 18;
var BCOLS = 18;
var numOfLevelsPassed = 0;

var friction = 0.7;
var gravity = 0.26;
var maxNumOfTraps = 5;

var dir =
{
    NORTH: 1,
    EAST: 2,
    SOUTH: 3,
    WEST: 4
};

var currentLevelTheme = 1;

//-----Canvas Setup-----//

var canvas = document.getElementById("canvas");
canvas.width = 640;
canvas.height = 640;
var surface = canvas.getContext("2d");

//*****TRAPS*****//

/*Each trap should have the following properties

 var trap =
 {
 isTrap: true,
 x: 0,
 y: 0,
 collidable: false, //If this is true, trap will collide like normal platforms
 width: SIZE,
 height: SIZE,

 img: undefined,
 spriteWidth: SIZE,
 spriteHeight: SIZE,
 frameIndex: 0,
 currentFrame: 0,
 framesPerSprite: 6, //Number of frames each individual sprite will be rendered for
 animate:
 function()
 {
 this.currentFrame++;
 if(this.currentFrame === this.framesPerSprite)
 {
 this.frameIndex++;
 this.currentFrame = 0;
 if(this.frameIndex == changeThisVariable)
 {
 this.frameIndex = 0;
 }
 }
 },

 activate:
 function()
 {
 blah;
 blahBlah;
 }
 };

 */

var fire =
{
    isTrap: true,
    x: 0,
    y: 0,
    collidable: false,
    width: SIZE,
    height: SIZE,

    img: undefined,
    spriteWidth: SIZE,
    spriteHeight: SIZE,
    frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 3,
    animate:
        function()
        {
            this.currentFrame++;
            if(this.currentFrame === this.framesPerSprite)
            {
                this.frameIndex++;
                this.currentFrame = 0;
                if(this.frameIndex == 8)
                {
                    this.frameIndex = 0;
                }
            }
        },

    activate:
        function()
        {
            if(player.x < this.x+this.width-10 &&
                player.x+player.width > this.x+10 &&
                player.y < this.y+this.height-10 &&
                player.y+player.height > this.y+10)
            {
                die();
            }
        }
};

var spikes =
{
    isTrap: true,
    x: 0,
    y: 0,
    collidable: false, //If this is true, trap will collide like normal platforms
    width: SIZE,
    height: SIZE,

    img: undefined,
    spriteWidth: SIZE,
    spriteHeight: SIZE,
    frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 8, //Number of frames each individual sprite will be rendered for
    animate:
        function()
        {
            this.currentFrame++;
            if(this.currentFrame === this.framesPerSprite)
            {
                this.frameIndex++;
                this.currentFrame = 0;
                if(this.frameIndex == 3)
                {
                    this.frameIndex = 0;
                }
            }
        },

    activate:
        function()
        {
            if(player.y < this.y
                && player.y+SIZE > this.y-10
                && player.x < this.x + SIZE
                && player.x > this.x)
            {
               die();
            }
        }
};

var teleporter =
{
    isTrap: true,
    x: 0,
    y: 0,
    collidable: false, //If this is true, trap will collide like normal platforms
    width: SIZE,
    height: SIZE,

    img: undefined,
    spriteWidth: SIZE,
    spriteHeight: SIZE,
    frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 8, //Number of frames each individual sprite will be rendered for
    animate:
        function()
        {
            this.currentFrame++;
            if(this.currentFrame === this.framesPerSprite)
            {
                this.frameIndex++;
                this.currentFrame = 0;
                if(this.frameIndex == 2)
                {
                    this.frameIndex = 0;
                }
            }
        },

    activate:
        function()
        {
            if(player.y < this.y+16 &&
                player.y+16 > this.y &&
                player.x < this.x+16 &&
                player.x+16 > this.x)
            {
                var randX = Math.floor((Math.random()*canvas.width-SIZE)+SIZE/2);
                var randY = Math.floor((Math.random()*canvas.height-SIZE)+SIZE/2);

                while(findTile(randX+1, randY+1).img != "empty")
                {
                    randX = Math.floor((Math.random()*canvas.width-SIZE)+SIZE/2);
                    randY = Math.floor((Math.random()*canvas.height-SIZE)+SIZE/2);
                }
                player.x = randX;
                player.y = randY;
                player.velX = 0;
                player.velY = 0;
            }
        }
};

var arrowSpawn =
{
        isTrap: true,
        isArrowTrap: true,
        x: 0,
        y: 0,
        collidable: false, //If this is true, trap will collide like normal platforms
        width: SIZE,
        height: SIZE,
        dir: dir.WEST,

        img: undefined,
        spriteWidth: SIZE,
        spriteHeight: SIZE,
        frameIndex: 0,
        currentFrame: 0,
        framesPerSprite: 6, //Number of frames each individual sprite will be rendered for
        animate:
            function()
            {
                /*this.currentFrame++;
                 if(this.currentFrame === this.framesPerSprite)
                 {
                 this.frameIndex++;
                 this.currentFrame = 0;
                 if(this.frameIndex == changeThisVariable)
                 {
                 this.frameIndex = 0;
                 }
                 }*/
            },

        counter: 0,
        arrows: [],
        activate:
            function()
            {
                this.counter++;
                if(this.counter % 100 === 0)
                {
                    this.shoot();
                    this.counter = 0;
                }
                for(var i = 0; i < this.arrows.length; i++)
                {
                    if(this.arrows[i].dir === dir.WEST)
                        this.arrows[i].x -= this.arrows[i].speed;
                    if(this.arrows[i].dir === dir.NORTH)
                        this.arrows[i].y -= this.arrows[i].speed;
                    if(this.arrows[i].dir === dir.EAST)
                        this.arrows[i].x += this.arrows[i].speed;
                    if(this.arrows[i].dir === dir.SOUTH)
                        this.arrows[i].y += this.arrows[i].speed;

                    if(player.x < this.arrows[i].x+this.arrows[i].width &&
                        player.x+player.width > this.arrows[i].x &&
                        player.y < this.arrows[i].y+this.arrows[i].height &&
                        player.y+player.height > this.arrows[i].y+SIZE-SIZE/4)
                    {
                        die();
                    }
                    if(this.arrows[i] != undefined && this.arrows[i].x < SIZE)
                        this.arrows.splice(i, 1);

                    if(this.arrows[i] != undefined && this.arrows[i].y < SIZE)
                        this.arrows.splice(i, 1);

                    if(this.arrows[i] != undefined && this.arrows[i].x+this.arrows[i].width > canvas.width-SIZE)
                        this.arrows.splice(i, 1);

                    if(this.arrows[i] != undefined && this.arrows[i].y+this.arrows[i].height > canvas.height-SIZE)
                        this.arrows.splice(i, 1);

                    for(var j = 0; j < ROWS; j++)
                    {
                        for(var k = 0; k < COLS; k++)
                        {
                            if(this.arrows[i] != undefined && platforms[j][k] != undefined && this.arrows[i].x < platforms[j][k].x+platforms[j][k].width &&
                                this.arrows[i].x+this.arrows[i].width > platforms[j][k].x &&
                                this.arrows[i].y < platforms[j][k].y+platforms[j][k].height &&
                                this.arrows[i].y+this.arrows[i].height > platforms[j][k].y &&
                                platforms[j][k].isTrap === false &&
                                platforms[j][k].img != "empty")
                            {
                                this.arrows.splice(i, 1);
                            }
                        }
                    }
                }
            },

        shoot:
            function()
            {
                var arrow = "undefined";
                if(this.dir === dir.WEST)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x,
                            y: this.y+13,
                            dir: dir.WEST,
                            speed: 1,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 22,
                            height: 6,
                            img: images[20]
                        };
                }
                if(this.dir === dir.NORTH)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x+13,
                            y: this.y,
                            dir: dir.NORTH,
                            speed: 1,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 6,
                            height: 16,
                            img: images[22]
                        };
                }
                if(this.dir === dir.EAST)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x,
                            y: this.y+13,
                            dir: dir.EAST,
                            speed: 1,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 22,
                            height: 6,
                            img: images[23]
                        };
                }
                if(this.dir === dir.SOUTH)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x+13,
                            y: this.y,
                            dir: dir.SOUTH,
                            speed: 1,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 6,
                            height: 16,
                            img: images[24]
                        };
                }
                this.arrows.push(arrow);
                playSound("shoot");
            }
    };

//-----Trap Activation-----//

function activateTraps()
{
    for(var i = 0; i < traps.length; i++)
    {
        traps[i].activate();
    }
    eyeTrap.activate();
}

//*****LEVEL GENERATION****//

var background = [];//array for background tile objects
var platforms = [];//array for platform images
var traps = [];//array to hold traps
var coll = [];//array for collidable platforms

var maxTilesInRow = 0;

function generateBackground()
{
    for(var i = 0; i < BROWS; i++)
    {
        background[i] = [];
        for(var j = 0; j < BCOLS; j++)
        {
            var randNum = -1;
			switch(currentLevelTheme)
			{
				case 1:
					randNum = Math.floor(Math.random()*4+1);
					break;
				case 2:
					randNum = Math.floor(Math.random()*4+32);
					break;
				case 3:
					randNum = Math.floor(Math.random()*7+58);
					break;
				case 4:
					randNum = Math.floor(Math.random()*4+69);
					break;
				case 5:
					randNum = Math.floor(Math.random()*4+77);
					break;
				case 6:
					randNum = Math.floor(Math.random()*4+85);
					break;
				case 7:
					randNum = Math.floor(Math.random()*4+93);
					break;
				case 8:
					randNum = Math.floor(Math.random()*4+97);
					break;
			}

            var temp =
                {
                    x: j*SIZE+32,
                    y: i*SIZE+32,
                    img: images[randNum]
                }

            background[i][j] = temp;
        }
    }
}

function generateRoom()
{
	//Reset head
	midHead.active = true;
	midHead.img = images[53];
	
    for(var i = 0; i < ROWS; i++)
    {
        platforms[i] = [];
        for(var j = 0; j < COLS; j++)
        {
            var temp =
                {
                    isTrap: false,
                    x: i*SIZE+SIZE*2,
                    y: j*SIZE+SIZE*2,
                    width: SIZE,
                    height: SIZE,
                    img: "empty",
                    collidable: false
                }

            var tileChance = Math.floor(Math.random()*100);
            if( (i === 7 && j === 0) || (i === 8 && j === 0) )
            {
				switch(currentLevelTheme)
				{
					case 1:
						temp.img = images[6];
						break;
					case 2:
						temp.img = images[28];
						break;
					case 3:
						temp.img = images[54];
						break;
					case 4:
						temp.img = images[65];
						break;
					case 5:
						temp.img = images[73];
						break;
					case 6:
						temp.img = images[81];
						break;
					case 7:
						temp.img = images[89];
						break;
					case 8:
						temp.img = images[101];
						break;
				}
                temp.collidable = true;
            }
			else if( (i === 7 && j === 7) || (i === 7 && j === 8) || (i === 8 && j === 7) || (i === 8 && j === 8) )
			{
				temp.img = "empty";
			}
            else if(tileChance <= 24)
            {
                var randNum = Math.floor(Math.random()*4);
                switch(randNum)
                {
                    case 0:
                        switch(currentLevelTheme)
						{
							case 1:
								temp.img = images[6];
								break;
							case 2:
								temp.img = images[28];
								break;
							case 3:
								temp.img = images[54];
								break;
							case 4:
								temp.img = images[65];
								break;
							case 5:
								temp.img = images[73];
								break;
							case 6:
								temp.img = images[81];
								break;
							case 7:
								temp.img = images[89];
								break;
							case 8:
								temp.img = images[101];
								break;
						}
                        break;
                    case 1:
                        switch(currentLevelTheme)
						{
							case 1:
								temp.img = images[7];
								break;
							case 2:
								temp.img = images[29];
								break;
							case 3:
								temp.img = images[55];
								break;
							case 4:
								temp.img = images[66];
								break;
							case 5:
								temp.img = images[74];
								break;
							case 6:
								temp.img = images[82];
								break;
							case 7:
								temp.img = images[90];
								break;
							case 8:
								temp.img = images[102];
								break;
						}
                        break;
                    case 2:
                        switch(currentLevelTheme)
						{
							case 1:
								temp.img = images[8];
								break;
							case 2:
								temp.img = images[30];
								break;
							case 3:
								temp.img = images[56];
								break;
							case 4:
								temp.img = images[67];
								break;
							case 5:
								temp.img = images[75];
								break;
							case 6:
								temp.img = images[83];
								break;
							case 7:
								temp.img = images[91];
								break;
							case 8:
								temp.img = images[103];
								break;
						}
                        break;
                    case 3:
						switch(currentLevelTheme)
						{
							case 1:
								temp.img = images[9];
								break;
							case 2:
								temp.img = images[31];
								break;
							case 3:
								temp.img = images[57];
								break;
							case 4:
								temp.img = images[68];
								break;
							case 5:
								temp.img = images[76];
								break;
							case 6:
								temp.img = images[84];
								break;
							case 7:
								temp.img = images[92];
								break;
							case 8:
								temp.img = images[104];
								break;
						}
                        break;
                }

                temp.collidable = true;
            }
            else if(tileChance > 24 && tileChance <= 28 && traps.length < maxNumOfTraps)
            {
                var randTrap = Math.floor(Math.random()*4);
                switch(randTrap)
                {
                    case 0:
                        temp = Object.create(fire);
                        temp.img = images[12];
                        break;
                    case 1:
                        temp = Object.create(spikes);
                        temp.img = images[18];
                        break;
                    case 2:
                        temp = Object.create(teleporter);
                        temp.img = images[19];
                        break;
                    case 3:
                        temp = Object.create(arrowSpawn);
                        var randDir = Math.floor(Math.random()*4);
                        switch(randDir)
                        {
                            case 0:
                                temp.dir = dir.WEST;
                                temp.img = images[21];
                                break;
                            case 1:
                                temp.dir = dir.NORTH;
                                temp.img = images[25];
                                break;
                            case 2:
                                temp.img = images[26];
                                temp.dir = dir.EAST;
                                break;
                            case 3:
                                temp.img = images[27];
                                temp.dir = dir.SOUTH;
                                break;
                        }
                        break;
                }
                temp.x = i*SIZE+SIZE*2;
                temp.y = j*SIZE+SIZE*2;

                traps.push(temp);
            }
            else
            {
                temp.img = "empty";
            }
            platforms[i][j] = temp;
        }
    }
}

//*****Eye Trap*****//
var eyeTrapState =
    {
        PATROLLING:0,
        FIGHTING:1
    };
var eyeTrap =
    {
        x: 0,
        y: 576,
        width: 30,
        height: 28,
        counter:0,
        img:undefined,
        spriteWidth: 32,
        spriteHeight:32,
        velX:0,
        velY:0,
        dir:dir.EAST,
        shootDir:dir.EAST,
        jumpSpeed:3,
        speed:1.5,
        coll:false,
        jumping: false,
        running: true,
        frameIndex: 0,
        currentFrame: 0,
        framesPerSprite: 6,
        playerInSight: false,
        currentState:eyeTrapState.PATROLLING,
        previousDir:dir.EAST,
        arrows:[],
        hasShot:false,
        isActivated:false,
        animate:
            function()
            {
                //TODO:animation code here.
            },
        shoot:
            function ()
            {
                //TODO: Fighting code here.
                var arrow;
                this.checkLineOfSite();
                console.log("attack");
                if(arrow === undefined && this.shootDir === dir.WEST)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x,
                            y: this.y+13,
                            dir: dir.WEST,
                            speed: 3,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 22,
                            height: 6,
                            img: images[20]
                        };
                }
                else if(arrow === undefined && this.shootDir === dir.NORTH)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x+13,
                            y: this.y,
                            dir: dir.NORTH,
                            speed: 3,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 6,
                            height: 16,
                            img: images[22]
                        };
                }
                else if( arrow === undefined &&this.shootDir === dir.EAST)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x,
                            y: this.y+13,
                            dir: dir.EAST,
                            speed: 3,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 22,
                            height: 6,
                            img: images[23]
                        };
                }
                else if( this.arrow === undefined &&this.shootDir === dir.SOUTH)
                {
                    arrow =
                        {
                            isTrap: true,
                            x: this.x+13,
                            y: this.y,
                            dir: dir.SOUTH,
                            speed: 3,
                            collidable: false, //If this is true, trap will collide like normal platforms
                            width: 6,
                            height: 16,
                            img: images[24]
                        };
                }
                this.arrows.push(arrow);
                playSound("shoot");
            },
        activate:
            function()
            {
                for(var i = 0; i < this.arrows.length; i++)
                {
                    if(this.arrows[i].dir === dir.WEST)
                        this.arrows[i].x -= this.arrows[i].speed;
                    if(this.arrows[i].dir === dir.NORTH)
                        this.arrows[i].y -= this.arrows[i].speed;
                    if(this.arrows[i].dir === dir.EAST)
                        this.arrows[i].x += this.arrows[i].speed;
                    if(this.arrows[i].dir === dir.SOUTH)
                        this.arrows[i].y += this.arrows[i].speed;

                    if(player.x < this.arrows[i].x+this.arrows[i].width &&
                        player.x+player.width > this.arrows[i].x &&
                        player.y < this.arrows[i].y+this.arrows[i].height &&
                        player.y+player.height > this.arrows[i].y+SIZE-SIZE/4)
                    {
                        die();
                    }
                    if(this.arrows[i] !== "undefined" && this.arrows[i].x < SIZE)
                    {
                        this.hasShot = false;
                        this.arrows.splice(i, 1);
                    }

                    if(this.arrows[i] !== "undefined" && this.arrows[i].y < SIZE)
                    {
                        this.hasShot = false;
                        this.arrows.splice(i, 1);
                    }

                    if(this.arrows[i] !== "undefined" && this.arrows[i].x+this.arrows[i].width > canvas.width-SIZE)
                    {
                        this.hasShot = false;
                        this.arrows.splice(i, 1);
                    }

                    if(this.arrows[i] !== "undefined" && this.arrows[i].y+this.arrows[i].height > canvas.height-SIZE)
                    {
                        this.hasShot = false;
                        this.arrows.splice(i, 1);
                    }

                    for(var j = 0; j < ROWS; j++)
                    {
                        for(var k = 0; k < COLS; k++)
                        {
                            if(this.arrows[i].x < platforms[j][k].x+platforms[j][k].width &&
                                this.arrows[i].x+this.arrows[i].width > platforms[j][k].x &&
                                this.arrows[i].y < platforms[j][k].y+platforms[j][k].height &&
                                this.arrows[i].y+this.arrows[i].height > platforms[j][k].y &&
                                platforms[j][k].isTrap === false &&
                                platforms[j][k].img != "empty")
                            {
                                this.hasShot = false;
                                this.arrows.splice(i, 1);
                            }
                        }
                    }
                }

                // var eyeTop = this.y;
                // var eyeBottom = this.y + this.height;
                // var eyeLeft = this.x;
                // var eyeRight = this.x + this.width;
                //
                // var playerTop = player.y;
                // var playerBottom = player.y + player.height;
                // var playerLeft = player.x;
                // var playerRight = player.x + player.width;
                //
                //
                // if(!(eyeTop > playerBottom)
                //     && !(eyeBottom < playerTop)
                //     && !(eyeLeft > playerRight)
                //     && !(eyeRight < playerLeft))
                // {
                //     die();
                // }
            },
        patrol:
            function ()
            {
                //TODO: Patrolling code here.
                this.checkLineOfSite();
                this.running = true;

                if(this.dir == dir.EAST)
                {
                    //TODO:this.img = "right-image"
                    if(this.velX < this.speed)
                    {
                        this.velX += 0.2;
                    }
                    this.x += this.velX;

                }
                else if(this.dir == dir.WEST)
                {
                    //TODO:this.img = "left-image"
                    if(this.velX > -this.speed)
                    {
                        this.velX -= 0.2;
                    }
                    this.x += this.velX;
                }
                else if(this.dir == dir.NORTH)
                {
                    //TODO:this.img = "left-image"
                    if(this.velY > -this.speed)
                    {
                        this.velY -= 0.2;
                    }
                    this.y += this.velY;
                }
                else if(this.dir == dir.SOUTH)
                {
                    //TODO:this.img = "left-image"
                    if(this.velY < this.speed)
                    {
                        this.velY += 0.2;
                    }
                    this.y += this.velY;
                }

                if(this.x >= canvas.width - SIZE - this.width ) //i.e. eyeTrap cannot go Right
                {
                    this.x = canvas.width - SIZE - this.width - 2;
                    // this.y = canvas.height - SIZE - this.height - 2;
                    this.dir = dir.NORTH;
                }
                else if(this.y <= 32 ) //i.e. eyeTrap cannot go Up!
                {
                    this.y = 34;
                    // this.x = canvas.width - SIZE - this.width - 2;
                    this.dir = dir.WEST;
                }
                else if(this.x <= 32 ) //i.e. eyeTrap cannot go Left!
                {
                    this.x = 34;
                    // this.y = 34;
                    this.dir = dir.SOUTH;
                }
                else if(this.y >= 576 ) //i.e. eyeTrap cannot go Down!
                {
                    this.y = canvas.height - SIZE - this.height - 2;
                    // this.y = canvas.height - SIZE - this.height - 1;
                    this.dir = dir.EAST;
                }
            },
        checkLineOfSite:
            function()
            {
                //TODO: Check if player is in any line of sight.

                // if((this.x >= player.x && this.x <= player.x+player.width)
                //     || (this.y >= player.y && this.y <= player.y+player.height) )
                // {
                //     for(var i = 0 ; i < ROWS; i++)
                //     {
                //         for (var j = 0 ; j < COLS; j++)
                //         {
                //             if (!(this.x >= platforms[i][j].x && this.x <= platforms[i][j].x + platforms[i][j].width)
                //                 || !(this.y >= platforms[i][j].y && this.y <= platforms[i][j].y + platforms[i][j].height))
                //             {
                //                 this.playerInSight = true;
                //                 this.currentState = eyeTrapState.CHASING;
                //                 this.fight();
                //             }
                //             else
                //             {
                //                 this.playerInSight = false;
                //                 this.currentState = eyeTrapState.PATROLLING;
                //                 console.log("I was in else of check line of sight");
                //             }
                //         }
                //     }
                // }

                //vertical line of sight check
                //LOS : LineOfSight

                var playerBottom = player.y + player.height;
                var playerTop = player.y;
                var playerRight = player.x + player.width;
                var playerLeft = player.x;

                var verticalLOSTop = this.y - canvas.height;
                var verticalLOSBottom = this.y + canvas.height;
                var verticalLOSLeft = this.x + this.width/2 - 5;
                var verticalLOSRight = this.x + this.width/2 + 5;

                var horizontalLOSTop = this.y + this.width/2 - 5;
                var horizontalLOSBottom = this.y + this.width/2 + 5;
                var horizontalLOSLeft = this.x - canvas.width;
                var horizontalLOSRight = this.x + canvas.width;

                if( !(verticalLOSTop > playerBottom) &&
                    !(verticalLOSBottom < playerTop) &&
                    !(verticalLOSLeft > playerRight) &&
                    !(verticalLOSRight < playerLeft))
                {
                    var isAnyPlatformBlocking = false;
                    for(var i = 0 ; i < ROWS; i++)
                    {
                        for (var j = 0 ; j < COLS; j++)
                        {
                            var platformBottom = platforms[i][j].y + platforms[i][j].height;
                            var platformTop = platforms[i][j].y;
                            var platformRight = platforms[i][j].x + platforms[i][j].width;
                            var platformLeft = platforms[i][j].x;
                            if( !(verticalLOSTop > platformBottom) &&
                                !(verticalLOSBottom < platformTop) &&
                                !(verticalLOSLeft > platformRight) &&
                                !(verticalLOSRight < platformLeft))
                            {

                                if(player.y > this.y)//i.e. player is below us
                                {
                                    if(player.y > platforms[i][j].y) // true = platform is between player and eyeTrap
                                    {
                                        isAnyPlatformBlocking = true;
                                    }
                                }
                                else if(player.y < this.y)//i.e. player is above us
                                {
                                    if(player.y < platforms[i][j].y) // true = platform is between player and eyeTrap
                                    {
                                        isAnyPlatformBlocking = true;
                                    }
                                }
                            }
                        }
                    }
                    if(!isAnyPlatformBlocking)
                    {
                        console.log("player right above or below me..");
                        this.currentState = eyeTrapState.FIGHTING;
                        this.playerInSight = true;
                        if(player.y > this.y)
                        {
                            this.shootDir = dir.SOUTH;
                        }
                        else
                        {
                            this.shootDir = dir.NORTH;
                        }
                    }
                }
                else if( !(horizontalLOSTop > playerBottom) &&
                    !(horizontalLOSBottom < playerTop) &&
                    !(horizontalLOSLeft > playerRight) &&
                    !(horizontalLOSRight < playerLeft))
                {

                    var isAnyPlatformBlocking = false;
                    for(var i = 0 ; i < ROWS; i++)
                    {
                        for (var j = 0 ; j < COLS; j++)
                        {
                            var platformBottom = platforms[i][j].y + platforms[i][j].height;
                            var platformTop = platforms[i][j].y;
                            var platformRight = platforms[i][j].x + platforms[i][j].width;
                            var platformLeft = platforms[i][j].x;
                            if( !(verticalLOSTop > platformBottom) &&
                                !(verticalLOSBottom < platformTop) &&
                                !(verticalLOSLeft > platformRight) &&
                                !(verticalLOSRight < platformLeft))
                            {

                                if(player.x > this.x)//i.e. player is on eyeTrap's right side
                                {
                                    if(player.x > platforms[i][j].x) // true = platform is between player and eyeTrap
                                    {
                                        isAnyPlatformBlocking = true;
                                    }
                                }
                                else if(player.x < this.x)//i.e. player is on eyeTrap's left side
                                {
                                    if(player.x < platforms[i][j].x) // true = platform is between player and eyeTrap
                                    {
                                        isAnyPlatformBlocking = true;
                                    }
                                }
                            }
                        }
                    }
                    if(!isAnyPlatformBlocking)
                    {
                        console.log("player right in front or behind me..");
                        this.currentState = eyeTrapState.FIGHTING;
                        this.playerInSight = true;
                        if(player.x > this.x)
                        {
                            this.shootDir = dir.EAST;
                        }
                        else
                        {
                            this.shootDir = dir.WEST;
                        }
                    }
                }
                else
                {
                    this.currentState = eyeTrapState.PATROLLING;
                    this.playerInSight = false;
                }

            },
        resetTrap:
            function()
            {
                this.x = 0;
                this.y=576;
                this.arrows = [];
            }

    };

//*****JESTER*****//
var jesterState =
    {
        PATROLLING:0,
        CHASING:1,
        FIGHTING:2
    };
var jester =
    {
        x: 0,
        y: 576,
        width: 34,
        height: 28,
        img:undefined,
        spriteWidth: 32,
        spriteHeight:32,
        velX:0,
        velY:0,
        xdir:dir.EAST,
        ydir:dir.NORTH,
        jumpSpeed:3,
        speed:1.5,
        coll:false,
        jumping: false,
        running: true,
        frameIndex: 0,
        currentFrame: 0,
        framesPerSprite: 6,
        playerInSight: false,
        currentState:jesterState.PATROLLING,
		animate:
        function() //animates the player, gets called from updateAnimation function
        {
            this.currentFrame++;
            if(this.currentFrame === this.framesPerSprite)
            {
                this.frameIndex++;
                this.currentFrame = 0;
                if(this.frameIndex == 4)
                {
                    this.frameIndex = 0;
                }
            }
        },
        chase:
            function ()
            {
                //TODO:Chasing code here.
                if(this.currentState === jesterState.CHASING && this.playerInSight)
                {
                    this.running = true;
                    if(this.x < player.x)
                    {
                        this.xdir = dir.EAST;
                    }
                    if(this.x > player.x)
                    {
                        this.xdir = dir.WEST;
                    }
                    if(this.y < player.y)
                    {
                        this.ydir = dir.NORTH;
                    }
                    if(this.y > player.y)
                    {
                        this.ydir = dir.SOUTH;
                    }
                    if(this.xdir == dir.EAST)
                    {
                        //TODO:this.img = "right-image"
                        if(this.velX < this.speed)
                        {
                            this.velX += 0.01;
                        }

                    }
                    else if(this.xdir == dir.WEST)
                    {
                        //TODO:this.img = "left-image"
                        if(this.velX > -this.speed)
                        {
                            this.velX -= 0.01;
                        }
                    }
                    if(this.ydir == dir.NORTH)
                    {
                        //TODO:this.img = "right-image"
                        if(this.velY < this.speed && this.y <= canvas.height - SIZE)
                        {
                            this.velY += 0.01;
                        }

                    }
                    else if(this.ydir == dir.SOUTH)
                    {
                        //TODO:this.img = "left-image"
                        if(this.velY > -this.speed && this.y >= 0)
                        {
                            this.velY -= 0.01;
                        }
                    }
                    this.x += this.velX;
                    this.y += this.velY;
                }
            },
        fight:
            function ()
            {
                //TODO: Fighting code here.
            },
        patrol:
            function ()
            {
                //TODO: Patrolling code here.
                this.checkLineOfSite();
                if(this.currentState === jesterState.PATROLLING)
                {
                    this.running = true;

                    if(this.x <=32 ) //i.e. jester cannot go left so he has to move right!
                    {
                        this.xdir = dir.EAST;
                    }
                    else if(this.x>=576)//i.e. jester cannot go right so he has to move left!
                    {
                        this.xdir = dir.WEST;
                    }

                    if(this.xdir == dir.EAST)
                    {
                        //TODO:this.img = "right-image"
                        if(this.velX < this.speed)
                        {
                            this.velX += 0.02;
                        }

                    }
                    else if(this.xdir == dir.WEST)
                    {
                        //TODO:this.img = "left-image"
                        if(this.velX > -this.speed)
                        {
                            this.velX -= 0.02;
                        }
                    }
                    this.x += this.velX;

                }

            },
        checkLineOfSite:
            function()
            {
                //TODO: Check if player is in any line of sight.
                if((this.x >= player.x && this.x <= player.x+player.width) || (this.y >= player.y && this.y <= player.y+player.height) )
                {
                    for(var i = 0 ; i < ROWS; i++)
                    {
                        for (var j = 0 ; j < COLS; j++)
                        {
                            if (!(this.x >= platforms[i][j].x && this.x <= platforms[i][j].x + platforms[i][j].width)
                                || !(this.y >= platforms[i][j].y && this.y <= platforms[i][j].y + platforms[i][j].height))
                            {
                                this.playerInSight = true;
                                this.currentState = jesterState.CHASING;
                                this.fight();
                            }
                            else
                            {
                                this.playerInSight = false;
                                this.currentState = jesterState.PATROLLING;
                                console.log("I was in else of check line of sight");
                            }
                        }
                    }
                }
            },
        resetFromTopDoor:
            function()
            {
                this.x = doors[1].x;
                this.y=doors[1].y;
            },
        resetFromLeftDoor:
            function()
            {
                this.x = doors[0].x;
                this.y=doors[0].y;
            },
        resetFromRightDoor:
            function()
            {
                this.x = doors[2].x;
                this.y=doors[2].y;
            },
        resetFromBottomDoor:
            function()
            {
                this.x = doors[3].x;
                this.y=doors[3].y;
            }

    };

//*****PLAYER*****//

var player =
{
    //Size/movement properties
    x: 576,
    y: 576,
    width: 14,
    height: 28,
    spriteWidth: 32,
    spriteHeight: 32,
    velX: 0,
    velY: 0,
    jumpSpeed: 3,
    speed: 1.5,
    coll: false, //if collided

    //Animation methods/properties
    img: undefined,
    dir: dir.EAST,
    idle: true,
    jumping: false,
    running: false,
    crouching: false,
    frameIndex: 0,
    currentFrame: 0,
    framesPerSprite: 6, //the number of frames the individual sprite will be drawn for

    animate:
        function() //animates the player, gets called from updateAnimation function
        {
            this.currentFrame++;
            if(this.currentFrame === this.framesPerSprite)
            {
                this.frameIndex++;
                this.currentFrame = 0;
                if(this.frameIndex == 10)
                {
                    this.frameIndex = 0;
                }
            }
        }
};

function die()
{
	playSound("death");
    traps = [];
    platforms = [];
    background = [];
    arrowSpawn.arrows=[];
    eyeTrap.resetTrap();
    player.x = 576;
    player.y = 576;
    player.velY = 0;
    player.velX = 0;
    changeState(3);
}

//*****PLAYER INPUT*****//

//Event listener holders
var click = -1;
var mouseDown = -1;
var mouseUp = -1;
var mouseMove = -1;
var keyUp = -1;
var keyDown = -1;

//Input variables
var jumpPressed = false;
var rightPressed = false;
var crouchPressed = false;
var leftPressed = false;

var key =
{
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32,
    UP_ARROW: 38,
    LEFT_ARROW: 37,
    DOWN_ARROW: 40,
    RIGHT_ARROW: 39,
    C:67,
    ESC: 27
}

var mouse = { x: 0, y:0 };

function updateMouse(e)
{
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if (mouseDown == true
        && (mouse.x >= minSliderX && mouse.x <= maxSliderX))
    {
        slider[2].x = mouse.x - SIZE/2;
    }
}

function clickHandler()
{
    //Determines whether button is clicked or not
    for(var i = 0; i < activeButtons.length; i++)
    {
        if(activeButtons[i].over === true)
        {
            switch(activeButtons[i])
            {
                case buttons[0]: //Start
                    changeState(1);
                    break;
                case buttons[1]: //Help
                    changeState(2);
                    break;
                case buttons[2]: //Settings
                    changeState(4);
                    break;
                case buttons[3]: //Exit
                    changeState(5);
                    break;
                case buttons[4]: //Main Menu
                    changeState(0);
                    break;
                case buttons[5]: //New
                    changeState(1);
                    break;
                case buttons[6]: //Return
                    changeState(lastState);
                    break;
            }
        }
    }
}

function keyDownHandler(e)
{
    e.preventDefault();
    switch(e.keyCode)
    {
        case key.W:
        case key.UP_ARROW:
        case key.SPACE:
            jumpPressed = true;
            break;
        case key.D:
        case key.RIGHT_ARROW:
            if(rightPressed === false)
                rightPressed = true;
            break;
        case key.S:
        case key.DOWN_ARROW:
            if(crouchPressed === false)
                crouchPressed = true;
            break;
        case key.A:
        case key.LEFT_ARROW:
            if(leftPressed === false)
                leftPressed = true;
            break;
        case key.ESC:
            paused = !paused;
            break;
        case 72:
            headsOwned = 8;
            break;
    }
}

function changeTheme(l)
{
    currentLevelTheme = l;
    traps = [];
    platforms = [];
    background = [];
    arrowSpawn.arrows=[];
    eyeTrap.resetTrap();
    generateRoom();
    generateBackground();
    player.velY = 0;
}

function keyUpHandler(e)
{
    e.preventDefault();
    switch(e.keyCode)
    {
        case key.W:
        case key.UP_ARROW:
        case key.SPACE:
            jumpPressed = false;
            break;
        case key.D:
        case key.RIGHT_ARROW:
            rightPressed = false;
            break;
        case key.S:
        case key.DOWN_ARROW:
            crouchPressed = false;
            break;
        case key.A:
        case key.LEFT_ARROW:
            leftPressed = false;
            break;
    }
}

function movePlayer()
{
    if(crouchPressed == false)
    {
        player.crouching = false;
        player.height = 60;
    }
    if (crouchPressed == true)
    {
        player.crouching = true;
        player.idle = false;
        player.running = false;
    }
    else if (leftPressed == true) // left
    {
        player.dir = dir.WEST;
        player.idle = false;
        player.running = true;
        player.img = images[11];
        if (player.velX > -player.speed)
        {
            player.velX--;
        }
    }
    else if (rightPressed == true) // Right
    {
        player.dir = dir.EAST;
        player.idle = false;
        player.running = true;
        player.img = images[10];
        if (player.velX < player.speed)
        {
            player.velX++;
        }
    }
    else if(player.jumping == false)
    {
        player.idle = true;
        player.running = false;
        if (player.dir == dir.EAST)
            player.img = images[10];
        else
            player.img = images[11];
    }
    if (jumpPressed == true) // Jump
    {
        player.idle = false;
        if(!player.jumping)
        {
            player.jumping = true;
            player.velY = -player.jumpSpeed*2;
        }
    }

    player.x += player.velX;
    player.y += player.velY;
    player.velX *= friction;
    player.velY += gravity;
}

//****COLLISION*****//

function eyeTrapCollision()
{
    //Walls, floor, and roof collision
    if(eyeTrap.y > canvas.height-SIZE*2)//Floor
    {
        eyeTrap.jumping = false;
        eyeTrap.y = canvas.height-SIZE*2;
    }
    if(eyeTrap.y < SIZE && eyeTrap.x+eyeTrap.width > 352)//Roof right side
    {
        eyeTrap.velY = 0;
        eyeTrap.y = SIZE;
    }
    if(eyeTrap.y < SIZE && eyeTrap.x < 288)//Roof right side
    {
        eyeTrap.velY = 0;
        eyeTrap.y = SIZE;
    }
    if(eyeTrap.x < SIZE)//Left wall top
    {
        eyeTrap.x = SIZE;
    }
    if(eyeTrap.x+eyeTrap.width > canvas.width-SIZE)//Right wall
    {
        eyeTrap.x = canvas.width - SIZE - eyeTrap.width;
    }

    for(var i = 0; i < ROWS; i++)
    {
        for(var j = 0; j < COLS; j++)
        {
            //Top
            if(platforms[i][j].collidable === true &&
                eyeTrap.x < platforms[i][j].x+SIZE &&
                eyeTrap.x+eyeTrap.width > platforms[i][j].x &&
                eyeTrap.y+eyeTrap.height > platforms[i][j].y+SIZE-4 &&
                eyeTrap.y+eyeTrap.height < platforms[i][j].y+SIZE/4+SIZE)
            {
                eyeTrap.y = platforms[i][j].y-eyeTrap.height+SIZE-4;
                eyeTrap.jumping = false;
                eyeTrap.velY = 0;
            }
            //Bottom
            else if(platforms[i][j].collidable === true &&
                eyeTrap.x < platforms[i][j].x+SIZE-4 &&
                eyeTrap.x+eyeTrap.width > platforms[i][j].x+4 &&
                eyeTrap.y < platforms[i][j].y+SIZE &&
                eyeTrap.y > platforms[i][j].y+SIZE-SIZE/4)
            {
                eyeTrap.y = platforms[i][j].y+SIZE;
                eyeTrap.velY = 0;
            }
            //Right
            else if(platforms[i][j].collidable === true &&
                eyeTrap.x < platforms[i][j].x+SIZE &&
                eyeTrap.x > platforms[i][j].x+SIZE-SIZE/4 &&
                eyeTrap.y < platforms[i][j].y+SIZE-SIZE/4 &&
                eyeTrap.y+eyeTrap.height > platforms[i][j].y+SIZE/4+SIZE)
            {
                eyeTrap.x = platforms[i][j].x+SIZE;
            }
            //Left
            else if(platforms[i][j].collidable === true &&
                eyeTrap.x+eyeTrap.width > platforms[i][j].x &&
                eyeTrap.x+eyeTrap.width < platforms[i][j].x+SIZE/4 &&
                eyeTrap.y < platforms[i][j].y+SIZE-SIZE/4 &&
                eyeTrap.y+eyeTrap.height > platforms[i][j].y+SIZE/4+SIZE)
            {
                eyeTrap.x = platforms[i][j].x-eyeTrap.width;
            }
        }
    }
}

function jesterCollision()
{
    if(jester.x !== -1000 && jester.y !== -1000)
    {
        var jesterTop = jester.y;
        var jesterBottom = jester.y + jester.height;
        var jesterLeft = jester.x;
        var jesterRight = jester.x + jester.width;

        var playerTop = player.y;
        var playerBottom = player.y + player.height;
        var playerLeft = player.x;
        var playerRight = player.x + player.width;


        if(!(jesterTop > playerBottom)
            && !(jesterBottom < playerTop)
            && !(jesterLeft > playerRight)
            && !(jesterRight < playerLeft))
        {
            die();
        }

        //Walls, floor, and roof collision
        if(jester.y > canvas.height-SIZE*2)//Floor
        {
            jester.jumping = false;
            jester.y = canvas.height-SIZE*2;
        }
        if(jester.y < SIZE && jester.x+jester.width > 352)//Roof right side
        {
            jester.velY = 0;
            jester.y = SIZE;
        }
        if(jester.y < SIZE && jester.x < 288)//Roof right side
        {
            jester.velY = 0;
            jester.y = SIZE;
        }
        if(jester.x < SIZE)//Left wall top
        {
            jester.x = SIZE;
        }
        if(jester.x+jester.width > canvas.width-SIZE)//Right wall
        {
            jester.x = canvas.width - SIZE - jester.width;
        }

        for(var i = 0; i < ROWS; i++)
        {
            for(var j = 0; j < COLS; j++)
            {
                //Top
                if(platforms[i][j].collidable === true &&
                    jester.x < platforms[i][j].x+SIZE &&
                    jester.x+jester.width > platforms[i][j].x &&
                    jester.y+jester.height > platforms[i][j].y+SIZE-4 &&
                    jester.y+jester.height < platforms[i][j].y+SIZE/4+SIZE)
                {
                    jester.y = platforms[i][j].y-jester.height+SIZE-4;
                    jester.jumping = false;
                    jester.velY = 0;
                }
                //Bottom
                else if(platforms[i][j].collidable === true &&
                    jester.x < platforms[i][j].x+SIZE-4 &&
                    jester.x+jester.width > platforms[i][j].x+4 &&
                    jester.y < platforms[i][j].y+SIZE &&
                    jester.y > platforms[i][j].y+SIZE-SIZE/4)
                {
                    jester.y = platforms[i][j].y+SIZE;
                    jester.velY = 0;
                }
                //Right
                else if(platforms[i][j].collidable === true &&
                    jester.x < platforms[i][j].x+SIZE &&
                    jester.x > platforms[i][j].x+SIZE-SIZE/4 &&
                    jester.y < platforms[i][j].y+SIZE-SIZE/4 &&
                    jester.y+jester.height > platforms[i][j].y+SIZE/4+SIZE)
                {
                    jester.x = platforms[i][j].x+SIZE;
                }
                //Left
                else if(platforms[i][j].collidable === true &&
                    jester.x+jester.width > platforms[i][j].x &&
                    jester.x+jester.width < platforms[i][j].x+SIZE/4 &&
                    jester.y < platforms[i][j].y+SIZE-SIZE/4 &&
                    jester.y+jester.height > platforms[i][j].y+SIZE/4+SIZE)
                {
                    jester.x = platforms[i][j].x-jester.width;
                }
            }
        }
    }
}

function playerCollision()
{
    //Walls, floor, and roof collision
    if(player.y > canvas.height-SIZE*2 && player.x+player.width > 352)//Floor right side
    {
        player.jumping = false;
        player.y = canvas.height-SIZE*2;
    }
    if(player.y > canvas.height-SIZE*2 && player.x < 288)//Floor left side
    {
        player.jumping = false;
        player.y = canvas.height-SIZE*2;
    }
    if(player.y < SIZE && player.x+player.width > 352)//Roof right side
    {
        player.velY = 0;
        player.y = SIZE;
    }
    if(player.y < SIZE && player.x < 288)//Roof right side
    {
        player.velY = 0;
        player.y = SIZE;
    }
    if(player.x < SIZE)//Left wall top
    {
        if (player.jumping == true && jumpPressed == false)
        {
            jumpFromLeftWall();

        }
        else
            player.x = SIZE;
    }
    if(player.x+player.width > canvas.width-SIZE)//Right wall
    {
        if (player.jumping == true && jumpPressed == false)
        {
            jumpFromRightWall();

        }
        else
            player.x = canvas.width - SIZE - player.width;
    }

    for(var i = 0; i < ROWS; i++)
    {
        for(var j = 0; j < COLS; j++)
        {
            //Top
            if(platforms[i][j].collidable === true &&
                player.x < platforms[i][j].x+SIZE &&
                player.x+player.width > platforms[i][j].x &&
                player.y+player.height > platforms[i][j].y+SIZE-4 &&
                player.y+player.height < platforms[i][j].y+SIZE/4+SIZE)
            {
                player.y = platforms[i][j].y-player.height+SIZE-4;
                player.jumping = false;
                player.velY = 0;
            }
            //Bottom
            else if(platforms[i][j].collidable === true &&
                player.x < platforms[i][j].x+SIZE-4 &&
                player.x+player.width > platforms[i][j].x+4 &&
                player.y < platforms[i][j].y+SIZE &&
                player.y > platforms[i][j].y+SIZE-SIZE/4)
            {
                player.y = platforms[i][j].y+SIZE;
                player.velY = 0;
            }
            //Right
            else if(platforms[i][j].collidable === true &&
                player.x < platforms[i][j].x+SIZE &&
                player.x > platforms[i][j].x+SIZE-SIZE/4 &&
                player.y < platforms[i][j].y+SIZE-SIZE/4 &&
                player.y+player.height > platforms[i][j].y+SIZE/4+SIZE)
            {
                if (player.jumping == true && jumpPressed == false)
                {
                    jumpFromLeftWall();

                }
                else
                    player.x = platforms[i][j].x+SIZE;
            }
            //Left
            else if(platforms[i][j].collidable === true &&
                player.x+player.width > platforms[i][j].x &&
                player.x+player.width < platforms[i][j].x+SIZE/4 &&
                player.y < platforms[i][j].y+SIZE-SIZE/4 &&
                player.y+player.height > platforms[i][j].y+SIZE/4+SIZE)
            {
                if (player.jumping == true && jumpPressed == false)
                {
                    jumpFromRightWall();
                }
                else
                    player.x = platforms[i][j].x-player.width;
            }
        }
    }
}

function jumpFromRightWall()
{
    player.dir = dir.WEST;
    player.idle = false;
    player.running = true;
    player.img = images[11];
    if (player.velX > -player.speed)
    {
        player.velX = -5;
    }
    player.velY = -player.jumpSpeed * 2;
    rightPressed = false;
    playSound("jump");
}

function jumpFromLeftWall()
{
    player.dir = dir.EAST;
    player.idle = false;
    player.running = true;
    player.img = images[11];
    if (player.velX > -player.speed)
    {
        player.velX = 5;
    }
    player.velY = -player.jumpSpeed * 2;
    rightPressed = false;
    playSound("jump");
}

//*****ROOM SWITCHING*****//

var doors =
    [
        { x: 0, y: 288, width: 32, height: 64, img: undefined },//Left
        { x: 288, y: 0, width: 64, height: 32, img: undefined },//Top
        { x: 608, y: 288, width: 32, height: 64, img: undefined },//Right
        { x: 288, y: 608, width: 64, height: 32, img: undefined }//Bottom
    ];

var door1O = true;
var door2O = true;
var door3O = true;
var door4O = true;
	
function switchRoom()
{
    if(player.x+player.width < doors[3].x+doors[3].width && player.x > doors[3].x && player.y+player.height > canvas.height-SIZE/2 && door3O === true)//Bottom door
    {
		door1O = false;
		door2O = true;
		door4O = true;
		door3O = true;
		playSound("teleport");
		changeTheme(headsOwned+1);
        jester.x = -1000;
        jester.y = -1000;
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows = [];
        eyeTrap.resetTrap();
        generateRoom();
        generateBackground();
        player.velY = 0;
        player.y = SIZE+1;
        setTimeout(jester.resetFromBottomDoor(),15000);
        if(numOfLevelsPassed >= 3){
            setTimeout(
                function(){
                    eyeTrap.isActivated = true;
                },3000);
        }
        maxNumOfTraps += 2;
    }
    if(player.x+player.width < doors[1].x+doors[1].width && player.x > doors[1].x && player.y < SIZE/2 && door1O === true)//Top door
    {
		door1O = true;
		door2O = true;
		door3O = false;
		door4O = true;
		playSound("teleport");
		changeTheme(headsOwned+1);
        jester.x = -1000;
        jester.y = -1000;
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
        eyeTrap.resetTrap();
        generateRoom();
        generateBackground();
        player.velY = 0;
        player.y = canvas.height-SIZE-player.height;
        player.x = doors[3].x-player.width;
        setTimeout(jester.resetFromTopDoor(),15000);
        if(numOfLevelsPassed >= 3){
            setTimeout(
                function(){
                    eyeTrap.isActivated = true;
                },3000);
        }
        maxNumOfTraps += 2;
    }
    if(player.x < SIZE && player.y+player.height > doors[2].y+SIZE && player.y < doors[2].y+doors[2].height && door4O === true)//Left door
    {
		door1O = true;
		door2O = false;
		door3O = true;
		door4O = true;
		playSound("teleport");
		changeTheme(headsOwned+1);
        jester.x = -1000;
        jester.y = -1000;
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
        eyeTrap.resetTrap();
        generateRoom();
        generateBackground();
        player.x = canvas.width-SIZE-player.width-1;
        player.velX = 0;
        setTimeout(jester.resetFromLeftDoor(),15000);
        if(numOfLevelsPassed >= 3){
            setTimeout(
                function(){
                    eyeTrap.isActivated = true;
                },3000);
        }
        maxNumOfTraps += 2;
    }
    if(player.x+player.width > doors[2].x && player.y+player.height > doors[2].y+SIZE && player.y < doors[2].y+doors[2].height && door2O === true)//Right door
    {
		door1O = true;
		door3O = true;
		door4O = false;
		door2O = true;
		playSound("teleport");
		changeTheme(headsOwned+1);
        jester.x = -1000;
        jester.y = -1000;
        traps = [];
        platforms = [];
        background = [];
        arrowSpawn.arrows=[];
        eyeTrap.resetTrap();
        generateRoom();
        generateBackground();
        setTimeout(jester.resetFromRightDoor(),15000);
        player.x = 0+SIZE+1;
        if(numOfLevelsPassed >= 3){
            setTimeout(
                function(){
                    eyeTrap.isActivated = true;
                },3000);
        }
        maxNumOfTraps += 2;
    }
}

//*****USER INTERFACE*****//

var activeButtons = -1;

var buttons =
[
    /*0*/{ x:230, y:220, width:180, height:53, over:false, img:"images/ui/startButton.png", imgO: "images/ui/startButtonO.png" },//Start
    /*1*/{ x:230, y:500,  width:180, height:53, over:false, img:"images/ui/helpButton.png", imgO: "images/ui/helpButtonO.png"},//Sample Help, 2
    /*2*/{ x:230, y:400,  width:180, height:53, over:false, img:"images/ui/settingsButton.png", imgO: "images/ui/settingsButtonO.png"},//Sample Settings, 3
    /*3*/{ x:230, y:200,  width:180, height:53, over:false, img:"images/ui/exitButton.png", imgO: "images/ui/exitButtonO.png"}, //Sample Exit, 4
    /*4*/{ x:230, y:100,  width:180, height:53, over:false, img:"images/ui/mainmenuButton.png", imgO: "images/ui/mainmenuButtonO.png"}, //Main Menu Button, 5
    /*5*/{ x:230, y:200,  width:180, height:53, over:false, img:"images/ui/newButton.png", imgO: "images/ui/newButtonO.png"},// New Game button, 6
    /*6*/{ x:230, y:200, width:180, height:53, over:false, img:"images/ui/returnButton.png", imgO: "images/ui/returnButtonO.png"}//Return, 7
]

function checkButtonOverlap()
{
    for(var i = 0; i < activeButtons.length; i++)
    {
        if(mouse.x < activeButtons[i].x+activeButtons[i].width && mouse.x > activeButtons[i].x && mouse.y < activeButtons[i].y+activeButtons[i].height && mouse.y > activeButtons[i].y )
        {
            activeButtons[i].over = true;
        }
        if(!(mouse.x < activeButtons[i].x+activeButtons[i].width && mouse.x > activeButtons[i].x && mouse.y < activeButtons[i].y+activeButtons[i].height && mouse.y > activeButtons[i].y ))
        {
            activeButtons[i].over = false;
        }
    }
}

 //*****VOLUME SLIDER*****//

var slider = -1;
var mouseDown = false;

var volumeslider =
    [
        { x:230, y:400, width:180, height:53, img:"images/ui/sliderPlaceholder.png"}, // Placeholder
        { x:270, y:425, width:100, height:3, img:"images/ui/slider.png"}, // Slider
        { x:305, y:408,  width:32, height:32, img:"images/ui/jSlider.png"} // Slidable
    ]

var minSliderX = volumeslider[1].x;
var maxSliderX = volumeslider[1].x + 100;

var volume = 0.5;

function calculateVol()
{
    //RANGES 270 - 370
    if (slider[2].x < 280)
        volume = 0.1;
    else if (slider[2].x <= 290 && slider[2].x > 280)
        volume = 0.2;
    else if (slider[2].x <= 300 && slider[2].x > 290)
        volume = 0.3;
    else if (slider[2].x <= 310 && slider[2].x > 300)
        volume = 0.4;
    else if (slider[2].x <= 320 && slider[2].x > 310)
        volume = 0.5;
    else if (slider[2].x <= 330 && slider[2].x > 320)
        volume = 0.6;
    else if (slider[2].x <= 340 && slider[2].x > 330)
        volume = 0.7;
    else if (slider[2].x <= 350 && slider[2].x > 340)
        volume = 0.8;
    else if (slider[2].x <= 360 && slider[2].x > 350)
        volume = 0.9;
    else if (slider[2].x <= 370)
        volume = 1.0;
}

function onMouseDown()
{
    if (mouseDown == false
        && (mouse.x >= minSliderX && mouse.x <= maxSliderX))
    {
        mouseDown = true;
        slider[2].x = mouse.x - SIZE/2;
    }
}

function onMouseUp()
{
    mouseDown = false;
}

//*****UTILITIES*****//


var bgAudio;
function playBackgroundSound(nameOfSound,shouldLoop)
{
    bgAudio = new Audio("sounds/"+nameOfSound+".mp3");

    if(shouldLoop)
    {
        bgAudio.loop = true;
    }

    bgAudio.play();
}


function toggleBackgroundMusic()
{
    if(bgAudio.paused)
    {
        bgAudio.play();
    }
    else
    {
        bgAudio.pause();
    }
}

function resetBackgroundMusicTo(time)
{
    bgAudio.currentTime = time;
}

function playSound(nameOfSound)
{
    var audio = new Audio("sounds/"+nameOfSound+".mp3");
    audio.play();
}

//Finds the tile that the x and y overlap
function findTile(x, y)
{
    if(x > SIZE*2 && x < canvas.width-SIZE*2 && y > SIZE*2 && y < canvas.height-SIZE*2)
    {
        for(var i = 0; i < ROWS; i++)
        {
            for(var j = 0; j < COLS; j++)
            {
                if(platforms.length !== 0 && x < platforms[i][j].x+SIZE && x > platforms[i][j].x && y < platforms[i][j].y+SIZE && y > platforms[i][j].y)
                {
                    var temp = platforms[i][j];
                    return temp;
                }
            }
        }
    }
    else
    {
        return "Invalid tile to find";
    }
}

//*****MENU GENERATION*****//
var menuBackground = [];

function generateBackgroundMenu()
{
    for(var i = 0; i < 22; i++)
    {
        menuBackground[i] = [];
        for(var j = 0; j < 22; j++)
        {
            var mRandNum = Math.floor(Math.random()*4+36);
            var menuTemp =
                {
                    x: j*SIZE,
                    y: i*SIZE,
                    img: images[mRandNum]
                }
            menuBackground[i][j] = menuTemp;
        }
    }
}



//*****PAUSE BOOL*****//

var paused = false;


//*****STATE MACHINE*****//

var gameLoop = -1; //Variable to hold the update interval
var currState = -1;
var lastState = -1;

var states =
    [
        { enter: enterMenu, update: updateMenu },//Main menu state, 0
        { enter: enterGame, update: updateGame },//Game state, 1
        { enter: enterHelp, update: updateHelp },//Help state, 2
        { enter: enterGameOver, update: updateGameOver},//Game over state, 3
        { enter: enterSettings, update: updateSettings}, //Settings State, 4
        { enter: enterExitMenu, update: updateExitMenu },//Exit, 5
        { enter: enterWin, update: updateWin} //Win State, 6
    ];

function changeState(newState)
{
    console.log("Game state changed");
    if(newState >= 0 && newState <= states.length)
    {
		midHead.reset();
		headsOwned = 0;
		changeTheme(1);
		for(var i = 0; i <  heads.length; i++)
		{
			heads[i].own = false;
		}
		jester.y = 576;
		jester.x = 0;
		traps = [];
		
        activeButtons = -1;
        activeHeads = -1;
        window.clearInterval(gameLoop);
        lastState = currState;
        currState = newState;
        window.setTimeout(function(){states[currState].enter();}, 10);
    }
    else
        console.log("Invalid state");
}

function enterMenu() //0
{
    generateBackgroundMenu();
    gameLoop = window.setInterval(updateMenu, FPS);
    canvas.style.backgroundColor = "#000000";
    activeButtons = [ buttons[0], buttons [1], buttons[2] ];//New Game, Continue/Start Game, Help, Settings, Exit

    buttons[2].y = 280;
    buttons[1].y = 340;
    //////////////////////////////////////
}

function updateMenu() //0
{
    console.log("In Main Menu");
    checkButtonOverlap();
    render();
}

function enterGame() //1
{
	bgAudio.src = "sounds/mainMusic.mp3";
	bgAudio.play();
    canvas.style.backgroundColor = "#36454f";
    gameLoop = window.setInterval(updateGame, FPS);
    activeButtons = [];
    activeHeads = [];
    generateBackground();
    generateRoom();
}


function updateGame() //1
{
    if(paused)
    {
        console.log("in IGM");
        checkButtonOverlap();
        menuBackground = [];
        activeButtons = [buttons[4], buttons[1], buttons[2], buttons[3] ]; // Main Menu, Help, Settings, Exit

        buttons[4].x = 230;
        buttons[4].y = 185;
        buttons[1].y = 250;
        buttons[2].y = 315;
        buttons[3].y = 380;
        render();
    }
    else
    {
        activeButtons = [];
        activeHeads = [heads[0], heads[1], heads[2], heads[3], heads[4], heads[5], heads[6],heads[7]];
        animate();
        render();
		checkHeads();
        movePlayer();
        switchRoom();
        activateTraps();
        playerCollision();
        jesterCollision();
        if(jester.currentState === jesterState.PATROLLING)
        {
            jester.patrol();
        }
        else if (jester.currentState === jesterState.CHASING)
        {
            jester.chase();
        }
        if(eyeTrap.isActivated)
        {
            eyeTrapCollision();
            eyeTrap.patrol();
            if (eyeTrap.currentState === eyeTrapState.FIGHTING)
            {
                if(!eyeTrap.hasShot)
                {
                    eyeTrap.shoot();
                    eyeTrap.hasShot = true;
                }
            }
        }
    }
}



function enterHelp() //2
{
    activeButtons = [buttons [6], buttons[4]]; // Main Menu, Return
    gameLoop = window.setInterval(updateHelp, FPS);

    generateBackgroundMenu();

    surface.drawImage(images[40], 200, 300);

    buttons[4].y = 100;
    buttons[4].x = 80;
    buttons[6].y = 160;
    buttons[6].x = 80;
}

function updateHelp() //2
{

    console.log("in help");
    checkButtonOverlap();
    render();

}

function enterGameOver() //3
{
    generateBackgroundMenu();

    activeButtons = [ buttons[4]];
    gameLoop = window.setInterval(updateGameOver, FPS);


    ////////////////////////////////////////////////////
    //make a logo
    buttons[4].x = 230;
    buttons[4].y = 300;
}

function updateGameOver() //3
{
    render();
    checkButtonOverlap();
    console.log("game over");
}

function enterSettings() // State 4
{


    gameLoop = window.setInterval(updateSettings, FPS);
    activeButtons = [buttons [6], buttons[4]]; // Main Menu, Return

   slider = [volumeslider[0], volumeslider[1], volumeslider[2]];
    generateBackgroundMenu();


    generateBackgroundMenu();

    buttons[4].y = 100;
    buttons[4].x = 80;
    buttons[6].y = 160;
    buttons[6].x = 80;
}

function updateSettings() // 4
{
    console.log("in settings");
    checkButtonOverlap();
    render();
}

function enterExitMenu() // 5
{
    gameLoop = window.setInterval(updateExitMenu, FPS);
    generateBackgroundMenu();
    activeButtons = [ buttons[4], buttons[6]];

    buttons[4].x = 130;
    buttons[4].y = 300;
    buttons[6].x = 330;
    buttons[6].y = 300;
}

function updateExitMenu()// 5
{
    console.log("in Exit");
    checkButtonOverlap();

    render();
}

function enterWin() // State 6
{
	bgAudio.src = "sounds/menuMusic.mp3";
	bgAudio.play();
    //activeButtons = [ buttons[5], buttons[4] ]; //to go back to main menu
    gameLoop = window.setInterval(updateWin, FPS);
	vid2.play();
	vid2.playing = true;
    //buttons[5].x = 230;
    //buttons[5].y = 240;
    //buttons[4].x = 230;
    //buttons[4].y = 300;
}

function updateWin() // 6
{
    checkButtonOverlap();
	surface.drawImage(vid2, 0, 0, canvas.width, canvas.height);
	if(vid2.ended === true)
	{
		changeState(0);
	}
    console.log("victory!");
}

//*****RENDERING*****//

function animate()
{
	jester.animate();
    player.animate();
    for(var i = 0; i < traps.length; i++)
    {
        traps[i].animate();
    }
}


function render()
{
    surface.clearRect(0, 0, canvas.width, canvas.height);




    // MENU BACKGROUND //
    if(currState !== 1)
    {
        for(var m = 0; m < 22; m++)
        {
            for(var b = 0; b < 22; b++)
            {
                if(menuBackground.length !== 0)
                    surface.drawImage(menuBackground[m][b].img, menuBackground[m][b].x, menuBackground[m][b].y);
            }
        }

        surface.drawImage(images[43], 570, 570);
    }



    //~~~MENU STATE~~~//
    if(currState === 0)
    {
        surface.drawImage(images[13], 140, 0);

    }





    //~~~GAME STATE~~~//
    else if(currState === 1)
    {
        //DRAW BACKGROUND//
        for(var i = 0; i < BROWS; i++)
        {
            for(var j = 0; j < BCOLS; j++)
            {
                if(background.length !== 0)
                    surface.drawImage(background[i][j].img, background[i][j].x, background[i][j].y);
            }
        }


        //DRAW PLATFORMS//
        for(var i = 0; i < ROWS; i++)
        {
            for(var j = 0; j < COLS; j++)
            {
                if(platforms.length !== 0 && platforms[i][j].img != "empty" && platforms[i][j].isTrap === false)
                    surface.drawImage(platforms[i][j].img, platforms[i][j].x, platforms[i][j].y);
            }
        }


        //DRAW BORDER//
        surface.drawImage(images[5], 0, 0);

        //DRAW DOORS//
        
		if(door1O === true)
			surface.drawImage(doors[1].img, doors[1].x, doors[1].y);
		if(door2O === true)
			surface.drawImage(doors[2].img, doors[2].x, doors[2].y);
		if(door3O === true)
			surface.drawImage(doors[3].img, doors[3].x, doors[3].y);
		if(door4O === true)
			surface.drawImage(doors[0].img, doors[0].x, doors[0].y);
		
		//DRAW MIDDLE HEAD
		if(midHead.active === true)
		{
			surface.drawImage(midHead.img, midHead.sprtX, midHead.sprtY, midHead.width, midHead.height, midHead.x, midHead.y, midHead.width, midHead.height);
		}

        //DRAW HEAD HOLDER//
        surface.drawImage(images[42], 15, 605);

        for(var i = 0; i < heads.length; i++)
        {
            // still need an owned function. if not yet owned, draw dark, if, highlight with original
            if(heads[i].own === true)
            {
                //surface.drawImage(activeHeads[i].imgO, activeHeads[i].x, activeHeads[i].y);
                surface.drawImage(heads[i].img, heads[i].x, heads[i].y);
            }
            else if(heads[i].own === false)
            {
                // surface.drawImage(activeHeads[i].img, activeHeads[i].x, activeHeads[i].y);
                surface.drawImage(heads[i].imgO, heads[i].x, heads[i].y);
            }
        }


        //DRAW TRAPS

        for(var i = 0; i < traps.length; i++)
        {
            surface.drawImage(traps[i].img,
                traps[i].frameIndex*traps[i].spriteWidth, 0, traps[i].spriteWidth, traps[i].spriteHeight,
                traps[i].x, traps[i].y, traps[i].spriteWidth, traps[i].spriteHeight);
            if(traps[i].isArrowTrap === true)
            {
                for(var j = 0; j <  traps[i].arrows.length; j++)
                {
                    surface.drawImage(traps[i].arrows[j].img, traps[i].arrows[j].x, traps[i].arrows[j].y);
                }
            }
        }

        //DRAW PLAYER//
        if (player.idle == true)
        {
            surface.drawImage(player.img,
                0, 0, player.spriteWidth, player.spriteHeight,
                player.x-9, player.y, player.spriteWidth, player.spriteHeight);
        }
        else if(player.crouching == true)
            surface.drawImage(player.img,
                player.dir===dir.EAST ? player.spriteWidth*7 : player.spriteWidth*2, 128, player.spriteWidth, player.spriteHeight,
                player.x-9,player.y, player.spriteWidth, player.spriteHeight);
        else if(player.jumping == true)
            surface.drawImage(player.img,
                player.dir===dir.EAST ? player.spriteWidth*2 : player.spriteWidth*7 , 128, player.spriteWidth, player.spriteHeight,
                player.x-9, player.y, player.spriteWidth, player.spriteHeight);
        else if(player.running == true)
            surface.drawImage(player.img,
                player.frameIndex*player.spriteWidth, 64, player.spriteWidth, player.spriteHeight,
                player.x-9, player.y, player.spriteWidth, player.spriteHeight);

        //DRAW JESTER//
        if (jester.running)
        {
            surface.drawImage(jester.img, jester.frameIndex*jester.spriteWidth, 0, jester.spriteWidth, jester.spriteHeight, jester.x, jester.y, jester.width, jester.height);
        }

        if(eyeTrap.isActivated)
        {
            //DRAW EYE TRAP//
            surface.drawImage(eyeTrap.img, eyeTrap.x, eyeTrap.y);

            //DRAW EYE TRAP ARROW//
            if (eyeTrap.arrows.length !== 0) {
                for (var j = 0; j < eyeTrap.arrows.length; j++) {
                    surface.drawImage(eyeTrap.arrows[j].img, eyeTrap.arrows[j].x, eyeTrap.arrows[j].y);
                }
            }
        }


    }


    if (currState === 2)
    {
        surface.drawImage(images[40], 200, 300); // help
    }

    if (currState === 4) // Slider!
    {
        surface.drawImage(images[47], 220, 350); // sound logo

        for (var i = 0; i < slider.length; i++)
        {
        surface.drawImage(slider[i].img, slider[i].x, slider[i].y); // slider
        }

    }

    if (currState === 5)
    {
        surface.drawImage(images[48], 100, 310);
        surface.drawImage(images[49], 510, 310);
        surface.drawImage(images[50], 108, 145);
        //surface.drawImage(images[51], 400, 270, 60, 60);
    }


     if (currState === 6)
     {
     surface.drawImage(images[44], 213, 100); // win logo
     }

     if (currState === 3)
     {
     surface.drawImage(images[45], 170, 120); // gameover
     }




    //~~~ALL STATES~~~//
    if(paused && currState === 1) //Dimmer
    {
        surface.drawImage(images[41],0 ,0);
    }

    //DRAW BUTTONS//
    for(var i = 0; i < activeButtons.length; i++)
    {
        if(activeButtons[i].over === true)
        {
            surface.drawImage(activeButtons[i].imgO, activeButtons[i].x, activeButtons[i].y);
        }
        else if(activeButtons[i].over === false)
        {
            surface.drawImage(activeButtons[i].img, activeButtons[i].x, activeButtons[i].y);
        }
    }

}

//*****GAME INTIALIZATION*****//

function eListeners()
{
    mouseMove = window.addEventListener("mousemove", updateMouse, false);
    mouseDown = window.addEventListener("mousedown", onMouseDown, false);
    mouseUp = window.addEventListener("mouseup", onMouseUp, false);
    click = window.addEventListener("click", clickHandler, false);
    keyDown = window.addEventListener("keydown", keyDownHandler, false);
    keyUp = window.addEventListener("keyup", keyUpHandler, false);
}

function drawVid()
{
	if(vid1Playing === true)
		surface.drawImage(vid1, 0, 0, canvas.width, canvas.height);
	if(vid2Playing === true)
		surface.drawImage(vid2, 0, 0, canvas.width, canvas.height);
}

function initSplash()//Draws the splash screen and clears it, then changes to the menu state
{
    surface.drawImage(images[0], 0, 0);
	playBackgroundSound("menuMusic", true);
	bgAudio.volume = 0.3;
    window.setTimeout(
	function()
	{
		surface.clearRect(0,0,canvas.width, canvas.height);
		vid1Playing = true;
		vid1.play();
		gameLoop = window.setInterval(drawVid, false);
		vid1.addEventListener('ended', function(){window.clearInterval(gameLoop); changeState(0);}, false);
	}, 1500);
}

function initGame()
{
    window.setTimeout(initSplash, 25);
    console.log("Initializing game...");
    eListeners();
}

//*****LEVEL PROGRESSION*****//

var activeHeads = -1;

var heads =
[
    /*0*/ { x:30, y:610, width:34, height:30,  own:false, img:"images/heads/one.png", imgO: "images/heads/oneD.png"},
    /*1*/ { x:60, y:610, width:34, height:30,  own:false, img:"images/heads/two.png", imgO: "images/heads/twoD.png"},
    /*2*/ { x:90, y:610, width:34, height:30, own:false, img:"images/heads/three.png", imgO: "images/heads/threeD.png"},
    /*3*/ { x:120, y:610, width:34, height:30, own:false, img:"images/heads/four.png", imgO: "images/heads/fourD.png"},
    /*4*/ { x:150, y:610, width:34, height:30, own:false, img:"images/heads/five.png", imgO: "images/heads/fiveD.png"},
    /*5*/ { x:180, y:610, width:34, height:30, own:false, img:"images/heads/six.png", imgO: "images/heads/sixD.png"},
    /*6*/ { x:210, y:610, width:34, height:30, own:false, img:"images/heads/seven.png", imgO: "images/heads/sevenD.png"},
    /*7*/ { x:240, y:610, width:34, height:30, own:false, img:"images/heads/eight.png", imgO: "images/heads/eightD.png"}
];

var headsOwned = 6;

var midHead =
{
	x: 304,
	y: 304,
	width: 32,
	height: 32,
	sprtX: 0,
	sprtY: 0,
	incrVal: 32,
	maxVal: 224,
	img: "empty",
	active: true,
	reset:
	function()
	{
		this.sprtX = 0;
		this.img = "empty";
	}
}

function checkHeads()
{
	console.log(headsOwned);
	if(headsOwned === 8)
	{
		changeState(6);
	}
	if(player.x < midHead.x+midHead.width && player.x+player.width > midHead.x && player.y < midHead.y+midHead.height && player.y+player.height > midHead.y && midHead.active === true && headsOwned <= 8)
	{
		playSound("collect");
		midHead.active = false;
		if(midHead.sprtX < midHead.maxVal)
			midHead.sprtX += midHead.incrVal;
		headsOwned++;
		heads[headsOwned-1].own = true;
	}
	if(midHead.active === false)
	{
		midHead.img = "empty";
	}
}

//----Asset Loading-----//

var imgNames =
    [
        /*0*/"images/ui/splashScreen.png", /*1*/"images/1.png", /*2*/"images/2.png",
        /*3*/"images/3.png", /*4*/"images/4.png", /*5*/"images/5.png",
        /*6*/"images/6.png", /*7*/"images/7.png", /*8*/"images/8.png",
        /*9*/"images/9.png", /*10*/"images/10.png", /*11*/"images/11.png",
        /*12*/"images/12.png", /*13*/"images/ui/logo.png", /*14*/"images/14.png",
        /*15*/"images/15.png", /*16*/"images/16.png", /*17*/"images/17.png",
        /*18*/"images/18.png", /*19*/"images/19.png", /*20*/"images/20.png",
        /*21*/"images/21.png", /*22*/"images/22.png", /*23*/"images/23.png",
        /*24*/"images/24.png", /*25*/"images/25.png", /*26*/"images/26.png",
        /*27*/"images/27.png",/*28*/"images/28.png",/*29*/"images/29.png",
        /*30*/"images/30.png",/*31*/"images/31.png",/*32*/"images/32.png",
        /*33*/"images/33.png",/*34*/"images/34.png",/*35*/"images/35.png",
        /*36*/"images/36.png", /*37*/"images/37.png", /*38*/"images/38.png",
        /*39*/"images/39.png", /*40*/"images/ui/help.png", /*41*/"images/ui/dimScreen.png",
        /*42*/"images/ui/headHolder.png", /*43*/"images/logo/logo1.png",
        /*44*/"images/ui/win.png",/*45*/ "images/ui/gameOver.png",
        /*46*/"images/eye.png",  /*47*/ "images/ui/sound.png",
        /*48*/"images/ui/flame1.png", /*49*/ "images/ui/flame2.png",
        /*50*/"images/ui/leave.png", /*51*/"images/ui/grim.png",
        /*52*/"images/jester.png", /*53*/"images/heads/fullHeads2.png", /*54*/"images/40.png", /*55*/"images/41.png", /*56*/"images/42.png", /*57*/"images/43.png", /*58*/"images/44.png", /*59*/"images/45.png",
		/*60*/"images/46.png", /*61*/"images/47.png", /*62*/"images/48.png", /*63*/"images/49.png", /*64*/"images/50.png", /*65*/"images/51.png", /*66*/"images/52.png", /*67*/"images/53.png",
		/*68*/"images/54.png", /*69*/"images/55.png", /*70*/"images/56.png", /*71*/"images/57.png", /*72*/"images/58.png", /*73*/"images/59.png", /*74*/"images/60.png", /*75*/"images/61.png",
		/*76*/"images/62.png", /*77*/"images/63.png", /*78*/"images/64.png", /*79*/"images/65.png", /*80*/"images/66.png", /*81*/"images/67.png", /*82*/"images/68.png", /*83*/"images/69.png",
		/*84*/"images/70.png", /*85*/"images/71.png", /*86*/"images/72.png", /*87*/"images/73.png", /*88*/"images/74.png", /*89*/"images/75.png", /*90*/"images/76.png", /*91*/"images/77.png",
		/*92*/"images/78.png", /*93*/"images/79.png", /*94*/"images/80.png", /*95*/"images/81.png", /*96*/"images/82.png", /*97*/"images/83.png", /*98*/"images/84.png", /*99*/"images/85.png",
		/*100*/"images/86.png", /*101*/"images/87.png", /*102*/"images/88.png", /*103*/"images/89.png", /*104*/"images/90.png"
    ];

var images = [];
var assetsLoaded = 0;

function loadAssets()
{
    for(var i = 0; i < imgNames.length; i++)
    {
        var temp = new Image();
        temp.src = imgNames[i];
        temp.addEventListener("load", onAssetLoad, false);
        images.push(temp);
    }

    for(var j = 0; j < buttons.length; j++)
    {
        var b = new Image();
        b.src = buttons[j].img;
        b.addEventListener("load", onAssetLoad, false);
        buttons[j].img = b;
        var c = new Image();
        c.src = buttons[j].imgO;
        c.addEventListener("load", onAssetLoad, false);
        buttons[j].imgO = c;
    }

    /*for(var z = 0; z < logo.length; z++)
     {
     var y = new Image();
     y.src = logo[z].img;
     y.addEventListener("load", onAssetLoad, false);
     logo[z].img = y;
     }
     //adsfgh
     */

    for(var s = 0; s < volumeslider.length; s++)
    {
        var v = new Image();
        v.src = volumeslider[s].img;
        v.addEventListener("load", onAssetLoad, false);
        volumeslider[s].img = v;
    }

    for(var k = 0; k < heads.length; k++)
    {
        var h = new Image();
        h.src = heads[k].img;
        h.addEventListener("load", onAssetLoad, false);
        heads[k].img = h;
        var d = new Image();
        d.src = heads[k].imgO;
        d.addEventListener("load", onAssetLoad, false);
        heads[k].imgO = d;
    }
}

function onAssetLoad(e)
{
    console.log("Asset loaded");
    assetsLoaded++;
    if(assetsLoaded === imgNames.length + (buttons.length*2) + (heads.length*2))
    {
        //Defines some images for objects
        player.img = images[10];
        eyeTrap.img = images[46];
        jester.img = images[52];
        doors[0].img = images[14];
        doors[1].img = images[15];
        doors[2].img = images[16];
        doors[3].img = images[17];
		
		midHead.img = images[53];

        //Initializes game after all assets are loaded
        initGame();
    }
    //TODO:playBackgroundSound("backgroundMusic",true);
}

//Initial Function Call
loadAssets();

 })();//IIFE END

//Code End