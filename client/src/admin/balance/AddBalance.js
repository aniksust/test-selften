import React, { useState, useEffect } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import { addBalance, showBalance } from './../apiAdmin';
import { AdminLinks } from '../../user/AdminDashboard';

const AddBalance = () => {
    const [values, setValues] = useState({
        balance: '',
        oldBalance: 0,
        loading: false,
        error: '',
        createdBalance: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token } = isAuthenticated();
    const {
        balance,
        oldBalance,
        loading,
        error,
        createdBalance,
        redirectToProfile,
        formData
    } = values;

    // load categories and set form data
    const init = () => {
        showBalance().then(data => {
            
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    let stock = 0;
                    if(data.length === 1){
                        stock = data[0].balance;
                    }
                    setValues({
                        ...values,
                        oldBalance: stock,
                        formData: new FormData()
                    });
                }
            
        });
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

        addBalance(user._id, token, {balance}).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                let newOldBalance = oldBalance + Number(balance);
                if(newOldBalance < 0){
                    newOldBalance = 0;
                }
                setValues({
                    ...values,
                    oldBalance: newOldBalance,
                    balance: '',
                    loading: false,
                    createdBalance: 'Balance'
                });
            }
        });
    };

    const newPostForm = () => (
        <form className="mb-3 m-5" onSubmit={clickSubmit}>
            <h4>Balance Stock in BDT: {oldBalance} </h4>

            <div className="form-group">
                <label className="text-muted">Add more balance or subtract by putting - before</label>
                <input onChange={handleChange('balance')} type="number" className="form-control" value={balance} />
            </div>

            <button className="btn btn-outline-primary">Add Balance</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdBalance ? '' : 'none' }}>
            <h2>{`${createdBalance}`} is created!</h2>
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

export default AddBalance;
