import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./auth/LoginPage";
import ProductPage from "./admin/ProductPage";
import RegisterPage from "./auth/RegisterPage";
import CategoryPage from "./admin/CategoryPage";
import HomePage from "./client/HomePage";
import MyOrdersPage from "./client/MyOrdersPage";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/l" element={<LoginPage />} />
        <Route path="/p" element={<ProductPage />} />
        <Route path="/r" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/c" element={<CategoryPage />} />
        <Route path="/o" element={<MyOrdersPage />} />

      </Routes>
    </>
  );
}

export default App;