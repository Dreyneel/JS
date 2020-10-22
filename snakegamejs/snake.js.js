
let game;

game = {
	width  : 400,
	height : 400,
	score  : 0,
	canvas : document.querySelector("canvas"),
	context: document.querySelector("canvas").getContext("2d"),
	food: {
		  x: Math.floor(Math.random() * 20) * 20,
		  y: Math.floor(Math.random() * 20) * 20
	},
	snake: {
		xspeed: 0,
		yspeed: 0,
        head: [{
              x: 100,
              y: 100
        },
        {
              x: 100,
              y: 100
        }],
        display(){
        	for (let i = 0; i < this.head.length; i++){
        	   game.context.beginPath();
        	   game.context.fillStyle=" #009933";
        	   game.context.fillRect(this.head[i].x, this.head[i].y, 20, 20);
        	   game.context.fill();
        	   game.context.closePath();

        	   game.context.beginPath();
        	   game.context.strokeStyle="#fff";
        	   game.context.strokeRect(this.head[i].x, this.head[i].y, 20, 20);
        	   game.context.stroke();
        	   game.context.closePath();
            }
        },
        update(){
        	this.head[0].x += this.xspeed;
        	this.head[0].y += this.yspeed;

        	if (this.head[0].x - 20 >= game.width) {this.head[0].x   =  0; }
        	if (this.head[0].y - 20 >= game.height){this.head[0].y   =  0; }
        	if (this.head[0].x <= -20) {this.head[0].x = game.width  + 20; }
        	if (this.head[0].y <= -20) {this.head[0].y = game.height + 20; }
        },
        accel(x, y){
            this.xspeed = x;
            this.yspeed = y;
        }
	},

	loop(){
		game.context.clearRect(0, 0, game.width, game.height);
		setTimeout(()=>{
			window.requestAnimationFrame(game.loop);
		}, 1000/15);

    	game.snake.display();
		game.context.beginPath();
        game.context.fillStyle="#cc0066";
        game.context.fillRect(game.food.x, game.food.y, 20, 20);

        game.context.strokeStyle="#fff";
        game.context.strokeRect(game.food.x, game.food.y, 20, 20);
        game.context.stroke();
        game.context.closePath();

		game.snake.display();
		game.snake.update();

        game.context.beginPath();
        game.context.font ="20px consolas";
        game.context.fillStyle="#fff";
        game.context.fillText('score: ' + game.score, 10, 20);
		game.context.closePath();

		let oldx = game.snake.head[0].x;
		let oldy = game.snake.head[0].y;

		if (game.food.x === oldx && game.food.y === oldy){
			game.food = {
		          x: Math.floor(Math.random() * 20) * 20,
		          y: Math.floor(Math.random() * 20) * 20
	        }
	        game.score += 1;
		} else 
			game.snake.head.pop();

		let newPos = {x: oldx, y: oldy};
		game.snake.head.unshift(newPos);
	}
};

document.onkeydown = (e) => {

   if (e.keyCode == 37 && game.snake.xspeed == 0) game.snake.accel(-20, 0);
   if (e.keyCode == 38 && game.snake.yspeed == 0) game.snake.accel(0, -20);
   if (e.keyCode == 39 && game.snake.xspeed == 0) game.snake.accel(20,  0);
   if (e.keyCode == 40 && game.snake.yspeed == 0) game.snake.accel(0,  20);

}


window.onload =()=>{
	game.canvas.width  = game.width;
	game.canvas.height = game.height;
	game.loop();
}
