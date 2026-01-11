class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav>
        <ul>
          <li><a class="logo" href="/">Ari Khan</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/ai">AI</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    `;
  }
}

customElements.define("site-header", Header);
