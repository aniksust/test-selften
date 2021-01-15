import React, { useState, useEffect } from 'react';
import { getProducts, getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import Card from './Card';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
// import "braintree-web"; // not using this package

const Checkout = ({ products, setRun = f => f, run = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: '',
        instance: {},
        name: '',
        email: '',
        phone:'',
        address: '',
        city: '',
        zipCode: '', 
        country: '',
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;


    const handleChange = name => event => {
        setData({ ...data, error: false, [name]: event.target.value });
    };

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    let deliveryAddress = data.address;

    const showDropIn = () => (
        <div onBlur={() => setData({ ...data, error: '' })}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Full name:</label>
                        <input
                            type="text"
                            onChange={handleChange('name')}
                            className="form-control"
                            value={data.name}
                            placeholder="Type your name..."
                        />
                    </div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Email:</label>
                        <input
                            type="text"
                            onChange={handleChange('email')}
                            className="form-control"
                            value={data.email}
                            placeholder="Email..."
                        />
                    </div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Phone:</label>
                        <input
                            type="text"
                            onChange={handleChange('phone')}
                            className="form-control"
                            value={data.phone}
                            placeholder="Phone..."
                        />
                    </div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleChange('address')}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">City:</label>
                        <input
                            type="text"
                            onChange={handleChange('city')}
                            className="form-control"
                            value={data.city}
                            placeholder="City..."
                        />
                    </div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Zipcode:</label>
                        <input
                            type="text"
                            onChange={handleChange('zipCode')}
                            className="form-control"
                            value={data.zipCode}
                            placeholder="Zipcode..."
                        />
                    </div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Country:</label>
                        <input
                            type="text"
                            onChange={handleChange('country')}
                            className="form-control"
                            value={data.country}
                            placeholder="Country..."
                        />
                    </div>

                    <div className="gorm-group mb-3">
                        <input
                            type="checkbox"
                            required
                        />
                        <label className="text-muted">I agree with <Link exact to="/terms-condition">Terms & Conditions</Link>, <Link exact to="/privacy-policy">Privacy Policy</Link> and <Link exact to="/refund-return-policy">Return Refund Policy</Link></label>

                    </div>


                    

                    <button className="btn btn-success btn-block">
                        Pay
                    </button>
                </div>
            ) : null} 
        </div>
    );

    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your payment was successful!
        </div>
    );

    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>

            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
  
        </div>
    );
};

export default Checkout;
