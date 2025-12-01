import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { box, brand, Brandphone, calculateAddedPrice, calculateDiscountedPrice, calculateSavingsPercentage } from '../data/data'
import Card from '../components/Card';
import VideoModal from '../components/VideoModal';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faMoneyBillWave, faCheckCircle, faUndo } from '@fortawesome/free-solid-svg-icons';
import {
    ComputerDesktopIcon,
    PhoneArrowUpRightIcon,
    VideoCameraIcon,
    CubeIcon,
} from "@heroicons/react/24/solid";
import { Truck, Recycle, Tag } from "lucide-react";
import { msterCode } from '../data/data'
import { useLocation } from 'react-router-dom';


const baseUrl = import.meta.env.VITE_BASE_URL;

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setproduct] = useState('')
    const [hash, sethash] = useState(window.location.hash)
    const [simillarproducts, setsimillarproducts] = useState("")
    const [selectedImage, setSelectedImage] = useState(""); // Default to the first image
    const [imageUrlArray, setimageUrlArray] = useState("")
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Replace with your video URL
    const [quantity, setQuantity] = useState(1);
    const [openIndex, setOpenIndex] = useState(null);
    const location = useLocation();


    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const increaseQty = () => {
        if (quantity < 9) {
            setQuantity(prev => prev + 1);
        }
    };

    const accordions = [
        {
            question: "How PRODUCT DESCRIPTION",
            answer: (
                <div className="space-y-2 text-gray-700 text-base leading-relaxed">
                    <p>This Product is the <span className="font-semibold">Same as Original Quality Master Copy</span> with <span className="font-semibold">3 month Machine Replacement Warranty</span>.</p>
                    <p><span className=" font-bold">If you want the original box kit, extra charges apply!</span></p>
                    <p>Cash on Delivery available all over India.</p>
                    <p>All Chrono working.</p>
                    <p>Approximate delivery time: <span className="italic">4-6 days</span>.</p>
                </div>
            )
        },
        {
            question: "BOX POLICY",
            answer: (
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                    <p>
                        <strong>Standard packaging:</strong> Every watch is shipped in a secure, high-quality protective box suitable for safe delivery. This is included with every order at <span className="font-semibold">no extra cost</span>.
                    </p>
                    <p>
                        <strong>Original / Brand box:</strong> Extra charges apply if an original or brand box is available for your selected watch. The extra fee will be shown at checkout. If the charge can't be displayed automatically, our team will confirm the box option and additional charges before shipping.
                    </p>
                </div>
            ),
        },
        {
            question: "RETURN POLICY",
            answer: (
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                    <p><strong>Exchange & Store Credit Policy</strong></p>
                    <p>At <em>Timekeepers</em>, we do not offer cash refunds. Instead, we provide easy exchange and store credit options to ensure customer satisfaction.</p>
                    <p>
                        <strong>Exchange Window:</strong> You may request an exchange within <strong>48 hours of delivery</strong> by contacting our support team.
                    </p>
                    <p><strong>Conditions:</strong></p>
                    <ol className="list-decimal list-inside ml-4 text-gray-600">
                        <li>Item must be unused and in original packaging.</li>
                        <li>All original tags, accessories, and documentation must be included.</li>
                        <li>The protective <em>polythene/film on the watch must be intact</em>.</li>
                        <li>A <em>clear unboxing video (from start to finish)</em> is required for any exchange or damage claim.</li>
                    </ol>
                    <p>
                        <strong>Store Credit:</strong> If you don’t wish to exchange immediately, the product value will be credited to your account as <em>store credit</em>, which can be used on any future purchase.
                    </p>
                    <p>
                        <strong>Damaged / Defective Items:</strong> If the product is delivered damaged or defective, we will provide a free replacement of the same model (subject to availability), subject to unboxing video proof.
                    </p>
                    <p>Your trust matters to us — with store credit, your money always stays safe with Timekeepers.</p>
                </div>
            ),
        }

    ];

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const steps = [
        { title: "ORDER NOW", Icon: ComputerDesktopIcon },
        { title: "OUR SALES TEAM CALL YOU", Icon: PhoneArrowUpRightIcon },
        { title: "VIDEO CALL FACILITY", Icon: VideoCameraIcon },
        { title: "DELIVERY", Icon: CubeIcon },
    ];


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,

        // lazyLoad: true,
        className: "slider variable-width",
        variableWidth: true,
        centerMode: true,
        // Disable swiping globally (optional)
        // swipe: false,
        // touchMove: false,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    // slidesToShow: 2,
                    // slidesToScroll: 1,
                    arrows: false,
                    // 👇 Disable swipe specifically for mobile
                    // swipe: false,
                    // touchMove: false,
                    // swipeToSlide: false
                }
            }
        ]
    };


    useEffect(() => {
        console.log(baseUrl);
        sethash(window.location.hash);

        // Fetch product details
        fetch(`${baseUrl}/product/${id}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setproduct(data.results[0]);
                setSelectedImage(Array.isArray(data.results[0].image) ? data.results.image[0] : data.results[0].featuredimg);
                setimageUrlArray(JSON.parse(data.results[0].imageUrl));
                // setsizes(JSON.parse(data.results[0].sizeName));
                console.log("data", data);
            })
            .catch(error => console.error('Error:', error));

    }, [id]); // Add id as dependency

    useEffect(() => {
        // Fetch similar products only when product is available
        if (product) {
            fetch(`${baseUrl}/product/search?q=${product.productName.slice(0, 3)}&category=${product.catName}&result=30&page=1`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setsimillarproducts(data.results);
                    console.log(data.results);
                })
                .catch(error => console.error('Error in Similar:', error));
        }
    }, [product]); // This remains unchanged

    return (
        <>

            {product === '' ? <Loader /> : <>
                <div className="">


                    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                        <div className="flex flex-col md:flex-row -mx-4">
                            <div className="md:flex-1 px-4 grid-cols-4">
                                {/* Main Display Area */}
                                <div className="aspect-square rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                                    {/* <span className="text-5xl">{selectedImage}</span> */}
                                    <img
                                        src={selectedImage}
                                        alt={product.productName}
                                        className="img-fluid rounded"
                                        style={{
                                            // height: '500px',
                                            objectFit: 'cover', width: '100%',
                                            aspectRatio: "1/1"
                                        }}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex -mx-2 mb-4">
                                    {
                                        Array.isArray(imageUrlArray) ? imageUrlArray.map((image, index) => (
                                            <div key={index} className="w-1/4 p-2">
                                                <img
                                                    src={image}
                                                    alt={`${product.productName} thumbnail ${index + 1}`}
                                                    className={`w-full h-[100px] object-cover rounded cursor-pointer border ${selectedImage === image ? 'border-black' : 'border-gray-300'}`}
                                                    style={{ aspectRatio: "1 / 1" }}
                                                    onClick={() => setSelectedImage(image)}
                                                />
                                            </div>
                                        )) : null
                                    }


                                    {/* {buttons.map((i) => (
                                    <div key={i} className="flex-1 px-2">
                                        <button
                                            onClick={() => setSelectedImage(i)}
                                            className={`focus:outline-none w-full rounded-lg h-24 md:h-32 bg-gray-100 flex items-center justify-center ${selectedImage === i ? 'ring-2 ring-indigo-300 ring-inset' : ''
                                                }`}
                                        >
                                            <span className="text-2xl">{i}</span>
                                        </button>
                                    </div>
                                ))} */}
                                </div>
                            </div>

                            <div className="md:flex-1 px-4">
                                <h2 className="mb-2 leading-tight tracking-tight font-bold text-black text-2xl md:text-3xl">
                                    {product.productName}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    By{' '}
                                    <a href="#" className="text-black hover:underline font-medium">
                                        {brand}
                                    </a>
                                </p>


                                {product.catName !== "Luxury Watch" &&
                                    <div className="flex items-center space-x-4 my-4">
                                        <div>
                                            <div className="flex py-2 pe-3">
                                                <span className="text-gray-300 mr-1 mt-1">₹</span>
                                                <span className="font-semibold text-gray-300 text-3xl line-through pe-3">
                                                    {parseInt(calculateAddedPrice(product.productOriginalPrice))}
                                                </span>

                                                <span className="text-black mr-1 mt-1">₹</span>
                                                <span className="font-semibold text-black text-4xl">
                                                    {parseInt(calculateDiscountedPrice(product.productOriginalPrice))}
                                                </span>
                                            </div>
                                        </div>

                                        {/* <div className="flex-1">
                                        <p className="text-green-500 text-xl font-semibold">
                                            <span className="mr-2 text-sm text-gray-300 line-through">₹{calculateAddedPrice(product.productOriginalPrice)}</span> {calculateSavingsPercentage(product.productOriginalPrice)}%</p>
                                        <p className="text-gray-400 text-sm">Inclusive of all Taxes.</p>
                                    </div> */}

                                    </div>
                                }
                                <div className="flex items-center space-x-4 py-4">

                                    {/* Add to Cart Button */}
                                    {product.videoUrl && (
                                        <>
                                            <button
                                                onClick={openModal}
                                                className="h-14 px-6 py-2 font-semibold rounded-xl bg-black hover:bg-neutral-800 text-white transition-colors"
                                            >
                                                Live Video
                                            </button>

                                            <VideoModal
                                                isOpen={showModal}
                                                onClose={closeModal}
                                                videoUrl={product.videoUrl}
                                                name={product.productName}
                                            />
                                        </>
                                    )}

                                    <button
                                        onClick={() => {

                                            const priceText =
                                                product.catName !== "Luxury Watch"
                                                    ? `💰 *Price*: ~₹${parseInt(
                                                        calculateAddedPrice(product.productOriginalPrice)
                                                    )}~ → *₹${parseInt(
                                                        calculateDiscountedPrice(product.productOriginalPrice)
                                                    )}\n`
                                                    : "";

                                            const whatsappUrl = `https://api.whatsapp.com/send?phone=${Brandphone}&text=${encodeURIComponent(
                                                `📦 *Product Details*\n\n` +
                                                `🛍️ *Product*: ${product.productName}\n` +
                                                priceText + // include only if condition passes
                                                `🔗 *URL*: ${window.location.href}`
                                            )}`;

                                            window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                                        }}
                                        className="h-14 px-6 py-2 font-semibold rounded-xl bg-black hover:bg-neutral-800 text-white transition-colors text-center"
                                    >
                                        Buy via WhatsApp
                                    </button>

                                </div>
                                {location.pathname.includes(msterCode) && <>
                                    <p className="text-red-500 text-xl font-semibold">{product.productOriginalPrice}</p>
                                    <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ">{product.productUrl}</a>
                                </>}

                                <section className="py-4 ">
                                    <div className="container mx-auto px-4 text-center">
                                        {/* Shipping Days Info */}
                                        <p className="font-semibold mb-8 text-left">
                                            SHIPPING DAYS: <span className="font-normal">4 TO 7 DAYS</span>
                                        </p>

                                        {/* Icons Section */}
                                        <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
                                            {/* Free Delivery */}
                                            <div className="flex flex-col items-center">
                                                <Truck className="w-10 h-10 mb-3 text-black" />
                                                <p className="text-sm font-medium">Free Delivery</p>
                                            </div>

                                            {/* 48 Hours Returnable */}
                                            <div className="flex flex-col items-center">
                                                <Recycle className="w-10 h-10 mb-3 text-black" />
                                                <p className="text-sm font-medium">48 Hours Returnable</p>
                                            </div>

                                            {/* Cash on Delivery */}
                                            <div className="flex flex-col items-center">
                                                <Tag className="w-10 h-10 mb-3 text-black" />
                                                <p className="text-sm font-medium">Cash On Delivery</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>


                                {/* <div className="flex items-center space-x-4 my-4 gap-2">
                                    <div className="feature-card">
                                        <FontAwesomeIcon icon={faHeadset} className='mb-2 feature-icon' />
                                        <div className="font-bold text-neutral-950">Brand Support</div>
                                    </div>

                                    <div className="feature-card">
                                        <FontAwesomeIcon icon={faUndo} className='mb-2 feature-icon' />
                                        <div className="font-bold text-neutral-950">7-Day Return</div>
                                    </div>

                                    <div className="feature-card">
                                        <FontAwesomeIcon icon={faMoneyBillWave} className='mb-2 feature-icon' />
                                        <div className="font-bold text-neutral-950 ">Cash on Delivery</div>
                                    </div>

                                    <div className="feature-card">
                                        <FontAwesomeIcon icon={faCheckCircle} className='mb-2 feature-icon' />
                                        <div className="font-bold text-neutral-950">Assured Quality</div>
                                    </div>
                                </div> */}

                                <div className="w-full max-w-2xl mx-auto my-6">
                                    {accordions.map((accordion, index) => (
                                        <div
                                            key={index}
                                            className="border border-neutral-300 border-s-0  border-e-0 overflow-hidden "
                                        >
                                            {/* Question */}
                                            <button
                                                onClick={() => toggle(index)}
                                                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold bg-white hover:bg-gray-50"
                                            >
                                                {/* Section Title */}
                                                <span className="text-base tracking-wide">{accordion.question}</span>
                                                <span
                                                    className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-90" : "rotate-0"
                                                        } text-lg`}
                                                >
                                                    &gt;
                                                </span>
                                            </button>

                                            {/* Answer */}
                                            <div
                                                className={`transition-all duration-300 overflow-hidden bg-gray-50 px-6 ${openIndex === index ? "py-4" : "max-h-0 py-0"
                                                    } text-sm text-gray-700`}
                                            >
                                                {accordion.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>


                                <div className="flex flex-col items-center p-6 bg-purple-100 rounded-xl max-w-3xl mx-auto">
                                    <h2 className="text-xl font-bold text-purple-900 mb-6">STEP BY STEP</h2>

                                    <div className="flex flex-col md:flex-row items-center md:justify-between w-full gap-6">
                                        {steps.map((step, idx) => (
                                            <div key={idx} className="flex flex-col items-center text-center relative">
                                                <step.Icon className="w-14 h-14 text-purple-700 mb-2" />
                                                <p className="text-sm font-semibold text-purple-800">{step.title}</p>
                                                {idx !== steps.length - 1 && (
                                                    <span className="hidden md:block absolute right-[-32px] top-6 text-purple-600 text-2xl">
                                                        →
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 w-full">
                                        <button
                                            onClick={() => {
                                                console.log(`User is interested in ${product.productName}`);

                                                const whatsappUrl = `https://api.whatsapp.com/send?phone=${Brandphone}&text=${encodeURIComponent(
                                                    `👋 Hello,\n\nI'm interested in moving forward through the *Step by Step* process on your site.\n\n🛍️ *Product*: ${product.productName}\n💰 *Price*: ~₹${parseInt(
                                                        calculateAddedPrice(product.productOriginalPrice)
                                                    )}~ → *₹${parseInt(
                                                        calculateDiscountedPrice(product.productOriginalPrice)
                                                    )}*\n🔗 *Product Link*: ${window.location.href}\n\nCan you please guide me with the next steps?`
                                                )}`;

                                                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                            className="bg-purple-400 text-white rounded-full py-3 px-6 text-center font-medium shadow-md cursor-pointer w-full"
                                        >
                                            💬 Chat with Support: {Brandphone}
                                        </button>


                                    </div>
                                </div>

                                {/* Buy with box option */}
                                {/*    <div className=" items-center space-x-4 py-4 border-2 rounded-lg">
                                    <h2 className='text-center text-2xl font-semibold mb-4 text-black'>Buy with Box</h2>
                                    <div className="flex flex-wrap sm:flex-nowrap mx-2 mb-4 justify-center sm:justify-between items-center">
                                        <div className="sm:w-1/4 w-1/3 p-2">
                                            <Card
                                                key={box[0].productId}
                                                title={box[0].productName}
                                                price={box[0].productOriginalPrice}
                                                coverImg={box[0].featuredimg}
                                                id={box[0].productId}
                                                calculateAddedPriceHidden="true"
                                            />
                                        </div>
                                        <h2 className='text-center font-semibold text-3xl mt-[-36px]  sm:mt-0'>+</h2>
                                        <div className="sm:w-1/4 w-1/3 p-2 ">
                                            <Card
                                                key={box[0].productId}
                                                title={box[0].productName}
                                                price={box[0].productOriginalPrice}
                                                coverImg={box[0].featuredimg}
                                                id={box[0].productId}
                                                calculateAddedPriceHidden="true"
                                            />
                                        </div>
                                        <h2 className='text-center font-semibold text-3xl hidden sm:block mt-[-36px]  sm:mt-0'>=</h2>
                                        <div className="p-2">
                                            <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                                                <span className="text-black mr-1 mt-1">₹</span>
                                                <span className="font-bold text-black text-2xl">
                                                    {calculateDiscountedPrice(product.productOriginalPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}


                                {/* Why Choose Us Section */}
                                {/* <div className="mt-10">
                                    <h2 className="text-2xl font-semibold mb-4 text-black">
                                        Why Choose Us?
                                    </h2>

                                    <ul className="list-disc list-inside space-y-2 text-black">
                                        <li>Authentic Timepieces Only – No Replicas or Fakes</li>
                                        <li>Comes with Original Branded Watch Box</li>
                                        <li>Sourced Directly from Trusted Distributors</li>
                                        <li>10,000+ Satisfied Customers & Counting</li>
                                        <li>Live Product Videos Available Before Dispatch</li>
                                        <li>Fast & Secure Shipping Across India</li>
                                    </ul>

                                    <div className="mt-6 text-black">
                                        <p className="font-bold">Trust the Name – {brand}</p>
                                        <p>- Where precision meets prestige</p>
                                        <p>
                                            - We deliver premium watches at the best price without compromising on
                                            authenticity or style.
                                        </p>
                                    </div>

                                    <div className="mt-4 text-black">
                                        <p>- Want to see it before you buy?</p>
                                        <p>
                                            - Live videos available on <span className="font-medium">WhatsApp</span>.
                                            Just message us!
                                        </p>
                                    </div>
                                </div> */}
                            </div>

                        </div>
                    </div>

                    {/* Similar Products */}
                    <div className="mt-5 max-w-7xl mx-auto pt-10 px-4">
                        <h2 className="text-2xl font-semibold mb-4 text-black">Similar Products</h2>

                        {simillarproducts && simillarproducts.length > 0 ? (
                            <Slider {...settings}>
                                {simillarproducts.map(similarProduct => (

                                    <div key={similarProduct.productId}>
                                        <div className="w-50 mx-3">
                                            <Card
                                                key={similarProduct.productId}
                                                title={similarProduct.productName}
                                                price={similarProduct.productOriginalPrice}
                                                coverImg={similarProduct.featuredimg}
                                                id={similarProduct.productId}
                                                catName={product.catName}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className="text-gray-500">No results found</p>
                        )}
                    </div>
                </div>


            </>}
        </>
    )
}

export default ProductDetailPage
