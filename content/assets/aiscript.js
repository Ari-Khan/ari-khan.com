// Function to handle the Enter key press and send the message
async function sendMessage(event) {
    if (event.key === 'Enter') {
        const inputText = document.getElementById('inputBox').value;

        // If there's text in the input box, proceed
        if (inputText.trim() !== "") {
            // Display the user's message in the scroll box
            const userMessage = document.createElement('p');
            userMessage.textContent = `You: ${inputText}`;
            document.getElementById('scrollBox').appendChild(userMessage);

            // Clear the input box
            document.getElementById('inputBox').value = "";

            // Scroll to the bottom of the scroll box
            const scrollBox = document.getElementById('scrollBox');
            scrollBox.scrollTop = scrollBox.scrollHeight;

            // Send the message to the backend via a POST request
            try {
                const response = await fetch('https://ari-khan.vercel.app/content/ai', {  // Replace with your deployed backend URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: inputText })
                });

                // Parse the response from the backend
                const data = await response.json();
                if (data.response) {
                    // Display Gemini's response
                    const botResponse = document.createElement('p');
                    botResponse.textContent = `KingBot: ${data.response}`;
                    document.getElementById('scrollBox').appendChild(botResponse);

                    // Scroll to the bottom of the scroll box
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

// Attach the sendMessage function to the input box for the Enter key press event
document.getElementById('inputBox').addEventListener('keydown', sendMessage);