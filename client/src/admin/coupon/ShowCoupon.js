import React, { useState, useEffect, Fragment } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import { showCoupon } from './../apiAdmin';
import { UserLinks } from '../../user/UserDashboard';
import { getDiamonds, collectCouponByUser, getCouponsByUser } from '../../user/apiUser';
import './coupon.css'

const ShowCoupon = () => {
    const [userCoupons, setUserCoupons] = useState([]);
    const [diamondAmount, setDiamondAmount] = useState(0);
    const [values, setValues] = useState({
        coupons: [],
        loading: false,
        error: '',
        boughtCoupon: '',
        redirectToProfile: false,
    });

    const {coupons, loading, error, boughtCoupon, redirectToProfile} = values;


    const { user, token } = isAuthenticated();

    // load categories and set form data
    const init = () => {
        showCoupon().then(data => {
            
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    
                    setValues({...values, coupons: data});
                }
            
        });

        getDiamonds(user, token).then(data=>{
            if(!data){
                return setDiamondAmount(0);
            }
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


    // const clickSubmit = event => {
    //     event.preventDefault();
    //     setValues({ ...values, error: '', loading: true });

    //     addCoupon(user._id, token, formData).then(data => {
    //         if (data.error) {
    //             setValues({ ...values, error: data.error });
    //         } else {
                
    //             setValues({
    //                 ...values,
    //                 coupons: [...coupons, data],
    //                 loading: false,
    //                 createdCoupon: 'Coupon'
    //             });
    //         }
    //     });
    // };

    //collect coupon
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
            <h4>Your diamonds or purchased points: {diamondAmount} </h4>

            <h3>All coupons</h3>
            <div className="row">
                
                {
                    coupons.map((coupon, index)=>{
                        return(
                            <div className="border col-md-5 bg-new p-2">
                                <p>{index + 1}</p>
                                <h3>{coupon.couponName}</h3>
                                <h5 className="bg-light p-2 rounded"><b>{coupon.couponCode}</b></h5>
                                <p>Discounts tk: - {coupon.discounts}</p>
                                <p>Diamond need to buy: {coupon.diamonds}</p>
                                { coupon.diamonds > diamondAmount ?
                                    <p>You do not have enought diamond to avail this coupon</p>
                                    :
                                    <Fragment>
                                        {userCoupons.filter(coupon._id) === -1 ?
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
        <div className="alert alert-info" style={{ display: boughtCoupon ? '' : 'none' }}>
            <h2>{`${boughtCoupon}`} is created!</h2>
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
                <div className="col-md-3"><UserLinks /></div>
                <div className="col-md-6 offset-md-2">
                    {showLoading()}
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                </div>
            </div>
        </Layout>
    );
};

export default ShowCoupon;
