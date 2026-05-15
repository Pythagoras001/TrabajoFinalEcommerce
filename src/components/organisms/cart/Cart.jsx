import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../../store/cartStore";
import { imageMap } from "../../../assets/imageMap";

const SHIPPING_RATES = {
  standard: { price: 5.00, label: "Estándar (3-5 días)" },
  express: { price: 15.00, label: "Express (1-2 días)" }
};

export default function Cart() {
  // TODO ESTUDIANTE: agregar cupones, envio y resumen con impuestos.
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState({ type: null, value: 0, code: "" });
  const [couponError, setCouponError] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = getTotalPrice();

  let discountAmount = 0;
  let shippingCost = SHIPPING_RATES[shippingMethod].price;

  if (discountApplied.type === "percent") {
    discountAmount = subtotal * discountApplied.value;
  } else if (discountApplied.type === "shipping") {
    shippingCost = 0;
  }

  const taxRate = 0.16; // 16% taxes
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * taxRate;
  const finalTotal = taxableAmount + shippingCost + taxAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    setCouponError("");
    if (code === "SAVE10") {
      setDiscountApplied({ type: "percent", value: 0.10, code: "SAVE10" });
    } else if (code === "FREESHIP") {
      setDiscountApplied({ type: "shipping", value: 0, code: "FREESHIP" });
    } else if (code === "") {
       setDiscountApplied({ type: null, value: 0, code: "" });
    } else {
      setDiscountApplied({ type: null, value: 0, code: "" });
      setCouponError("Cupón inválido");
    }
  };

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50/30">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14 text-center shadow-xl shadow-gray-200/40 max-w-lg w-full">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-10 leading-relaxed text-lg">Explora nuestra tienda y añade tus productos favoritos.</p>
          <Link
            to="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            Ir a la tienda
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">Tu Carrito</h2>
        <p className="text-gray-500 mt-3 text-lg">Revisa tus productos antes de finalizar la compra.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14">
        
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-gray-200/40">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </span>
              Artículos ({items.length})
            </h3>
            
            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => {
                const resolvedImage = imageMap[product.image] ?? product.image;
                const itemSubtotal = Number(product.price) * Number(quantity);
                return (
                  <article key={product.id} className="py-5 flex gap-4 sm:gap-6 items-center group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:border-gray-300 transition-colors shadow-sm">
                      <img src={resolvedImage} alt={product.title} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug">{product.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">${Number(product.price).toFixed(2)} c/u</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        ${itemSubtotal.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                          <button onClick={() => decrementItem(product.id)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg></button>
                          <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-gray-900">{quantity}</span>
                          <button onClick={() => incrementItem(product.id)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></button>
                        </div>
                        <button onClick={() => removeItem(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2" title="Eliminar">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-gray-200/40">
             <h3 className="text-lg font-bold text-gray-900 mb-5">Método de Envío</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(SHIPPING_RATES).map(([key, rate]) => (
                  <label key={key} className={`relative flex cursor-pointer rounded-2xl border p-4 shadow-sm focus:outline-none transition-all ${shippingMethod === key ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <input type="radio" name="shipping" value={key} className="sr-only" checked={shippingMethod === key} onChange={() => setShippingMethod(key)} />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-semibold text-gray-900">{rate.label}</span>
                        <span className="mt-1 flex items-center text-xs text-gray-500">{key === "express" ? "Entrega prioritaria" : "Entrega normal"}</span>
                      </span>
                    </span>
                    <svg className={`h-5 w-5 ${shippingMethod === key ? 'text-gray-900' : 'text-transparent'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </label>
                ))}
             </div>
          </div>
        </div>

        <aside className="bg-gray-50/80 border border-gray-100 rounded-3xl p-6 sm:p-8 h-fit lg:sticky lg:top-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
            Resumen de Compra
          </h3>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Código de descuento</label>
            <div className="flex gap-2">
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Ej. SAVE10" className="flex-1 px-4 py-3 bg-white rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all uppercase placeholder:normal-case" />
              <button onClick={handleApplyCoupon} className="px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors">Aplicar</button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{couponError}</p>}
            {discountApplied.code && <p className="text-green-600 text-xs mt-2 font-medium flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Cupón {discountApplied.code} aplicado</p>}
            <p className="text-gray-400 text-[10px] mt-2">Cupones de prueba: SAVE10, FREESHIP</p>
          </div>

          <div className="border-t border-gray-200 border-dashed pt-6 space-y-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Descuento ({discountApplied.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>Envío ({SHIPPING_RATES[shippingMethod].label})</span>
              {shippingCost === 0 ? (
                 <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">Gratis</span>
              ) : (
                 <span>${shippingCost.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>Impuestos (16%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end pt-4 mb-8 border-t border-gray-200">
            <div>
              <span className="block text-sm text-gray-500 font-medium mb-1">Total a pagar</span>
            </div>
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">${finalTotal.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            state={{ discountApplied, shippingMethod, shippingCost, discountAmount, taxAmount, finalTotal }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4.5 rounded-xl bg-gray-900 text-white text-lg font-semibold hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
          >
            Proceder al Checkout
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             Pago 100% seguro y encriptado
          </div>
        </aside>
      </div>
    </section>
  );
}
