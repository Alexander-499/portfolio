+++
date = "2025-09-07"
draft = false
title = "How to display your Spotify Data on your Portfolio"
image = "/assets/images/blog/cover/spotify-data-explanation.png"
description = "How to get Spotify data? How to use and display it?"
+++

## How to get Spotify Data?

The goal of this step is to get all of the Spotify data we want from a generated JSON file.

### Creating a Spotify Developer App

1. Head to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in with your Spotify account (you may need to verify your email).
2. Create a new app using the dashboard, give it a name, description, and a **Redirect URI** (I recommend setting any localhost e.g. [http://127.0.0.1:8080](http://127.0.0.1:8080)).
3. Save the **client ID**, **client secret** and **redirect URI** for later.

### Creating the Project & setting up a Server

We will need a server, in this case [Netlify](https://www.netlify.com) (free), with a new project in it to generate and serve the JSON file automatically: First **create a Netlify account** by signing up on their website. After that you should **create a new project** (folder) on your PC which will be generating the JSON and **open it in a code editor** and run the following commands in **Powershell** in the created folder (make sure [Node.js](https://nodejs.org) is installed before):

{{< shiki lang="shell" >}}
npm install -g netlify-cli # Install Netlify CLI globally
npm init -y # Initialize Node project
netlify init # Initialize Netlify project (log in with your Netlify account in the opened browser and create & configure a new site)
mkdir functions # Add functions folder (here will be the code which will generate the JSON)
{{< /shiki >}}

Now create a new JavaScript file in `functions` which I called  `get-spotify-data.js`. To tell Netlify where the functions live you need to specify it in `netlify.toml` (you may need to create this file if it doesn't already exist):

{{< shiki lang="toml" >}}
[build]
  functions = "functions"
{{< /shiki >}}

Before you can code the `functions/get-spotify-data.js` you must know the client ID and client secret, which we thankfully already got. Additionally we need to generate a refresh token. That requires a few steps though. Spotify needs you to visit a URL to grant access to its API. The URL I used looks like this (remember to add your client ID and redirect URI):

{{< shiki >}}
https://accounts.spotify.com/authorize
?client_id=YOUR_CLIENT_ID
&response_type=code
&redirect_uri=YOUR_REDIRECT_URI
&scope=user-top-read%20user-library-read%20playlist-read-private%20user-read-recently-played%20user-follow-read
{{< /shiki >}}

You can change the scopes by adding different keywords to `scope` separated by spaces (`%20`). *Scopes provide Spotify users using third-party apps the confidence that only the information they choose to share will be shared, and nothing more.* You can find a list of all scopes on the [Spotify Developer Documentation](https://developer.spotify.com/documentation/web-api/concepts/scopes). After visiting the url and granting access it will change to something like `http://127.0.0.1:8888/?code=YOUR_CODE`. Save this code for later as well. The final step here to get your refresh token is to create a Node script which will generate it for you:

  1. Create a new folder anywhere.
  2. Run `npm init -y` and `npm install node-fetch@2`. This will create a `package.json` and install `node-fetch`.
  3. Create a new JavaScript file in the folder (e.g. `get-refresh-token.js`) and add the following code (remember to add your client ID, client secret, redirect uri and code)

{{< shiki lang="javascript" >}}
const fetch = require("node-fetch");
const client_id = "YOUR_CLIENT_ID";
const client_secret = "YOUR_CLIENT_SECRET";
const redirect_uri = "YOUR_REDIRECT_URI";
const code = "YOUR_CODE";

(async () => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri
    })
  });

  const data = await res.json();
  console.log(data);
})();
{{< /shiki >}}

  After running the code using `node get-refresh-token.js` it will output a small peace of JSON which includes the wanted refresh token. Save it also for later from `refresh_token` from the JSON.
  4. Finally we can add the 3 secrets to our Netlify project. Go to **your project** → **Project configuration** → **Environment variables** → **Add a variable** (add a single variable) for each secret. Give each one a proper name using the **SCREAMING_SNAKE_CASE** and check **Contains secret values**.

Now you can code (copy) the `functions/get-spotify-data.js`. This is mine which you can build upon:

{{< shiki lang="javascript" >}}
const fetch = require("node-fetch");
exports.handler = async function(event, context) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token
    })
  });

  const tokenData = await tokenRes.json();
  const access_token = tokenData.access_token;

  const headers = { "Authorization": `Bearer ${access_token}` };

  // Fetch top Tracks
  const [topTracksShortTerm, topTracksMediumTerm, topTracksLongTerm] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=30&time_range=short_term", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=30&time_range=medium_term", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=30&time_range=long_term", { headers }).then(r => r.json())
  ]);

  // Fetch top Artists
  const [topArtistShortTerm, topArtistMediumTerm, topArtistLongTerm] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term", { headers }).then(r => r.json())
  ]);

  // Fetch saved Tracks, Playlists, recently played, and followed Artists
  const [savedTracks, playlists, recentlyPlayed, followedArtists] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/tracks?limit=30", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/playlists?limit=50", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/player/recently-played?limit=30", { headers }).then(r => r.json()),
    fetch("https://api.spotify.com/v1/me/following?type=artist&limit=10", { headers }).then(r => r.json())
  ]);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify({ topTracksShortTerm, topTracksMediumTerm, topTracksLongTerm, topArtistShortTerm, topArtistMediumTerm, topArtistLongTerm, savedTracks, playlists, recentlyPlayed, followedArtists })
  };
};
{{< /shiki >}}

  Mine for example will generate up to:

  - 30 top songs (short, medium, long term)
  - 10 top artists (short, medium, long term)
  - 30 last saved tracks
  - 50 saved playlist
  - 30 recently played songs
  - 10 followed artists

Now finally you can run `netlify deploy --prod` to push everything to Netlify (if you change anything run it again). Now the JSON will be served on something like `https://your-project.netlify.app/.netlify/functions/get-spotify-data` which you can use later for displaying the content.

## How to use and display it?

~~Now I will show you what I did with the spotify data: Displaying specific data as interactive UI on my portfolio website. I will show it using only plain frontend HTML and JavaScript.~~ Ask ChatGPT lol (Maybe I will finish this post sometime).