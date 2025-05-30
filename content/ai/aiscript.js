// Helper functions to manage chat history in localStorage
function getChatHistory() {
    const history = localStorage.getItem('kingbot-history');
    return history ? JSON.parse(history) : [];
}

function addToChatHistory(role, message) {
    const history = getChatHistory();
    history.push({ role, message });
    localStorage.setItem('kingbot-history', JSON.stringify(history));
}

function displayMessage(role, message) {
    const container = document.getElementById('scrollBox');
    const msgElem = document.createElement('div');
    msgElem.innerHTML = `<strong>${role}:</strong> ${marked.parse(message.trim())}<br><br>`;
    container.appendChild(msgElem);
    container.scrollTop = container.scrollHeight;
}

// Load history when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const history = getChatHistory();
    history.forEach(msg => {
        displayMessage(msg.role === 'user' ? 'You' : 'KingBot', msg.message);
    });
});

// Function to handle the Enter key press and send the message
async function sendMessage(event) {
    if (event.key === 'Enter') {
        const inputBox = document.getElementById('inputBox');
        const inputText = inputBox.value.trim();
        if (inputText === '') return;

        // Display user's message
        displayMessage('You', inputText);
        addToChatHistory('user', inputText);
        inputBox.value = '';

        // Get full history to send to backend
        const history = getChatHistory();

        try {
            const response = await fetch('https://ari-khan.vercel.app/content/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: inputText,
                    history: history.map(h => ({ role: h.role === 'user' ? 'user' : 'bot', message: h.message }))
                })
            });

            const data = await response.json();

            if (data.response) {
                const botReply = data.response;
                displayMessage('KingBot', botReply);
                addToChatHistory('bot', botReply);
            } else {
                throw new Error("No response field in result");
            }
        } catch (error) {
            console.error("Error:", error);
            displayMessage('KingBot', "Error: Could not get a response from KingBot.");
        }
    }
}

// Attach the sendMessage function to the input box
document.getElementById('inputBox').addEventListener('keydown', sendMessage);
