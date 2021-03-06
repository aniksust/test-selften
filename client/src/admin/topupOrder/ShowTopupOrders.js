import React, {useEffect, useState, Fragment} from 'react';
import { isAuthenticated } from './../../auth';
import { getTopupOrdersAdmin, updateTopupOrderAdmin } from '../apiAdmin';
import { Link } from 'react-router-dom';
import Layout from '../../core/Layout';
import { AdminLinks } from '../../user/AdminDashboard';
import { sendMessage } from '../../core/apiCore';

const ShowTopupOrders = ()=>{
    const [orders, setOrders] = useState();

    const {user, token} = isAuthenticated();

    useEffect(()=>{
        getTopupOrdersAdmin(user._id, token).then(ord=>{
            if(ord.error){
                console.log(ord.error)
            }
            if(ord){
                setOrders(ord);
            }
            
        })
    
    },[]);

    // update order status
    const markTopupOrderStatus = (orderId, status, customerId) => {
            updateTopupOrderAdmin(orderId, user._id, token, {status, customerId})
                .then(data => {
                    if (data.error) {
                        console.log("couldn't happen");
                    } else {
                        
                        console.log('updated');
                    }
        })

    }

    return(
            
        <Layout
            title="All topup orders"
            description="See new orders"
        >

        <div className="row">
            <div className="col-md-3"><AdminLinks /></div>
            <div className="col-md-9">
                 <div className="row">
            {
                orders ? 
                orders.map(order=>{
                    return(
                           
                                <div className="col-md-4 p-5" key={order._id}>
                                    <Link exact to={`/topup-orders/${order._id}`}>
                                        {
                                            order.user ?
                                         <h6>Requested by: { order.user.name }</h6>
                                         :
                                         <p>User deleted</p>


                                        }
                                    </Link>
                                        <h6 className="hidden">{ order._id }</h6>
                                        {
                                            order.topupGameId?
                                            <h6>Game: {order.topupGameId.title}</h6>
                                            :
                                            <p>Game deleted</p>

                                        }
                                        {
                                            order.selectRecharge ?
                                        <h6>Pecharge Package: {order.selectRecharge.packageName}</h6>

                                        :
                                        <p>Recharge package deleted</p>
                                        }
                                         {
                                            order.gameUserId ?
                                            <h6>Game User Id: { order.gameUserId }</h6>
                                            :
                                            <Fragment>
                                                <h6>Account type: { order.accountType }</h6>
                                                <h6>Number: { order.gmailOrFacebook }</h6>
                                            </Fragment>
                                        }
                                        <h6>Password: { order.password }</h6>
                                        <h6>Paid Amount: { order.price } Tk</h6>
                                        <h6>Status: {order.status} </h6>
                                        
                                        {
                                            order.pair ?
                                            <Link exact to={`/messages/pair/${order.pair._id}`} >
                                                <h5 className="border"><b>Send message</b></h5>
                                            </Link>
                                        :
                                            <Fragment></Fragment>

                                        }
                                        

                                        { order.status === 'completed' || order.status === 'cancelled' ?
                                            <Fragment></Fragment>
                                            :
                                
                                        <Fragment>
                                            <b>Assigned to:</b> {
                                                order.assignedTo ?
                                                <p>{order.assignedTo.name}</p>
                                                :
                                                <Fragment>
                                                <p>none</p>
                                                    <Link exact to={`/admin/assign-topup-order/${order._id}`} className="border btn btn-secondary"><b>Assign it to a admin</b></Link>
                                                </Fragment>
                                            }
                                            <p className="btn btn-primary" role="button" onClick={() => { markTopupOrderStatus(order._id, 'completed', order.user._id) }}>Mark completed</p>
                                            <p className="btn btn-primary" role="button" onClick={() => { markTopupOrderStatus(order._id, 'cancelled', order.user._id) }}>Mark cancelled</p>
                                        </Fragment>
                                        }
                                        
                                    
                                </div>
                                     
                       
                    )
                })
                :
                <Fragment>Loading...</Fragment>
            }
            </div> 
            </div>
        </div>

        </Layout>



    )
}

export default ShowTopupOrders;