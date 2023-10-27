import { useState, useContext, createContext, useEffect } from "react";
const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        let existingWishlist = localStorage.getItem('wishlist')
        if (existingWishlist) {
            setWishlist(JSON.parse(existingWishlist))
        }

    }, [])

    return (
        <WishlistContext.Provider value={[wishlist, setWishlist]}>
            {children}
        </WishlistContext.Provider>
    )
}

// custom hook
const useWishlist = () => useContext(WishlistContext)

export { useWishlist, WishlistProvider }
