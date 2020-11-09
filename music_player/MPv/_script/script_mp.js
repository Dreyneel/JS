
let mp_audio    = document.getElementsByClassName("_audio")[0];
let mp_progress = document.getElementsByClassName("_progress")[0];
let mp_currTime = document.getElementsByClassName("_currTime")[0];
let mp_duration = document.getElementsByClassName("_duration")[0];

let mp_next    = document.getElementsByClassName("_next")[0];
let mp_play    = document.getElementsByClassName("_play")[0];
let mp_prev    = document.getElementsByClassName("_prev")[0];
let mp_volume  = document.getElementsByClassName("_volume")[0];
let mp_percent = document.getElementsByClassName("_percent")[0];

let mp_isPlaying = document.getElementsByClassName("_isPlayed");
let mp_title     = document.getElementsByClassName("_title")[0];

let player   = document.getElementsByClassName("player")[0];
let playlist = document.getElementsByClassName("playlist")[0];


let music_Player = {
	isPlayed: false,
	storeLength: 0,
	convertElapsedTime: (inputSeconds)=>{
		if (isNaN(inputSeconds)) return "00 : 00";
		let seconds = Math.floor(inputSeconds % 60);
		if (seconds < 10) seconds = "0" + seconds;
		let minutes = Math.floor((inputSeconds / 60) % 60);
		let hour     = Math.floor((inputSeconds / 60) /60);
		if (minutes > 59){
			return hour + " : " + minutes + " : " + seconds;
		} else if (minutes < 10){
			return minutes + " : " + seconds;
		} else {
			return minutes + " : " + seconds;
		}
	},
	playButton: ()=>{
		if (!music_Player.isPlayed){
			music_Player.isPlayed = true;
			mp_play.src = "_asset/pause.png";
			mp_audio.play();
		} else {
			music_Player.isPlayed = false;
			mp_play.src = "_asset/play.png";
			mp_audio.pause();
		}
	},
	nextButton: ()=>{
		let getimg = document.getElementsByClassName("_isPlayed");
		for (let j = 0; j < getimg.length; j++) getimg[j].src = "_asset/note2.png";
		
		if (music_Player.storeLength < musicLink.length - 1){
			getimg[music_Player.storeLength + 1].src = "_asset/planim.gif";
			let nextSong = musicLink[music_Player.storeLength + 1].dir;
			mp_title.innerHTML = musicLink[music_Player.storeLength + 1].name;
			mp_audio.src = nextSong;
			music_Player.isPlayed = false;
			music_Player.playButton();
			music_Player.storeLength += 1;
		} else {
			music_Player.storeLength = 0;
			getimg[music_Player.storeLength].src = "_asset/planim.gif";
			mp_audio.src = musicLink[music_Player.storeLength].dir;
			mp_title.innerHTML = musicLink[music_Player.storeLength].name;
			mp_audio.play();
		}
	},
	previousButton: ()=>{
		let getimg = document.getElementsByClassName("_isPlayed");
		for (let j = 0; j < getimg.length; j++) getimg[j].src = "_asset/note2.png";
		
		if (music_Player.storeLength > 0){
			getimg[music_Player.storeLength - 1].src = "_asset/planim.gif";
			mp_title.innerHTML = musicLink[music_Player.storeLength - 1].name;
			mp_audio.src = musicLink[music_Player.storeLength - 1].dir;
			music_Player.isPlayed = false;
			music_Player.playButton();
			music_Player.storeLength -= 1;
	} else {
			music_Player.storeLength = musicLink.length - 1;
			getimg[music_Player.storeLength].src = "_asset/planim.gif";
			mp_title.innerHTML = musicLink[music_Player.storeLength].name;
			mp_audio.src = musicLink[storeLength].dir;
			mp_audio.play();
		}
	},
	addEvents: ()=>{
		mp_play.addEventListener("click", music_Player.playButton);
		mp_next.addEventListener("click", music_Player.nextButton);
		mp_prev.addEventListener("click", music_Player.previousButton);
	},
	addSongs: ()=>{
		for (let i = 0; i < musicLink.length; i++){
			let songs = document.getElementsByClassName("songs")[0];
			let elUl  = document.createElement("li");
			elUl.classList.add("track");
			songs.appendChild(elUl);
			let getLi = document.getElementsByClassName("track");
			for (let l = 0; l < getLi.length; l++){
				getLi[l].innerHTML = (`					
					<img src="_asset/note2.png" width="15" class="_isPlayed">
					<label>` + musicLink[l].name +`</label>
				`);

				getLi[l].addEventListener("click", ()=>{
					let getimg = document.getElementsByClassName("_isPlayed");
					for (let j = 0; j < getimg.length; j++) getimg[j].src = "_asset/note2.png";
					getimg[l].src = "_asset/planim.gif";
					music_Player.isPlayed = false;
					music_Player.storeLength = l;
					mp_title.innerHTML = musicLink[l].name;
					mp_audio.src = musicLink[l].dir; 
					music_Player.playButton();
				});
			}
		}
	},
	runLoop: ()=>{
		let audio_duration = mp_audio.duration;
		let audio_currTime = mp_audio.currentTime;

		let scaledProgress = mp_progress.max * (mp_audio.currentTime / mp_audio.duration);
		if (!isNaN(scaledProgress)){
			mp_progress.value  = Math.floor(scaledProgress);
		}

		mp_audio.volume = mp_volume.value / 100;
		mp_percent.innerHTML = mp_volume.value + "%";
		audio_duration -= audio_currTime;
		if (audio_duration === 0){
			mp_play.src = "_asset/pause.png";
			music_Player.isPlayed = true;
			music_Player.storeLength += 1;
			mp_audio.src = 	musicLink[music_Player.storeLength+1].dir;
			mp_audio.play();
			music_Player.playButton();
			
		}

		mp_currTime.innerHTML = music_Player.convertElapsedTime(audio_currTime);
		mp_duration.innerHTML = music_Player.convertElapsedTime(audio_duration);
		setInterval(music_Player.runLoop, 1000);
	}
}

function popup(){
	player.style.display = "block";
	playlist.style.display = "none";

}

function goToPlaylist(){
	player.style.display = "none";
	playlist.style.display = "block";	
}

window.onload =()=>{
	music_Player.addSongs();
	music_Player.addEvents();
	music_Player.runLoop();
}
