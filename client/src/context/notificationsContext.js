import React, { useState, useEffect, createContext, useContext } from 'react';
import { isAuthenticated } from '../auth';
import { getUnseenMessagesByReceiver } from '../user/apiUser';

export const NotificationsContext = createContext();

export const UserProvider = (props)=> {
    const [notifications, setNotifications] = useState(0);
    const { user, token } = isAuthenticated();
    
    useEffect(() => {
        if(user){
                    getUnseenMessagesByReceiver(user, token)
            .then(messages => {
                
                setNotifications(messages.length);
            });
        }else{
            return;
        }


        
        
    }, []);



    return(
        <NotificationsContext.Provider value={[notifications, setNotifications]}>
            {props.children}
        </NotificationsContext.Provider>
    )
}