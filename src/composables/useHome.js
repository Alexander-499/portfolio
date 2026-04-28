import L from "leaflet";
import "leaflet/dist/leaflet.css"
import { ref } from "vue";

export const hackatimeLanguages = ref([]);
export const hackatimeTotalTime = ref(null);
export const leafletMapDistance = ref(null);
export const localTime = ref("00:00:00");
export const githubRecentRepos = ref([]);
export const abacusVisitCount = ref(null);
export const abacusButtonClicks = ref(null);
export const abacusTextParticles = ref([]);
export const toolsCurrentDockIcon = ref(["vscode", -6]);

// Hackatime Stats
(async () => {
  const { data } = await (await fetch("https://hackatime.hackclub.com/api/v1/users/Alexander499/stats")).json();
  const colorsLowerCase = Object.fromEntries(
    Object.entries(await (await fetch("https://raw.githubusercontent.com/ozh/github-colors/refs/heads/master/colors.json")).json())
    .map(([key, value]) => [key.toLowerCase(), value])
  );

  hackatimeTotalTime.value = data.human_readable_total;
  hackatimeLanguages.value = data.languages.map(language => {
    const info = colorsLowerCase[language.name.toLowerCase()] || {};
    const name = info.url?.replace("https://github.com/trending?l=", "") || language.name;
    const percentage = Math.round(language.total_seconds / data.total_seconds * 1000) / 10;
    if (percentage <= 0.1) return null;
    return { name, percentage, color: info.color }
  }).filter(Boolean);
})();

