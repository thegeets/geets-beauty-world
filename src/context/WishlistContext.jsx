import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { addToast } = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem("geets-wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading wishlist:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("geets-wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Error saving wishlist:", e);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, "info");
        return prev.filter((item) => item.id !== product.id);
      } else {
        addToast(`Added "${product.name}" to wishlist! ✨`, "success");
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
