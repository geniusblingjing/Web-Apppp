window.onload = function() {
    const analyzeButton = document.getElementById('analyze-button');
    const generateImageButton = document.getElementById('generate-image-button');
    const dreamInput = document.getElementById('dream-input');
    const resultsContainer = document.getElementById('results-container');
    const loadingIndicator = document.getElementById('loadingIndicator'); // Access the loading indicator

    analyzeButton.addEventListener('click', async function() {
        const dreamDescription = dreamInput.value;
        const summary = generateSummary(dreamDescription); // Generates a summary for the dream
        const prompt = `Please provide a short creative analysis of the following dream: '${dreamDescription}'. Focus on symbolic meanings, emotions involved, and possible interpretations.`;
        loadingIndicator.style.display = 'block'; // Show the loading indicator
        const analysis = await analyzeDream(prompt); // Fetch the analysis
        loadingIndicator.style.display = 'none'; // Hide the loading indicator after fetching
        displayStructuredResults(summary, dreamDescription, analysis); // Display structured results instead of just analysis
    });
    
    function generateSummary(description) {
        // Placeholder function for generating a summary. Needs more sophisticated logic or an API.
        return description.slice(0, 50) + '...'; // Simplistic "summary"
    }
    
    function displayStructuredResults(summary, description, analysis) {
        // Updates the resultsContainer to show structured results
        resultsContainer.innerHTML = `
            <h2>Summary: ${summary}</h2>
            <p><strong>User's Description:</strong> ${description}</p>
            <p><strong>Creative Analysis:</strong> ${analysis}</p>
        `;
    }

    generateImageButton.addEventListener('click', async function() {
        const dreamDescription = dreamInput.value;
        loadingIndicator.style.display = 'block'; // Show the loading indicator
        const imageUrl = await generateImage(dreamDescription); // Fetch the image URL
        loadingIndicator.style.display = 'none'; // Hide the loading indicator after fetching
        displayImage(imageUrl); // Display the image
    });

    async function analyzeDream(prompt) {
        try {
            const response = await fetch('/api/gpt?prompt=' + encodeURIComponent(prompt), {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.text();
            return data;
        } catch (error) {
            console.error('Failed to fetch:', error);
            return 'Error: ' + error.message;
        }
    }
    
    async function generateImage(dreamDescription) {
        try {
            const response = await fetch('/generateImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dream: dreamDescription })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            return data.imageUrl; // Returns the generated image URL
        } catch (error) {
            console.error('Error:', error);
            return ''; // Return empty string in case of error
        }
    }

    function displayResults(analysis) {
        resultsContainer.innerHTML = `<p>${analysis}</p>`;
    }
    function displayStructuredResults(summary, description, analysis) {
        // Assuming analysis is a string with points separated by a specific delimiter, e.g., ';'
        const analysisPoints = analysis.split(';').map(point => `<div>${point.trim()}</div>`).join('');
        resultsContainer.innerHTML = `
            <div class="result-box">
                <h2>Summary: ${summary}</h2>
                <h2><strong>User's Description:</strong> ${description}</h2>
                <div class="analysis"><strong>Creative Analysis:</strong> ${analysisPoints}</div>
            </div>
        `;
    }
    
    

    function displayImage(imageUrl) {
        resultsContainer.innerHTML = `<img src="${imageUrl}" alt="Dream Image" />`;
    }
};
