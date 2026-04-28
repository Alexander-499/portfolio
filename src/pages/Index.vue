<script setup>
import { hackatimeLanguages, hackatimeTotalTime, leafletMapDistance, localTime, githubRecentRepos, abacusVisitCount, abacusButtonClicks, abacusTextParticles, abacusButton, toolsCurrentDockIcon } from "@/composables/useHome.js"
import { t } from "@/scripts/i18n.js";
</script>

<template>
  <strong style="font-size: 14px;">NOTE: THIS WEBSITE IS FAR FROM FINISHED. THERE ARE PROBLEMS WITH RESPONSIVENESS, FUNCTIONALITY AND COMPLETENESS!</strong>
  <section class="top">
    <h1 class="emoji">🌆</h1>
    <h1 class="main-heading">
      <span class="tag">&lt;h1&gt;</span>
      <span class="hey">Heyy, I'm Alexander</span>
      <span class="tag">&lt;/h1&gt;</span>
    </h1>
    <div class="divider"></div>
    <p><span v-html="t('aboutText').value"></span> ✌🏼💕</p>
    <ul class="links gb-wrapper">
      <li><a href="https://github.com/Alexander-499" target="_blank"><img src="https://cdn.simpleicons.org/github/aaa" alt draggable="false"></a></li>
      <li><a href="https://discord.gg/XGxBGrJjkA" target="_blank"><img src="https://cdn.simpleicons.org/discord/aaa" alt draggable="false"></a></li>
      <li><a href="mailto:alexander499gg@gmail.com" target="_blank"><img src="https://cdn.simpleicons.org/gmail/aaa" alt draggable="false"></a></li>
      <li><a href="https://www.youtube.com/@Alexander499_" target="_blank"><img src="https://cdn.simpleicons.org/youtube/aaa" alt draggable="false"></a></li>
    </ul>
    <h2>{{ t("stack") }}</h2>
    <div class="stack">
      <div class="gb-wrapper">
        <div v-for="tool in [
          { 'name': 'HTML', 'url': 'https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg' },
          { 'name': 'CSS', 'url': 'https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg' },
          { 'name': 'JavaScript', 'url': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg' },
          { 'name': 'Sassy CSS', 'url': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg' },
          { 'name': 'Node.js', 'url': 'https://www.svgrepo.com/show/354119/nodejs-icon.svg' },
          { 'name': 'Electron', 'url': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg' },
          { 'name': 'Capacitor', 'url': 'https://www.svgrepo.com/show/353536/capacitorjs-icon.svg' },
          { 'name': 'Java', 'url': 'https://www.svgrepo.com/show/452234/java.svg' },
          { 'name': 'Scratch', 'url': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Scratch_S.svg' },
          { 'name': 'npm', 'url': 'https://static-production.npmjs.com/c426a1116301d1fd178c51522484127a.png' },
          { 'name': 'Vue', 'url': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg' },
          { 'name': 'Firebase', 'url': 'https://files.brandlogos.net/svg/sbXzVXnLZr/firebase-icon-logo-brandlogos.net_jvd6h29s8.svg' },
          { 'name': 'Git', 'url': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg' },
          { 'name': 'Hugo', 'url': 'https://gohugo.io/favicon-32x32.png' },
          { 'name': 'Tauri', 'url': 'https://iili.io/fMmTiTN.png' },
          { 'name': 'Socket.IO', 'url': 'https://socket.io/images/logo-dark.svg' }
        ]"><img :src="tool.url">{{ tool.name }}</div>
      </div>
    </div>
    <div class="hackatime-stats">
      <div class="gb">
        <div
          v-for="language in hackatimeLanguages"
          :class="{ white: !language.color }"
          :style="{ width: `${language.percentage}%`, backgroundColor: language.color ? language.color : 'black' }"
          :title="`${language.name} - ${language.percentage}%`"
        >
          {{ language.percentage > 10 ? language.name : "" }}
        </div>
      </div>
    </div>
  </section>
  <section class="highlights">
    <div class="gb map">
      <div class="header">
        <span><IconMap/>Map</span>
        <span>
          <IconInfo/>
          <div><p>Made using <a href="https://ipapi.co">ipapi</a>, <a href="https://leafletjs.com">Leaflet</a> and <a href="https://carto.com">Carto</a>. Idea by <a href="https://www.joshwcomeau.com">Josh W Comeau</a>.</p></div>
        </span>
      </div>
      <div class="main">
        <div id="map"></div>
        <p>I'm from <span>Germany</span>, roughly <span>{{ leafletMapDistance }}km</span> away from your current location, according to your IP address.<br>It is currently <span>{{ localTime }}</span> for me.</p>
        <small>My Location is approximate. The red line represents the fastest way to travel between both points (airplane route).</small>
      </div>
    </div>
    <div class="gb counter">
      <div class="header absolute">
        <span>
          <IconInfo/>
          <div><p>Made using <a href="https://abacus.jasoncameron.dev">Abacus</a>. Idea by <a href="https://jasoncameron.dev">Jason Cameron</a>.</p></div>
        </span>
      </div>
      <div class="main">
        <span class="button-clicks">{{ abacusButtonClicks ? abacusButtonClicks : "&ndash;" }}</span>
        <button @click="abacusButton('hit')">Click me</button>
        <span>Page Views: {{ abacusVisitCount ? abacusVisitCount : "&ndash;" }}</span>
        <small>Max 30 Clicks / 10 Secs</small>
      </div>
      <span v-for="particle in abacusTextParticles" :key="particle.id" class="text-particle" :style="{
        top: `${particle.y}%`,
        left: `${particle.x}%`,
        translate: `-${particle.x}% -${particle.y}%`
      }">{{ particle.text }}</span>
    </div>
    <div id="tools" class="gb tools">
      <div class="header">
        <span><IconAppWindowMac/>Tools</span>
      </div>
      <div class="main">
        <div id="dock" class="dock">
          <ul>
            <li v-for="(tool, i) in [
              { name: 'vscode', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg' },
              { name: 'intellij-idea', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/IntelliJ_IDEA_Icon.svg' },
              { name: 'android-studio', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Android_Studio_icon_%282023%29.svg' },
              { name: 'github', url: 'https://github.githubassets.com/favicons/favicon-dark.svg' },
              { name: 'chrome', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg' },
              { name: 'powertoys', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/2020_PowerToys_Icon.svg' }
            ]" :style="{
              transform: `translateY(${Math.round((-10 * 0.6 ** Math.abs(toolsCurrentDockIcon[1]-i) ** 2) * 100) / 100}px)`,
              scale: Math.round((1 + 0.5 * 0.4 ** Math.abs(toolsCurrentDockIcon[1]-i)) * 100) / 100
            }" @pointerenter="toolsCurrentDockIcon = [tool.name, i]" @pointerleave="toolsCurrentDockIcon[1] = -6">
              <img :src="tool.url" draggable="false">
            </li>
          </ul>
        </div>
        <p v-show="toolsCurrentDockIcon[0] === 'vscode'">My primary IDE is <a href="https://code.visualstudio.com" target="_blank">Visual Studio Code</a>, because I like it being lightweight and so customizable.</p>
        <p v-show="toolsCurrentDockIcon[0] === 'intellij-idea'">For Minecraft modding (<a href="https://www.java.com" target="_blank">Java</a>) I use <a href="https://www.jetbrains.com/idea" target="_blank">IntelliJ Idea</a>. You can check out my mods on <a href="https://modrinth.com/user/Alexander499/mods" target="_blank">Modrinth</a>.</p>
        <p v-show="toolsCurrentDockIcon[0] === 'android-studio'">For building and testing Android applications I rely on <a href="https://developer.android.com/studio" target="_blank">Android Studio</a>. Check out <a href="https://zpeedometer.alexander499.de" target="_blank">Zpeedometer</a>!</p>
        <p v-show="toolsCurrentDockIcon[0] === 'github'">I use <a href="https://github.com" target="_blank">GitHub</a> for sharing and hosting my code with <a href="https://www.netlify.com" target="_blank">Netlify</a>. <a href="https://github.com/Alexander-499/portfolio" target="_blank">This portfolio</a> is also on there.</p>
        <p v-show="toolsCurrentDockIcon[0] === 'chrome'"><a href="https://www.google.com/chrome" target="_blank">Google Chrome</a> is my primary browser, used daily for both <a href="https://developer.chrome.com" target="_blank">development</a> and general browsing.</p>
        <p v-show="toolsCurrentDockIcon[0] === 'powertoys'">I use <a href="https://learn.microsoft.com/en-us/windows/powertoys" target="_blank">PowerToys</a> mainly for: <a href="https://learn.microsoft.com/en-us/windows/powertoys/always-on-top" target="_blank">always on top</a>, <a href="https://learn.microsoft.com/en-us/windows/powertoys/color-picker" target="_blank">color picker</a>, <a href="https://learn.microsoft.com/en-us/windows/powertoys/screen-ruler" target="_blank">screen ruler</a> and <a href="https://learn.microsoft.com/en-us/windows/powertoys/powerrename" target="_blank">PowerRename</a>.</p>
      </div>
    </div>
    <div class="gb recent-repos">
      <div class="header">
        <span><IconActivity/>Recent Repositories</span>
        <span>
          <IconInfo/>
          <div><p>Made using <a href="https://docs.github.com/rest">GitHub REST API</a>. Idea by <a href="https://jasoncameron.dev">Jason Cameron</a>.</p></div>
        </span>
      </div>
      <div class="main">
        <div>
          <a v-for="repo in githubRecentRepos" :href="repo.url" target="_blank" :title="`${repo.description} ${repo.language ? `(${repo.language})` : ''}`">
            <span>{{ repo.name }}</span>
            <span class="description">{{ repo.description }}</span>
            <span v-if="repo.stars > 0" class="stars">{{ repo.stars }}&starf;</span>
          </a>
        </div>
        <span><a href="https://github.com/Alexander-499" target="_blank">View on GitHub</a> &centerdot; <b>{{ t("totalCodingTime") }}</b> {{ hackatimeTotalTime }}</span>
      </div>
    </div>
    <div class="cat">
      <video autoplay loop muted playsinline preload="metadata">
        <source src="/assets/videos/cat.webm" type="video/webm">
      </video>
    </div>
    <div class="gb zpeedometer">
      <div class="header">
        <span><img src="https://zpeedometer.alexander499.de/assets/images/favicon.svg">Zpeedometer</span>
      </div>
      <div class="main">
        <img src="/assets/images/zpeedometer-iphone.png" alt="Zpeedometer on iPhone">
        <p>
          This is my elegant-looking GPS speedometer app showing speed, altitude, heading, distance & more. I build it using
          <em><img src="https://www.svgrepo.com/show/353536/capacitorjs-icon.svg">Capacitor</em>
          and
          <em><img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg">Vue</em>.
        </p>
        <div>
          <a href="https://zpeedometer.alexander499.de" target="_blank">Website<IconSquareArrowOutUpRight/></a>
          <a href="https://play.google.com/store/apps/details?id=com.alexander499.zpeedometer" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_Play_2022_icon.svg">Download</a>
          <a href="https://discord.gg/rJJSueZauD" target="_blank"><img src="https://cdn.simpleicons.org/discord/white">Community</a>
        </div>
      </div>
    </div>
    <div class="gb functions">
      <div class="header">
        <span><IconChartSpline/>Functions</span>
        <span>
          <IconInfo/>
          <div><p>Made using <a href="https://mauriciopoppe.github.io/function-plot">function-plot</a>.</p></div>
        </span>
      </div>
      <div class="main">
        <div id="functionsCanvas"></div>
        <input id="functionsFunctionInput" type="text" value="sin(x)" placeholder="x^2">
        <div>
          <button id="functionsRandomizeButton"><IconDices/>Randomize</button>
          <button id="functionsPlayButton"><IconPlay/>Play Sound</button>
        </div>
        <p>Input any* function and listen to it! (/&GreaterFullEqual;&bigtriangledown;&LessFullEqual;)/</p>
      </div>
    </div>
  </section>
  <section class="projects selected">
    <h1 class="heading-lines">{{ t("projectsTitle") }}</h1>
    <div>
      <a href="https://zpeedometer.alexander499.de" data-release-stage="beta">
        <div id="project1" class="letters"></div>
        <div class="gradient orange"></div>
        <h2>Zpeedometer<span>{{ t("projectDescriptions.zpeedometer") }}</span></h2>
      </a>
      <a href="p/fluidftp" data-release-stage="alpha">
        <div id="project2" class="letters"></div>
        <div class="gradient cyan"></div>
        <h2>FluidFTP<span>{{ t("projectDescriptions.fluidftp") }}</span></h2>
      </a>
      <a href="https://ccr.alexander499.de#about" data-release-stage="beta">
        <div id="project3" class="letters"></div>
        <div class="gradient pink"></div>
        <h2>City Country River<span>{{ t("projectDescriptions.cityCountryRiver") }}</span></h2>
      </a>
      <img id="projectsHoverImage">
    </div>
    <a href="javascript:document.getElementById('allProjects').scrollIntoView({ behavior: 'smooth' });">
      <span class="text"><span v-for="i in 2">{{ t("allProjects") }}</span></span>
      <span class="arrow"><IconArrowUpRight/><IconArrowUpRight/></span>
    </a>
  </section>
  <!-- <div class="youtube-stats">
    <h1 class="heading-lines">YouTube Stats</h1>
    <div>
      <div><p id="youtubeSubscribers" class="counter"></p><span>{{ t("subscribers") }}</span></div>
      <div class="divider"></div>
      <div><p id="youtubeViews" class="counter"></p><span>{{ t("views") }}</span></div>
      <div class="divider"></div>
      <div><p id="youtubeVideoCount" class="counter"></p><span>{{ t("videos") }}</span></div>
    </div>
  </div> -->
  <section id="allProjects" class="projects">
    <h1 class="heading-lines">{{ t("allProjectsTitle") }}</h1>
    <div>
      <a href="https://zpeedometer.alexander499.de" data-release-stage="beta">
        <h2>Zpeedometer<span>{{ t("projectDescriptions.zpeedometer") }}</span></h2>
      </a>
      <a href="p/fluidftp" data-release-stage="alpha">
        <h2>FluidFTP<span>{{ t("projectDescriptions.fluidftp") }}</span></h2>
      </a>
      <a href="https://ccr.alexander499.de#about" data-release-stage="beta">
        <h2>City Country River<span>{{ t("projectDescriptions.cityCountryRiver") }}</span></h2>
      </a>
      <a href="https://alexander-499.github.io/binary-counter">
        <h2>Binary Counter</h2>
      </a>
      <a href="https://alexander-499.github.io/language-editor">
        <h2>Language Editor</h2>
      </a>
      <a href="https://github.com/Alexander-499/auto-bongo">
        <h2>Auto Bongo</h2>
      </a>
      <a href="https://alexander-499.github.io/eclipse" data-release-stage="alpha">
        <h2>Eclipse</h2>
      </a>
    </div>
  </section>
</template>

<style scoped src="@/styles/pages/index.css"></style>