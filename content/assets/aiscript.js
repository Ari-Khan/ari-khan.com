// Function to handle the Enter key press and send the message
async function sendMessage(event) {
    if (event.key === 'Enter') {
        const inputText = document.getElementById('inputBox').value;

        if (inputText.trim() !== "") {
            // Display the user's message in the scroll box
            const userMessage = document.createElement('p');
            userMessage.innerHTML = `<strong>You: </strong> ${inputText} <br><br>`;
            document.getElementById('scrollBox').appendChild(userMessage);

            // Clear the input box
            document.getElementById('inputBox').value = "";

            // Scroll to the bottom of the scroll box
            const scrollBox = document.getElementById('scrollBox');
            scrollBox.scrollTop = scrollBox.scrollHeight;

            // Send the message to the serverless backend
            try {
                const response = await fetch('https://ari-khan.vercel.app/content/ai', { // Replace with your deployed backend URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: inputText })
                });

                const data = await response.json();
                if (data.response) {
                    const htmlResponse = marked.parse(data.response);

                    const botResponse = document.createElement('div'); // Use <div> for richer content
                    botResponse.innerHTML = `<strong>KingBot:</strong> ${htmlResponse.trim()} <br><br>`;
                    document.getElementById('scrollBox').appendChild(botResponse);

                    scrollBox.scrollTop = scrollBox.scrollHeight;
                }
            } catch (error) {
                console.error("Error:", error);
                const errorMessage = document.createElement('p');
                errorMessage.textContent = "Error: Could not get a response from KingBot.";
                document.getElementById('scrollBox').appendChild(errorMessage);

                // Scroll to the bottom of the scroll box
                scrollBox.scrollTop = scrollBox.scrollHeight;
            }
        }
    }
}

// Attach the sendMessage function to the input box
document.getElementById('inputBox').addEventListener('keydown', sendMessage);