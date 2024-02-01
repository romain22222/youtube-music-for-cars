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
	// navigator.mediaSession.metadata = new MediaMetadata({
	// 	title: videoTitles[realId],
	// 	artist: videoArtists[realId]
	// });
}

let checkCounter = 0;

let v;
function checkIsLoaded() {
	if (YT.loaded !== 1) {
		setTimeout(checkIsLoaded, 100);
	}
	player = new YT.Player(playerDiv, playerOptions);

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

window.onpointerup = function(e) {
    navigator.bluetooth.requestDevice({acceptAllDevices: true})
      .then(device => {
          console.log(device);
        // Connect to the selected device
        return device.gatt.connect();
      })
      .then(server => {
        // Get all the services offered by the Bluetooth server
        return server.getPrimaryServices();
      })
      .then(services => {
        // Iterate through each service
        services.forEach(service => {
          console.log('Service UUID:', service.uuid);
          // Get all the characteristics offered by each service
          service.getCharacteristics().then(characteristics => {
            characteristics.forEach(characteristic => {
              console.log('Characteristic UUID:', characteristic.uuid);
              // Subscribe to characteristic changes if needed
              characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
              characteristic.startNotifications().catch(error => console.error('Failed to start notifications:', error));
            });
          });
        });
      })
      .catch(error => {
        console.error('Bluetooth error:', error);
      });

    // Callback function to handle characteristic value changes
    function handleCharacteristicValueChanged(event) {
      const value = event.target.value;
        console.log('Received ' + value);
      // Process the received value (e.g., check if the next track button was pressed)
      // Trigger appropriate actions in your web application
    }
}


window.onYouTubeIframeAPIReady = () => {
	checkIsLoaded();
};