import React, { useContext, useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import './adminDashboard.css';
import { NotificationsContext } from "../context/notificationsContext";
import { updateUserProfile, getUserProfile } from "./apiUser";


export const AdminLinks = () => {
    const [notifications, setNotifications] = useContext(NotificationsContext);
    return ( 
        <div className="card">
            <h4 className="card-header">Admin Links</h4>
           
            <ul className="list-group">
            <li className="list-group-item">
                <Link className="nav-link" to="/admin/assigned-topup-orders">
                        Assigned topup orders
                 </Link>
            </li>
             <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/topup-orders">
                        See New Topup Orders
                    </Link>
                </li>
            <li className="list-group-item">
                <Link exact className="nav-link" to="/admin/messages">
                        See messages <sup className="notifications">{ notifications }</sup>
                 </Link>
            </li>
            <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/refill-wallet">
                        Wallet
                    </Link>
                </li>

            <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/balance-stock">
                        Stocks for topup
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/diamond-value">
                        Diamond or Purchase Point
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/add-coupons">
                        Add coupons
                    </Link>
                </li>
                 <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/recharge-package">
                        Create Recharge Package
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact  className="nav-link" to="/admin/topup">
                        Create Game for Topup
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/add-slider">
                        Create Slider
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/see-your-topup-orders">
                        Your topup orders
                    </Link>
                </li>

                <li className="list-group-item">
                    <Link exact className="nav-link" to="/create/category">
                        Create Category
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/create/product">
                        Create Product
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/orders">
                        View Orders
                    </Link>
                </li>
                <li className="list-group-item">
                    <Link exact className="nav-link" to="/admin/products">
                        Manage Products
                    </Link>
                </li>
               
               
                
            </ul>
        </div>
    );
};

const AdminDashboard = () => {
    const {user, token} = isAuthenticated();
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
        verified: '',
        formData: '',
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
        verified,
        formData,
    } = values;

    const init = async ()=>{
        const data = await getUserProfile(user, token);
        
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
        
        
        
    }

    useEffect(()=>{
        init();
    },[])

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


    const adminInfo = () => {
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

    return (
        <Layout
            title="Dashboard"
            description={`G'day ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                
                <div className="col-md-3"><AdminLinks /></div>
              
                <div className="col-md-9">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {adminInfo()}</div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
