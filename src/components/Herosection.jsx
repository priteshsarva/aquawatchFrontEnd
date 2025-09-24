import React from 'react'
import './Herosection.css'
import Banner1 from '../assets/banner-1.jpg'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const Herosection = () => {
    return (
        <>
            <div className="w-full flex justify-center items-center">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full aspect-ratio-16-9"
                >
                    <SwiperSlide className="relative w-full h-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${Banner1})` }}
                        ></div>
                        <div className="absolute inset-0 "></div>
                        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                            <h1 className="text-4xl font-bold">Slide 1</h1>
                            <p className="mt-4">This is the first slide description.</p>
                        </div> */}
                    </SwiperSlide>

                    {/* <SwiperSlide className="relative w-full h-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: 'url(https://via.placeholder.com/1200x1920)' }}
                        ></div>
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                            <h1 className="text-4xl font-bold">Slide 2</h1>
                            <p className="mt-4">This is the second slide description.</p>
                        </div>
                    </SwiperSlide> */}
                </Swiper>
            </div>
        </>
    )
}

export default Herosection
