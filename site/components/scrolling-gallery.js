class ScrollingGallery extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="scrolling-gallery">
        <div class="gallery-content">
          ${this.galleryItems()}
        </div>
        <div class="gallery-content gallery-duplicate">
          ${this.galleryItems()}
        </div>
      </div>
    `;
  }

  galleryItems() {
    return `
      <img src="/assets/images/gallery/gallery-1.webp" alt="">
      <img src="/assets/images/gallery/gallery-2.webp" alt="">
      <img src="/assets/images/gallery/gallery-3.webp" alt="">
      <img src="/assets/images/gallery/gallery-4.webp" alt="">
      <video autoplay loop muted controls>
        <source src="/assets/images/gallery/video-1.mp4" type="video/mp4">
      </video>
      <img src="/assets/images/gallery/gallery-5.webp" alt="">
      <img src="/assets/images/gallery/gallery-6.webp" alt="">
      <img src="/assets/images/gallery/gallery-7.webp" alt="">
      <img src="/assets/images/gallery/gallery-8.webp" alt="">
      <img src="/assets/images/gallery/gallery-9.webp" alt="">
      <video autoplay loop muted controls>
        <source src="/assets/images/gallery/video-2.mp4" type="video/mp4">
      </video>
      <img src="/assets/images/gallery/gallery-10.webp" alt="">
      <img src="/assets/images/gallery/gallery-11.webp" alt="">
      <img src="/assets/images/gallery/gallery-12.webp" alt="">
    `;
  }
}

customElements.define("scrolling-gallery", ScrollingGallery);
