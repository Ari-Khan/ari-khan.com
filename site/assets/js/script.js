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

const firstWords = ["Discover", "Explore", "Embrace", "Uncover", "Achieve", "Ari"];
const secondWords = ["Innovation", "Creativity", "Success", "Leadership", "Vision", "Khan"];
const colors = ["#FF5733", "#33FF57", "#1964FA", "#FF33A8", "#FAD700", "#1964FA"];
const fadeTextEl = document.getElementById('fade-text');

let index = 0;

function fadeEffect() {
  fadeTextEl.style.opacity = 0;

  setTimeout(() => {
    fadeTextEl.innerHTML = `<span>${firstWords[index]}</span> <span style="color: ${colors[index]};">${secondWords[index]}</span>`;
    fadeTextEl.style.opacity = 1;

    index = (index + 1) % secondWords.length;

    setTimeout(fadeEffect, 2000);
  }, 1000);
}

fadeEffect();
