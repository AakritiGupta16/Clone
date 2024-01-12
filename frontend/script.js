<script>
        // Speech Recognition Setup
        const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new speechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
    
        // Elements
        const speakButton = document.getElementById('speakBtn');
        const responseDiv = document.getElementById('response');
        const aiAudio = document.getElementById('aiAudio');
    
        // Event Listener for Speak Button
        speakButton.addEventListener('click', () => {
            recognition.start();
        });
    
        // Handling Speech Recognition Result
        recognition.onresult = async (event) => {
            const speechToText = event.results[0][0].transcript;
            try {
                // Send to Backend, which forwards to OpenAI API
                const aiResponse = await sendToBackend(speechToText, 'openai');
                responseDiv.textContent = aiResponse;
    
                // Send to Backend, which forwards to Play.ht for Speech Synthesis
                const audioUrl = await sendToBackend(aiResponse, 'playht');
                aiAudio.src = audioUrl;
                aiAudio.play();
            } catch (error) {
                console.error('Error:', error);
                responseDiv.textContent = 'Sorry, an error occurred.';
            }
        };
    
        // Function to Send Text to Backend
        async function sendToBackend(text, endpoint) {
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });
    
            const data = await response.json();
            return endpoint === 'openai' ? data.choices[0].message.content : data.audio_url;
        }
    </script>