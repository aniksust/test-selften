const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { showBalance, addUpdateBalance, addUpdateDiamondValue } = require('./../controllers/adminBalance');
const { userById } = require("../controllers/user");

router.get('/admin/balance', showBalance);
router.post('/admin/balance/:userId', requireSignin, isAuth, isAdmin, addUpdateBalance);
router.post('/admin/add-diamonds/:userId', requireSignin, isAuth, isAdmin, addUpdateDiamondValue );

router.param("userId", userById);
module.exports = router;