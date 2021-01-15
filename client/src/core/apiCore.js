import { API } from "../config";
import queryString from "query-string";


//send messages
export const sendMessage = async (token, userId, receiverId, pairId, message) => {
    try{
        const response = await fetch(`${API}/user/${userId}/message/${receiverId}/pair/${pairId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: message
        })

        return response.json();
    }

    
    catch(err) {
        console.log(err);
    }
}

// read chats for eavh pair
export const messageByPairId = async (userId, token, pairId) => {
    try{
        const response = await fetch(`${API}/user/${userId}/message-pair/${pairId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        return response.json();
    }
    catch(err){ console.log(err)}
}

//show messages list of pair to user
export const getMessage = async (userId, token) => {
    try{
        const response = await fetch(`${API}/user/messages/${userId}`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        
        return response.json();
    }

    
    catch(err) {console.log(err)}
}

//creating topup order
export const createTopupOrder = async (userId, token, order, id, withSSLCommerz)=>{
    try{
        const response = await fetch(`${API}/topup-orders/${userId}/topup/${id}/${withSSLCommerz}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: order
            })

        return response.json();
    }


    
    catch(err) {
        console.log(err);
    }
}

//get wallet
export const getWallet = async (id, token) => {
    try{
        const response = await fetch(`${API}/wallet/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
        return response.json();
    }catch(err){console.log(err)};
}

export const getTopupById = async (id)=>{
    try{
        const response = await fetch(`${API}/topup-thumbs/single/${id}`, {
            method: "GET"
        });
            
        return response.json();
    }
    catch(err){console.log(err)};
}

//get topup thumbs
export const getTopupThumbs = async () => {
    try{
        const response = await fetch(`${API}/topup-thumbs`, {
            method: "GET"
        });
            
        return response.json();
    }
    catch(err){console.log(err)};
};

//get Recharge Packages for admin
export const getRechargePackages = async () => {
    try{
        const response = await fetch(`${API}/recharge-package`, {
            method: "GET"
        })

        return response.json();
    }

    
    catch(err) {console.log(err)};
};

//get recharge packages by game id
export const getRechargePackagesByGameName = async (game) => {
    try{
        const response = await fetch(`${API}/recharge-package/get-by-game/${game}`, {
            method: "GET"
        })
        return response.json();
    }

        
    catch(err) {console.log(err)}
};

export const getProducts = async (sortBy) => {
    try{
        const response = await fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
            method: "GET"
        });
        return response.json();
    }catch(err ) {console.log(err)};
};

export const getCategories = async () => {
    try{
        const response = await fetch(`${API}/categories`, {
                method: "GET"
            })
        return response.json();
    }catch(err){ console.log(err)};
};

export const getFilteredProducts = async (skip, limit, filters = {}) => {
    try{
        const data = {
            limit,
            skip,
            filters
        };
        const response = await fetch(`${API}/products/by/search`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        return response.json();
    }catch(err) {
            console.log(err);
    }
};

export const list = params => {
    const query = queryString.stringify(params);
    console.log("query", query);
    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const read = async (productId) => {
    try{
        const response = await fetch(`${API}/product/${productId}`, {
            method: "GET"
        })
        return response.json();
    }
    catch(err){ console.log(err)}
};

export const listRelated = async (productId) => {
    try{
        const response = await fetch(`${API}/products/related/${productId}`, {
            method: "GET"
        })
            
        return response.json();
    }
    
    catch(err){console.log(err)}
};

export const getBraintreeClientToken = async (userId, token) => {
    try{
        const response = await fetch(`${API}/braintree/getToken/${userId}`, {
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

export const processPayment = async (userId, token, paymentData) => {
    try{
        const response = await fetch(`${API}/braintree/payment/${userId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
        })
        
        return response.json();
    }

    
    catch(err){console.log(err)}
};

export const createOrder = async (userId, token, createOrderData) => {
    try{
        const response = await fetch(`${API}/order/create/${userId}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ order: createOrderData })
        })
        
        return response.json();
    }catch(err){console.log(err)}
};

//search by item for both product and topup
export const getItemsBySearch= async(searchText)=>{
    try{
        const response = await fetch(`${API}/search/${searchText}/`, {
            
            method: 'GET',
            
        });

        return response.json();
    }catch(err){
        console.log(err)
    }

    

}

//slider images
export const sliderImages = async()=>{
    try{
        const response = await fetch(`${API}/slider/`, {
            
            method: 'GET',
            
        });

        return response.json();
    }catch(err){
        console.log(err)
    }

}
