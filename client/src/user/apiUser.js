import { API } from "../config";

export const resetNewPassword = async (phone, password)=>{

    try{
        const response = await fetch(`${API}/user/set-new-password/${phone}/${password}`, {
            method: 'GET'
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
    
}

export const resetPasswordByPhone = async (phone, otp)=>{
    try{
        const response = await fetch(`${API}/user/check-reset-otp/${phone}/${otp}`, {
            method: 'GET'
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
}

export const sendResetOTP = async (phone)=>{
    try{
        const response = await fetch(`${API}/user/reset-password/${phone}`, {
            method: 'GET'
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
}

//get topup order by user
export const getTopupOrdersByUser = async (user, token)=>{

    try{

        const response = await fetch(`${API}/topup-order/by-user/${user._id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        return response.json();
    }
    catch(err){ console.log(err)};
}

export const getCouponsByUser = async (user, token)=>{

    try{
        const response = await fetch(`${API}/coupon/${user._id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return response.json();
    }
    catch(err){ console.log(err)};
}

export const collectCouponByUser = async (couponId, user, token)=>{
    try{
            const response = await fetch(`${API}/coupon/${couponId}/${user._id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return response.json();
    }

    
    catch(err){ console.log(err)}
}

export const getDiamonds = async (user, token)=>{
    try{
        const response = await fetch(`${API}/diamonds/${user._id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return response.json();
    }
    
    catch(err){ console.log(err)}
}

export const getUnseenMessagesByReceiver = async (user, token) => {
    try{
        const response = await fetch(`${API}/user/get-unseen-messages/receiver/${user._id}`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: {}
        })

        return response.json();
    }

            
    catch(err) {console.log(err)};
}

export const read = async (userId, token) => {
    try{
        const response = await fetch(`${API}/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return response.json();
    }

    
    catch(err){console.log(err)}
};

export const update = async (userId, token, user) => {
    try{
        const response = await fetch(`${API}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    })

    return response.json();
    }


    catch(err) {console.log(err)}
};

export const updateUser = async (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = await JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            await localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};

export const updateUserProfile = async (user, token, userData)=>{
    try{
        const response = await fetch(`${API}/user/update/${user._id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            body: userData,
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
}
export const getUserProfile = async (user, token)=>{
    try{
        const response = await fetch(`${API}/user/profile/${user._id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
}




export const getPurchaseHistory = async (userId, token) => {
    try{
        const response = await fetch(`${API}/orders/by/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return response.json();
    }

    catch(err){console.log(err)}
};
