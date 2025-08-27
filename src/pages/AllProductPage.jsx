import React, { useState, useEffect } from "react";
import BreadCrumbs from "../components/BreadCrumbs";
import { Link } from "react-router-dom";
import Card from "../components/Card";
const baseUrl1 = import.meta.env.VITE_BASE_URL;


// for brand
// https://aquawatchserver.onrender.com/product/search?q=Adi 
// for category
// https://aquawatchserver.onrender.com/product/search?category=Mens%20Shoes&result=20&page=1
// for page
// https://aquawatchserver.onrender.com/product/search?category=Mens%20Shoes&&result=20&page=2


const AllProductPage = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [url, setUrl] = useState("");
    const [noProductFound, setNoProductFound] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category: "",
        brand: "",
    });

    const sidebarDataCategory = [
        {
            id: "mensWatches",
            title: "Men's Watches",
            items: ["Audemars Piguet", "Rolex"],
        },
        {
            id: "Womenswatches",
            title: "Women's Watches",
            items: [],
        },
    ];

    // Sample data for brands
    const sidebarDataBrand = [
        {
            id: "brandRolex",
            title: "Rolex",
            items: ["Daytona", "Submariner"],
        },
        {
            id: "brandFossil",
            title: "Fossil",
            items: ["Chronograph", "Neutra"],
        },
        {
            id: "brandEmpty",
            title: "Unbranded",
            items: [],
        },
    ];

    const combinedSections = [...sidebarDataCategory, ...sidebarDataBrand];

    const [openSections, setOpenSections] = useState(
        combinedSections.reduce((acc, section) => {
            acc[section.id] = false;
            return acc;
        }, {})
    );

    const toggleSection = (id) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const buildUrl = (filters, page) => {
        let baseUrl = `${baseUrl1}/product/search?`;
        const params = [];

        if (filters.brand && filters.brand.trim() !== "") {
            // Map certain brand names to query terms if needed
            const brandMap = {
                "Crocs Slide": "croc",
                Airforce: "force",
                "Louis Vuitton": "Vuitton",
                Converse: "conver",
            };

            const brandQuery = brandMap[filters.brand] || filters.brand;
            params.push(`q=${encodeURIComponent(brandQuery.slice(0, 3))}`);
        }

        if (filters.category && filters.category.trim() !== "") {
            params.push(`category=${encodeURIComponent(filters.category.slice(0, 3))}`);
        }

        params.push(`result=20`);
        params.push(`page=${page}`);

        return baseUrl + params.join("&");
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const apiUrl = buildUrl(selectedFilters, currentPage);
            setUrl(apiUrl);

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    if (currentPage === 1) {
                        setProducts(data.results);
                    } else {
                        setProducts((prev) => [...prev, ...data.results]);
                    }
                    setNoProductFound(false);
                    setTotalPages(data.totalPages);
                } else {
                    if (currentPage === 1) {
                        setProducts([]);
                        setNoProductFound(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [selectedFilters, currentPage]);

    const handleFilterChange = (newBrand, newCategory) => {
        setSelectedFilters({
            brand: newBrand,
            category: newCategory,
        });
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <>
            <BreadCrumbs />
            <section className="grid grid-cols-12 gap-4">
                <div className="hidden md:block md:col-span-3 p-4 border-r border-gray-200 text-sm text-gray-800">
                    <h2 className="font-bold mb-4 text-xl">Filter</h2>
                    <div className="mb-4 border-t border-gray-300 pt-2 ">
                        <h2 className="font-bold mb-4 text-lg">Category</h2>
                        <div className="cursor-pointer hover:text-grey-600 opacity-85 hover:opacity-100">
                            {sidebarDataCategory.map(({ id, title, items }) => (
                                <div key={id} className="pl-4 mb-4">
                                    <button
                                        onClick={() => {
                                            setSelectedFilters((prev) => ({ ...prev, category: title }))
                                            toggleSection(id)
                                        }}
                                        className="flex justify-between items-center w-full font-semibold mb-2 focus:outline-none opacity-85 hover:opacity-100"
                                    >
                                        {title}
                                        {items.length > 0 && (
                                            <span className="opacity-85 hover:opacity-100">
                                                {openSections[id] ? "▲" : "▼"}
                                            </span>
                                        )}
                                    </button>

                                    {openSections[id] && (
                                        <ul className="pl-4 space-y-1 border-l border-gray-300">
                                            {items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="cursor-pointer hover:text-grey-600  opacity-85 hover:opacity-100"
                                                    onClick={() =>
                                                        setSelectedFilters((prev) => ({ ...prev, category: item }))
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
                        <div className="cursor-pointer hover:text-grey-600 opacity-85 hover:opacity-100">
                            {sidebarDataBrand.map(({ id, title, items }) => (
                                <div key={id} className="pl-4 mb-4">
                                    <button
                                        onClick={() => {
                                            setSelectedFilters((prev) => ({ ...prev, brand: title }))
                                            toggleSection(id)
                                        }}
                                        className="flex justify-between items-center w-full font-semibold mb-2 focus:outline-none opacity-85 hover:opacity-100"
                                    >
                                        {title}
                                        {items.length > 0 && (
                                            <span className="opacity-85 hover:opacity-100">
                                                {openSections[id] ? "▲" : "▼"}
                                            </span>
                                        )}
                                    </button>

                                    {openSections[id] && (
                                        <ul className="pl-4 space-y-1 border-l border-gray-300">
                                            {items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="cursor-pointer hover:text-grey-600  opacity-85 hover:opacity-100"
                                                    onClick={() =>
                                                        setSelectedFilters((prev) => ({ ...prev, brand: item }))
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

                </div>

                <div className="col-span-12 md:col-span-9 p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">


                        {products.map((product) => (
                            <div className="h-full flex flex-col">
                                <Card
                                    key={product.productId}
                                    title={product.productName}
                                    price={product.productOriginalPrice}
                                    coverImg={product.featuredimg}
                                    id={product.productId}
                                />
                            </div>
                        ))}



                    </div>
                </div>
            </section>
        </>
    )
};

export default AllProductPage;
