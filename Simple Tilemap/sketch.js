

let Dungeon = {
	context:document.querySelector("canvas").getContext("2d"),
	tileset: {
		column: 11,
		rows  : 12,
		size  : 48,
		img   : new Image()
	},
	drawMap: ()=>{
		for (let i = 0; i < map.tile.length; i++){
			let val = map.tile[i]-1;
			let posx = (i % map.column) * map.size;
			let posy = Math.floor(i / map.rows) * map.size;
			let sourcex = (val % Dungeon.tileset.column) * Dungeon.tileset.size;
			let sourcey = Math.floor(val / Dungeon.tileset.rows) * Dungeon.tileset.size;
			// i used single row tileset
			Dungeon.context.drawImage(Dungeon.tileset.img, 
				sourcex, 
				0, 
				Dungeon.tileset.size, 
				Dungeon.tileset.size, 
				posx, posy, 
				map.size, 
				map.size
			);
		}
	},
	loop: ()=>{
		Dungeon.context.clearRect(0, 0, 576, 576);
		window.requestAnimationFrame(Dungeon.loop);
		Dungeon.drawMap();
	}
}

window.onload =()=>{
	Dungeon.context.imageSmoothingEnabled = false; 
	Dungeon.tileset.img.src = "asset/tileset.png";
	Dungeon.loop();
}















