const env = require('dotenv').config();
const GoPro = require('goproh4');

const cam = new GoPro.Camera({
  mac: process.env.MAC
});

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
