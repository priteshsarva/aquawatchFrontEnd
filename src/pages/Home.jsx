import React from 'react'
import Herosection from '../components/Herosection';
import ShoeCarousel from '../components/ShoeCarousel';
import {products} from '../data/data';
import ProductCategory from '../components/ProductCategory';
import SingleCollection from '../components/SingleCollection';
const baseUrl = import.meta.env.VITE_BASE_URL;




const Home = () => {

     let urls = `${baseUrl}/product/firstdata`;
        fetch(urls, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.results);
                setSearchResults(data.results);
            })
            .catch(error => console.error('Error:', error));


    return (
        <div>            
            <Herosection />
            <ShoeCarousel  productss={products}/>
            <ProductCategory /> 
            <SingleCollection products={products}/>           
        </div>
    )
}

export default Home
