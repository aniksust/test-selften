import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";
import { updateUserProfile, getUserProfile } from "./apiUser";
import './adminDashboard.css'

export const UserLinks = () => {
    const {
        user: { _id }
    } = isAuthenticated();
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                     <li className="list-group-item">
                        <Link exact className="nav-link" to="/user/see-your-topup-orders">
                            Your topup orders
                        </Link>
                    </li>

                    <li className="list-group-item">
                        <Link exact className="nav-link" to="/user/messages">
                            See messages  <sup className="notifications">0</sup>
                        </Link>
                    </li>
                    <li className="list-group-item">
                    <Link exact className="nav-link" to="/user/refill-wallet">
                        Wallet
                    </Link>
                    </li>
                    <li className="list-group-item">
                        <Link exact className="nav-link" to="/cart">
                            My Cart
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link exact className="nav-link" to={`/profile/${_id}`}>
                            Update Profile
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link exact className="nav-link" to={`/user/coupons`}>
                            Diamonds Coupons
                        </Link>
                    </li>
                    
                    
                </ul>
            </div>
        );
    };

const Dashboard = () => {
    const [history, setHistory] = useState([]);

     const {user, token} = isAuthenticated();
    const [profile, setProfile] = useState({});
    const [values, setValues] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        postCode: '',
        city: '',
        about:'',
        loading: '',
        error: '',
        updated: '',
        formData: '',
        verified:'',
    });
    const {
        name,
        email,
        phone,
        address,
        postCode,
        city,
        about,
        loading,
        error,
        updated,
        formData,
        verified,
    } = values;

    const init = async () => {
        
        const datas = await getPurchaseHistory(user._id, token)
        const data = await getUserProfile(user, token);
        setHistory(datas);
        setValues({...values, formData: new FormData(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            postCode: data.postCode,
            city: data.city,
            about:data.about,
            verified: data.verified,
        })
            
        
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const updateProfile = async (event)=>{
        event.preventDefault();

        try{

            
            setValues({...values, loading: true})
            const newUser = await updateUserProfile(user, token, formData);
            
            if (newUser.error){
                return setValues({...values, error: newUser.error})
            }
            setValues({...values, loading: false, updated: 'Profile'});
            
            
        }catch(err){
            console.log(err);
        }

    }
            const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: updated ? '' : 'none' }}>
            <h2>{`${updated}`} - successfully updated</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    const userInfo = () => {
        return (
            <div className="card mb-5 dashboard-form">
                <h3 className="card-header">User Information</h3>

                <form onSubmit={updateProfile} >
                    <div className="form-group">
                        <label className="text-muted">Name</label>
                        <input onChange={handleChange('name')} type="text" className="form-control" name="name" value={name} />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input onChange={handleChange('email')} type="text" className="form-control" name="email" value={email} />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Phone</label>
                        <input onChange={handleChange('phone')} type="text" className="form-control" name="phone" value={phone} />
                        { verified ?
                        <p>Phone Verified</p>
                        :
                        <Link exact to="/verify-phone" >Phone verification is necessary</Link>
                    }
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Address</label>
                        <input onChange={handleChange('address')} type="text" className="form-control" name="address" value={address} />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Postal Code</label>
                        <input onChange={handleChange('postCode')} type="text" className="form-control" name="postCode" value={postCode} />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">City</label>
                        <input onChange={handleChange('city')} type="text" className="form-control" name="city" value={city} />
                    </div>
                    <div className="form-group">
                        <label className="text-muted">About</label>
                        <textarea onChange={handleChange('about')} type="text" className="form-control" name="about" value={about} >{about}</textarea>
                    </div>

                   <input type="submit" className="btn-primary" value="Update Profile" />
                    

                </form>

                
            </div>
        );
    };

    const purchaseHistory = history => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase history</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        {history.map((h, i) => {
                            return (
                                <div>
                                    <hr />
                                    {h.products.map((p, i) => {
                                        return (
                                            <div key={i}>
                                                <h6>Product name: {p.name}</h6>
                                                <h6>
                                                    Product price: ${p.price}
                                                </h6>
                                                <h6>
                                                    Purchased date:{" "}
                                                    {moment(
                                                        p.createdAt
                                                    ).fromNow()}
                                                </h6>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-md-3"><UserLinks /></div>
                <div className="col-md-9">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {userInfo()}
                    {purchaseHistory(history)}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
