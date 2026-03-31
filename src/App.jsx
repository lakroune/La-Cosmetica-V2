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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<><NavBar /> <Outlet /></>} >
          <Route path="p" element={<ProductPage />} />
          <Route path="" element={<HomePage />} />
          <Route path="c" element={<CategoryPage />} />
          <Route path="myorders" element={<MyOrdersPage />} />
          <Route path="n" element={<NavBar />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;