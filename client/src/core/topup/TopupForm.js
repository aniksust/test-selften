import React, { useState, useEffect, Fragment } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import { getRechargePackagesByGameName, getTopupById, getWallet } from './../apiCore';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { createTopupOrder } from './../apiCore';
import { showBalance } from './../../admin/apiAdmin';
import './topupForm.css';
import ShowThumb from '../ShowThumb';
import { getUserProfile } from '../../user/apiUser';
import { Input,Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


const TopupForm = () => {
    // Id for the game name to load packages under it
    // id comes from parameter url
    const [profile, setProfile] = useState({});
    const { id, type } = useParams();
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState(null);
    const [adminLimit, setAdminLimit] = useState(0);
    const [thisTopup, setThisTopup] = useState({});
    const [diamondValue, setDiamondValue] = useState(null);

    const [values, setValues] = useState({
        withSSLCommerz: 'n',
        gameUserId: '',
        accountType: '',
        gmailOrFacebook: '',
        password: '',
        securityCode: '',
        selectRecharge: '',
        selectRecharges:[],
        loading: false,
        error: '',
        createdTopupOrder: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token, role } = isAuthenticated();
    const {
        withSSLCommerz,
        gameUserId,
        accountType,
        gmailOrFacebook,
        password,
        securityCode,
        selectRecharge,
        selectRecharges,
        loading,
        error,
        createdTopupOrder,
        redirectToProfile,
        formData
    } = values;



    // load Recharge packages and set form data

    const init = async () => {
        try{

        
        setValues({ ...values, loading: true });
        const data = await getRechargePackagesByGameName(id);
        
        const topupData = await getTopupById(id);
        const bl = await showBalance();
        
        
        if (data.error) {
            return setValues({ ...values, error: data.error });
        }
        
        if (topupData.error) {
            return setValues({ ...values, error: topupData.error });
        } 
        if (bl.error) {
            return setValues({ ...values, error: bl.error });
        }

        if(user){
            const wData = await getWallet(user._id, token);
            const dataUser = await getUserProfile(user, token);
            setProfile(dataUser);
            if (!wData) {
                setWallet(0);
            }else{
                setWallet(wData);
            }
        }
        
        
        if(!data.error || !bl.error || !topupData.error) {
            setDiamondValue(bl[0].takaPerDiamond);
            setAdminLimit(bl[0].balance)
            
            setThisTopup(topupData);
            setValues({
                ...values,
                 selectRecharges: data,
                formData: new FormData(),
                loading: false
            });           
        }
        
    }catch(err){
        console.log(err)
    }
        
    };

    useEffect(() => {
        init();
    }, []);
    

    useEffect(()=>{
        if(selectRecharges.length > 0){
    
            let selectedpack = selectRecharges.filter(sr =>{
                return sr._id === selectRecharge;
            });

            if(selectedpack.length > 0){
                setAmount(selectedpack[0].packageAmount);
            }
        }
        
    }, [selectRecharge])

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };
    const Option = Select.Option
    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        createTopupOrder(user._id, token, formData, id, withSSLCommerz).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    gameUserId: '',
                    accountType: '',
                    gmailOrFacebook: '',
                    password: '',
                    selectRecharge: '',
                    securityCode: '',
                    loading: false,
                    createdTopupOrder: data.name
                });
            }
        });
    };

    //order wit ssl commerze
    const orderWithSSLCommerz = ()=>{
        setValues({ ...values, error: '', loading: true, withSSLCommerz: 'y' });

        createTopupOrder(user._id, token, formData, id, 'y').then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                                setValues({
                    ...values,
                    
                    gameUserId: '',
                    accountType: '',
                    gmailOrFacebook: '',
                    password: '',
                    selectRecharge: '',
                    securityCode: '',
                    loading: false,
                    withSSLCommerz: 'n',
                    createdTopupOrder: data.name
                });
                console.log(data);
                //redirect to payment page
               window.location.replace(data.GatewayPageURL);
                
                setValues({
                    ...values,
                    
                    gameUserId: '',
                    accountType: '',
                    gmailOrFacebook: '',
                    password: '',
                    selectRecharge: '',
                    securityCode: '',
                    loading: false,
                    withSSLCommerz: 'n',
                    createdTopupOrder: data.name
                });
            }
        });
    }

    const selectARechargePackage = (id)=>{
        setValues({
            ...values,
            selectRecharge: id,
        });
        
        formData.set('selectRecharge', id);
        if(document.getElementsByClassName('select-recharge')){
            
            const classes = document.getElementsByClassName('select-recharge');
            for(let i = 0; i < classes.length; i++){
                document.getElementsByClassName('check-mark')[i].style.visibility = "hidden";
                document.getElementsByClassName('check-mark')[i].style.opacity = 0;
                document.getElementsByClassName('select-recharge')[i].style.border = "2px solid rgb(194, 191, 191)";
            }
            
            document.getElementById(id).style.border = "2px solid #E6753E";
            document.getElementById(`${id}-check-mark`).style.visibility = "visible";
            document.getElementById(`${id}-check-mark`).style.opacity = 1;

        }

        

    }

    const newPostForm = () => (
        <form className="mb-3 topup-form" onSubmit={clickSubmit}>
            <div className="rows">
                <div className="col-md-5">
                    <ShowThumb item={{_id: id}} url="topup-thumbs"/>
                </div>
            </div>
                <div className="col-md-12 box">
                    <div className="flexs">
                    <p><b>Publisher:</b><br /> {thisTopup.publisher}</p></div>
                    <div className="flexs">
                    <p><b>Platform: </b><br /> {thisTopup.platform}</p></div>
                    <div className="flexs">
                    <p><b>Region:   </b><br /> {thisTopup.region}</p></div>
                </div>
            <h4>Request a Topup</h4>
            { type === 'inGame' ?
                
                <Fragment>
                    
                    <div className="row">

                        <div className="form-group col-md-4">
                            
                            <label className="text-muted">Account Type</label>
                            <select name="accountType" onChange={handleChange('accountType')} className="form-control inp">
                                <option disabled selected>Please select</option>
                                <option value="facebook">Facebook</option>
                                <option value="gmail">Gmail</option>
                                
                            </select>
                        </div>

                        <div className="form-group col-md-4">
                            
                            {
                                accountType === 'facebook' ? 
                                    <label className="text-muted">Your Facebook</label>
                                :
                                <Fragment>
                                {
                                    accountType === 'gmail' ? 
                                        <label className="text-muted">Your Gmail</label>
                                    
                                    :
                                    <label className="text-muted">Select Account type first</label>
                                    
                                }
                                </Fragment>
                            }
                            {/* <input onChange={handleChange('gmailOrFacebook')}  className="form-control" value={gmailOrFacebook} /> */}
                            <Input className="inp" value={gmailOrFacebook} placeholder="Account Type.." onChange={handleChange('gmailOrFacebook')} />
                            
                        </div>

                        <div className="form-group col-md-4">
                            <label className="text-muted">Password</label>
                            {/* <input onChange={handleChange('password')} type="password" className="form-control" name="password" value={password} /> */}
                            <Input.Password
                                className="inp "
                                placeholder="Password..."
                                value={password}
                                onChange={handleChange('password')}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                            
                        </div>
                    </div>
                    <div className="row security-code">

                        {
                            accountType === 'gmail' ? 
                                <div className="form-group">
                                    <label className="text-muted">Security Code</label>
                                    {/* <input onChange={handleChange('securityCode')} type="text" className="form-control" value={securityCode} /> */}
                            <Input className="inp" value={securityCode} placeholder="Security Code.." onChange={handleChange('securityCode')} />
                                </div>
                            :
                                <Fragment></Fragment>
                        }
                    </div>
                </Fragment>
                :

               
                
            
                
                 
                <div className="row">
                     <div className="form-group col-md-4">
                        {/* <label className="text-muted">Game Id</label> */}
                        {/* <input onChange={} type="text" className="form-control" value={gameUserId} /> */}
                        <Input className="inp" value={gameUserId} placeholder="Game ID.." onChange={handleChange('gameUserId')} />

                    </div>
                    <div className="form-group col-md-4">
                        {/* <label className="text-muted">Password</label> */}
                        {/* <input onChange={handleChange('password')} type="password" className="form-control" name="password" value={password} /> */}
                        <Input.Password
                                className="inp "
                                placeholder="Password..."
                                value={password}
                                onChange={handleChange('password')}
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                    </div>
                </div>
                 
                 
            }
            
            <div className="row">
                <div className="form-group col-9">
                    <p className="text-muted">Recharge Package</p>
                        <div className="row">
                        {selectRecharges? 
                            selectRecharges.map((c, i) => {
                                return(
                                    <p id={c._id} className="cursor-pointer select-recharge col-md-3 recharge" onClick={()=>{selectARechargePackage(c._id)}}>
                                        <img className="check-mark" id={`${c._id}-check-mark`} src="/images/icons/check-mark.svg" width="20" />
                                        <span>{c.packageName} </span>
                                    </p>
                                )
                                
                            })
                            :
                            <p>Loading</p>
                        }
                        </div>
                        
                    
                </div>
            </div>

            {
                user ?
                 
                     (!profile.address || !profile.city || !profile.postCode) ?
                        <p>Please fill your address, city postal code in your <Link exact to={()=>{
                            return role && role === 1 ? '/admin/dashboard' : '/user/dashboard'
                        }} >profile</Link> before you can order a topup</p>
                        
                        :
                        <Fragment>
                            <div className="form-group col-md-4">
                                <label className="text-muted">Amount to pay: { amount ? <b>{amount}</b>: <b>0</b> }</label>
                            </div>

                            <div className="money">
                                <h4>Your Balance: { wallet ? wallet.amount : <span>Loading...</span>}</h4>
                            </div>

                                        { wallet && amount ? wallet.amount < amount ? 
                                            <p>You have less balance than you have to pay. Please <Link to={()=>{
                                                if(user.role === 1){
                                                    return '/admin/refill-wallet';
                                                }else{
                                                    return '/user/refill-wallet';
                                                }

                                            }}><button className="btn btn-primary">add money</button></Link></p>
                                            :
                                            <Fragment></Fragment>
                                            :
                                            <Fragment></Fragment>
                                        }
                                    
                                        {/* { amount > adminLimit ? 
                                            <p>You are ordering more than admin can handle. Please select less</p>
                                            :
                                            <Fragment></Fragment>

                                        } */}
                        {/* <h4>Admin Balance: { adminLimit }</h4> */}
                                    
                        { diamondValue && amount ?
                            <p>You will receive - {parseInt(amount / diamondValue)} Diamonds </p>
                            :
                            <Fragment></Fragment>
                        }

                        <button className="btn btn-outline-primary submit-btn">Order With Balance</button>
                        <br />
                        <br />
                        {/* submit-btn btn btn-outline-primary */}
                        <p onClick={()=>{orderWithSSLCommerz()}} className="btnn">Order With Card, Bkash and more</p>
                    </Fragment>
                                
                    
                :
                    <p style={{textAlign:'center',fontSize:"25px",color:'red',backgroundColor:'#1a1515',borderRadius:'20px 0 20px 0'}}>Please login to order a topup</p>
            }

            <h5>About {thisTopup.title}</h5>
            <p className="textaigin">{thisTopup.about}</p>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdTopupOrder ? '' : 'none' }}>
            <h2>{`${createdTopupOrder}`} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12 topup-form-wrapper">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default TopupForm;
