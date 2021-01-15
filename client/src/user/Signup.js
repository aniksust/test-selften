import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { signup, verifyOTP } from '../auth';
import ResendOTP from './ResendOTP';
import './signup.css';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';

const Signup = () => {
    const [sendOTP, setSendOTP] = useState(false);
    const [userPhone, setUserPhone] = useState('');
    const [values, setValues] = useState({
        otp: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        postCode: '',
        city: '',
        error: '',
        success: false
    });

    const { otp, name, email, phone, password, address, postCode, city, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, phone, address, postCode, city, password }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            }
            if (data.sendAgain) {
                setValues({ ...values, error: data.error, success: false });
                setSendOTP(true);
                setUserPhone(data.phone)
            }

            else {
                setValues({ ...values, error: 'Server error', success: false });

            }
        });
    };

    const signUpForm = () => (
        <div className="signup-container">
            <form id="sign-up-form" className="all-form">
                <div className="cont">
                    <div className="ali">
                    <span className="login">S</span><span className="login2">I</span><span className="login2">G</span><span className="login2">N</span><span className="login2">U</span><span className="login2">P</span>
                        <div className="form-group">
                            <Input className="inp" suffix={<UserOutlined style={{ color: 'light-gray' }} />} value={name} placeholder="Enter your Name..." onChange={handleChange('name')} />
                        </div>

                        <div className="form-group">
                            <Input className="inp" suffix={<UserOutlined style={{ color: 'light-gray' }} />} value={email} placeholder="Enter your Email Address..." onChange={handleChange('email')} />
                        </div>
                        <div className="form-group">
                            <Input className="inp" type="number" value={phone} placeholder="Enter your Phone Number..." onChange={handleChange('phone')} />
                        </div>

                        <div className="form-group">
                            <Input.Password
                                className="inp "
                                placeholder="Enter your Password..."
                                value={password}
                                onChange={handleChange('password')}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </div>
                        <div className="form-group">
                            <Input className="inp" value={address} placeholder="Enter your Address[Optional]..." onChange={handleChange('address')} />
                        </div>
                        <div className="form-group">
                            <Input className="inp" value={postCode} placeholder="Enter your PostCode[Optional]..." onChange={handleChange('postCode')} />
                        </div>
                        <div className="form-group">
                            <Input className="inp" value={city} placeholder="Enter your City[Optional]..." onChange={handleChange('city')} />
                        </div>
                        <button onClick={clickSubmit} className="btnn">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/user/login">Signin</Link>
        </div>
    );

    const validateOTP = async (event) => {
        event.preventDefault();

        const sendOTP = await verifyOTP(userPhone, otp);

        if (sendOTP.error) {
            setValues({ ...values, error: sendOTP.error, success: false });

        } else {
            setValues({
                ...values,
                otp: '',
                name: '',
                email: '',
                phone: '',
                address: '',
                postCode: '',
                city: '',
                password: '',
                error: '',
                success: true
            });

            document.getElementById('otp-form').style.display = "none";


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

export default Signup;
