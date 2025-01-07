// aiscript.js
function generateImage(event) {
    if (event.key === "Enter") { // Check if Enter key is pressed
      const prompt = document.getElementById("imageTextBox").value.trim(); // Get the input text
  
      if (prompt) {
        const width = 1024;
        const height = 700;
        const seed = Math.floor(Math.random() * 100000); // Generate a random seed
        const model = "flux-pro"; // Model name
  
        // Construct the image URL
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&width=${width}&height=${height}&nologo=true&private=true&enhance=true&seed=${seed}&safe=true`;
        
        // Get the image container
        const imageBox = document.getElementById("imageBox");
        if (!imageBox) {
          console.error("Error: imageBox element not found in the DOM.");
          return;
        }

        document.getElementById('imageTextBox').value = "";

        // Remove existing image if any
        imageBox.innerHTML = "";

        const spinnerContainer = document.createElement("div");
            spinnerContainer.classList.add("spinner-container");

        const spinner = document.createElement("div");
            spinner.classList.add("spinner");
            spinnerContainer.appendChild(spinner);
            imageBox.appendChild(spinnerContainer);
  
        // Create a new image element
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Generated image for: ${prompt}`;
        img.style.maxWidth = "100%"; // Ensure it fits the container
        img.style.border = "1px solid #ccc";
        img.style.borderRadius = "20px";

        img.onload = function() {
            // Remove the spinner
            imageBox.removeChild(spinnerContainer);
            // Append the image to the container
            imageBox.appendChild(img);
        };

      } else {
        alert("Please enter a prompt!");
      }
    }
  }  

document.getElementById('imageTextBox').addEventListener('keydown', sendMessage);