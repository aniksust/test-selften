const express = require('express');
const router = express.Router();
const {searchProductAndTopup} = require('../controllers/search');

router.get('/search/:searchText', searchProductAndTopup);


module.exports = router;