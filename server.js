const express = require('express');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Save uploads to ./uploads directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.webm`); // Save as .webm initially
    }
});

const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle file upload
app.post('/upload', upload.single('audio'), (req, res) => {
    const webmFilePath = req.file.path;
    const mp3FilePath = webmFilePath.replace('.webm', '.mp3');

    // Convert .webm to .mp3 using ffmpeg
    ffmpeg(webmFilePath)
        .toFormat('mp3')
        .on('end', () => {
            console.log('Conversion to MP3 completed');
            res.send('File uploaded and converted to MP3 successfully');
        })
        .on('error', (err) => {
            console.error('Error during conversion: ', err);
            res.status(500).send('Error during conversion');
        })
        .save(mp3FilePath);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

