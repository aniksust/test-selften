import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { signin, authenticate, isAuthenticated } from "../auth";
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';

const Signin = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        error: "",
        loading: false,
        redirectToReferrer: false
    });

    const { email, password, loading, error, redirectToReferrer } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, loading: false });
            } else {
                authenticate(data, () => {
                    setValues({
                        ...values,
                        redirectToReferrer: true
                    });
                });
            }
        });
    };

    const signUpForm = () => (
        <Fragment>
            <form className="form-input">
                <div className="align">
                    <div className="full">
                        <span className="login">L</span><span className="login2">O</span><span className="login2">G</span><span className="login2">I</span><span className="login2">N</span>
                        <div className="form-group">
                            {/* <label className="text-muted">Email or Phone</label> */}
                            <Input className="inp" suffix={<UserOutlined style={{ color: 'light-gray' }} />} value={email} placeholder="Email Address.." onChange={handleChange("email")} />
                        </div>

                        <div className="form-group">
                            {/* <label className="text-muted">Password</label> */}
                            <Input.Password
                                className="inp "
                                placeholder="Password..."
                                value={password}
                                onChange={handleChange("password")}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </div>
                        <Link exact to="/forget-password" >Forget Password?</Link>
                        <button onClick={clickSubmit} className="btnn">
                            Login
            </button>
                    </div>
                </div>
            </form>
        </Fragment>
    );

    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
        >
            {error}
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        );

    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />;
            } else {
                return <Redirect to="/user/dashboard" />;
            }
        }
        if (isAuthenticated()) {
            return <Redirect to="/" />;
        }
    };

    return (
        <Layout
            title="Signin"
            description="Signin to Selften"
            className="container col-md-8 offset-md-2"
        >
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    );
};

export default Signin;
