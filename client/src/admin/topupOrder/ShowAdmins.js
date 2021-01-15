import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { isAuthenticated } from '../../auth';
import Layout from '../../core/Layout';
import { AdminLinks } from '../../user/AdminDashboard';
import { getAllAdmins, assignTopupOrder } from './../apiAdmin';
import './showAdmins.css';

const ShowAdmins = ()=>{
    const history = useHistory();
    const [admins, setAdmins] = useState([]);
    const {topupOrderId} = useParams();
    const { user, token } = isAuthenticated();

    useEffect(()=>{
        getAllAdmins(user, token).then(data=>{
            console.log(data);
            setAdmins(data);
        })
    },[]);

    //assign order to admin onclick
    const assignTopupToAdmin = (adminId)=>{
        assignTopupOrder(user, token, adminId, topupOrderId).then(data=>{
            if(data){
                 history.push('/admin/topup-orders')
            }else{
                console.log('err')
            }
           

        })
    }

    return(
    
            <Layout
                title="Assign this order"
                description="To a admin agent"
            >
                <div className="row">
                <div className="col-md-3"><AdminLinks /></div>
                <div className="col-md-7">
                    { admins ?
                        admins.map(admin=>{
                            return(
                                <div className="col-md-10">
                                    <p onClick={()=>{assignTopupToAdmin(admin._id)}} className="border pointer">{admin.name}: {admin.email}, click to assign</p>
                                </div>
                            )
                        })
                        :
                        <Fragment></Fragment>
                    }
                </div>
            </div>

            </Layout>
            
        
    )
}

export default ShowAdmins;