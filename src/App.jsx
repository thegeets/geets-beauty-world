import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

// Store Components (Customer)
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import BottomNav from "./components/BottomNav.jsx";
import LoginModal from "./components/LoginModal.jsx";
import SearchModal from "./components/SearchModal.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import FloatingCart from "./components/FloatingCart.jsx";

// Store Pages (Customer)
import Home from "./Pages/Home.jsx";
import Shop from "./Pages/Shop.jsx";
import Cart from "./Pages/Cart.jsx";
import Checkout from "./Pages/Checkout.jsx";
import Payment from "./Pages/Payment.jsx";
import OrderSuccess from "./Pages/OrderSuccess.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import ProductDetails from "./Pages/ProductDetails.jsx";
import Profile from "./Pages/Profile.jsx";
import Wishlist from "./Pages/Wishlist.jsx";
import Login from "./Pages/Login.jsx";

// Admin Suite Pages & Protection
import AdminLogin from "./Pages/Admin/AdminLogin.jsx";
import AdminProtectedRoute from "./Pages/Admin/AdminProtectedRoute.jsx";
import AdminLayout from "./Pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";
import AdminProducts from "./Pages/Admin/AdminProducts.jsx";
import AdminOrders from "./Pages/Admin/AdminOrders.jsx";
import AdminCustomers from "./Pages/Admin/AdminCustomers.jsx";
import AdminReviews from "./Pages/Admin/AdminReviews.jsx";

// Context Providers
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);

  return null;
}

function CustomerLayout() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Header onOpenLogin={() => setIsLoginOpen(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
      <FloatingCart />
      <ChatWidget />
      <BottomNav
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Route>
      </Routes>
    );
  }

  return <CustomerLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <ProductProvider>
                <OrderProvider>
                  <WishlistProvider>
                    <CartProvider>
                      <AppContent />
                    </CartProvider>
                  </WishlistProvider>
                </OrderProvider>
              </ProductProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}