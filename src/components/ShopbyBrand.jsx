import React from 'react'
import './ShopbyBrand.css'
import { Link } from 'react-router-dom';

import { watchBrand } from '../data/data';

const ShopbyBrand = () => {
    return (
        <>
            <section className=" mx-auto px-4 py-10 bg-white">
                {/* Title */}
                <div className=' container mx-auto px-4 py-10 bg-white'>
                    <h4 className=" section-title section-title-center mb-5">
                        <b></b>
                        <span className="text-xl  text-black tracking-wide uppercase">
                            Shop by Brand
                        </span>
                        <b></b>
                    </h4>
                </div>

                {/* Grid */}
                <div className=" mx-auto px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-9">
                        {watchBrand.map((watch, index) => (
                            <Link
                                key={index}
                                to={watch.url}
                                className="flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:-translate-y-2"
                                aria-label={`Visit product category ${watch.name}`}
                            >
                                {/* Image */}
                                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={watch.image}
                                        alt={watch.name}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Text */}
                                <h5 className="uppercase text-xs text-black">
                                    {watch.name}
                                </h5>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ShopbyBrand
