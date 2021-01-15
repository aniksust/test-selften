const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { getSingleTopupBy, thumb, getAllTopups, updateTopupById, createTopup, deleteTopupById, getTopupById } = require('./../controllers/topup');
const { userById } = require("../controllers/user");

router.get('/topup-thumbs', getAllTopups);
router.post('/topup-thumbs/:userId', requireSignin, isAuth, isAdmin, createTopup);
router.get('/topup-thumbs/:userId', getTopupById);
router.get('/topup-thumbs/single/:topupId', getSingleTopupBy);
router.patch('/topup-thumbs/:userId', updateTopupById)
router.delete('/topup-thumbs/:userId', deleteTopupById);
router.get("/topup-thumbs/photo/:topupId", thumb);

router.param("userId", userById); 
router.param("topupId", getTopupById);
module.exports = router; 