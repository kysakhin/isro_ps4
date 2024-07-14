let mediaRecorder;
let audioChunks = [];

document.getElementById('recordButton').addEventListener('click', startRecording);
document.getElementById('stopButton').addEventListener('click', stopRecording);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = document.getElementById('audioPlayback');
            audio.src = audioUrl;

            // Upload the audioBlob to the server
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            audioChunks = [];
        };

        mediaRecorder.start();
        document.getElementById('recordButton').disabled = true;
        document.getElementById('stopButton').disabled = false;
    } catch (err) {
        console.error('Error starting recording: ', err);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        document.getElementById('recordButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
    } else {
        console.warn('MediaRecorder is not active or already stopped');
    }
}



var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
