// Local Time
const localTime = document.getElementById("localTime");
const updateLocalTime = () => localTime.innerText = (new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin', hour12: false })).format(new Date());
setInterval(updateLocalTime, 30000);
updateLocalTime();

// Hackatime Stats
const hackatimeChart = document.getElementById("hackatimeChart");
const hackatimeTotalTime = document.getElementById("hackatimeTotalTime");

(async function () {
  const data = (await (await fetch("https://hackatime.hackclub.com/api/v1/users/Alexander499/stats")).json())?.data;
  const colors = await (await fetch("https://raw.githubusercontent.com/ozh/github-colors/refs/heads/master/colors.json")).json();
  const colorsLowerCase = Object.fromEntries(Object.entries(colors).map(([key, value]) => [key.toLowerCase(), value]));

  hackatimeTotalTime.innerHTML += data.human_readable_total;

  data.languages.forEach(language => {
    let name = colorsLowerCase[language.name.toLowerCase()]?.url.replace("https://github.com/trending?l=", "");
    name = name ? name : language.name;
    const color = colorsLowerCase[language.name.toLowerCase()]?.color;
    const percentage = Math.round(language.total_seconds / data.total_seconds * 1000) / 10;
    if (percentage <= 0.1) return;
    hackatimeChart.innerHTML += `<div style="width: ${percentage}%; background-color: ${color ? color : "black"};" title="${name} - ${percentage}%">${percentage > 10 ? name : ""}</div>`;
  });
})();

// Project hover effect
const projects = [1, 2, 3].map(i => document.getElementById(`project${i}`));
const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

function generateProjectHoverEffect(project) {
  let output = "";
  for (let i = 0; i < 32 * 13; i++) {
    const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
    output += randomChar;
  }
  project.innerText = output;
}

projects.forEach((project) => {
  let hoverTimeout;
  project.addEventListener("mousemove", () => {
    if (!hoverTimeout) {
      generateProjectHoverEffect(project);
      hoverTimeout = setTimeout(() => { hoverTimeout = null; }, 50);
    }
  })

  generateProjectHoverEffect(project);
});

const projectsHoverImage = document.getElementById("projectsHoverImage");
let [mouseX, mouseY, currentX, currentY] = [0, 0, 0, 0];

(function animate() {
  currentX += (mouseX - currentX) * 0.3;
  currentY += (mouseY - currentY) * 0.3;
  projectsHoverImage.style.transform = `translate(${currentX}px, ${currentY}px)`;
  requestAnimationFrame(animate);
})();

[
  { imageSrc: "https://zpeedometer-website.netlify.app/assets/images/favicon.svg" },
  { imageSrc: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2285%22>📂</text></svg>` },
  { imageSrc: `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2285%22>🏞️</text></svg>` }
].forEach(({ imageSrc }, index) => {
  projects[index].addEventListener("mouseenter", () => {
    projectsHoverImage.src = imageSrc;
    projectsHoverImage.style.display = "block";
  });

  projects[index].addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  projects[index].addEventListener("mouseleave", () => { projectsHoverImage.style.display = "none"; });
});

// Spotify Data
const topSongs = document.getElementById("topSongs");
const topArtists = document.getElementById("topArtists");
let spotifyDataCache = null;
let IFrameAPI = null;

async function fetchSpotifyData() {
  try {
    const res = await fetch("https://alexander499-spotify-api.netlify.app/.netlify/functions/get-spotify-data");
    spotifyDataCache = await res.json();
  } catch (error) { console.error("Error fetching Spotify data:", error); }
}

async function generateSpotifyData(element, type, typeExact) {
  if (!spotifyDataCache) return;
  const data = spotifyDataCache;

  if (type === "topSongs") spotifyControllers = {};
  element.innerHTML = "";
  data[typeExact]?.items.slice(0, (type === "topSongs" ? 15 : 10)).forEach((item, index) => {
    const div = document.createElement("div");
    const left = document.createElement("div");
    const leftImg = document.createElement("img");
    const leftDiv = document.createElement("div");
    const leftDivName = document.createElement("span");
    const leftDivArtists = document.createElement("span");
    const right = document.createElement("div");
    const rightIframe = document.createElement("iframe");
    const rightLink = document.createElement("a");
    const rightButton = document.createElement("button");

    div.title = item.name;
    left.classList.add("left");
    leftImg.src = type === "topSongs" ? item.album.images[0].url : item.images[0].url;
    leftDivName.innerText = item.name;
    if (type === "topSongs") leftDivArtists.innerHTML = item.artists
      .map(a => `<a href="${a.external_urls.spotify}" target="_blank">${a.name}</a>`).join(", ");
    right.classList.add("right");
    if (type === "topSongs") rightIframe.id = `topSong${index + 1}Iframe`;
    if (type === "topSongs") rightIframe.src = "https://open.spotify.com/embed/track/" + item.id;
    if (type === "topSongs") rightIframe.loading = "lazy";
    if (type === "topSongs") rightIframe.dataset.trackId = item.id;
    rightLink.href = item.external_urls.spotify;
    rightLink.target = "_blank";
    rightLink.innerHTML = "<i data-lucide='square-arrow-out-up-right'></i>";
    if (type === "topSongs") rightButton.id = `topSong${index + 1}Button`;
    if (type === "topSongs") rightButton.innerHTML = "<i data-lucide='play' fill='black' stroke='none'></i>";

    leftDiv.appendChild(leftDivName);
    if (type === "topSongs") leftDiv.appendChild(leftDivArtists);
    left.appendChild(leftImg);
    left.appendChild(leftDiv);
    if (type === "topSongs") right.appendChild(rightIframe);
    right.appendChild(rightLink);
    if (type === "topSongs") right.appendChild(rightButton);
    div.appendChild(left);
    div.appendChild(right);
    element.appendChild(div);
  });

  lucide.createIcons();
  if (type === "topSongs") initTopSongControllers();
}

(async function() {
  await fetchSpotifyData();
  generateSpotifyData(topSongs, "topSongs", "topTracksShortTerm");
  generateSpotifyData(topArtists, "topArtists", "topArtistShortTerm");
})();

document.getElementById("reloadSpotifyDataButton").addEventListener("click", async () => {
  await fetchSpotifyData();
  generateSpotifyData(topSongs, "topSongs", document.querySelector('input[name="topSongsRadioGroup"]:checked').value);
  generateSpotifyData(topArtists, "topArtists", document.querySelector('input[name="topArtistsRadioGroup"]:checked').value);
});

document.querySelectorAll('input[type="radio"][name="topSongsRadioGroup"], input[type="radio"][name="topArtistsRadioGroup"]')
.forEach(radio => {
  radio.addEventListener("change", (e) => {
    if (e.target.checked) {
      if (e.target.name === "topSongsRadioGroup") {
        generateSpotifyData(topSongs, "topSongs", e.target.value);
        initTopSongControllers();
      }
      if (e.target.name === "topArtistsRadioGroup") generateSpotifyData(topArtists, "topArtists", e.target.value);
    }
  });
});

let spotifyControllers = {};
window.onSpotifyIframeApiReady = (api) => {
  IFrameAPI = api;
  initTopSongControllers();
};

function initTopSongControllers() {
  if (!IFrameAPI) return;
  const iframes = document.querySelectorAll('[id^="topSong"][id$="Iframe"]');

  iframes.forEach((iframe) => {
    const index = iframe.id.match(/\d+/)[0];
    const button = document.getElementById(`topSong${index}Button`);
    if (!button) return;

    const trackId = iframe.dataset.trackId;
    if (!trackId) return;
    if (spotifyControllers[iframe.id]) return;

    IFrameAPI.createController(
      iframe,
      { uri: `spotify:track:${trackId}`, width: 224, height: 80 },
      (EmbedController) => {
        let isPaused = true;
        button.onclick = async () => {
          try {
            if (isPaused) {
              await EmbedController.resume();
              button.innerHTML = "<i data-lucide='pause' fill='black' stroke='none'></i>";
            } else {
              await EmbedController.pause();
              button.innerHTML = "<i data-lucide='play' fill='black' stroke='none'></i>";
            }
            lucide.createIcons();
            isPaused = !isPaused;
          } catch (err) {
            console.error("Error controlling Spotify track:", err);
          }
        };
      }
    );

    spotifyControllers[iframe.id] = true;
  });
}

// YouTube Subscriber Counter
// const youtubeSubscribers = document.getElementById("youtubeSubscribers");
// const youtubeViews = document.getElementById("youtubeViews");
// const youtubeVideoCount = document.getElementById("youtubeVideoCount");

// (async function () {
// const statistics = (await (await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCqPhvVSUJDyc6Q7BfvodcoQ&key=YOUTUBE_API_KEY`)).json()).items[0].statistics; // Saved in Dikiy Kot Discord
//   if (statistics.subscriberCount) { youtubeSubscribers.innerHTML = statistics.subscriberCount } else return;
//   youtubeViews.innerHTML = statistics.viewCount;
//   youtubeVideoCount.innerHTML = statistics.videoCount;
// })();