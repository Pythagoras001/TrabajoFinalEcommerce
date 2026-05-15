import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useCartStore from "../../../store/cartStore";

export default function Checkout() {
  const location = useLocation();
  const cartState = location.state || {};

  // TODO ESTUDIANTE:
  // Este checkout debe mantenerse simulado en el taller.
  // Solo personaliza estilos, estructura visual y textos.
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
  });

  const total = getTotalPrice();

  const SHIPPING_RATES = {
    standard: { price: 5.00, label: "Estándar" },
    express: { price: 15.00, label: "Express" }
  };

  const discountApplied = cartState.discountApplied || { type: null, value: 0, code: "" };
  const shippingMethod = cartState.shippingMethod || "standard";
  
  let discountAmount = cartState.discountAmount !== undefined ? cartState.discountAmount : 0;
  let shippingCost = cartState.shippingCost !== undefined ? cartState.shippingCost : SHIPPING_RATES[shippingMethod].price;
  
  if (cartState.discountAmount === undefined) {
    if (discountApplied.type === "percent") {
      discountAmount = total * discountApplied.value;
    } else if (discountApplied.type === "shipping") {
      shippingCost = 0;
    }
  }

  const taxRate = 0.16;
  const taxableAmount = Math.max(0, total - discountAmount);
  const taxAmount = cartState.taxAmount !== undefined ? cartState.taxAmount : taxableAmount * taxRate;
  const finalTotal = cartState.finalTotal !== undefined ? cartState.finalTotal : taxableAmount + shippingCost + taxAmount;

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearCart();
    setSuccess(true);
  };

  if (success) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50/30">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14 text-center shadow-2xl shadow-gray-200/50 max-w-lg w-full">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">¡Pago Exitoso!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed text-lg">
            Tu orden ha sido procesada correctamente. (Flujo simulado para el taller).
          </p>
          <Link
            to="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            Volver a la tienda
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50/30">
        <div className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14 text-center shadow-xl shadow-gray-200/40 max-w-lg w-full">
          <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-10 leading-relaxed text-lg">No tienes productos en tu carrito. Explora nuestra tienda y añade tus favoritos.</p>
          <Link
            to="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
          >
            Explorar productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">Finalizar Compra</h2>
        <p className="text-gray-500 mt-3 text-lg">Completa tus datos para procesar el pago de forma segura y rápida.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-gray-200/40 space-y-8"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </span>
              Información de Contacto
            </h3>

            <div className="space-y-5">
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-gray-900">Nombre completo</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-gray-900">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@ejemplo.com"
                  className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
              <div className="relative group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 transition-colors group-focus-within:text-gray-900">Dirección de Envío</label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle Principal 123, Ciudad"
                  className="w-full px-5 py-4 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4.5 rounded-xl bg-gray-900 text-white text-lg font-semibold hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Pagar ${finalTotal.toFixed(2)}
            </button>
            <p className="text-center text-xs font-medium text-gray-400 mt-5 flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              Transacción cifrada y segura (Simulada)
            </p>
          </div>
        </form>

        <aside className="bg-gray-50/80 border border-gray-100 rounded-3xl p-6 sm:p-8 h-fit lg:sticky lg:top-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
            Resumen de Compra
            <span className="bg-gray-200 text-gray-700 text-xs py-1 px-2.5 rounded-full font-bold">{items.length} artículos</span>
          </h3>

          <div className="space-y-5 mb-8 max-h-[380px] overflow-y-auto pr-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 items-start group">
                <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center relative overflow-hidden group-hover:border-gray-300 transition-colors shadow-sm">
                  <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                  <span className="absolute -top-0 -right-0 bg-gray-900 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-bl-xl font-bold">
                    {quantity}
                  </span>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{product.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
                </div>
                <div className="pt-1 text-right pl-2">
                  <span className="text-sm font-bold text-gray-900 block">
                    ${(Number(product.price) * Number(quantity)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 border-dashed pt-6 space-y-4">
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
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
            <div className="flex justify-between items-end pt-4 mt-2 border-t border-gray-200">
              <div>
                <span className="block text-sm text-gray-500 font-medium mb-1">Total a pagar</span>
                <span className="text-xs text-gray-400">Incluye impuestos</span>
              </div>
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
