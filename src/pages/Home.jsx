import React from 'react'
import Herosection from '../components/Herosection';
import Card from '../components/Card';
import ShoeCarousel from '../components/ShoeCarousel';
import {products} from '../data/data';
import ProductCategory from '../components/ProductCategory';
import SingleCollection from '../components/SingleCollection';




const Home = () => {

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
