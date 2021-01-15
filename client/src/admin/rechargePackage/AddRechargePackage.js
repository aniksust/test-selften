import React, { useState, useEffect, Fragment } from 'react';
import Layout from './../../core/Layout';
import { isAuthenticated } from './../../auth';
import { Link } from 'react-router-dom';
import {getRechargePackagesByGameName, getTopupThumbs} from './../../core/apiCore'
import { createRechargePackage, deleteRechargePackage, editRechargePackage } from './../apiAdmin';
import { AdminLinks } from '../../user/AdminDashboard';
import './rechargePackage.css';

const AddRechargePackage = () => {
    const [values, setValues] = useState({
        msg: '',
        rechargePackages: [],
        topupForPackages: '',
        topupGameNames: [],
        topupGameName: '',
        packageName: '',
        packageAmount: '',
        loading: false,
        error: '',
        createdRechargePackage: '',
        redirectToProfile: false,
        formData: '',
        pkgName: '',
        pkgAmount: '',
    });

    const { user, token } = isAuthenticated();
    const {
        pkgName,
        pkgAmount,
        msg,
        rechargePackages,
        topupForPackages,
        topupGameNames,
        topupGameName,
        packageName,
        packageAmount,
        error,
        createdRechargePackage,
        redirectToProfile,
        formData,
        loading
    } = values;

 // load Topup Game names and set form data
 const init = async () => {
    setValues({ ...values, loading: true });
    
        const thumb = await getTopupThumbs();  
        if (thumb.error) {
            setValues({ ...values, error: thumb.error });
        } else {
            setValues({
                ...values,
                topupGameNames: thumb,
                formData: new FormData(),
                loading: false,
            });
        }
    
};

useEffect(() => {
    init();
}, []);

const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
};

useEffect(()=>{
    
    const loadPackages = async ()=>{
        if(topupForPackages === ''){
            return setValues({ ...values, rechargePackages: []});
            
        }else{
            setValues({ ...values, error: '', loading: true });
            const loadedPackages = await getRechargePackagesByGameName(topupForPackages);

            setValues({ ...values, rechargePackages: loadedPackages, loading: false});
        }
    }
    loadPackages();
}, [topupForPackages])

const editRP = async (id, i)=>{
    setValues({ ...values, msg: '...updating'});
    const packageName = document.getElementsByName(`${id}-packageName`)[0].value;
    const packageAmount = document.getElementsByName(`${id}-packageAmount`)[0].value;

    const edited = await editRechargePackage(user, token, id, packageName, packageAmount);
    
    setValues({ ...values,  msg: 'updated'});
    
}
const deleteRP = async ( id, i)=>{
    setValues({ ...values, msg: '...loading'});

    const deleted = await deleteRechargePackage(user, token, id);

    setValues({ ...values, rechargePackages:  rechargePackages.filter(rps=>{
        return rps._id !== id
    }),  msg: ''});
}

const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: '', loading: true });

    createRechargePackage(user._id, token, formData).then(data => {
        if (data.error) {
            setValues({ ...values, error: data.error });
        } else {
            setValues({
                ...values,
                packageName: '',
                packageAmount: '',
                loading: false,
                createdRechargePackage: data.name
            });
        }
    });
};

// const toggleEdit = (id)=>{
//     if(document.getElementById(`${id}-edit`)){
        
//         if(document.getElementById(`${id}-edit`).style.display = "none"){
//             console.log('hi')
//             document.getElementById(`${id}-edit`).style.display = "block";
//             document.getElementById(`${id}-show`).style.display = "none";
//             document.getElementById(`${id}-toggle`).innerHTML = "Cancell";
//             return;
//         }
        
//         if(document.getElementById(`${id}-show`).style.display = "none"){
//             console.log('ji')
//             document.getElementById(`${id}-edit`).style.display = "none";
//             document.getElementById(`${id}-show`).style.display = "block";
//             document.getElementById(`${id}-toggle`).innerHTML = "Edit";

//         }
        
//     }
// }

const newPostForm = () => (
    <Fragment>
    <form className="mb-3 m-5" onSubmit={clickSubmit}>
        <h4>Create Racharge Package</h4>
        
        <div className="form-group">
            <label className="text-muted">Game Name</label>
            <select name="topupGameName" onChange={handleChange('topupGameName')} className="form-control">
                <option disabled selected>Please select</option>
                {topupGameNames &&
                    topupGameNames.map((c, i) => (
                        
                        <option key={i} value={c._id}>
                            {c.title}
                        </option>
                        
                    ))}
            </select>
        </div>

        <div className="form-group">
            <label className="text-muted">Package Name</label>
            <input name="packageName" onChange={handleChange('packageName')} type="text" className="form-control" value={packageName} />
        </div>

        <div className="form-group">
            <label className="text-muted">Package Price</label>
            <input name="packageAmount" onChange={handleChange('packageAmount')} type="number" className="form-control" value={packageAmount} />
        </div>


        <button className="btn btn-outline-primary">Create Recharge Package</button>
    </form>

    <div className="form-group">
            <label className="text-muted">See packages by Game Name</label>
            <select name="topupForPackages" onChange={handleChange('topupForPackages')} className="form-control">
                <option selected value=''>Please select</option>
                {topupGameNames &&
                    topupGameNames.map((c, i) => (
                        
                        <option key={i} value={c._id}>
                            {c.title}
                        </option>
                        
                    ))}
            </select>
        </div>

        <div className="recharge-package row">
            <p className="loading">{msg}</p>
            {
                rechargePackages.map((r, i)=>(
                    <div className="col-md-2" key={r._id}>
                        

                        
                            <div id={`${r._id}-edit`}>
                                <input onChange={handleChange('pkgName')} type="text" placeholder={r.packageName} className="form-control" value={pkgName} name={`${r._id}-packageName`} />
                                <input onChange={handleChange('pkgAmount')} type="text" placeholder={r.packageAmount} className="form-control" value={pkgAmount} name={`${r._id}-packageAmount`} />
                       
                                <p className="btn btn-primary cursor-pointer" onClick={()=>{editRP( r._id, i)}}>Update</p>
                                <p className="btn btn-primary cursor-pointer" onClick={()=>{deleteRP( r._id, i)}}>delete</p>
                            </div>
                            
                            {/* <div id={`${r._id}-show`}>
                                <p>{r.packageName}</p>
                                <p>{r.packageAmount}</p>

                            </div>
                            <div className="cursor-pointer" id={`${r._id}-toggle`} onClick={()=>{toggleEdit(r._id)}}>
                               
                                Edit
                            
                            </div> */}

                        
                        


                    </div>       
                ))

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
    <div className="alert alert-info" style={{ display: createdRechargePackage ? '' : 'none' }}>
        <h2>{`${createdRechargePackage}`} is created!</h2>
    </div>
);

const showLoading = () =>
    loading && (
        <div className="alert alert-success loading">
            <h2>Loading...</h2>
        </div>
    );

return (
    <Layout title="Add a new recharge package" description={`G'day ${user.name}, ready to add a new recharge package?`}>
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

export default AddRechargePackage;
