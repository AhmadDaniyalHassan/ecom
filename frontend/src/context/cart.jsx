import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        let existingCart = localStorage.getItem('cart')
        if (existingCart) {
            setCart(JSON.parse(existingCart))
        }

    }, [])



    const increaseQuantity = (itemId) => {
        const updatedCart = cart.map((item) => {
            if (item._id === itemId) {
                const updatedItem = { ...item, quantity: item.quantity + 1 };
                return {
                    ...updatedItem,
                    total: updatedItem.price * updatedItem.quantity,
                };
            }
            return item;
        });
        updateCart(updatedCart);
    };

    const decreaseQuantity = (itemId) => {
        const updatedCart = cart.map((item) => {
            if (item._id === itemId) {
                if (item.quantity > 1) {
                    const updatedItem = { ...item, quantity: item.quantity - 1 };
                    return {
                        ...updatedItem,
                        total: updatedItem.price * updatedItem.quantity,
                    };
                }
            }
            return item;
        });
        updateCart(updatedCart);
    };

    return (
        <CartContext.Provider value={[cart, increaseQuantity, decreaseQuantity, setCart]}>
            {children}
        </CartContext.Provider>
    )
}

// custom hook
const useCart = () => useContext(CartContext)

export { useCart, CartProvider }