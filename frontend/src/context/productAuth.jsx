import { useState, useContext, createContext, useEffect } from "react";

const ProductContext = createContext();



const ProductProvider = ({ children }) => {
  const [productAuth, setProductAuth] = useState([]);

  useEffect(() => {
    let existingProductAuth = localStorage.getItem('productauth')
    if (existingProductAuth) {
      setProductAuth(JSON.parse(existingProductAuth))
    }

  }, [])

  return (
    <ProductContext.Provider value={[productAuth, setProductAuth]}>
      {children}
    </ProductContext.Provider>
  )
}


// custom hook
const useProduct = () => useContext(ProductContext)

export { useProduct, ProductProvider }