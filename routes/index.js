var express = require('express');
var router = express.Router();
const requestIp = require('request-ip');
const useragent = require('useragent');
const axios = require('axios'); 

const groupWeb = ['acesiam.com','acesasia.com','aces69.com'];
let currentIndex = 0; // Initialize the index to 0

/* GET home page. */
router.use(requestIp.mw());

router.get('/', async function(req, res, next) {
  const ipAddress = requestIp.getClientIp(req); // Get client's IP address
  
  try {
      // Fetch additional data from the IP address using IP-API service
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      const location = response.data;
      console.log(location);

      // Get the referring domain from the request headers
      const referringDomain = req.headers.referer || 'Direct visit'; // If referer is not present, set it to 'Direct visit'

      // Determine which website to redirect based on IP address
      const redirectWeb = groupWeb[currentIndex];
      res.redirect(`http://${redirectWeb}`);
      console.log(referringDomain)

      // Increment currentIndex to rotate to the next website
      currentIndex = (currentIndex + 1) % groupWeb.length;
  } catch (error) {
      console.error('Error fetching data from IP-API:', error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
