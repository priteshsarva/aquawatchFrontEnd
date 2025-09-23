import React from 'react'
import rd1 from '../assets/readyToDispatch/1.jpeg'
import rd2 from '../assets/readyToDispatch/2.jpeg'
import rd3 from '../assets/readyToDispatch/3.jpeg'
import rd4 from '../assets/readyToDispatch/4.jpeg'
import rd5 from '../assets/readyToDispatch/5.jpeg'
import rd6 from '../assets/readyToDispatch/6.jpeg'
import rd7 from '../assets/readyToDispatch/7.jpeg'
import rd8 from '../assets/readyToDispatch/8.jpeg'
import rd9 from '../assets/readyToDispatch/9.jpeg'
import rd10 from '../assets/readyToDispatch/10.jpeg'
import rd11 from '../assets/readyToDispatch/11.jpeg'
import rd12 from '../assets/readyToDispatch/12.jpeg'
import rd13 from '../assets/readyToDispatch/13.jpeg'
import rd14 from '../assets/readyToDispatch/14.jpeg'
import rd15 from '../assets/readyToDispatch/15.jpeg'
import rd16 from '../assets/readyToDispatch/16.jpeg'
import rd17 from '../assets/readyToDispatch/17.jpeg'
import { Link } from 'react-router-dom'



const ReadyToDispatch = () => {
    const readyToDispatch = [
        { image: rd1, name: "CHANEL" },
        { image: rd2, name: "Audemars Piguet" },
        { image: rd3, name: "CARTIER" },
        { image: rd4, name: "CASIO" },
        { image: rd5, name: "DIESEL" },
        { image: rd6, name: "LONGINES" },
        { image: rd7, name: "SEIKO" },
        { image: rd8, name: "MONTBLANC" },
        { image: rd9, name: "SWAROVSKI" },
        { image: rd10, name: "MONTBLANC" },
        { image: rd11, name: "LONGINES" },
        { image: rd12, name: "TOMFORD" },
        { image: rd13, name: "DIOR" },
        { image: rd14, name: "MONTBLANC" },
        { image: rd15, name: "CASIO VINTAGE SERIES" },
        { image: rd16, name: "DIOR" },
        { image: rd17, name: "COACH" }
    ];



    return (
        <>
            <section className=" mx-auto px-4 py-10 bg-white">
                {/* Title */}
                <div className=' container mx-auto px-4 py-10 bg-white'>
                    <h4 className=" section-title section-title-center mb-5">
                        <b></b>
                        <span className="text-xl  text-black tracking-wide uppercase">
                            Ready To Dispatching
                        </span>
                        <b></b>
                    </h4>
                </div>


                {/* Grid */}
                <div className=" mx-auto px-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 md:gap-9 gap-2">
                        {readyToDispatch.map((watch, index) => (
                            <Link
                                className="flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:-translate-y-2"
                                aria-label={`Visit product category ${watch.name}`}
                            >
                                {/* Image */}
                                <div key={index} className="w-full aspect-square rounded-xl overflow-hidden mb-4">
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

export default ReadyToDispatch
