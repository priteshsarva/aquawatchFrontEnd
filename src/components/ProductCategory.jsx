import React from 'react'
import { category } from '../data/data';
import { Link } from 'react-router-dom';

const ProductCategory = () => {
    return (
        <>
            <div className="2xl:container 2xl:mx-auto md:pt-12 lg:px-20 md:px-6 pt-8 px-4">
                <div className="text-center">
                    <h2 className="font-semibold  lg:text-4xl text-3xl lg:leading-9 md:leading-7 leading-9 text-gray-800 md:w-full w-9/12 mx-auto">
                        Shop by category
                    </h2>
                    {/* <p className="font-normal text-base leading-6 dark:text-gray-400 text-gray-600 mt-4 lg:w-5/12 md:w-9/12 mx-auto"> */}
                        {/* Find your perfect look. Browse Men’s and Women’s fashion by category */}
                        {/* Follow us on instagram @
                        <span className="underline cursor-pointer">followuspleaseee</span> and tag us to get featured on our timeline */}
                    {/* </p> */}
                </div>

                <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-2 lg:gap-8 md:gap-6 gap-4 mt-10">
                    <div class="hidden lg:block"></div>
                    {category.map((img) => (
                        <Link to={img.link} key={img.id} className="relative group aspect-[1/1.25]">
                            <img src={img.desktopSrc} alt={img.alt} className="lg:block hidden w-full h-full object-cover" />
                            <img src={img.mobileSrc} alt={img.alt} className="lg:hidden block w-full h-full object-cover" />
                            {/* <div className="flex justify-center items-center opacity-0 bg-gradient-to-t from-gray-800 via-gray-800 to-opacity-30 group-hover:opacity-50 absolute top-0 left-0 h-full w-full"></div>
                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 hover:opacity-100">
                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M42.6665 10.6665H21.3332C15.4421 10.6665 10.6665 15.4421 10.6665 21.3332V42.6665C10.6665 48.5575 15.4421 53.3332 21.3332 53.3332H42.6665C48.5575 53.3332 53.3332 48.5575 53.3332 42.6665V21.3332C53.3332 15.4421 48.5575 10.6665 42.6665 10.6665Z"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M32 40C36.4183 40 40 36.4183 40 32C40 27.5817 36.4183 24 32 24C27.5817 24 24 27.5817 24 32C24 36.4183 27.5817 40 32 40Z"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M44 20V20.001"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div> */}


                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-gray-800 via-gray-800 to-opacity-30 opacity-50"></div>

                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-100">
                                <h1 className='text-white lg:text-4xl md:text-2xl  text-xl font-semibold dark:text-white text-center'>{img.title}</h1>
                            </div>
                        </Link>
                    ))}
                <div class="hidden lg:block"></div>
                </div>
            </div>
        </>
    )
}

export default ProductCategory
