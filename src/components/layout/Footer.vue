<template>
  <footer id="footer">
    <div>
      <div class="left">
        <RouterLink class="title" to="/">Alexander499</RouterLink>
        <p>&copy; 2026 Alexander499</p>
        <a href="https://ko-fi.com/alexander499"><b><i>Support me!</i></b></a>
      </div>
      <div class="right">
        <div>
          <ul>
            <li><b>Portfolio</b></li>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/blog">Blog</RouterLink></li>
            <li><img src="https://cdn.simpleicons.org/github/white"><a href="https://github.com/Alexander-499/portfolio" target="_blank">GitHub</a></li>
          </ul>
        </div>
        <div>
          <ul>
            <li><img src="https://cdn.simpleicons.org/gmail/white"><a href="mailto:alexander499gg@gmail.de">Email</a></li>
            <li><img src="https://cdn.simpleicons.org/youtube/white"><a href="https://www.youtube.com/@alexander499_">YouTube</a></li>
            <li><img src="https://cdn.simpleicons.org/tiktok/white"><a href="https://www.tiktok.com/@ac.alexander499">TikTok</a></li>
            <li><img src="https://cdn.simpleicons.org/discord/white"><a href="https://discord.gg/zB2PyHYu4T">Discord</a></li>
          </ul>
        </div>
        <div>
          <ul>
            <li><img src="https://cdn.simpleicons.org/scratch/white"><a href="https://scratch.mit.edu/users/Alexander499">Scratch</a></li>
            <li><img src="https://cdn.simpleicons.org/reddit/white"><a href="https://www.reddit.com/user/Alexander499_">Reddit</a></li>
            <li><img src="https://cdn.simpleicons.org/twitch/white"><a href="https://www.twitch.tv/alexander499tv">Twitch</a></li>
            <li><img src="https://cdn.simpleicons.org/x/white"><a href="https://x.com/Alexander499_">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div class="bottom">
        <p>Site made with 💝 using <a href="https://vuejs.org" target="_blank">Vue</a> and a few APIs running on <a href="https://www.netlify.com" target="_blank">Netlify</a>! </p>
      </div>
    </div>
  </footer>
</template>

<style>
footer {
  display: flex;
  justify-content: center;

  > div {
    width: min(880px, 75%);
    max-width: 1440px;
    display: grid;
    grid-template-columns: 224px 1fr;
    gap: 16px;
    color: var(--color-text-secondary);
    background-color: var(--color-bg-secondary);
    font-size: 14px;
    font-family: "JetBrains Mono";
    border: hsl(from var(--color-bg-tertiary) h s l / 0.5) solid;
    border-width: 1px 1px 0 1px;
    border-radius: 8px 8px 0 0;
    padding: 20px;
    margin: 20px 20px 0 20px;

    @media (width <= 760px) {
      display: flex;
      flex-direction: column;
    }

    .left {
      display: flex;
      flex-direction: column;

      a.title {
        font-size: 24px;
        font-family: Pacifico;
        text-decoration: none;
        margin-top: -8px;
      }
    }

    .right {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      
      @media (width <= 480px) { grid-template-columns: repeat(2, 1fr); }
      @media (width <= 320px) { grid-template-columns: 1fr; }

      > div {
        ul {
          display: flex;
          flex-direction: column;
          gap: 16px;
          list-style-type: none;

          li {
            display: flex;
            gap: 6px;

            b {  color: var(--color-text-primary); }

            img {
              height: 16px;
              width: 16px;
            }
          }
        }
      }
    }

    .bottom { grid-column: span 2; }
  }
}
</style>