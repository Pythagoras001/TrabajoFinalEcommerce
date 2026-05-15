import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../molecules/ProductCard";
import { getProducts } from "../../../services/productService";

const ITEMS_PER_PAGE = 8;

export default function Gallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category);
    return ["All", ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    
    return products.filter((product) => {
      // Filtrar por búsqueda de texto
      const matchesSearch = normalized === "" || 
        product.title.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized);

      // Filtrar por categoría
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

      // Filtrar por precio
      const priceLimit = parseFloat(maxPrice);
      const matchesPrice = isNaN(priceLimit) || product.price <= priceLimit;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Descubre</h2>
          <p className="text-lg text-gray-500 font-medium">
            Mostrando {filteredProducts.length} resultado(s)
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input
               type="text"
               value={searchTerm}
               onChange={handleSearchChange}
               placeholder="Buscar productos..."
               className="w-full pl-11 pr-4 py-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
             />
          </div>

          {/* Category Select */}
          <div className="relative sm:w-48 group">
             <select 
               value={selectedCategory} 
               onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
               className="w-full pl-4 pr-10 py-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 capitalize font-medium text-gray-900 appearance-none cursor-pointer shadow-sm"
             >
               {categories.map((cat) => (
                 <option key={cat} value={cat}>
                   {cat === "All" ? "Categorías (Todas)" : cat}
                 </option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
             </div>
          </div>

          {/* Max Price Input */}
          <div className="relative sm:w-40">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 font-bold">$</span>
             </div>
             <input
               type="number"
               value={maxPrice}
               onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
               placeholder="Max."
               className="w-full pl-8 pr-4 py-3.5 bg-gray-50/80 rounded-2xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300 placeholder:text-gray-400 font-medium text-gray-900 shadow-sm"
             />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50/50 border border-gray-100 rounded-[40px] p-16 sm:p-24 text-center shadow-sm max-w-3xl mx-auto mt-12">
          <div className="w-24 h-24 bg-white text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Sin resultados</h3>
          <p className="text-gray-500 text-lg">No encontramos productos que coincidan con tu búsqueda actual.</p>
          <button 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setMaxPrice(""); }}
            className="mt-8 px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-black transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-3 mt-20 flex-wrap">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3.5 rounded-full border border-gray-200 font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            >
              Anterior
            </button>
            
            <div className="flex gap-2">
               {Array.from({ length: totalPages }, (_, index) => {
                 const page = index + 1;
                 return (
                   <button
                     key={page}
                     type="button"
                     onClick={() => goToPage(page)}
                     className={`w-12 h-12 rounded-full text-sm font-extrabold transition-all duration-300 ${
                       page === currentPage
                         ? "bg-gray-900 text-white shadow-xl scale-110"
                         : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                     }`}
                   >
                     {page}
                   </button>
                 );
               })}
            </div>

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3.5 rounded-full border border-gray-200 font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}
