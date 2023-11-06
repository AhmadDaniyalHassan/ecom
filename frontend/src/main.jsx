import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './context/auth.jsx'
import { CartProvider } from './context/cart.jsx'
import { WishlistProvider } from './context/wishlist.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import 'antd/dist/reset.css';
// import { ThemeProvider } from "./context/theme.jsx";
import { SearchProvider } from './context/search.jsx'
// import { ProductProvider } from './context/productAuth.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <ThemeProvider>
  <AuthProvider>
    <SearchProvider>
      <Provider store={store}>
        <CartProvider>
          {/* <ProductProvider> */}
            <WishlistProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter >
            </WishlistProvider>
          {/* </ProductProvider> */}
        </CartProvider>
      </Provider>
    </SearchProvider>
  </AuthProvider>
  // </ThemeProvider>

)