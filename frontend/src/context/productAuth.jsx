// import { useState, useContext, createContext, useEffect } from "react";

// const ProductContext = createContext();

// const ProductProvider = ({ children }) => {
//   const [allProducts, setAllProducts] = useState([]);

//   useEffect(() => {
//     let existingProduct = localStorage.getItem('cart')
//     if (existingProduct) {
//       setAllProduts(JSON.parse(existingProduct))
//     }

//   }, [])





//   return (
//     <ProductContext.Provider value={[allProducts, setAllProducts]}>
//       {children}
//     </ProductContext.Provider>
//   )
// }

// // custom hook
// const useProduct = () => useContext(ProductContext)

// export { useProduct, ProductProvider }