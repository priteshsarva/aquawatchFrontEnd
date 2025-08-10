import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({ title, price, coverImg, id, key }) => {
    return (
        <div>
            {/* <div className="w-full h-screen flex justify-center items-center"  key={id}> */}
            <Link to={`/productpage?id=${id}`} key={key} className='px-2'>
                <div className="w-50 mx-3">
                    <div className="shadow hover:shadow-lg transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
                        <div className="overflow-hidden relative">
                            <img className="w-full transition duration-700 ease-in-out group-hover:opacity-60" src={coverImg} alt="image" style={{ aspectRatio: "1/1", objectFit: 'cover' }} />
                            {/* <div className="flex justify-center">
                                    <div className="absolute bottom-4 transition duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                                        <a href="#" className="bg-gray-700 px-3 py-3 hover:bg-red-500 transition duration-300 ease-in-out">
                                            <i className="fas fa-shopping-cart transition duration-300 ease-in-out flex justify-center items-center text-gray-100"></i>
                                        </a>
                                        <a href="#" className="bg-gray-700 px-3 py-3 hover:bg-red-500 transition duration-300 ease-in-out">
                                            <i className="fas fa-random transition duration-300 ease-in-out flex justify-center items-center text-gray-100"></i>
                                        </a>
                                        <a href="#" className="bg-gray-700 px-3 py-3 hover:bg-red-500 transition duration-300 ease-in-out">
                                            <i className="fas fa-search transition duration-300 ease-in-out flex justify-center items-center text-gray-100"></i>
                                        </a>
                                        <a href="#" className="bg-gray-700 px-3 py-3 hover:bg-red-500 transition duration-300 ease-in-out">
                                            <i className="fas fa-heart transition duration-300 ease-in-out flex justify-center items-center text-gray-100"></i>
                                        </a>
                                    </div>
                                </div> */}
                        </div>
                        <div className="px-4 py-3 bg-white">
                            <Link to={`/productpage?id=${id}`} className=""><h1 className="text-gray-800 font-semibold text-lg hover:text-red-500 transition duration-300 ease-in-out">{title}</h1></Link>
                            <div className="flex py-2">
                                <p className="mr-2 text-xs text-gray-600">{price}</p>
                                <p className="mr-2 text-xs text-red-600 line-through">{price}</p>
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
                </div>
            </Link>
        </div>
        // </div>
    )
}

export default Card
