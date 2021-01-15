import React, { useState, useEffect, Fragment } from 'react';
import { sendResetOTP } from './apiUser';
import './resendOTP.css';

const ResendPasswordResetOTP = ({phone})=>{
    const [error, setError] = useState('');
    const [counter, setCounter] = useState(0);

    const resendOTP = async ()=> {

        const reset = await sendResetOTP(phone);
        if(reset.sendAgain){
            setCounter(0);
            return setError(`A new OTP code sent to your phone`);
        }
        if(reset.error){
            return setError(reset.error);
        }


    }

    useEffect(()=>{
      const clock = ()=>{  
            if(counter === 60){
                clearInterval(iv);
            }else{
                setCounter(counter + 1);
            }
        }
        const iv = setInterval(clock, 1000);
        return () => {
            clearInterval(iv)
        }
    })
    

    return(
        <Fragment>
            <p>{error}</p>
        
            <div className="row otp-width">
                
                <input disabled className="col-7 otp-input" type="text" value={phone} />
                <input disabled className="col-4 otp-input" type="text" value={counter} />
                
            </div>
            <div className="row otp-width">
                {
                    counter === 60?
                        <p className="otp-resend-btn cursor-pointer pl-1 otp-text" onClick={resendOTP}>Didn't receive? Resend code</p>
                    :
                    <Fragment></Fragment>
                    // <p className="down-color pl-1 otp-text">If you don't receive OTP in 2 minutes, please resend</p>
                }
            </div>
        </Fragment>
    )
}

export default ResendPasswordResetOTP;