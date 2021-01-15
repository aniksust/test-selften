
import { API } from '../config';

//edit recharge package

export const editRechargePackage = async (user, token, rp, packageName, packageAmount)=>{
    try{
        const response = await fetch(`${API}/recharge-package/edit/${user._id}/${rp}/${packageName}/${packageAmount}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
            
        })
        return response.json();
    }catch(err){
        console.log(err);
    }
}

//delete recharge package
export const deleteRechargePackage = async (user, token, rp)=>{
    try{
        const response = await fetch(`${API}/recharge-package/delete/${user._id}/${rp}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            }
            
        })
        return response.json();
    }catch(err){
        console.log(err);
    }
}

//add to wallet
export const addToWallet = async (user, token, wallet)=>{
    try{
        const response = await fetch(`${API}/wallet/add/${user._id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: wallet
        })

        return response.json();
    }catch(err){
        console.log(err)
    }
    
}

//create slider 
export const createSlider = async (userId, token, slider) => {
    try{
        const response =  await fetch(`${API}/slider/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: slider
        })
    
        return response.json();
    }catch(err) {
        console.log(err);
    };
};

// add coupons
export const addCoupon = async (userId, token, coupon) => {
    try{
        const response = await fetch(`${API}/coupon/create/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: coupon
        })

        return response.json();
    }
    catch(err){
        console.log(err);
    }
        
        
};

// show coupons
export const showCoupon = async (userId, token, coupon) => {
    try{
        const response = await fetch(`${API}/coupon/`, {
            method: 'GET',
        });

        return response.json();
    }
        
    catch(err){
        console.log(err);
    };
};

//assign topup order to admin
export const assignTopupOrder = async (user, token, adminId, topupOrderId)=>{
    try{
        const response = await fetch(`${API}/topup-orders/assigning/${adminId}/${user._id}/${topupOrderId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            
        })
        
        return response.json();
        
    }catch(err) {
            console.log(err);
    }
}

//get all admins to assign order
export const getAllAdmins = async (user, token) => {
    try{
        const response = await fetch(`${API}/user/admins/${user._id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },

        })

        return response.json();
    
    }catch(err){
        console.log(err);
    }
};


// show balance
export const showBalance = async ()=> {
    try{

        const response = await fetch(`${API}/admin/balance`, {
            method: 'GET'
        })

        return response.json();
    
    }catch(err){console.log(err)}
}

//add balance
export const addBalance = async (userId, token, balance) => {
    try{
        const response = await fetch(`${API}/admin/balance/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(balance)
        })

        return response.json();
    }catch(err) {
            console.log(err);
        }
}; 
export const addDiamondValue = async (userId, token, diamondValue) => {
    try{
    const response = await fetch(`${API}/admin/add-diamonds/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(diamondValue)
    })
    
    return response.json();    
}    catch(err){
    console.log(err);
}   
}; 

//update topup orders
export const updateTopupOrderAdmin = async (topupOrderId, userId, token, sentStatus) => {
    try{
        const response = await fetch(`${API}/topup-orders/update/${topupOrderId}/${userId}/${sentStatus.status}/${sentStatus.customerId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: sentStatus,
        })

        return response.json();
    }

    
    catch(err) {console.log(err)}
};


//get all topup orders
export const getTopupOrdersAdmin = async (userId, token) => {
    try{
        const response = await fetch(`${API}/topup-orders/admin/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: {}
        })

        return response.json();
    }
    catch(err){console.log(err)}
};

//get assigned topup orders for admin
export const getAssignedTopupOrdersAdmin = async (userId, token) => {
    try{
        const response = await fetch(`${API}/topup-orders/assigned/admin/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: {}
        });

        return response.json();
    }
    catch(err){console.log(err)}
};

//create recharge packages
export const createRechargePackage = async (userId, token, rechargePackage)=>{
    try{
        const response = await fetch(`${API}/recharge-package/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: rechargePackage
        });

        return response.json();
    }
    catch(err){
            console.log(err);
    }
}

export const createTopupThumb = async (userId, token, topup) => {
    try{
        const response = await fetch(`${API}/topup-thumbs/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: topup
        })

        return response.json();
    }

    
    catch(err) {
        console.log(err);
    }
};

export const createCategory = async (userId, token, category) => {
    try{
        const response = await fetch(`${API}/category/create/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: category
        })

        return response.json();
    }

    
    catch(err) {
        console.log(err);
    }
};

export const updateCategory = async (categoryId, userId, token, category) => {
    try{
        const response = await fetch(`${API}/category/${categoryId}/${userId}`, {
        method: 'PUT',
        headers: {
            // content type?
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    
    return response.json();
    }

    
    catch(err){console.log(err)}
};

export const createProduct = async (userId, token, product) => {
    try{
        const response = await fetch(`${API}/product/create/${userId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: product
        })
        
        return response.json();
    }

    
    catch(err) {
        console.log(err);
    }
};

export const getCategory = async categoryId => {
    try{
        const response = await fetch(`${API}/category/${categoryId}`, {
            method: 'GET'
        })

        return response.json();
    }
    
    catch(err){console.log(err)}
};

export const getCategories = async () => {
    try{
        const response = await fetch(`${API}/categories`, {
            method: 'GET'
        })

        return response.json();
    }

    catch(err){ console.log(err)}
};

export const listOrders = async (userId, token) => {
    try{
        const response = await fetch(`${API}/order/list/${userId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        
        return response.json();
    
    }catch(err) {console.log(err)}
};

export const getStatusValues = async (userId, token) => {
    try{
        const response = await fetch(`${API}/order/status-values/${userId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        
        return response.json();
    }

    
    catch(err) {console.log(err)}
};

export const updateOrderStatus = async (userId, token, orderId, status) => {
    try{
        const response = await fetch(`${API}/order/${orderId}/status/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status, orderId })
        })
        return response.json();
    }

    catch(err){ console.log(err)}
};

/**
 * to perform crud on product
 * get all products
 * get a single product
 * update single product
 * delete single product
 */

export const getProducts = async () => {
    try{
        const response = await fetch(`${API}/products?limit=undefined`, {
            method: 'GET'
        });
        
        return response.json();
    }

    
    catch(err){ console.log(err)}
};

export const deleteProduct = async (productId, userId, token) => {
    try{
        const response = await fetch(`${API}/product/${productId}/${userId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        return response.json();
    }

    catch(err){console.log(err)}
};

export const getProduct = async (productId) => {
    try{
        const response = await fetch(`${API}/product/${productId}`, {
            method: 'GET'
        })
        
        return response.json();
    }
    catch(err){console.log(err)}
};

export const updateProduct = async (productId, userId, token, product) => {
    try{

    
        const response = await fetch(`${API}/product/${productId}/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: product
        })

        return response.json();
    }
    
    catch(err){console.log(err)}
};
