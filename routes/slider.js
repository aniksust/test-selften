const express = require('express');
const router = express.Router();
const {getSliderById, createSlider, slider, photo} = require('../controllers/slider');
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get('/slider', slider);
router.post('/slider/:userId', requireSignin, isAuth, isAdmin, createSlider);
router.get('/slider/photo/:sliderId', photo);
router.param("userId", userById);
router.param("sliderId", getSliderById);
module.exports = router;