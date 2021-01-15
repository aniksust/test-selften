const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { getCouponsByUser, collectCoupon, showCoupon, addCoupon } = require('./../controllers/coupon');
const { userById } = require("../controllers/user");

router.get('/coupon', showCoupon);
router.get('/coupon/:userId', requireSignin, isAuth, getCouponsByUser )
router.post('/coupon/:couponId/:userId', requireSignin, isAuth, collectCoupon);
router.post('/coupon/create/:userId', requireSignin, isAuth, isAdmin, addCoupon);
//router.post('/admin/add-diamonds/:userId', requireSignin, isAuth, isAdmin, addUpdateDiamondValue );

router.param("userId", userById);
module.exports = router;