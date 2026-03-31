import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./auth/LoginPage";
import ProductPage from "./admin/ProductPage";
import RegisterPage from "./auth/RegisterPage";
import CategoryPage from "./admin/CategoryPage";
import HomePage from "./client/HomePage";
import MyOrdersPage from "./client/MyOrdersPage";
import NavBar from "./component/NavBar";
import SidBar from "./component/SidBar";


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<><NavBar /> <Outlet /></>} >
          <Route index element={<HomePage />} />
          <Route path="myorders" element={<MyOrdersPage />} />
        </Route>
        <Route path="/admin" element={<div className="flex"><SidBar /> <Outlet /></div>} >
          <Route index element={<ProductPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="categories" element={<CategoryPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;