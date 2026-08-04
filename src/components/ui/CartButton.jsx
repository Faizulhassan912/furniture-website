import { useCart } from '../../context/CartContext';

function CartButton() {
  const { cartItems, setIsCartOpen } = useCart();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-24 right-6 z-[90] w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer group"
      aria-label="Open Quote Cart"
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-3 -right-3 bg-accent text-bg-card text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-primary">
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );
}

export default CartButton;
