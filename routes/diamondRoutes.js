const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { getDiamonds } = require('./../controllers/diamond');
const { userById } = require("../controllers/user");

router.get('/diamonds/:userId', requireSignin, isAuth, getDiamonds);
//router.post('/admin/add-diamonds/:userId', requireSignin, isAuth, isAdmin, addUpdateDiamondValue );

router.param("userId", userById);
module.exports = router;