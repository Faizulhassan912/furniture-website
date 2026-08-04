import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

import { useSettings } from '../../context/SettingsContext';

function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const { settings } = useSettings();

  const handleSendQuote = () => {
    if (cartItems.length === 0) return;
    
    // Construct the WhatsApp message with the current website link
    const websiteUrl = window.location.origin;
    let message = "Hi! I want to order the following items:\n\n";
    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${websiteUrl}/collection/${item.slug})\n`;
    });
    
    // Get phone number from settings or fallback to a default
    let phoneNumber = settings?.settings?.whatsapp || '923000000000';
    // Remove any non-numeric characters (e.g., +, spaces, dashes)
    phoneNumber = phoneNumber.replace(/\D/g, '');

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] transition-opacity cursor-pointer"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-bg-card shadow-2xl z-[120] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-bold font-heading text-text flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" /> Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full bg-bg-alt flex items-center justify-center text-text hover:text-primary transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-light">
              <ShoppingBag className="w-16 h-16 mb-4 text-primary opacity-50 stroke-1" />
              <p className="text-lg font-medium">Your cart is empty.</p>
              <p className="text-sm mt-2 mb-6">Browse our collection and add items you want to order.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-accent text-bg-card font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {cartItems.map(item => (
                <div key={item._id || item.id} className="flex gap-4 p-4 rounded-2xl bg-bg-alt border border-border">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white border border-border">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <Link 
                        to={`/collection/${item.slug}`} 
                        className="font-bold text-text hover:text-primary text-sm line-clamp-2"
                        onClick={() => setIsCartOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="text-text-light hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs text-accent uppercase font-bold tracking-wider">{item.category}</span>
                      <div className="flex items-center gap-3 bg-bg-card rounded-lg px-2 py-1 border border-border shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-text hover:text-primary cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-text w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-text hover:text-primary cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-border bg-bg-card">
            <button 
              onClick={handleSendQuote}
              className="w-full bg-[#25D366] text-white font-bold text-lg py-4 rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartSidebar;