// TODO Map
(async () => {
  try {
    const response = await fetch("https://ipapi.co/json");
    if (!response.ok) return;
    const data = await response.json();
    localStorage.setItem("ipLocationData", JSON.stringify((( { latitude, longitude }) => ({ latitude, longitude }))(data)));
  } catch (error) {}
  const ipLocationData = JSON.parse(localStorage.getItem("ipLocationData"));

  const meCoords = { lat: 51.47, lon: 7.55 }; // NRW
  const targetCoords = ipLocationData ? { lat: ipLocationData.latitude, lon: ipLocationData.longitude } : { lat: 40.728139, lon: -73.920278 }; // New York as Fallback

  const map = L.map("map", Object.fromEntries(["zoomControl", "dragging", "scrollWheelZoom", "doubleClickZoom", "boxZoom", "keyboard", "touchZoom", "attributionControl"].map(k => [k, false])));

  map.setView([meCoords.lat, meCoords.lon], 3, { animate: false });
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png").addTo(map);

  const icon = type => L.divIcon({
    className: "",
    iconAnchor: [13.5, 34.5],
    html: `<svg class="map-pin ${type}" height="41px" width="27px" viewBox="0 0 27 41">
      <defs><radialGradient id="shadowGradient"><stop offset="10%" stop-opacity="0.4"/><stop offset="100%" stop-opacity="0.05"/></radialGradient></defs>
      <ellipse cx="13.5" cy="34.8" rx="10.5" ry="5.25" fill="url(#shadowGradient)"/>
      <path fill="currentColor" d="M27,13.5C27,19.07 20.25,27 14.75,34.5C14.02,35.5 12.98,35.5 12.25,34.5C6.75,27 0,19.22 0,13.5C0,6.04 6.04,0 13.5,0C20.96,0 27,6.04 27,13.5Z"></path><path opacity="0.25" d="M13.5,0C6.04,0 0,6.04 0,13.5C0,19.22 6.75,27 12.25,34.5C13,35.52 14.02,35.5 14.75,34.5C20.25,27 27,19.07 27,13.5C27,6.04 20.96,0 13.5,0ZM13.5,1C20.42,1 26,6.58 26,13.5C26,15.9 24.5,19.18 22.22,22.74C19.95,26.3 16.71,30.14 13.94,33.91C13.74,34.18 13.61,34.32 13.5,34.44C13.39,34.32 13.26,34.18 13.06,33.91C10.28,30.13 7.41,26.31 5.02,22.77C2.62,19.23 1,15.95 1,13.5C1,6.58 6.58,1 13.5,1Z"/>
      <circle fill="white" cx="13.5" cy="13.5" r="5.5"/>
    </svg>`
  });

  const alignToSameWorld = (a, b) => ({ ...b, lon: ((b.lon - a.lon + 540) % 360) - 180 + a.lon });

  const rad = r => r*Math.PI/180, deg = d => d*180/Math.PI
  function arc(a, b, length = 80) {
    const φ1=rad(a.lat), λ1=rad(a.lon), φ2=rad(b.lat), λ2=rad(b.lon); // Converts Degrees into Radians
    const δ=2*Math.asin(Math.sqrt(Math.sin((φ2-φ1)/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin((λ2-λ1)/2)**2)); // Computes angular Distance (Haversine Formula)
    let prevLon;
    return [...Array(length + 1).keys()].map(i=>{
      const A=Math.sin((1-i/length)*δ)/Math.sin(δ), B=Math.sin(i/length*δ)/Math.sin(δ);
      const x=A*Math.cos(φ1)*Math.cos(λ1)+B*Math.cos(φ2)*Math.cos(λ2);
      const y=A*Math.cos(φ1)*Math.sin(λ1)+B*Math.cos(φ2)*Math.sin(λ2);
      const z=A*Math.sin(φ1)+B*Math.sin(φ2);
      let lat = deg(Math.atan2(z,Math.hypot(x,y)));
      let lon = deg(Math.atan2(y,x));
      if (prevLon !== undefined) lon = prevLon + ((((lon - prevLon) + 180) % 360 + 360) % 360) - 180;
      prevLon = lon;
      return [lat, lon];
    });
  }

  const arcPoints = arc(meCoords, alignToSameWorld(meCoords, targetCoords));
  const path = L.polyline([], { color: "#f04", weight: 4, dashArray: 7 }).addTo(map);

  function drawArcSmoothly(polyline, points, duration = 1000) {
    let start = null;

    function frame(time) {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const count = Math.max(1, Math.floor(progress * points.length));
      polyline.setLatLngs(points.slice(0, count));
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  L.marker([meCoords.lat, meCoords.lon], { icon: icon("me") }).addTo(map);
  L.marker([alignToSameWorld(meCoords, targetCoords).lat, alignToSameWorld(meCoords, targetCoords).lon], { icon: icon("target") }).addTo(map);

  map.flyToBounds(L.latLngBounds([
    [meCoords.lat, meCoords.lon],
    [alignToSameWorld(meCoords, targetCoords).lat,
    alignToSameWorld(meCoords, targetCoords).lon]
  ]), { padding: [32, 32], duration: 1.5 });

  map.once("moveend", () => {
    map.setZoom(Math.min(map.getZoom(), 7));
    drawArcSmoothly(path, arcPoints, 800);
  });

  const a =
    Math.sin(rad(targetCoords.lat - meCoords.lat) / 2) ** 2 +
    Math.cos(rad(meCoords.lat)) * Math.cos(rad(targetCoords.lat)) *
    Math.sin(rad(targetCoords.lon - meCoords.lon) / 2) ** 2;
  leafletMapDistance.value = Math.round(2 * 6371 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toLocaleString();
})();

// Local Time
const updateLocalTime = () => localTime.value = (new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Berlin", hour12: false })).format(new Date());
setInterval(updateLocalTime, 1000);
updateLocalTime();

// GitHub Activity
(async () => {
  const response = await fetch("https://api.github.com/users/Alexander-499/repos");
  if (!response.ok) return;
  const data = await response.json();
  localStorage.setItem("githubRepoData", JSON.stringify(
    data.map(repo => Object.fromEntries(Object.entries(repo).filter(([key]) => ["name", "html_url", "description", "language", "stargazers_count", "forks_count", "updated_at"].includes(key))))
      .map(repo => ({ ...repo, updated_at_ts: Date.parse(repo.updated_at) }))
      .sort((a, b) => b.updated_at_ts - a.updated_at_ts)
      .slice(0, 5)
  ));

  const githubRepoData = JSON.parse(localStorage.getItem("githubRepoData"));
  githubRepoData.forEach(repo =>
    githubRecentRepos.value.push({
      url: repo.html_url,
      description: repo.description,
      language: repo.language ? `(${repo.language})` : undefined,
      name: repo.name,
      stars: repo.stargazers_count ?? 0
    })
  );
})();

// Abacus Counter
function abacusAddTextParticle(text) {
  const particle = {
    id: crypto.randomUUID(),
    text,
    x: Math.random() * 100,
    y: Math.random() * 100
  }

  setTimeout(() => {
    abacusTextParticles.value.push(particle);
  }, 0);
  setTimeout(() => abacusTextParticles.value = abacusTextParticles.value.filter(p => p.id !== particle.id), 2000);
}

export async function abacusButton(type) {
  const response = await fetch(`https://abacus.jasoncameron.dev/${type}/alexander499.de/counter-button`);
  if (!response.ok) return abacusAddTextParticle("Wait a bit!");
  abacusButtonClicks.value = (await response.json()).value;
  if (type === "hit") abacusAddTextParticle("+1");
}

fetch("https://abacus.jasoncameron.dev/hit/alexander499.de/pageviews")
  .then(r => r.json())
  .then(data => abacusVisitCount.value = data.value);

abacusButton("get");