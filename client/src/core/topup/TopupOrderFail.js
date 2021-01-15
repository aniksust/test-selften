import React, { Fragment } from 'react';
import {useParams} from 'react-router-dom';
import Layout from '../Layout';

const TopupOrderFail = ()=>{
    const {transactionId} = useParams();


    return(
      
            <Layout>
                <h4>Order Failed. Please order again</h4>

            <p>Please keep this {transactionId} - transaction id to contact us if you paid but order isn't saved</p>
        
            </Layout>
            
    )
}

export default TopupOrderFail;