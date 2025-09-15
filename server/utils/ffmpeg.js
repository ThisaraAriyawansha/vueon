const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Try to use ffmpeg-static and ffprobe-static packages
try {
  const ffmpegPath = require('ffmpeg-static');
  const ffprobePath = require('ffprobe-static').path;
  
  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);
  console.log('Using ffmpeg-static and ffprobe-static packages');
} catch (error) {
  console.log('ffmpeg-static/ffprobe-static not available, using system FFmpeg');
}

const processVideo = (inputPath, outputDir, filename) => {
  return new Promise((resolve, reject) => {
    const videoDir = path.join(outputDir, filename);
    const outputPath = path.join(videoDir, `${filename}.m3u8`);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    console.log('Starting video processing...');
    console.log('Input:', inputPath);
    console.log('Output:', outputPath);

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
      .on('start', (commandLine) => {
        console.log('FFmpeg process started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .on('end', () => {
        console.log('Video processing finished successfully');
        resolve({
          hlsPlaylist: `${filename}/${filename}.m3u8`,
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
    const videoDir = path.join(outputDir, filename);
    const thumbnailPath = path.join(videoDir, `${filename}.jpg`);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    console.log('Generating thumbnail...');

    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['50%'],
        filename: `${filename}.jpg`,
        folder: videoDir,
        size: '640x360'
      })
      .on('end', () => {
        console.log('Thumbnail generated successfully');
        resolve(`${filename}/${filename}.jpg`);
      })
      .on('error', (err) => {
        console.error('Error generating thumbnail:', err);
        reject(err);
      });
  });
};

const getVideoDuration = (inputPath) => {
  return new Promise((resolve, reject) => {
    console.log('Getting video duration...');
    
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        console.error('Error getting video duration:', err);
        reject(err);
      } else {
        const duration = Math.round(metadata.format.duration);
        console.log('Video duration:', duration, 'seconds');
        resolve(duration);
      }
    });
  });
};

module.exports = {
  processVideo,
  generateThumbnail,
  getVideoDuration
};