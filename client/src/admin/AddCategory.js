import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createCategory } from "./apiAdmin";
import { AdminLinks } from "../user/AdminDashboard";

const AddCategory = () => {
    const [values, setValues] = useState({
        name: '',
        photo: '',
        formData: '',
    });

    const {name, photo, formData} = values;
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    // destructure user and token from localstorage
    const { user, token } = isAuthenticated();

    const handleChange = name => event => {
        setError("");
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value });
    };

    const init = () => {

         setValues({
            ...values,
            formData: new FormData()
        });

    };

    useEffect(() => {
        init();
    }, []);
 

    const clickSubmit = e => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        // make request to api to create category
        createCategory(user._id, token, formData).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setError("");
                setSuccess(true);
                setValues({
                    ...values,
                    name: '',
                    photo: ''
                    
                });
            }
        });
    };

    const newCategoryFom = () => (
        <form onSubmit={clickSubmit}>
            <h4>Create Category with a photo</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    type="text"
                    className="form-control"
                    onChange={handleChange('name')}
                    value={name}
                    name="name"
                    autoFocus
                    required
                />
            </div>
            <button className="btn btn-outline-primary">Create Category</button>
        </form>
    );

    const showSuccess = () => {
        if (success) {
            return <h3 className="text-success">{name} is created</h3>;
        }
    };

    const showError = () => {
        if (error) {
            return <h3 className="text-danger">Category should be unique</h3>;
        }
    };

    const goBack = () => (
        <div className="mt-5">
            <Link to="/admin/dashboard" className="text-warning">
                Back to Dashboard
            </Link>
        </div>
    );

    return (
        <Layout
            title="Add a new category"
            description={`G'day ${user.name}, ready to add a new category?`}
        >
            <div className="row">
            <div className="col-md-3"><AdminLinks /></div>
                <div className="col-md-6 offset-md-2">
                    {showSuccess()}
                    {showError()}
                    {newCategoryFom()}
                    {goBack()}
                </div>
            </div>
        </Layout>
    );
};

export default AddCategory;
