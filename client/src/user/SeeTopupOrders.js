import React, { useState, useEffect, Fragment } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getTopupOrdersByUser } from "./apiUser";
import { AdminLinks } from "./AdminDashboard";
import { UserLinks } from "./UserDashboard";
import './seeTopupOrders.css';

const SeeTopupOrders = ()=>{
    const {user, token} = isAuthenticated();
    const [topupOrders, setTopupOrders] = useState([]);

    const init = async ()=>{
        try{

            const UsersTopupOrders = await getTopupOrdersByUser(user, token);
            console.log(UsersTopupOrders)
            setTopupOrders(UsersTopupOrders);
        
        }catch(err){
            console.log(err)
        }
      
        
    }

    useEffect(()=>{
        init();
    },[])

    return(
        <Layout
            title="Dashboard"
            description={`G'day!`}
            className="container-fluid"
        >
            <div className="row">
                
                <div className="col-md-3">{ user.role === 1 ?
                    
                    <AdminLinks />
                    :
                    <UserLinks />
                }</div>
              
                <div className="col-md-9">
        
                    <h5>My topup orders</h5>
                    <div className="row">
        
                        {
                            topupOrders.map((order, i)=>(


                                        <div className="col-md-4 p-5" key={order._id}>
                                                <h6 className="">Order id: <p className="order-id">{ order._id }</p></h6>
                                                
                                                <h6>Total Price: { order.price } Tk</h6>
                                                <h6>Status: {order.status} </h6>

                                                {
                                                    order.pair ?
                                                    <Link exact to={`/messages/pair/${order.pair._id}`} >
                                                        <h5 className="border"><b>Send message</b></h5>
                                                    </Link>
                                                :
                                                    <Fragment></Fragment>
                                                
                                                }
                                                <h6>Player ID: {order.user._id} </h6>

                                            
                                        </div>

                            ) )
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SeeTopupOrders;