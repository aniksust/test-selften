import React, { useState, useEffect } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import {createTopupThumb} from './../apiAdmin'
import { AdminLinks } from '../../user/AdminDashboard';

const AddTopupThumb = () => {
    const [values, setValues] = useState({
        region:'',
        platform: '',
        publisher: '',
        about:'',
        title: '',
        type: '',
        thumb: '',
        loading: false,
        error: '',
        createdTopup: '',
        redirectToProfile: false,
        formData: ''
    });

    const { user, token } = isAuthenticated();
    const {
        region,
        platform,
        publisher,
        about,
        title,
        loading,
        type,
        error,
        createdTopup,
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
        const value = name === 'thumb' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        createTopupThumb(user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    title: '',
                    thumb: '',
                    loading: false,
                    createdProduct: data.title
                });
            }
        });
    };

    const newPostForm = () => (
        <form className="mb-3 m-5" onSubmit={clickSubmit}>
            <h4>Game Thumbnail Photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('thumb')} type="file" name="thumb" accept="image/*" />
                </label>
            </div>
            <div className="form-group col-md-4">
                    
                <label className="text-muted">Type</label>
                <select name="type" onChange={handleChange('type')} className="form-control">
                    <option disabled selected>Please select type</option>
                    <option value="inGame">In Game</option>
                    <option value="idCode">Id Code</option>
                        
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Title of the Game</label>
                <input onChange={handleChange('title')} type="text" className="form-control" value={title} />
            </div>
            <div className="form-group">
                <label className="text-muted">Region</label>
                <input onChange={handleChange('region')} type="text" className="form-control" value={region} />
            </div>
            <div className="form-group">
                <label className="text-muted">Platform</label>
                <input onChange={handleChange('platform')} type="text" className="form-control" value={platform} />
            </div>
            <div className="form-group">
                <label className="text-muted">Publisher</label>
                <input onChange={handleChange('publisher')} type="text" className="form-control" value={publisher} />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea onChange={handleChange('about')} type="text" className="form-control" value={about}>About</textarea>
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
        <div className="alert alert-info" style={{ display: createdTopup ? '' : 'none' }}>
            <h2>{`${createdTopup}`} is created!</h2>
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

export default AddTopupThumb;
