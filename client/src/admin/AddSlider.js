import React, { useState, useEffect } from 'react';
import Layout from './../core/Layout';
import { isAuthenticated } from './../auth';
import {createSlider} from './apiAdmin'
import { AdminLinks } from '../user/AdminDashboard';

const AddSlider = () => {
    const [values, setValues] = useState({
        title: '',
        photo: '',
        loading: false,
        error: '',
        createdSlider: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token } = isAuthenticated();
    const {
        title,
        loading,
        error,
        createdSlider,
        redirectToProfile,
        formData
    } = values;


        // load categories and set form data
        const init = () => {
            
            setValues({
                ...values,
                formData: new FormData()
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

        createSlider(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    title: '',
                    photo: '',
                    loading: false,
                    createdProduct: data.title
                });
            }
        });
    };

    const newPostForm = () => (
        <form className="mb-3 m-5" onSubmit={clickSubmit}>
            <h4>Slider Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div>
            

            <div className="form-group">
                <label className="text-muted">Title of the Slider</label>
                <input onChange={handleChange('title')} type="text" className="form-control" value={title} />
            </div>

            <button className="btn btn-outline-primary">Create Topup Thumb</button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: createdSlider ? '' : 'none' }}>
            <h2>{`${createdSlider}`} is created!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    return (
        <Layout title="Add a new topup system" description={`G'day ${user.name}, ready to add a new topup?`}>
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

export default AddSlider;
