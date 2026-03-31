import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./auth/LoginPage";
import ProductPage from "./admin/ProductPage";
import RegisterPage from "./auth/RegisterPage";
import CategoryPage from "./admin/CategoryPage";
import HomePage from "./client/HomePage";
import MyOrdersPage from "./client/MyOrdersPage";
import NavBar from "./component/NavBar";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Routes path="/" element={<><NavBar /> <Outlet /></>} >
          <Route path="l" element={<LoginPage />} />
          <Route path="p" element={<ProductPage />} />
          <Route path="r" element={<RegisterPage />} />
          <Route path="" element={<HomePage />} />
          <Route path="c" element={<CategoryPage />} />
          <Route path="o" element={<MyOrdersPage />} />
          <Route path="n" element={<NavBar />} />
        </Routes>

      </Routes>
    </>
  );
}

export default App;