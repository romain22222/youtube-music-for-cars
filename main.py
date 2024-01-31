import json
import os
import random
import sys

from googleapiclient.discovery import build


def load_config():
	with open("./config/config.txt", "r") as f:
		return {x: y for x, y in [x.strip().split("=") for x in f.readlines()]}


def getVideos(playlist_id):
	resp = youtube.playlistItems().list(
		part="snippet",
		playlistId=playlist_id,
		maxResults=50
	).execute()
	res = resp.get("items", [])
	while "nextPageToken" in resp:
		resp = youtube.playlistItems().list(
			part="snippet",
			playlistId=playlist_id,
			maxResults=50,
			pageToken=resp["nextPageToken"]
		).execute()
		res.extend(resp.get("items", []))
	return res


def generate_html_page(video_ids, videoTitles, videoArtists):
	# Generate the HTML content with embedded iframes for each video
	html_content = f"""
<div style="display:flex;justify-content:center;align-items:center;">
	<div id="player" frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" width="100%" height="100%" src="https://www.youtube.com/embed/HRL5Cp_mPeo?origin=https%3A%2F%2Fyoutube-shuffle.boucaud.dev&amp;enablejsapi=1&amp;widgetid=1" id="widget2"></div>
	<div id="audio-controls">
		<button onclick="previousTrack()">Previous Track</button>
		<button onclick="togglePlayPause()">Play/Pause</button>
		<button onclick="nextTrack()">Next Track</button>
	</div>
</div>
<div id="debugKey"></div>
<script>
	let videoIds = {json.dumps(video_ids)};
	let videoTitles = {json.dumps(videoTitles)};
	let videoArtists = {json.dumps(videoArtists)};
</script>
<script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>
<script>{"".join(open("code.js", 'r').readlines())}</script>
	"""

	return html_content


if __name__ == '__main__':
	config = load_config()
	youtube = build("youtube", "v3", developerKey=config["YOUTUBE_API_KEY"])
	if sys.argv[1] == "load":
		videos = getVideos(sys.argv[2])
		# Save the video IDs to a file named after the playlist
		# print(json.dump(videos[0], open(f"./playlists/{sys.argv[2]}.json", "w")))
		with open(f"./playlists/{sys.argv[2]}.txt", "w", encoding="utf-8") as f:
			f.write("\n".join([f'{v["snippet"]["resourceId"]["videoId"]} &&&&& {v["snippet"]["title"]} &&&&& {v["snippet"]["videoOwnerChannelTitle"]}' for v in videos]))
		exit()
	elif sys.argv[1] == "startVid":
		# Load the video IDs from the file
		with open(f"./playlists/{sys.argv[2]}.txt", "r", encoding="utf-8") as f:
			playlist = [x.strip().split(" &&&&& ") for x in f.readlines()]
			ids = [x[0] for x in playlist]
			titles = [x[1] for x in playlist]
			artists = [x[2] for x in playlist]
		page = generate_html_page(ids, titles, artists)
		with open("./index.html", "w") as f:
			f.write(page)
