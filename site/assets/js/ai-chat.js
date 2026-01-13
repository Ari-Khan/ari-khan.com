let pendingBotUndo = false;
let repromptTimeout = null;
let thinkingElem = null;

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

function clearMessages() {
    localStorage.removeItem('kingbot-history');
    document.getElementById('scrollBox').innerHTML = '';
}

function deleteLastMessage() {
    const container = document.getElementById('scrollBox');
    const history = getChatHistory();

    if (history.length === 0) return;

    const last = history.pop();
    localStorage.setItem('kingbot-history', JSON.stringify(history));

    const children = Array.from(container.children);
    if (children.length > 0) {
        container.removeChild(children[children.length - 1]);
    }

    if (last.role === 'bot') {
        pendingBotUndo = true;

        if (repromptTimeout) clearTimeout(repromptTimeout);
        repromptTimeout = setTimeout(() => {
            if (pendingBotUndo) {
                pendingBotUndo = false;
                repromptLastPrompt();
            }
        }, 2000);
    } else {
        if (repromptTimeout) clearTimeout(repromptTimeout);
        pendingBotUndo = false;
    }
}

async function repromptLastPrompt() {
    const history = getChatHistory();
    const lastUserMsg = [...history].reverse().find(msg => msg.role === 'user');
    if (!lastUserMsg) return;

    const container = document.getElementById('scrollBox');
    thinkingElem = document.createElement('div');
    thinkingElem.innerHTML = `<strong>KingBot:</strong> <em>...</em><br><br>`;
    container.appendChild(thinkingElem);
    container.scrollTop = container.scrollHeight;

    try {
        const response = await fetch('/content/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: lastUserMsg.message,
                history: history.map(h => ({
                    role: h.role === 'user' ? 'user' : 'bot',
                    message: h.message
                }))
            })
        });

        const data = await response.json();

        if (data.response) {
            thinkingElem.remove();
            thinkingElem = null;

            displayMessage('KingBot', data.response);
            addToChatHistory('bot', data.response);
        }
    } catch (error) {
        console.error("Reprompt error:", error);
        if (thinkingElem) {
            thinkingElem.remove();
            thinkingElem = null;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getChatHistory().forEach(msg => {
        displayMessage(msg.role === 'user' ? 'You' : 'KingBot', msg.message);
    });
});

window.sendMessage = async function (event) {
    if (event.key !== 'Enter') return;

    const inputBox = document.getElementById('inputBox');
    const inputText = inputBox.value.trim();
    if (!inputText) return;

    displayMessage('You', inputText);
    addToChatHistory('user', inputText);
    inputBox.value = '';

    const container = document.getElementById('scrollBox');
    thinkingElem = document.createElement('div');
    thinkingElem.innerHTML = `<strong>KingBot:</strong> <em>...</em><br><br>`;
    container.appendChild(thinkingElem);
    container.scrollTop = container.scrollHeight;

    const history = getChatHistory();
    let cancelled = false;

    const observer = new MutationObserver(() => {
        if (!container.contains(thinkingElem)) {
            cancelled = true;
            observer.disconnect();
            pendingBotUndo = false;
            if (repromptTimeout) clearTimeout(repromptTimeout);
        }
    });
    observer.observe(container, { childList: true });

    try {
        const response = await fetch('/content/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: inputText,
                history: history.map(h => ({
                    role: h.role === 'user' ? 'user' : 'bot',
                    message: h.message
                }))
            })
        });

        const data = await response.json();

        if (!cancelled && data.response) {
            thinkingElem.remove();
            thinkingElem = null;

            displayMessage('KingBot', data.response);
            addToChatHistory('bot', data.response);
        }
    } catch (error) {
        console.error("Send error:", error);
        if (!cancelled && thinkingElem) {
            thinkingElem.remove();
            thinkingElem = null;
        }
    }
};
