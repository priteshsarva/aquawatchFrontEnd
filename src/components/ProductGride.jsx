import React from 'react'
import Card from './Card';

const ProductGride = ({ products }) => {
    console.log(products.products);


    return (
        <>
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {products.products.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No Products found</p>
                    ) : (
                        products.products.map((product) => (
                            <Card key={product.productId}
                                title={product.productName}
                                price={product.productOriginalPrice}
                                coverImg={product.featuredimg}
                                id={product.productId} />
                            //             <div key={product.productId} className="w-full">
                            //                 <div className="bg-white border border-gray-200 h-full shadow-sm transition-transform hover:scale-[1.01]">
                            //                     <Link
                            //                         to={`/product/${product.productId}`}
                            //                         target="_blank"
                            //                         className="block text-inherit"
                            //                     >
                            //                         {/* Image */}
                            //                         <div className="relative aspect-square overflow-hidden">
                            //                             <img
                            //                                 src={Array.isArray(product.image) ? product.image[0] : product.featuredimg}
                            //                                 alt={product.productName}
                            //                                 className="w-full h-full object-cover transition-opacity duration-300"
                            //                                 loading="lazy"
                            //                             />
                            //                         </div>

                            //                         {/* Content */}
                            //                         <div className="p-3 text-center">
                            //                             <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                            //                                 {product.productName}
                            //                             </p>

                            //                             {/* Size Options */}
                            //                             <div className="flex flex-wrap justify-center gap-1 mb-2">
                            //                                 {JSON.parse(product.sizeName).map((size) => {
                            //                                     const normalized = normalizeSize(size);
                            //                                     return (
                            //                                         <label
                            //                                             key={size}
                            //                                             className="text-xs border border-gray-700 px-2 py-0.5 rounded-sm cursor-pointer bg-white text-gray-700"
                            //                                         >
                            //                                             <input
                            //                                                 type="checkbox"
                            //                                                 className="hidden"
                            //                                                 checked={true}
                            //                                                 onChange={() => handleCheckboxChange("sizes", size)}
                            //                                             />
                            //                                             {normalized}
                            //                                         </label>
                            //                                     );
                            //                                 })}
                            //                             </div>

                            //                             {/* Optional pricing or badges can be added here */}
                            //                             {/* 
                            // <div className="font-semibold text-lg">Rs. 12,999</div>
                            // <div className="mt-2">
                            //   <span className="text-xs bg-gray-100 border px-2 py-0.5 inline-block text-gray-800">
                            //     Extra ₹500 Off on Prepaid Orders
                            //   </span>
                            // </div>
                            // */}
                            //                         </div>
                            //                     </Link>
                            //                 </div>
                            //             </div>
                        ))
                    )}
                </div>
            </div>

        </>
    )
}

export default ProductGride
