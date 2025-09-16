import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BreadCrumbs = ({
    selectedFilters,
    sidebarDataBrand,
    sidebarDataCategory,
    handleFilterChange,
}) => {
    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const combinedSections = [...sidebarDataCategory, ...sidebarDataBrand];

    const [openSections, setOpenSections] = useState(
        combinedSections.reduce((acc, section) => {
            acc[section.id] = false;
            return acc;
        }, {})
    );
    return (
        <>
            {/* <!-- component --> */}

            <div className="w-full text-center py-3">
                <nav aria-label="breadcrumb" className="block w-full">
                    <ol className="flex w-full flex-wrap items-center rounded-md bg-blue-gray-50 bg-opacity-60 py-2 px-4 justify-center
">
                        <li className="flex cursor-pointer items-center font-sans text-sm font-normal leading-normal text-blue-gray-900 antialiased transition-colors duration-300 hover:text-gray-800">
                            <Link className="opacity-60 hover:opacity-100" to="#">
                                <span>Docs</span>
                            </Link>
                            <span className="pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal text-blue-gray-500 antialiased">
                                /
                            </span>
                        </li>
                        <li className="flex cursor-pointer items-center font-sans text-sm font-normal leading-normal text-blue-gray-900 antialiased transition-colors duration-300 hover:text-gray-800">
                            <Link className="opacity-60 hover:opacity-100" to="#">
                                <span>Components</span>
                            </Link>
                            <span className="pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal text-blue-gray-500 antialiased">
                                /
                            </span>
                        </li>
                        <li className="flex cursor-pointer items-center font-sans text-sm font-normal leading-normal text-blue-gray-900 antialiased transition-colors duration-300 hover:text-gray-800">
                            <Link
                                className="font-medium text-blue-gray-900 transition-colors hover:text-gray-800"
                                to="#"
                            >
                                Breadcrumbs
                            </Link>
                        </li>
                    </ol>
                    <button
                        onClick={() => setLeftDrawerOpen(true)}
                        className="md:hidden font-medium text-blue-gray-900 transition-colors hover:text-gray-800"
                    >Filter
                    </button>
                </nav>
            </div>


            {leftDrawerOpen && (
                <div className="fixed top-0 left-0 z-40 h-screen w-80 bg-white shadow transition-transform animate-slide-right p-4 overflow-y-auto text-black">
                    <div className="w-full sticky top-0 z-40 bg-white border-b border-gray-200 flex justify-between items-center mb-2 pb-3">
                        <button onClick={() => setLeftDrawerOpen(false)} className="text-base font-semibold text-gray-500 inline-flex items-center gap-2">
                            Filter options
                        </button>
                        <button
                            onClick={() => setLeftDrawerOpen(false)}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg p-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-900">

                        <div className="mb-4 border-gray-300 pt-2 ">
                            <h2 className="font-bold mb-4 text-lg">Category</h2>
                            <div className="cursor-pointer">
                                {sidebarDataCategory.map(({ id, title, items }) => (
                                    <div key={id} className="pl-4 mb-4">
                                        <button
                                            onClick={() => {
                                                handleFilterChange(null, title); // Corrected
                                                toggleSection(id)
                                                setLeftDrawerOpen(false)
                                            }}
                                            className={`flex justify-between items-center w-full font-semibold mb-2 focus:outline-none hover:opacity-100 ${selectedFilters.category === title ? "opacity-100 font-bold text-grey-600 text-md" : "opacity-65"}`}
                                        >
                                            {title}
                                            {items.length > 0 && (
                                                <span className="opacity-75 hover:opacity-100">
                                                    {openSections[id] ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </button>

                                        {openSections[id] && (
                                            <ul className="pl-4 space-y-1 border-l border-gray-300">
                                                {items.map((item) => (
                                                    <li
                                                        key={item}
                                                        className={`cursor-pointer hover:text-gray-600 hover:opacity-100 ${selectedFilters.category === item ? "opacity-100 font-semibold" : "opacity-75"}`}
                                                        onClick={() => {
                                                            handleFilterChange(null, item)
                                                            setLeftDrawerOpen(false)
                                                        }
                                                        }
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4 border-t border-gray-300 pt-2 ">
                            <h2 className="font-bold mb-4 text-lg">Brand</h2>
                            <div className="cursor-pointer">
                                {sidebarDataBrand.map(({ id, title, items }) => (
                                    <div key={id} className="pl-4 mb-4">
                                        <button
                                            onClick={() => {
                                                handleFilterChange(title, null)
                                                toggleSection(id)
                                                setLeftDrawerOpen(false)
                                            }}
                                            className={`flex justify-between items-center w-full font-semibold mb-2 focus:outline-none hover:opacity-100 ${selectedFilters.brand === title ? "opacity-100 font-bold text-grey-600 text-md" : "opacity-65"}`}
                                        >
                                            {title}
                                            {items.length > 0 && (
                                                <span className="opacity-75 hover:opacity-100">
                                                    {openSections[id] ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </button>

                                        {openSections[id] && (
                                            <ul className="pl-4 space-y-1 border-l border-gray-300">
                                                {items.map((item) => (
                                                    <li
                                                        key={item}
                                                        className={`cursor-pointer hover:text-gray-600 hover:opacity-100 ${selectedFilters.brand === item ? "opacity-100 font-semibold" : "opacity-75"}`}
                                                        onClick={() => {
                                                            handleFilterChange(item, null)
                                                            setLeftDrawerOpen(false)
                                                        }
                                                        }
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link
                                    to={link.url}
                                    className="block px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))} */}
                    </ul>
                </div>
            )}
        </>
    )
}

export default BreadCrumbs
