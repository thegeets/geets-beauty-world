import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { products as defaultProducts } from "../data/products";
import apiRequest from "../api/apiClient";

const ProductContext = createContext(null);
const STORAGE_KEY = "geets-products-v5";

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      localStorage.removeItem("geets-products");
      localStorage.removeItem("geets-products-v2");
      localStorage.removeItem("geets-products-v3");
      localStorage.removeItem("geets-products-v4");

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultMap = new Map(defaultProducts.map((p) => [p.id, p]));
          return parsed.map((p) => {
            const def = defaultMap.get(p.id);
            if (def) {
              return {
                ...def,
                ...p,
                image: def.image,
                hoverImage: def.hoverImage || "",
                category: def.category,
              };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.error("Error reading stored products:", e);
    }

    return defaultProducts.map((p) => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : (p.inStock === false ? 0 : 15),
      inStock: p.inStock !== undefined ? p.inStock : (p.stock === 0 ? false : true),
      soldCount: p.soldCount ?? Math.floor(Math.random() * 80) + 10,
    }));
  });

  const [loading, setLoading] = useState(false);

  // Fetch products from Express / MongoDB backend on load
  const fetchProductsFromBackend = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/products");
      if (res.success && Array.isArray(res.products) && res.products.length > 0) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn("Backend products fetch failed, using local catalog fallback.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsFromBackend();
  }, [fetchProductsFromBackend]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error("Error persisting products:", e);
    }
  }, [products]);

  // Reset to default catalog
  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("geets-products");
    } catch (e) {}
    setProducts(
      defaultProducts.map((p) => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : (p.inStock === false ? 0 : 15),
        inStock: p.inStock !== undefined ? p.inStock : (p.stock === 0 ? false : true),
        soldCount: p.soldCount ?? Math.floor(Math.random() * 80) + 10,
      }))
    );
  };

  // Add Product
  const addProduct = async (newProductData) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: newProductData.name || "Untitled Product",
      category: newProductData.category || "Skincare",
      subcategory: newProductData.subcategory || "General",
      price: Number(newProductData.price) || 999,
      oldPrice: newProductData.oldPrice ? Number(newProductData.oldPrice) : null,
      rating: Number(newProductData.rating) || 4.8,
      badge: newProductData.badge || "New",
      image: newProductData.image || "/Hydrating Glow Serum.png",
      description: newProductData.description || "Premium beauty formulation for radiant, healthy glow.",
      stock: Number(newProductData.stock) || 20,
      inStock: Number(newProductData.stock) > 0,
      soldCount: 0,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Backend sync
    try {
      const res = await apiRequest("/products", {
        method: "POST",
        useAdminToken: true,
        body: JSON.stringify(newProduct),
      });
      if (res.success && res.product) {
        setProducts((prev) => prev.map((p) => (p.id === newProduct.id ? res.product : p)));
        return res.product;
      }
    } catch (e) {
      console.warn("Could not sync added product to backend:", e);
    }

    return newProduct;
  };

  // Update Product
  const updateProduct = async (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id || String(p.id) === String(id)) {
          const updatedStock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock;
          return {
            ...p,
            ...updatedFields,
            stock: updatedStock,
            inStock: updatedStock > 0,
            price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
            oldPrice: updatedFields.oldPrice !== undefined ? (updatedFields.oldPrice ? Number(updatedFields.oldPrice) : null) : p.oldPrice,
          };
        }
        return p;
      })
    );

    // Backend sync
    try {
      await apiRequest(`/products/${id}`, {
        method: "PUT",
        useAdminToken: true,
        body: JSON.stringify(updatedFields),
      });
    } catch (e) {
      console.warn(`Could not sync updated product ${id} to backend:`, e);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id && String(p.id) !== String(id)));

    // Backend sync
    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE",
        useAdminToken: true,
      });
    } catch (e) {
      console.warn(`Could not sync deleted product ${id} to backend:`, e);
    }
  };

  // Toggle Stock Status
  const toggleStock = (id) => {
    const targetProduct = products.find((p) => p.id === id || String(p.id) === String(id));
    const newStatus = targetProduct ? !targetProduct.inStock : false;
    const newStock = newStatus ? (targetProduct?.stock > 0 ? targetProduct.stock : 10) : 0;

    updateProduct(id, {
      inStock: newStatus,
      stock: newStock,
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        resetToDefault,
        refetchProducts: fetchProductsFromBackend,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
