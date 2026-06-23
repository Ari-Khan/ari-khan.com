{
  const d = 200
  const html = document.documentElement

  html.style.opacity = '0'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      html.style.transition = `opacity ${d}ms ease`
      html.style.opacity = '1'
    })
  })

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="/"]')
    if (!link || link.target) return
    e.preventDefault()
    html.style.transition = `opacity ${d}ms ease`
    html.style.opacity = '0'
    setTimeout(() => { location.href = link.href }, d)
  })
}
