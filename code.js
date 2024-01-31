function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
let videosPlayed = videoIds
const playerDiv = document.getElementById('player');
const playerOptions = {
    height: '100%',
    width: '100%',
    videoId: videosPlayed[0],
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
};

let currentTrackIndex = 0;
let player;

function onPlayerReady(event) {
    // Player is ready to receive API calls
    player = event.target;
    updatePlayerSource();
}

function onPlayerStateChange(event) {
    // Called when the player's state changes (e.g., track ends)
    if (event.data === YT.PlayerState.ENDED) {
        // Automatically play the next track when the current one ends
        nextTrack();
    }
}

function togglePlayPause() {
    if (player.getPlayerState() === YT.PlayerState.PAUSED || player.getPlayerState() === YT.PlayerState.ENDED) {
        player.playVideo();
    } else {
        player.pauseVideo();
    }
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + videosPlayed.length) % videosPlayed.length;
    updatePlayerSource();
    player.playVideo();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % videosPlayed.length;
    updatePlayerSource();
    player.playVideo();
}

function updatePlayerSource() {
	const realId = videosPlayed.findIndex((id) => id === videoIds[currentTrackIndex]);
    player.loadVideoById(videosPlayed[currentTrackIndex]);
	navigator.mediaSession.metadata = new MediaMetadata({
		title: videoTitles[realId],
		artist: videoArtists[realId]
	});
}

let checkCounter = 0;

let v;
function checkIsLoaded() {
	if (YT.loaded !== 1) {
		setTimeout(checkIsLoaded, 100);
	}
	player = new YT.Player(playerDiv, playerOptions);
	/*v = setInterval(function() {
		try {
		if (player.getPlayerState() === YT.PlayerState.UNSTARTED) {
			checkCounter++;
			if (checkCounter === 2) {
				nextTrack();
				checkCounter = 0;
			}
		} else {
			checkCounter = 0;
		}} catch (e) {
			console.log("player not loaded");
			clearInterval(v);
		}
	}, 1000);*/
}

document.onkeydown = function(e) {
	document.getElementById("debugKey").innerHTML = "'" + e.key + " " + e.code + "(" + JSON.stringify(e) + ")" + "'\n\n" + document.getElementById("debugKey").innerHTML;
	switch (e.key) {
		case "MediaTrackNext":
		case "MediaNextTrack":
			previousTrack();
			break;
		case "MediaTrackPrevious":
		case "MediaPreviousTrack":
			nextTrack();
			break;
	}
}

navigator.mediaSession.setActionHandler("seekforward", function(event) {
	console.log("seek forward");
	document.getElementById("debugKey").innerHTML = "event seekforward" + "'\n\n" + document.getElementById("debugKey").innerHTML;
});

navigator.mediaSession.setActionHandler("seekto", function(event) {
	console.log("seek to");
	document.getElementById("debugKey").innerHTML = "event seekto" + "'\n\n" + document.getElementById("debugKey").innerHTML;
});

navigator.mediaSession.setActionHandler("stop", function(event) {
	console.log("stop");
	document.getElementById("debugKey").innerHTML = "event stop" + "'\n\n" + document.getElementById("debugKey").innerHTML;
});

navigator.mediaSession.setActionHandler("pause", function(event) {
	console.log("pause");
	document.getElementById("debugKey").innerHTML = "event pause" + "'\n\n" + document.getElementById("debugKey").innerHTML;
	togglePlayPause();
});

navigator.mediaSession.setActionHandler("seekbackward", function(event) {
	console.log("seek backward");
	document.getElementById("debugKey").innerHTML = "event seekbackward" + "'\n\n" + document.getElementById("debugKey").innerHTML;
});

navigator.mediaSession.setActionHandler('previoustrack', function() {
	console.log('Previous track button pressed');
	document.getElementById("debugKey").innerHTML = "event previoustrack" + "'\n\n" + document.getElementById("debugKey").innerHTML;
	previousTrack();
});
navigator.mediaSession.setActionHandler('nexttrack', function() {
	console.log('Next track button pressed');
	document.getElementById("debugKey").innerHTML = "event nexttrack" + "'\n\n" + document.getElementById("debugKey").innerHTML;
	nextTrack();
});
navigator.mediaSession.setActionHandler('play', function() {
	console.log('Play button pressed');
	document.getElementById("debugKey").innerHTML = "event play" + "'\n\n" + document.getElementById("debugKey").innerHTML;
	togglePlayPause();
});


window.onYouTubeIframeAPIReady = () => {
	checkIsLoaded();
};
window.addEventListener('pointerup', function(event) {
	// Check if any bluetooth devices are connected
	if ('bluetooth' in navigator) {
		console.log('Web Bluetooth API is available.')
		// Request access to Bluetooth devices
		navigator.bluetooth.requestDevice({acceptAllDevices: true})
		.then(device => {
			// Device(s) found, do something with them
			console.log('Connected Bluetooth device:', device.name);
		})
		.catch(error => {
			// An error occurred
			console.error('Bluetooth error:', error);
		});
	} else {
		console.error('Web Bluetooth API is not supported in this browser.');
	}
});