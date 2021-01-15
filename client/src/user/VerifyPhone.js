import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup, verifyOTP, isAuthenticated, ReresendOTPCode } from '../auth';
import ResendOTP from './ResendOTP';
import './signup.css';

const VerifyPhone = () => {
    const {user} = isAuthenticated();
    const [sendOTP, setSendOTP] = useState(false);
    const [userPhone, setUserPhone] = useState(user.phone);
    const [values, setValues] = useState({
        otp:'',
        error: '',
        success: false
    });

    const { otp, success, error } = values;

        const init = () => {
            
            setValues({
                ...values,
                formData: new FormData()
             });
                
            
        };
    
        useEffect(() => {
            init();
        }, []);
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    
        const sendFirstOtp = async ()=>{
            
                if(!user.verified){
                
                const data = await ReresendOTPCode(user.phone);
                
                if(data.error){
                    return setValues({...values, error: data.error});
                }else{

                    setSendOTP(true);
                    return setValues({ ...values, error: data.error});
                }  
            }else{
                return setValues({ ...values, error: 'Already verified'});

            }
            
            
            
  

        }
      


    const signUpForm = () => (
       
            
            <p onClick={sendFirstOtp} className="btn btn-primary submit-btn">
                Send a OTP and Verify
            </p>
        
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Successfully verified
        </div>
    );

    const validateOTP = async (event)=>{
        event.preventDefault();
       
        const sendOTP = await verifyOTP(userPhone, otp);

        if(sendOTP.error){
            setValues({ ...values, error: sendOTP.error, success: false });

        }else{
            setValues({
                    ...values,
                    otp: '',
                    error: '',
                    success: true
                });

            document.getElementById('otp-form').style.display= "none";

            
        }


    }



    return (
        <Layout
            title="Signup"
            description="Signup to Selften"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
            {showError()}
            {
                sendOTP === true ?
                <form onSubmit={validateOTP} id="otp-form" className="all-form">
                    <div className="form-group">
                        <p className="text-muted otp-text row">Phone verification is required. Please make sure
                        your phone is available to receive verification code</p>
                        <ResendOTP phone={userPhone} />
                        <div className="row otp-width">
                            <input onChange={handleChange('otp')} placeholder="Code here" type="text" className="col-7 otp-input" value={otp} name="otp" />
                            <input className="col-4 cursor pointer otp-input" type="submit" value="Verify" />

                        </div>
                        <div className="sms-sent-text row">SMS code sent!</div>
                    </div>
                    
                </form>
                :
                signUpForm()
            }
            
        </Layout>
    );
};

export default VerifyPhone;
