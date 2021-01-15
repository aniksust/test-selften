import React, { Fragment, useEffect, useState } from 'react';
import { getWallet } from '../core/apiCore';
import {getUserProfile} from './../user/apiUser';
import {addToWallet} from './../admin/apiAdmin';
import Layout from '../core/Layout';
import { isAuthenticated } from './../auth';
import { AdminLinks } from '../user/AdminDashboard';
import { UserLinks } from '../user/UserDashboard';
import { Link } from 'react-router-dom';
import './refillWallet.css';

const RefillWallet = ()=>{
    const [profile, setProfile] = useState({});
    const [wallet, setWallet] = useState(0);
    const {user, token} = isAuthenticated();
    const { role} = user;
    const [values, setValues] = useState({
        amount: 0,
        loading: '',
        error: '',
        formData: '',
        addedBalance: '',
    });

    const {amount, loading, error, formData, addedBalance} = values;

    

    const init = async ()=>{
        const datas = await getWallet(user._id, token);
        setWallet(datas.amount);
        const data = await getUserProfile(user, token);
        setProfile(data);
        
        setValues({...values, formData: new FormData()})
    }

    useEffect(()=>{
        init();
    },[])


    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: addedBalance ? '' : 'none' }}>
            <h2>{`${addedBalance}`}</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    
    const refillWallet = async (event)=>{
        event.preventDefault();
        try{
            const data = await addToWallet(user, token, formData);
            if (data.error){
                return setValues({...values, error: data.error})
            }
            window.location.replace(data.GatewayPageURL);
        }catch(err){
            setValues({...values, error: 'Could not perform'})
        }
        
        
    }

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    return(
        <Layout title="Request a topup" description={`G'day ${user.name}, ready to add a new topup request?`}>
            
            <div className="row">
                
                <div className="col-md-3">{role === 1 ?
                    <AdminLinks />
                    :
                    <UserLinks />
                }</div>
                <div className="col-md-9 m-b-250 mb-5">
                
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    <form className="row wallet" onSubmit={refillWallet}>
                
                        <div className="form-group col-md-4">
                            <p>Balance: {wallet}.00 BDT</p>
                            <label className="text-muted">Add money</label>
                            <input onChange={handleChange('amount')} type="number" className="form-control" value={amount} />
                        <br />

                            {(!profile.address || !profile.city || !profile.postCode) ?
                                <p>Please fill your address, city postal code in your <Link exact to={()=>{
                                    return role === 1 ? '/admin/dashboard' : '/user/dashboard'
                                }} >profile</Link> before you can add money</p>

                                :
                                <input type="submit" className="btn-primary" value="Add via credit card, bKash etc" />

                            }


                            
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
        
            
        
    )
}

export default RefillWallet;