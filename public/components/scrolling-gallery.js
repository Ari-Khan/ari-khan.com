class ScrollingGallery extends HTMLElement {
	constructor(){
		super()
		this.speed = 500

		this.currentSpeed = 0
		this.targetSpeed = this.speed
		this.accel = 1500

		this.paused = false
		this.offset = 0
	}

	connectedCallback(){
		fetch('/images/gallery/manifest.json')
			.then(res => {
				if (!res.ok) throw new Error('Failed to load gallery manifest')
				return res.json()
			})
			.then(items => {
				this.innerHTML = `
					<div class="scrolling-gallery">
						<div class="scrolling-track">
							${items.map(item =>
								item.type === 'video'
									? `<video autoplay loop muted playsinline><source src="${item.src}" type="video/mp4"></video>`
									: `<img src="${item.src}">`
							).join('')}
						</div>
					</div>
				`
				this.track = this.querySelector('.scrolling-track')
				this.waitForMedia()
			})
			.catch(err => {
				console.error('Gallery error:', err)
			})
	}

	waitForMedia(){
		const media = this.querySelectorAll('img, video')
		let loaded = 0
		const done = () => {
			loaded++
			if (loaded === media.length) this.start()
		}
		
		// Fallback timeout - start animation after 3 seconds regardless
		const timeout = setTimeout(() => {
			if (loaded < media.length) {
				console.warn(`Gallery started with ${loaded}/${media.length} items loaded`)
				this.start()
			}
		}, 3000)
		
		media.forEach(el => {
			if ((el.tagName === 'IMG' && el.complete) ||
			    (el.tagName === 'VIDEO' && el.readyState >= 2)) {
				done()
			} else {
				el.addEventListener('load', () => {
					clearTimeout(timeout)
					done()
				}, { once: true })
				el.addEventListener('loadeddata', () => {
					clearTimeout(timeout)
					done()
				}, { once: true })
				el.addEventListener('error', () => {
					clearTimeout(timeout)
					done()
				}, { once: true })
			}
		})
	}

	start(){
		let last = 0

		const step = (t) => {
			if (!last) last = t
			const dt = (t - last) / 1000
			last = t

			const diff = this.targetSpeed - this.currentSpeed
			this.currentSpeed += diff * Math.min(1, this.accel * dt / this.speed)

			if (Math.abs(this.currentSpeed) > 0.1) {
				this.offset -= this.currentSpeed * dt
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
		this.targetSpeed = this.paused ? 0 : this.speed
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
