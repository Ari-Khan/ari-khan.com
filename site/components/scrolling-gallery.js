class ScrollingGallery extends HTMLElement {
	constructor(){
		super()
		this.speed = 400
		this.paused = false
		this.offset = 0
	}

	connectedCallback(){
		this.innerHTML = `
			<div class="scrolling-gallery">
				<div class="scrolling-track">
					${this.items()}
				</div>
			</div>
		`
		this.track = this.querySelector('.scrolling-track')
		this.waitForMedia()
	}

	items(){
		return `
			<img src="/assets/images/gallery/gallery-1.webp">
			<img src="/assets/images/gallery/gallery-2.webp">
			<img src="/assets/images/gallery/gallery-3.webp">
			<img src="/assets/images/gallery/gallery-4.webp">
			<video autoplay loop muted>
				<source src="/assets/images/gallery/video-1.mp4" type="video/mp4">
			</video>
			<img src="/assets/images/gallery/gallery-5.webp">
			<img src="/assets/images/gallery/gallery-6.webp">
			<img src="/assets/images/gallery/gallery-7.webp">
			<img src="/assets/images/gallery/gallery-8.webp">
			<img src="/assets/images/gallery/gallery-9.webp">
			<video autoplay loop muted>
				<source src="/assets/images/gallery/video-2.mp4" type="video/mp4">
			</video>
			<img src="/assets/images/gallery/gallery-10.webp">
			<img src="/assets/images/gallery/gallery-11.webp">
			<img src="/assets/images/gallery/gallery-12.webp">
		`
	}

	waitForMedia(){
		const media = this.querySelectorAll('img, video')
		let loaded = 0
		const done = () => {
			loaded++
			if (loaded === media.length) this.start()
		}
		media.forEach(el => {
			if ((el.tagName === 'IMG' && el.complete) ||
			    (el.tagName === 'VIDEO' && el.readyState >= 2)) {
				done()
			} else {
				el.addEventListener('load', done, { once: true })
				el.addEventListener('loadeddata', done, { once: true })
			}
		})
	}

	start(){
		let last = 0

		const step = (t) => {
			if (!last) last = t
			const dt = (t - last) / 1000
			last = t

			if (!this.paused) {
				this.offset -= this.speed * dt
				this.recycle()
				this.track.style.transform = `translateX(${this.offset}px)`
			}

			requestAnimationFrame(step)
		}

		requestAnimationFrame(step)
	}

	recycle(){
		const first = this.track.firstElementChild
		if (!first) return

		const firstWidth = first.getBoundingClientRect().width
		const gap = parseFloat(getComputedStyle(this.track).gap) || 0

		if (-this.offset >= firstWidth + gap) {
			this.offset += firstWidth + gap
			this.track.appendChild(first)
		}
	}

	toggle(){
		this.paused = !this.paused
	}
}

customElements.define('scrolling-gallery', ScrollingGallery)

document.addEventListener('keydown', e => {
	if (e.code === 'Space') {
		e.preventDefault()
		document.querySelectorAll('scrolling-gallery')
			.forEach(g => g.toggle())
	}
})
