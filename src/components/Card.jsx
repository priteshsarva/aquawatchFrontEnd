import React from 'react'
import { Link } from 'react-router-dom'
import { calculateAddedPrice, calculateDiscountedPrice, margin, toaddincutvalue } from '../data/data'

const Card = ({ title, price, coverImg, id, key }) => {

    return (
        <div>
            {/* <div className="w-full h-screen flex justify-center items-center"  key={id}> */}
            <Link to={`/productpage/${id}`} key={key} className=''>

                <div className="transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
                    <div className="overflow-hidden relative">
                        <img className="w-full transition duration-700 ease-in-out group-hover:opacity-60" src={coverImg} alt="image" style={{ aspectRatio: "1/1", objectFit: 'cover' }} />
                       
                    </div>
                    <div className="px-4 py-3 bg-white">
                        <Link to={`/productpage/${id}`} className=""><h1 className="text-center text-gray-800 font-medium text-sm hover:text-black transition duration-300 ease-in-out line-clamp-2">{title}</h1></Link>
                        <div className="flex py-2 justify-center">
                            {/* <p className="mr-2 text-sm text-gray-300 line-through">₹{Number(price) + Number(toaddincutvalue)}</p> */}
                            <p className="mr-2 text-sm text-gray-300 line-through">₹{calculateAddedPrice(price)}</p>

                            {/* <p className="mr-2 text-sm font-semibold text-gray-600">₹{Number(price) + Number(margin)}</p> */}
                            <p className="mr-2 text-sm font-semibold text-gray-600"> ₹{calculateDiscountedPrice(price)}</p>

                        </div>
                        {/* <div className="flex">
                                    <div className="">
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="far fa-star text-gray-400 text-xs"></i>
                                    </div>
                                    <div className="ml-2">
                                        <p className="text-gray-500 font-medium text-sm">(1)</p>
                                    </div>
                                </div> */}
                    </div>
                </div>

            </Link>
        </div>
        // </div>
    )
}

export default Card
