import React from 'react'
import { Link } from 'react-router-dom'
import Herosection from '../components/Herosection';
import Card from '../components/Card';
import ShoeCarousel from '../components/ShoeCarousel';
import { joinUsOnWhatsapp, products } from '../data/data';
import ProductCategory from '../components/ProductCategory';
import SingleCollection from '../components/SingleCollection';
import ShopbyBrand from '../components/ShopbyBrand';
import AquwawacthJoinFamily from '../assets/Aquwawacth-join-family.png';

const baseUrl = import.meta.env.VITE_BASE_URL;




const Home = () => {

    let urls = `${baseUrl}/product/firstdata`;
    fetch(urls, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data.results);
            // setSearchResults(data.results);
        })
        .catch(error => console.error('Error:', error));


    return (
        <div>

            <Herosection />
            {/* <ShoeCarousel productss={products} /> */}
            <ShopbyBrand />
            <div className="relative w-full aspect-[3/1]">
                <img
                    src={AquwawacthJoinFamily}
                    alt="Join Us"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Link
                        to={joinUsOnWhatsapp}
                        target='_blank' 
                        className="mt-6 inline-flex items-center justify-center bg-white text-gray-900 font-semibold px-4 py-2  hover:text-white hover:bg-gray-900 transition rounded-none cursor-pointer"
                    >
                        <h6 className="flex items-center gap-2 text-base font-semibold">
                            Join Us on Whatsapp
                            {/* <svg
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        aria-hidden="true"
                                        focusable="false"
                                        className="w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                                            fill="currentColor"
                                        ></path>
                                    </svg> */}
                        </h6>
                    </Link>
                </div>
            </div>

            <ProductCategory />
            <SingleCollection products={products} />
        </div>
    )
}

export default Home
