function generateImage(event) {
    if (event.key === "Enter") {
      const prompt = document.getElementById("imageTextBox").value.trim();
  
      if (prompt) {
        if (window.innerHeight > window.innerWidth) {
            width = window.innerWidth * 0.65;
            height = window.innerHeight * 0.65;
        } else {
            width = window.innerWidth * 0.5;
            height = window.innerHeight * 0.68;
        }
        const seed = Math.floor(Math.random() * 100000);
        const model = "flux-pro";
  
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=${model}&width=${width}&height=${height}&nologo=true&private=true&enhance=true&seed=${seed}&safe=true`;
        
        const imageBox = document.getElementById("imageBox");
        if (!imageBox) {
          console.error("Error: imageBox element not found in the DOM.");
          return;
        }

        document.getElementById('imageTextBox').value = "";

        imageBox.innerHTML = "";

        const spinnerContainer = document.createElement("div");
            spinnerContainer.classList.add("spinner-container");

        const spinner = document.createElement("div");
            spinner.classList.add("spinner");
            spinnerContainer.appendChild(spinner);
            imageBox.appendChild(spinnerContainer);
  
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `Generated image for: ${prompt}`;
        img.style.maxWidth = "100%";
        img.style.border = "1px solid #ccc";
        img.style.borderRadius = "20px";

        img.onload = function() {
            imageBox.removeChild(spinnerContainer);
            imageBox.appendChild(img);
        };

      } else {
        alert("Please enter a prompt!");
      }
    }
  }  

document.getElementById('imageTextBox').addEventListener('keydown', sendMessage);