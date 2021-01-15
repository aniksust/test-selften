const express = require('express');
const router = express.Router();
const { requireSignin, isAuth } = require("../controllers/auth");
const {success, fail, getWallet, addWallet } = require('./../controllers/wallet');
const { userById } = require("../controllers/user");

router.post('/wallet/success/:transactionId', success)
router.post('/wallet/fail/:transactionId', fail)
router.post('/wallet/cancell/:transactionId', fail)
router.get('/wallet/:userId', requireSignin, isAuth, getWallet);
router.post('/wallet/add/:userId', requireSignin, isAuth, addWallet);
router.param("userId", userById);

module.exports = router;