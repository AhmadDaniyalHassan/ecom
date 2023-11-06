import { useState, useContext, createContext, useEffect } from "react";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productAuth, setProductAuth] = useState([]);

  useEffect(() => {
    let existingProductAuth = localStorage.getItem('productauth');
    if (existingProductAuth) {
      setProductAuth(JSON.parse(existingProductAuth));
    }
  }, []);

  // Function to add cart items to productAuth

  return (
    <ProductContext.Provider value={{ productAuth }}>
      {children}
    </ProductContext.Provider>
  );
}

// Custom hook
const useProduct = () => useContext(ProductContext);

export { useProduct, ProductProvider };
