import { imageMap } from "../../assets/imageMap";
import { Link } from "react-router-dom";
import useCartStore from "../../store/cartStore";

function ProductCard({ product }) {
    const resolvedImage = imageMap[product.image] ?? product.image;
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e) => {
        e.preventDefault(); // prevent navigation to detail page
        e.stopPropagation();
        addItem(product);
    };

    return (
        <Link 
          to={`/product/${product.id}`} 
          className="group relative flex flex-col w-full bg-white rounded-[32px] p-3 sm:p-4 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
        >
            {/* Image Container with premium gray background */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-gray-50 to-gray-200 rounded-[24px] overflow-hidden flex items-center justify-center p-6 mb-5">
                {/* Badge */}
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                    Trending
                </span>
                
                {/* Favorite Button */}
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full z-10 shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                
                {/* Product Image with hover scale */}
                <img 
                  src={resolvedImage} 
                  alt={product.title} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
            </div>

            {/* Content Container */}
            <div className="px-2 pb-2 flex-1 flex flex-col">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight line-clamp-1 mb-1.5 capitalize">
                    {product.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6">
                    {product.description || "Lightweight, durable, and built for peak performance every step of the way."}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-black text-gray-900 tracking-tight">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    <button 
                      onClick={handleAddToCart}
                      className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-black hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        Add To Cart
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
