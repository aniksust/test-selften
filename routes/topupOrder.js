const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { topupOrdersByUser, SSLComFail, SSLComSuccess, assignTopupOrder, getAllTopupOrders, updateTopupOrderById, createTopupOrder, deleteTopupOrderById, getTopupOrderById, getAllAssignedTopupOrders } = require('./../controllers/topupOrder');
const { userById } = require("../controllers/user");

router.get('/topup-order/by-user/:userId', requireSignin, isAuth,topupOrdersByUser )
router.post('/topup-order/success/:transactionId', SSLComSuccess);
router.post('/topup-order/fail/:transactionId', SSLComFail);
router.post('/topup-order/cancell/:transactionId', SSLComFail);
router.post('/topup-orders/assigning/:adminId/:userId/:topupOrderId', requireSignin, isAuth, isAdmin, assignTopupOrder);
router.post('/topup-orders/assigned/admin/:userId', requireSignin, isAuth, isAdmin, getAllAssignedTopupOrders);
router.post('/topup-orders/admin/:userId', requireSignin, isAuth, isAdmin, getAllTopupOrders);
router.post('/topup-orders/:userId/topup/:topupGameId/:withSSLCommerz', requireSignin, isAuth, createTopupOrder);
router.get('/topup-orders/single/:topupOrderId', getTopupOrderById);
router.post('/topup-orders/update/:topupOrderId/:userId/:status/:customerId', requireSignin, isAuth, isAdmin, updateTopupOrderById);
router.delete('/topup-orders/:topupOrderId', deleteTopupOrderById);
router.param("userId", userById);
router.param("topupId", getTopupOrderById);
module.exports = router;