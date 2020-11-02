const env = require('dotenv').config();
const GoPro = require('goproh4');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('common'));
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(helmet());
const port = process.env.PORT || 3001;
const cam = new GoPro.Camera({
  mac: process.env.MAC
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/capturePicture', (req, res) => {
  console.log('received capture video request');
  cam.mode(GoPro.Settings.Modes.Photo, GoPro.Settings.Submodes.Photo.Single)
    .then(() => {
      return cam.set(GoPro.Settings.PHOTO_RESOLUTION, GoPro.Settings.PhotoResolution.R12MPWide);
    })
    .then(() => {
      return cam.start();
    })
    .catch((err) => {
      console.log('err: ', err);
    });
  res.send('Capturing picture');
});

app.get('/captureVideo', (req, res) => {
  // Set camera mode
  cam.mode(GoPro.Settings.Modes.Video, GoPro.Settings.Submodes.Video.Video)
    // Set camera resolution
    .then(function () {
        return cam.set(GoPro.Settings.VIDEO_RESOLUTION, GoPro.Settings.VideoResolution.R1080S)
    })
    // Set camera framerate
    .then(function () {
        return cam.set(GoPro.Settings.VIDEO_FPS, GoPro.Settings.VideoFPS.F60)
    })
    // Begin recording
    .then(function () {
        console.log('[video]', 'started')
        return cam.start()
    })
    // Wait 5s
    .delay(5000)
    // Stop recording
    .then(function () {
        console.log('[video]', 'stopped')
        return cam.stop()
    })
    .catch((err) => {
      console.log('error:', err);
    });
  res.send('Capturing video');
});

app.get('/deleteLast', (req, res) => {
  console.log('received sleep request');
  cam.deleteLast();
  res.send('Deleting last item');
});

app.get('/sleep', (req, res) => {
  console.log('received sleep request');
  cam.powerOff();
  res.send('Powering off gropro');
});

app.get('/powerOn', (req, res) => {
  console.log('received power on request');
  cam.powerOn();
  res.send('Powering on gorpro');
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});