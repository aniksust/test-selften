import { API } from '../config';

export const verifyOTP = async (phone, otp)=>{
    try{
        const response = await fetch(`${API}/verify-otp/${phone}/${otp}`, {
            method: 'GET'
        });

        return response.json();
    }catch(err){
        return console.log(err);
    }

}
export const ReresendOTPCode = async(phone)=>{
    try{
        
        const response = await fetch(`${API}/user/resend-otp-user/${phone}`, {
            method: "GET",
            
        });
        console.log(response)

        return response.json();
    }catch(err){
        console.log(err);
    }
}
export const resendResetOTPCode = async (phone)=>{
    try{
        const response = await fetch(`${API}/resend-reset-otp/${phone}`, {
            method: "GET",
            
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
}

export const resendOTPCode = async (phone)=>{
    try{
        const response = await fetch(`${API}/resend-otp/${phone}`, {
            method: "GET",
            
        });

        return response.json();
    }catch(err){
        console.log(err);
    }
}

export const signup = user => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const signin = user => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
};

export const signout = next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        next();
        return fetch(`${API}/signout`, {
            method: 'GET'
        })
            .then(response => {
                console.log('signout', response);
            })
            .catch(err => console.log(err));
    }
};

export const isAuthenticated = () => {
    if (typeof window == 'undefined') {
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};
