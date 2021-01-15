const express = require("express");
const router = express.Router();

const {
    signup,
    signin,
    signout,
    requireSignin,
    verifyOTP,
    resendOTP,
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/verify-otp/:phone/:otpcode", verifyOTP);
router.get("/resend-otp/:phone/", resendOTP);

module.exports = router;
