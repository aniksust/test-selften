import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import {sendResetOTP, resetPasswordByPhone, resetNewPassword} from './apiUser';
import './forgetPassword.css';
import ResendPasswordResetOTP from './ResendPasswordResetOTP';

const ForgetPassword = ()=> {
    const [user, setUser] = useState({});
    const [changePassword, setChangePassword] = useState(false);
    const [sendOTP, setSendOTP] = useState(false);
    const [userPhone, setUserPhone] = useState('');
    const [values, setValues] = useState({
        passwordAgain: '',
        password:'',
        otp: '',
        success:'',
        email: '',
        error: '',
        loading: '',
    });
    const {otp, email, error, password, loading, success, passwordAgain} = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const resetPassword = async (event)=>{
        event.preventDefault();
        const reset = await sendResetOTP(email);
        if(reset.error){
            return setValues({...values, error: reset.error});
        }
        if(reset.sendAgain){
            setUserPhone(reset.phone)
            return setSendOTP(true);
        }
    }

    const validateOTP = async (event)=>{
        event.preventDefault();
        
        const sendOTP = await resetPasswordByPhone(userPhone, otp);

        if(sendOTP.error){
            setValues({ ...values, error: sendOTP.error, success: false });

        }else{
            setValues({
                ...values,
                otp: '',
                error: '',
            });

            document.getElementById('otp-form').style.display= "none";
            setUser(sendOTP);
            console.log(sendOTP)
            return setChangePassword(true);
            
        }


    }

    const changePasswordSubmit = async (event)=>{
        event.preventDefault();
        if(password !== passwordAgain){
            return setValues({...values, error: 'Password and password again field do not match'})
        }
        const newpass = await resetNewPassword(userPhone, password);

        if(newpass.error){
            return setValues({...values, error: newpass.error})
        }

        if(newpass.success){
            document.getElementById('change-password').style.display = 'none';
            return setValues({...values, success: true})
        }
        



    }

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Success, <Link to="/user/login">Signin</Link>
        </div>
    );

    return (
        <Layout>
        {showSuccess()}
        {showError()}
        {
            sendOTP === true ?
            
            <form onSubmit={validateOTP} id="otp-form" className="all-form">
                <div className="form-group">
                    <p className="text-muted otp-text row">Phone verification is required. Please make setUserPhone
                    your phone is available to receive verification code</p>
                    <ResendPasswordResetOTP phone={userPhone} />
                    <div className="row otp-width">
                        <input onChange={handleChange('otp')} placeholder="Code here" type="text" className="col-7 otp-input" value={otp} name="otp" />
                        <input className="col-4 cursor pointer otp-input" type="submit" value="Verify" />
                    </div>
                    <div className="sms-sent-text row">SMS code sent!</div>
                </div>
                
            </form>
            :
            
        
            
            <div className="forget-password">
                <form onSubmit={resetPassword}>
                    <div className="form-group">
                    <label className="text-muted">Give your phone number to reset password</label>
                    <input
                        onChange={handleChange("email")}
                        type="text"
                        className="form-control"
                        value={email}
                    />

                    <input type="submit" className="btn submit-btn" value="Reset Password" />
                </div>
                </form>

            </div>  
            }

        { changePassword ?
            <div id="change-password" className="row">
                <form onSubmit={changePasswordSubmit}>
                    <div className="form-group">
                    <label className="text-muted">Give new password</label>
                    <input
                        onChange={handleChange("password")}
                        type="text"
                        placeholder="password"
                        className="form-control"
                        value={password}
                    />
                    <input
                        onChange={handleChange("passwordAgain")}
                        type="text"
                        className="form-control"
                        placeholder="password again"
                        value={passwordAgain}
                    />

                    <input type="submit" className="btn submit-btn" value="Set new Password" />
                </div>
                </form>

            </div>  

            :
            <Fragment></Fragment>

        }
        </Layout>

    )
}

export default ForgetPassword;