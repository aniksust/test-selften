import React, { useState, useEffect } from 'react';
import Layout from '../../core/Layout';
import { isAuthenticated } from '../../auth';
import { addDiamondValue, showBalance } from '../apiAdmin';
import { AdminLinks } from '../../user/AdminDashboard';

const ModifyDiamondsValue = () => {
    const [values, setValues] = useState({
        diamondValue: '',
        oldDiamondValue: 0,
        loading: false,
        error: '',
        createdDiamondValue: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token } = isAuthenticated();
    const {
        diamondValue,
        oldDiamondValue,
        loading,
        error,
        createdDiamondValue,
        redirectToProfile,
        formData
    } = values;

    // load categories and set form data
    const init = () => {
        showBalance().then(data => {
            
                if (data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    console.log(data);
                    let diamondVal = 0;
                    if(data.length === 1){
                        diamondVal = data[0].takaPerDiamond;
                    }
                    setValues({
                        ...values,
                        oldDiamondValue: diamondVal,
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

        addDiamondValue(user._id, token, {diamondValue}).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                
                setValues({
                    ...values,
                    oldDiamondValue: diamondValue,
                    diamondValue: '',
                    loading: false,
                    createdDiamondValue: 'Balance'
                });
            }
        });
    };

    const newPostForm = () => (
        <form className="mb-3 m-5" onSubmit={clickSubmit}>
            <h4>How many taka equals to 1 diamond? Now {oldDiamondValue}tk = 1 Diamond</h4>

            <div className="form-group">
                
                <input onChange={handleChange('diamondValue')} type="number" className="form-control" value={diamondValue} />
            </div>

            <button className="btn btn-outline-primary">Add Diamond value</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdDiamondValue ? '' : 'none' }}>
            <h2>{`${createdDiamondValue}`} is created!</h2>
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

export default ModifyDiamondsValue;
