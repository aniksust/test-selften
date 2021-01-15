import React, { useState, useEffect } from 'react';

const TopSearch = ()=>{
    const [searchBox, setSearchBox] = useState({
        search: '',
        formData: '',
        error: '',

    });

    const {search, formData} = searchBox;

        // load categories and set form data
    const init = () => {
       
        setSearchBox({
            ...searchBox,
            formData: new FormData()
        });
          
    };

    useEffect(() => {
        init();
    }, []);

    const handleChange = name => event => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value);
        setSearchBox({ ...searchBox, [name]: value });
    };


    const clickSubmit = event => {
        event.preventDefault();
        
        window.location.replace(`/search/${search}`)
        // setValues({ ...values, error: '', });

        // createProduct(user._id, token, formData).then(data => {
        //     if (data.error) {
        //         setValues({ ...values, error: data.error });
        //     } else {
        //         setValues({
        //             ...values,
        //             name: '',
        //             description: '',
        //             photo: '',
        //             price: '',
        //             quantity: '',
        //             loading: false,
        //             createdProduct: data.name
        //         });
        //         console.log('done')
        //     }
        // });
    };    

    return(
        <div className="top-search">
            <form onSubmit={clickSubmit}>
                <input style={{borderRadius: '25px',background:'#484545',color:'white',paddingLeft:'20px'}} name="search" onChange={handleChange('search')} type="text" placeholder="search" /><img onClick={clickSubmit} className="search-icon cursor-pointer" src="/images/icons/search-icon.svg" width="18" />
            </form>
        </div>
    )
}

export default TopSearch;