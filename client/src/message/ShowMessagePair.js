import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../core/Layout';
import { AdminLinks } from '../user/AdminDashboard';
import { UserLinks } from './../user/UserDashboard';
import { isAuthenticated } from '../auth';
import { getMessage } from '../core/apiCore';

const ShowMessagePair = () => {
    const [messagesPair, setMessagesPair] = useState(null);
    const { user, token } = isAuthenticated();

    useEffect(() => {
        getMessage(user._id, token).then(data => {
            if (!data) {
                console.log('no message')
            } else {
                
                setMessagesPair(data);
                
            }
        })
    }, []);

    return (



        <Layout
            title={`Hi ${user.name}`}
            description={`This is Message Page`}
            className="container-fluid"
        >
            <div className="row">
                {
                    user.role === 1 ?
                        <div className="col-md-3"><AdminLinks /></div>
                        :
                        <div className="col-md-3"><UserLinks /></div>
                }
            
                <div className="col-md-9 m-b-250 mb-5">
                    
                    {
                        messagesPair ?
                            messagesPair.map(messages=>{
                                return (
                                    <div className="border p-1 m-3" key={messages._id}>
                                        <Link exact to={`/messages/pair/${messages._id}/`}>
                                            <p>By: {messages.user.name}</p>
                                            {
                                                messages.message.filter(receivedMsg => {
                                                    return (receivedMsg.user === user._id && receivedMsg.seen === false)
                                                }).length > 0 ?
                                                    <p>Unread messages</p>
                                                    :
                                                    <Fragment></Fragment>
                                                
                                            }
                                            <p>Message: {messages.message[messages.message.length - 1].message}</p>
                                            <p>To: {messages.receiver.name}</p>
                                            
                                        </Link>
                                    </div>
                                       
                                )
                            
                            })
                            :
                            <Fragment>Loading...</Fragment>
                    }
                </div>  
               
            </div>
        </Layout>
    )
}

export default ShowMessagePair;


