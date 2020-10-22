

let arrowKeys = {
	LEFT  : false,
	RIGHT : false,
	TOP   : false,
	BOTTOM: false,
	keys  : (event)=>{
		let key = (event.type == 'keydown')?true:false;
		switch(event.keyCode){
			case 37: arrowKeys.LEFT   = key; break;
			case 38: arrowKeys.TOP    = key; break;
			case 39: arrowKeys.RIGHT  = key; break;
			case 40: arrowKeys.BOTTOM = key;
		}
	}
};

let Game = {
	mapimg: new Image(),
	sprite: new Image(),
	context: document.querySelector("canvas").getContext("2d"),
	collide: false,
	camera: {
		x: 0,   y: 0,
		w: 400, h: 400,
		update: (xspeed, yspeed)=>{

			//not the best solution 
			if (!Game.collide){
			if (arrowKeys.TOP   ) Game.camera.y -= yspeed;         
			if (arrowKeys.BOTTOM) Game.camera.y -= yspeed; 
			if (arrowKeys.RIGHT ) Game.camera.x -= xspeed;  
			if (arrowKeys.LEFT  ) Game.camera.x -= xspeed;
		}
			
			if (Game.camera.x >= 0   ) Game.camera.x =    0;
			if (Game.camera.x <= -368) Game.camera.x = -368;
			if (Game.camera.y >= 0   ) Game.camera.y =    0;
			if (Game.camera.y <= -368) Game.camera.y = -368;

		}
	},
	size  : 64,
	cols  : 10,
	rows  : 10,
	player: {
		width: 64,  height: 64,
		x    : 170,   oldx: 100,
		y    : 170,   oldy: 100,
		vx   : 0,	  size: 64,
		vy   : 0,	  fr  : 0.9,
		srcx: 0,      srcy: 0,
		frameCount        : 8,
		currframe         : 0,
		oldFrame: 0,
		display: ()=>{
			Game.context.drawImage(
				Game.sprite, 
				Game.player.srcx, Game.player.srcy, 
				Game.player.size, Game.player.size, 
				Game.player.x,    Game.player.y, 
				Game.player.size, Game.player.size, 
			);
		},
		addVelocity: (xspeed, yspeed, srcy)=>{
			Game.player.vx = xspeed;
			Game.player.vy = yspeed;
			//movecamera
			Game.camera.update(Game.player.vx, Game.player.vy);
			if (xspeed == 0 && yspeed == 0){
				Game.player.srcy = srcy;
				Game.player.currframe = 0;
			}
			else
				Game.player.srcy = srcy;
				Game.player.oldFrame = srcy;
		} ,
		moveCharacter: (speed)=>{
			let oldf = Game.player.oldFrame;
			if      (arrowKeys.TOP   ) Game.player.addVelocity(0, -speed,    0);
			else if (arrowKeys.BOTTOM) Game.player.addVelocity(0,  speed,  192);
			else if (arrowKeys.RIGHT ) Game.player.addVelocity( speed, 0,  128);
			else if (arrowKeys.LEFT  ) Game.player.addVelocity(-speed, 0,   64);
			else                       Game.player.addVelocity(0,      0, oldf);
		},
		update: ()=>{
			//animation
        	Game.player.currframe = ++Game.player.currframe % Game.player.frameCount;
        	Game.player.srcx = Game.player.currframe * Game.player.size;
        	Game.player.srcy = 0;
        	//move player with arrow keys
        	Game.player.moveCharacter(10);
        	Game.player.x  += Game.player.vx;
        	Game.player.y  += Game.player.vy;
        	if (Game.player.vx >= 15) Game.player.vx = 15;
		},
	},

	drawMap:()=>{
		for (let i = 0; i < map.tile.length; i++){
			let getTile = map.tile[i] - 1;
			let posX = (i % map.cols) * map.size;
			let posY = Math.floor(i / map.rows) * map.size;
			let sourceX = (getTile % Game.cols) * map.size;
			let sourceY = Math.floor(getTile / Game.rows) * map.size;
			if (getTile !== 0){
				Game.context.drawImage(
					Game.mapimg, 
					sourceX, sourceY, 
					Game.size, Game.size, 
					posX, posY, 
					Game.size, Game.size
				);
			}
		}
	}
};

function render(){
	Game.context.clearRect(0, 0, 500, 500);
	setTimeout(()=>{
		window.requestAnimationFrame(render);
	},1000/60);

	Game.player.oldx = Game.player.x;
	Game.player.oldy = Game.player.y;

	Game.context.save();
	Game.context.translate(Game.camera.x, Game.camera.y);

	Game.drawMap();
	Game.player.update();

	let bott  = Math.floor((Game.player.y + Game.player.height ) / Game.player.height);
    let right = Math.floor((Game.player.x + Game.player.width  ) / Game.player.width );
    let left  = Math.floor(Game.player.x  / Game.player.width  );
    let top   = Math.floor(Game.player.y  / Game.player.height );

    let botLeft  = collisionmap[bott * map.cols +  left];
    let topLeft  = collisionmap[top  * map.cols +  left];
    let botRight = collisionmap[bott * map.cols + right];
    let topRight = collisionmap[top  * map.cols + right];

    //left
    	if (Game.player.x - Game.player.oldx < 0) {
        	if (botLeft == 5 || topLeft == 5) {
        		Game.collide = true;
            	Game.player.vx = 0;
            	Game.player.x = (left * Game.player.width) + Game.player.width + 0.001;
       		} else
       			Game.collide = false;
    	}//right
    	else if (Game.player.x - Game.player.oldx > 0) {
        	if (botRight == 5 || topRight == 5) {
        		Game.collide = true;
            	Game.player.vx = 0;
            	Game.player.x = (right * Game.player.width) - Game.player.width - 0.001;
        	} else
	        	Game.collide = false;
    	}//top
    	if (Game.player.y - Game.player.oldy < 0) {
        	if (topLeft == 5 || topRight == 5) {
        		Game.collide = true;
            	Game.player.vy = 0;
            	Game.player.y = (top * Game.player.height) + Game.player.height + 0.001;
        	} else
	        	Game.collide = false;
    	}//bottom
    	else if (Game.player.y - Game.player.oldy > 0) {
        	if (botLeft == 5 || botRight == 5) {
        		Game.collide = true;
            	Game.player.vy = 0;
            	Game.player.y = (bott * Game.player.height) - Game.player.height - 0.001;
        	} else
	        	Game.collide = false;
    	} 
    Game.player.display();
    Game.context.restore();
}


window.addEventListener('keydown', arrowKeys.keys);
window.addEventListener('keyup',   arrowKeys.keys);
window.onload =()=>{
	Game.context.imageSmoothingEnabled = false; 
	Game.mapimg.src = "tilemap.png";
	Game.sprite.src = "sprite5.png";
	render();
}