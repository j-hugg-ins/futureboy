import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CartProvider } from "./context/CartContext";
import { AboutPage } from "./pages/AboutPage";
import { CartPage } from "./pages/CartPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { PolicyPage } from "./pages/PolicyPage";
import { ProductPage } from "./pages/ProductPage";
import { SuccessPage } from "./pages/SuccessPage";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<Navigate to="/" replace />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="product/:handle" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="success" element={<SuccessPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="policies/:slug" element={<PolicyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
