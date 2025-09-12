const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const processVideo = (inputPath, outputDir, filename) => {
  return new Promise((resolve, reject) => {
    const outputBase = path.join(outputDir, filename);
    const outputPath = `${outputBase}.m3u8`;
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    ffmpeg(inputPath)
      .outputOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
      ])
      .output(outputPath)
      .on('end', () => {
        console.log('Video processing finished');
        resolve({
          hlsPlaylist: `${filename}.m3u8`,
          outputDir
        });
      })
      .on('error', (err) => {
        console.error('Error processing video:', err);
        reject(err);
      })
      .run();
  });
};

const generateThumbnail = (inputPath, outputDir, filename) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, `${filename}.jpg`);
    
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['50%'],
        filename: `${filename}.jpg`,
        folder: outputDir,
        size: '640x360'
      })
      .on('end', () => {
        console.log('Thumbnail generated');
        resolve(`${filename}.jpg`);
      })
      .on('error', (err) => {
        console.error('Error generating thumbnail:', err);
        reject(err);
      });
  });
};

const getVideoDuration = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(Math.round(metadata.format.duration));
      }
    });
  });
};

module.exports = {
  processVideo,
  generateThumbnail,
  getVideoDuration
};