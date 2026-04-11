// Shared nav + footer HTML and shared CSS — included inline in each page
const NAV = `
<nav id="top-nav">
  <a href="index.html" class="nav-logo">
    <img src="https://images.squarespace-cdn.com/content/v1/65440d9b96a095033228c2f3/463757f4-1137-4896-b8fb-007204244ae4/IAR+Logo+Main_Light.png?format=300w" alt="I Am Redemption">
  </a>
  <ul class="nav-links">
    <li><a href="index.html">Home</a></li>
    <li><a href="where-you-stand.html">Where You Stand</a></li>
    <li><a href="podcast.html">Podcast</a></li>
    <li><a href="community.html">Community</a></li>
    <li><a href="impact.html">Impact</a></li>
    <li><a href="speaking.html">Speaking</a></li>
    <li><a href="merch.html">Merch</a></li>
    <li><a href="https://iamredemption.com/donate" class="nav-cta">Donate</a></li>
  </ul>
  <div class="nav-hamburger" onclick="toggleMenu()">
    <span></span><span></span><span></span>
  </div>
</nav>`;
