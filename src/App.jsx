import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import CategoryPage from "./auth/admin/CategoryPage";
import ProductPage from "./auth/admin/ProductPage";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/p" element={<ProductPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<CategoryPage />} />
      </Routes>
    </>
  );    
}

export default App;