import { useState } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import logo1 from '../assets/logo.png'


export default function NavBarWithSubmenu() {
    const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            {/* 🔍 Top Search Drawer */}
            {searchDrawerOpen && (
                <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 bg-white dark:bg-gray-800 shadow-md transition-transform animate-slide-down">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-gray-700 dark:text-white text-lg font-semibold">Search</h2>
                        <button
                            onClick={() => setSearchDrawerOpen(false)}
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div>
                        {/* Replace with live results */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Live results will appear here...
                        </p>
                    </div>
                </div>
            )}

            {/* 🍔 Left Drawer (Mobile Menu) */}
            {leftDrawerOpen && (
                <div className="fixed top-0 left-0 z-40 h-screen w-80 bg-white dark:bg-gray-800 shadow transition-transform animate-slide-right p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h5 className="text-base font-semibold text-gray-500 dark:text-gray-400 inline-flex items-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            Menu
                        </h5>
                        <button
                            onClick={() => setLeftDrawerOpen(false)}
                            className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 dark:hover:text-white rounded-lg p-1"
                        >
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Supercharge your hiring with our
                        <a
                            href="#"
                            className="text-blue-600 underline dark:text-blue-500 hover:no-underline ml-1"
                        >
                            limited-time sale
                        </a>
                    </p>
                    <ul className="space-y-2 text-sm text-gray-900 dark:text-white">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">Company</a></li>
                        <li><a href="#" className="hover:underline">Team</a></li>
                        <li><a href="#" className="hover:underline">Features</a></li>
                    </ul>
                </div>
            )}

            {/* 🌐 Navbar */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
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
                        <a href="#" className="inline-flex items-center">
                            <img src={logo1} alt="Logo" className="h-8 w-auto" />
                        </a>
                    </div>


                    {/* Right: Search */}
                    <button
                        onClick={() => setSearchDrawerOpen(true)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <FaSearch className="inline-block mr-1" />
                        Search
                    </button>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex justify-center border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 py-2">
                    <ul className="flex space-x-8 text-sm font-medium text-gray-700 dark:text-white">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li><a href="#" className="hover:underline">Company</a></li>
                        <li><a href="#" className="hover:underline">Team</a></li>
                        <li><a href="#" className="hover:underline">Features</a></li>
                    </ul>
                </div>
            </nav>
        </>
    );
}
