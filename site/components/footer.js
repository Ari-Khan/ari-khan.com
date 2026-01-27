class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-container">
          <div class="logo-container">
            <a class="bottom-logo" href="/">Ari Khan</a>
          </div>

          <ul class="links-grid">
            <li><a href="https://github.com/Ari-Khan">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/ari-khan-7383a5324/">LinkedIn</a></li>
            <li><a href="https://www.youtube.com/@AriKhan1">YouTube</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="https://ko-fi.com/arikhan">Donate</a></li>
            <li><a href="https://github.com/Ari-Khan/ari-khan.com">Repository</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
          </ul>
        </div>

        <div class="thin-line"></div>
        <p>&copy; 2026 Ari Khan. All rights reserved. | <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="hover-underline">CC BY-NC-SA 4.0</a></p>
      </footer>
    `;
  }
}

customElements.define("site-footer", Footer);
