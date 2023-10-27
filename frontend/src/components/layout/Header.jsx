import { NavLink, Link, useNavigate } from "react-router-dom"
import React, { useState, useContext } from 'react'
import { FaShoppingBag } from "react-icons/fa"
// import { MdDarkMode, MdLightMode } from "react-icons/md"
import { useAuth } from "../../context/auth"
import { useCart } from "../../context/cart"
import { useWishlist } from "../../context/wishlist"
import { Badge } from "antd"
import { useSelector } from "react-redux"
import SearchInput from "../Form/SearchInput"
import useCategory from "../../hooks/useCategory"
import wishlists from '../../assets/wishlists.svg'
import carts from '../../assets/cart.svg'


const Header = () => {
  const selector = useSelector((state) => state.cart)
  const [auth, setAuth] = useAuth()
  const navigate = useNavigate()
  const [cart] = useCart()
  const [wishlist] = useWishlist()

  const categories = useCategory()

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: ''
    })

    localStorage.removeItem('auth')
    navigate('/login')
  }


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary" >
        <div className=" container-fluid">
          <button className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="d-flex flex-row nav-bar-cart-wish">
            <li className="text-center nav-item nav-bar-cart-wish" style={{ marginTop: '1.7px', listStyle: 'none', marginRight: '10px' }}>
              <Badge style={{ marginRight: '12px', marginTop: '6px', backgroundColor: 'black' }} count={wishlist.length} showZero className="cart-badge">
                <NavLink to={"/wishlist"}
                  className="nav-link"
                  alt="Wish-List"
                >
                  <img src={wishlists} alt="wishlist" width="20px" height="20px" />
                </NavLink>
              </Badge>
            </li>

            <li className="text-center nav-item nav-bar-cart-wish" style={{ marginTop: '1.7px', listStyle: 'none', marginRight: '10px' }}>

              <Badge style={{ marginRight: '12px', marginTop: '6px', marker: 'none', backgroundColor: 'black' }} count={cart.length} showZero className="cart-badge">
                <NavLink to={"/cart"}
                  className="nav-link"
                  alt="Cart-Page"
                >
                  <img src={carts} alt="wishlist" width="20px" height="20px" />
                </NavLink>
              </Badge>
            </li>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to={"/"}
              className="navbar-brand"
              alt="Home-page"
            ><FaShoppingBag /> Ecom </Link>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />

              <li className="nav-item">
                <NavLink to={"/"}
                  className="text-center nav-link "
                  alt="product-page">
                  Home</NavLink>
              </li>

              <li className="text-center nav-item">
                <NavLink to={"/about"}
                  className="nav-link "
                  alt="product-page">
                  About</NavLink>
              </li>
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to={"/categories"} data-bs-toggle="dropdown" >
                  Category
                </Link>
                <ul className="dropdown-menu">
                  <li><Link to={"/categories"} className="dropdown-item">All Categories</Link></li>
                  {categories?.map(c => (
                    <li key={c._id}><Link to={`/category/${c.slug}`} className="dropdown-item">{c.name}</Link></li>
                  ))}
                </ul>
              </li>

              {!auth.user ?
                (<>
                  <li className="nav-item">
                    <NavLink to={"/login"}
                      className="nav-link"
                      alt="login-page"
                    >Login</NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to={"/signup"}
                      className="nav-link"
                      alt="signup-page"
                    >Signup</NavLink>
                  </li>

                </>) : (<>

                  <li className="text-center navdrop nav-item dropdown">
                    <NavLink className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      {auth?.user?.name}
                    </NavLink>


                    <ul className="dropdown-menu dropnav">
                      <li><NavLink className="dropdown-item"
                        to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                      >Dashboard</NavLink></li>
                      <li><NavLink onClick={handleLogout} className="dropdown-item"
                        to={"/login"}
                      >Logout</NavLink></li>
                    </ul>
                  </li>
                </>)}
              <li className="text-center nav-item nav-bar-cart-wish-slider" style={{ marginTop: '1.7px', listStyle: 'none', marginRight: '10px' }}>
                <Badge style={{ marginRight: '12px', marginTop: '6px', backgroundColor: 'black' }} count={wishlist.length} showZero className="cart-badge">
                  <NavLink to={"/wishlist"}
                    className="nav-link"
                    alt="Wish-List"
                  >
                    <img src={wishlists} alt="wishlist" width="20px" height="20px" />
                  </NavLink>
                </Badge>
              </li>
              <li className="text-center nav-item nav-bar-cart-wish-slider" style={{ marginTop: '1.7px', listStyle: 'none', marginRight: '10px' }}>

                <Badge style={{ marginRight: '12px', marginTop: '6px', marker: 'none', backgroundColor: 'black' }} count={cart.length} showZero className="cart-badge">
                  <NavLink to={"/cart"}
                    className="nav-link"
                    alt="Cart-Page"
                  >
                    <img src={carts} alt="wishlist" width="20px" height="20px" />
                  </NavLink>
                </Badge>
              </li>
            </ul>
          </div>
          {/* <button className={`btn 'Dark' ? 'btn-light' : 'btn-dark'}`}>

          </button> */}
        </div>
      </nav>

    </>
  )
}

export default Header























// <form className="d-flex" role="search">
//   <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
//   <button className="btn btn-outline-success" type="submit">Search</button>
// </form>


//   {!auth.user ? (<></>) : (<></>)

// }

//   <li className="nav-item">
//   <NavLink to={"/login"}
//    className="nav-link"
//     alt="login-page"
//      >Login</NavLink>
// </li>

// < li className = "nav-item" >
//   <NavLink to={"/cart"}
//     className="nav-link"
//     alt="Cart-page"
//   >Add To Cart(0)</NavLink>
//     </li >
//   <li className="nav-item">
//   <NavLink to={"/login"}
//    onClick={handleLogout}
//     className="nav-link"
//     alt="logout-page"
//     >logout</NavLink>
// </li>
// <li className="nav-item">
//   <NavLink to={"/signup"}
//    className="nav-link"
//     alt="signup-page"
//      >Signup</NavLink>
// </li>