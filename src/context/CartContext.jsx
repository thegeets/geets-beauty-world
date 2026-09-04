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

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      // Product already exists
      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Number(item.quantity || 0) + 1,
              }
            : item
        );
      }

      // New product
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
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
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
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