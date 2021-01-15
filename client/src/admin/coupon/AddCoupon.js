import React, { useState, useEffect, Fragment } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import { addCoupon, showCoupon } from './../apiAdmin';
import { AdminLinks } from '../../user/AdminDashboard';
import { getDiamonds, collectCouponByUser,getCouponsByUser } from '../../user/apiUser';
import './coupon.css'

const AddCoupon = () => {
     const [userCoupons, setUserCoupons] = useState([]);
    const [diamondAmount, setDiamondAmount] = useState(0);
    const [values, setValues] = useState({
        coupons: [],
        couponName: '',
        couponCode: '',
        shortDetails: '',
        discounts: 0,
        diamonds: 0,
        loading: false,
        error: '',
        createdCoupon: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token } = isAuthenticated();
    const {
        coupons,
        discounts,
        diamonds,
        couponName,
        couponCode,
        shortDetails,
        loading,
        error,
        createdCoupon,
        redirectToProfile,
        formData
    } = values;

    // load categories and set form data
    const init = () => {
        showCoupon().then(data => {
            
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    
                    setValues({
                        ...values,
                        coupons: data,
                        formData: new FormData()
                    });
                }
            
        });

        getDiamonds(user, token).then(data=>{
            if (data.error) {
                setDiamondAmount(0);
            } else{
                setDiamondAmount(data.amount)
            }
        });

        getCouponsByUser(user, token).then(data=>{
            if(data.error){
                setUserCoupons([])
            }else{
                if(user.coupon){
                    setUserCoupons(data.coupon)
                }else{
                    setUserCoupons([])
                }
                
            }
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

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        addCoupon(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                
                setValues({
                    ...values,
                    coupons: [...coupons, data],
                    loading: false,
                    createdCoupon: 'Coupon'
                });
            }
        });
    };

    const collectCoupon = (couponId)=>{
        collectCouponByUser(couponId, user, token).then(data=>{
            if(data.error){
                setValues({ ...values, error: data.error });
            }else{
                setUserCoupons(...userCoupons, data);
            }
        })
    }

    const newPostForm = () => (
        <Fragment>
            <form className="mb-3 m-5" onSubmit={clickSubmit}>
                <h4>Add a coupon </h4>
                <div className="form-group">
                    <label className="text-muted">Coupon Name</label>
                    <input onChange={handleChange('couponName')} type="text" className="form-control" value={couponName} />
                </div>

                <div className="form-group">
                    <label className="text-muted">Coupon Code</label>
                    <input onChange={handleChange('couponCode')} type="text" className="form-control" value={couponCode} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Short Details</label>
                    <input onChange={handleChange('shortDetails')} type="text" className="form-control" value={shortDetails} />
                </div>

                <div className="form-group">
                    <label className="text-muted">Discounts in Taka</label>
                    <input onChange={handleChange('discounts')} type="number" className="form-control" value={discounts} />
                </div>
                <div className="form-group">
                    <label className="text-muted">Diamonds amount</label>
                    <input onChange={handleChange('diamonds')} type="number" className="form-control" value={diamonds} />
                </div>

                <button className="btn btn-outline-primary">Add a coupon</button>
            </form>
            <h4 className="m-5">Your diamonds or purchased points: {diamondAmount} </h4>
            <h3 className="m-5">All coupons</h3>
            <div className="row m-5">
                
                {
                    coupons.map((coupon, index)=>{
                        return(
                            <div className="border col-md-4 bg-new p-2">
                                <p>{index + 1}</p>
                                <h3>{coupon.couponName}</h3>
                                <h5 className="bg-light p-2 rounded"><b>{coupon.couponCode}</b></h5>
                                <p>Discounts tk: - {coupon.discounts}</p>
                                <p>Diamond need to buy: {coupon.diamonds}</p>
                                { coupon.diamonds > diamondAmount ?
                                    <p>You do not have enought diamond to avail this coupon</p>
                                    :
                                    <Fragment>
                                        {userCoupons.indexOf(coupon._id) === -1 ?
                                        <h3 onClick={()=>{collectCoupon(coupon._id)}} className="btn btn-primary cursor" role="btn" ><b>Collect</b></h3>
                                        :
                                        <h3 className="btn btn-primary cursor" role="btn" ><b>Collected</b></h3>

                                        }
                                    </Fragment>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </Fragment>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdCoupon ? '' : 'none' }}>
            <h2>{`${createdCoupon}`} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Add balance" description={`for stock of topup ?`}>
            <div className="row">
                <div className="col-md-3"><AdminLinks /></div>
                <div className="col-md-9">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default AddCoupon;
