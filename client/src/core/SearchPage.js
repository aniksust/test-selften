import React, { useState, useEffect, Fragment } from 'react';
import {Link, useParams} from 'react-router-dom';
import {getItemsBySearch} from './apiCore';
import Layout from './Layout';
import './searchPage.css';

const SearchPage = ()=>{
    const [searchData, setSearchData] = useState([]);
    const [error, setError] = useState('');
    const {searchText} = useParams(); 


        // load categories and set form data
    const init = async () => {

        const data = await getItemsBySearch(searchText);
        if(data[0].length === 0 && data[1].length === 0){
            setError('No products or topup found');
        }
        setSearchData(data);
        

       
          
    };

    useEffect(() => {
        init();
    }, []);

   

    return(
        <Layout>
            <div className="search-page">
                {error}
                {searchData ?
                    searchData.map(datas=>{
                        return(
                        datas.map(s=>{
                            return(
                                <Fragment>
                                    <br />
                                    { s.title ? 
                                        <Link exact to={`/topups/${s._id}/type/${s.type}`}>{s.title}</Link>
                                        :
                                        <Fragment></Fragment>
                                    }
                                    <br />
                                    { s.name ? 
                                        <Link exact to={`/product/${s._id}`}>{s.name}</Link>
                                        
                                        :
                                        <Fragment></Fragment>

                                    }
                                </Fragment>
                            )
                            
                        }))
                    })
                    :
                    <Fragment>Loading...</Fragment>
                }
                
            </div>
        </Layout>
    )
}

export default SearchPage;