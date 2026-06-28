{
  const d = 200
  const html = document.documentElement

  const fadeIn = () => {
    html.style.transition = `opacity ${d}ms ease`
    html.style.opacity = '1'
  }

  const fadeOut = (cb) => {
    html.style.transition = `opacity ${d}ms ease`
    html.style.opacity = '0'
    setTimeout(cb, d)
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(fadeIn)
  })

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="/"]')
    if (!link || link.target) return
    const path = new URL(link.href).pathname
    if (path === location.pathname) {
      e.preventDefault()
      fadeOut(fadeIn)
      return
    }
    e.preventDefault()
    fadeOut(() => { location.href = link.href })
  })
}
