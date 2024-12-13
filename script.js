const galleries = document.querySelectorAll('.gallery-content, .gallery-content2');

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();

        const isPaused = galleries[0].style.animationPlayState === 'paused';
        galleries.forEach(gallery => {
            gallery.style.animationPlayState = isPaused ? 'running' : 'paused';
        });
    }
});
