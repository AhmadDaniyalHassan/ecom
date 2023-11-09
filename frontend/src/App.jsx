import { React } from 'react';
import Cart from "./pages/Cart.jsx";
import About from './pages/About.jsx';
import Search from './pages/Search.jsx';
import Misc from './pages/Admin/Misc.jsx';
import Login from "./pages/Auth/Login.jsx";
import CheckOut from "./pages/CheckOut.jsx";
import HomePage from "./pages/HomePage.jsx";
import Wishlist from './pages/Wishlist.jsx';
import SignUp from "./pages/Auth/Signup.jsx";
import Categories from './pages/Categories.jsx';
import { Routes, Route } from "react-router-dom";
import UserShow from "./pages/Admin/UserShow.jsx";
import UserOrder from "./pages/user/UserOrder.jsx";
import PageNotFount from "./pages/PageNotFount.jsx";
import CategoryList from './pages/CategoryList.jsx';
import AdminOrder from './pages/Admin/AdminOrder.jsx';
import SingleProduct from "./pages/SingleProduct.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import ProductAdmin from "./pages/Admin/ProductAdmin.jsx";
import PrivateRoute from "./components/Routes/Private.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import CreateProduct from "./pages/Admin/CreateProduct.jsx";
import AdminRoute from "./components/Routes/AdminRoute.jsx";
import UpdateProduct from "./pages/Admin/UpdateProduct.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import CreateCategory from "./pages/Admin/CreateCategory.jsx";
import RestPassword from './pages/Auth/RestPassword.jsx';

// import Misc from './pages/misc.jsx';

function App() {

  return (
    <>
      <Routes>

        {/* visible to all users */}
        {/* <Route path="/misc" element={<Misc />} /> */}


        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<RestPassword />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:slug" element={<CategoryList />} />

        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/single-product/:slug" element={<SingleProduct />} />

        <Route path="/search/:keyword" element={<Search />} />

        <Route path="/*" element={<PageNotFount />} />

        {/* user private routing */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          {/* nested routing */}
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/orders" element={<UserOrder />} />
          <Route path="user/profile" element={<UserProfile />} />
        </Route>

        {/* admin private routing */}
        <Route path="/dashboard" element={<AdminRoute />}>
          {/* nested routing */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/products" element={<ProductAdmin />} />
          <Route path="admin/orders" element={<AdminOrder />} />
          <Route path="admin/update-product/:slug" element={<UpdateProduct />} />
          <Route path="admin/show-user" element={<UserShow />} />
          <Route path="admin/Misc" element={<Misc />} />

        </Route>
      </Routes>
    </>
  )
}

export default App
