import { useState } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import logo1 from '../assets/logo.png'
import { Link } from 'react-router-dom';
import Card from './Card'
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function NavBarWithSubmenu() {
    const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // const baseUrl = 'https://kicksmaniaserver-1-5-15-25.onrender.com';



    const navLinks = [
        { name: "Rolex", url: "/rol" },
        { name: "Omega", url: "/omeg" },
        { name: "Patek Philippe", url: "/patek" },
        { name: "Cartier", url: "/cart" },
        { name: "Audemars Piguet", url: "/audem" },
        { name: "Breitling", url: "/breitling" },
        { name: "TAG Heuer", url: "/tag" },
        { name: "Tissot", url: "/tiss" },
        { name: "Seiko", url: "/seik" },
        { name: "Fossil", url: "/foss" },
        { name: "Citize", url: "/citi" },
    ];


    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        console.log(term);
        let urls = `${baseUrl}/product/search?q=${term}`;
        fetch(urls, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.results);
                setSearchResults(data.results);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleCloseSearch = () => {
        setSearchDrawerOpen(false)
        setSearchTerm('');
        setSearchResults([]);
    };


    return (
        <>

            {/* 🔍 Top Search Drawer */}
            {searchDrawerOpen && (
                <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 bg-white dark:bg-gray-800 shadow-md transition-transform animate-slide-down">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-gray-700 dark:text-white text-lg font-semibold">Search</h2>
                        <button
                            // onClick={() => setSearchDrawerOpen(false)}
                            onClick={handleCloseSearch}
                            className="text-gray-500 dark:text-white"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            value={searchTerm}
                            // onChange={(e) => setSearchTerm(e.target.value)}
                            onChange={handleSearch}
                            autoFocus
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        {/* Replace with live results */}
                        <div className="text-sm text-gray-500 dark:text-gray-400 ">
                            {/* Optional message or heading */}
                            {/* <p>Live results will appear here...</p> */}

                            {searchTerm.trim() === '' ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                                    Please enter a search term to see results.
                                </p>
                            ) : (
                                <>
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className="max-h-90 overflow-y-auto pr-2">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                                    {searchResults.slice(0, 6).map((product) => (
                                                        <Card
                                                            key={product.productId}
                                                            title={product.productName}
                                                            price={product.productOriginalPrice}
                                                            coverImg={product.featuredimg}
                                                            id={product.productId}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <Link
                                                to={`/search/${searchTerm}`}
                                                onClick={handleCloseSearch}
                                                className="w-full flex justify-center mt-4 btn fw-semibold px-4 rounded-none text-dark"
                                            >
                                                <h6 className="inline-flex items-center font-semibold">
                                                    View All Products
                                                    <svg
                                                        viewBox="0 0 14 10"
                                                        fill="none"
                                                        aria-hidden="true"
                                                        focusable="false"
                                                        className="ml-1 icon icon-arrow"
                                                        width="14"
                                                        height="10"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </h6>
                                            </Link>
                                        </>
                                    ) : (
                                        <p className="mt-4 text-center text-sm text-red-500">No Result Found</p>
                                    )}
                                </>
                            )}

                        </div>

                    </div>
                </div>
            )}

            {/* 🍔 Left Drawer (Mobile Menu) */}
            {leftDrawerOpen && (
                <div className="fixed top-0 left-0 z-40 h-screen w-80 bg-white dark:bg-gray-800 shadow transition-transform animate-slide-right p-4 overflow-y-auto">
                    <div className="w-full sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center mb-2 pb-3">
                        <Link to='/' onClick={() => setLeftDrawerOpen(false)} className="text-base font-semibold text-gray-500 dark:text-gray-400 inline-flex items-center gap-2">
                            {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" ><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" /></svg> */}
                            <img src={logo1} alt="Logo" className="h-8 w-auto" />
                        </Link>
                        <button onClick={() => setLeftDrawerOpen(false)}
                            className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg p-1">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Supercharge your hiring with our
                        <Link
                            href="#"
                            className="text-blue-600 underline dark:text-blue-500 hover:no-underline ml-1"
                        >
                            limited-time sale
                        </Link>
                    </p> */}
                    <ul className="space-y-2 text-sm text-gray-900 dark:text-white">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link
                                    href={link.url}
                                    className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                </div>
            )}

            {/* 🌐 Navbar */}
            <nav className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">

                <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Left: Hamburger (mobile only) */}
                    <button
                        onClick={() => setLeftDrawerOpen(true)}
                        className="md:hidden text-gray-600 dark:text-white"
                    >
                        <FaBars />
                    </button>

                    {/* Center: Logo (mobile center, desktop left) */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <Link href="#" className="inline-flex items-center">
                            <img src={logo1} alt="Logo" className="h-8 w-auto" />
                        </Link>
                    </div>


                    {/* Right: Search */}
                    <button
                        onClick={() => setSearchDrawerOpen(true)}
                        className="flex items-center text-sm font-semibold text-dark-600 dark:text-white-400 hover:underline"
                    >
                        <FaSearch className="mr-1" />
                        Search
                    </button>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex justify-center border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 py-2">
                    <ul className="w-full max-w-[80%] flex justify-center space-x-4 text-sm font-medium text-gray-700 dark:text-white text-center">
                        {navLinks.map((link, index) => (
                            <li
                                key={index}
                                className={`${index !== 0 ? 'border-l border-gray-300 dark:border-gray-600 pl-4' : ''}`}
                            >
                                <Link href={link.url} className="hover:underline block">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                </div>

            </nav>
        </>
    );
}
