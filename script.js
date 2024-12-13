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

async function subscribe() {
    const email = document.getElementById('email').value;
    const messageEl = document.getElementById('message');

    if (!email || !email.includes('@')) {
        messageEl.innerText = "Please enter a valid email address containing '@'.";
        messageEl.style.color = "red";
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
            messageEl.innerText = result.message;
            messageEl.style.color = "green";
            document.getElementById('email').value = '';
        } else {
            messageEl.innerText = result.message || "Subscription failed!";
            messageEl.style.color = "red";
        }
    } catch (error) {
        console.error("Server Error:", error);
        messageEl.innerText = "Unable to connect to the server.";
        messageEl.style.color = "red";
    }
}

