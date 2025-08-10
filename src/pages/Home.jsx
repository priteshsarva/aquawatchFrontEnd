import React from 'react'
import Herosection from '../components/Herosection';
import Card from '../components/Card';
import ShoeCarousel from '../components/ShoeCarousel';
import {products} from '../data/data';




const Home = () => {
    console.log(products);
    
   
    return (
        <div>
            <Herosection />
            <ShoeCarousel  productss={products}/>
            
        </div>
    )
}

export default Home
