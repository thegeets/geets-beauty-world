import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // ============================================
  // LOAD CART FROM LOCAL STORAGE
  // ============================================

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("geets-cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          return parsedCart;
        }
      }

      return [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });

  // ============================================
  // RECENTLY ADDED PRODUCT
  // ============================================

  const [lastAddedProduct, setLastAddedProduct] = useState(null);

  // ============================================
  // SAVE CART AUTOMATICALLY
  // ============================================

  useEffect(() => {
    try {
      localStorage.setItem("geets-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  // ============================================
  // ADD TO CART
  // ============================================

  const addToCart = (product, count = 1) => {
    if (!product) return;
    
    // Check if out of stock
    const isOut = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);
    if (isOut) return;

    const maxStock = product.stock !== undefined ? Number(product.stock) : 999;

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      // Product already exists
      if (existingProduct) {
        const currentQty = Number(existingProduct.quantity || 0);
        const nextQty = Math.min(maxStock, currentQty + count);
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                ...product,
                quantity: nextQty,
              }
            : item
        );
      }

      // New product
      const initialQty = Math.min(maxStock, Math.max(1, count));
      return [
        ...currentCart,
        {
          ...product,
          quantity: initialQty,
        },
      ];
    });

    // Show recently added product
    setLastAddedProduct(product);
  };

  // ============================================
  // HIDE VIEW CART BAR
  // ============================================

  const hideCartBar = () => {
    setLastAddedProduct(null);
  };

  // ============================================
  // REMOVE PRODUCT
  // ============================================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  // ============================================
  // UPDATE QUANTITY
  // ============================================

  const updateQuantity = (productId, quantity) => {
    const newQuantity = Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock !== undefined ? Number(item.stock) : 999;
          return {
            ...item,
            quantity: Math.min(maxStock, newQuantity),
          };
        }
        return item;
      })
    );
  };

  // ============================================
  // CLEAR CART
  // IMPORTANT:
  // This should ONLY be called AFTER
  // successful order confirmation.
  // ============================================

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("geets-cart");

    setLastAddedProduct(null);
  };

  // ============================================
  // CART COUNT
  // ============================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ============================================
  // CART TOTAL
  // ============================================

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ============================================
  // PROVIDER
  // ============================================

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        lastAddedProduct,
        hideCartBar,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================
// useCart HOOK
// ============================================

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}