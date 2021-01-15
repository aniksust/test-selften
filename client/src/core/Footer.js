import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ()=>{
    return (
        <div id="footer" className="row">
            <div className="col-md-6">

                <h5 className="site-name-footer">© 2020 SELFTEN.com</h5>

                <p>Disclaimer: Registered names and trademarks are the copyright 
                    and property of their respective owners. Use of this Web site 
                    constitutes acceptance of the <Link exact to="/terms-condition">Terms and Condition</Link>
                    <Link exact to="/privacy-policy">Privacy Policy</Link>,
                    <Link exact to="/shipment-info">Shipment info</Link>,
                    <Link exact to="/refund-return-policy">Refund and Return Policy</Link> &
                    <Link exact to="/about-us">About Us</Link>
                </p>
                
            </div>
            <div className="col-md-3">
                <h5>Follow us</h5>
                <a exact href="https://www.youtube.com/channel/UC1yaSj3ejk-11bMcZ-G4yNw">YouTube</a>
                <a exact href="https://www.facebook.com/selften/">Facebook</a>
            </div>
            <div className="col-md-3">
                <img src="/images/ssl.png" width="120" />
                <p>Payment by SSL commerce</p>
            </div>
            

        </div>
    )
}

export default Footer;