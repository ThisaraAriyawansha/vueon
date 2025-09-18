const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.get('/speed-test', (req, res) => {
  // Return a 1MB response for speed testing
  const testData = Buffer.alloc(1024 * 1024, 'a');
  res.set('Cache-Control', 'no-cache');
  res.send(testData);
});



module.exports = router;