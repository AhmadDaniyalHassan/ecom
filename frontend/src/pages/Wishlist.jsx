import React from 'react'
import Layout from "../components/layout/Layout"
import { useWishlist } from '../context/wishlist'
import { useCart } from '../context/cart'
const Wishlist = () => {
    const [wishlist, setWishlist] = useWishlist()
    const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart()

    const removeFromWishlist = (id) => {
        const updatedWishlist = wishlist.filter(item => item.id !== id);
        setWishlist(updatedWishlist);
    };
    const handleAddToCart = (item) => {
        const existingProduct = cart.find((item) => item._id === item._id);

        if (existingProduct) {
            // If the product already exists in the cart, increase its quantity by 1
            updateQuantity(existingProduct._id, existingProduct.quantity + 1);
        } else {
            // If it's a new product, add it to the cart with a quantity of 1
            const newProduct = { ...item, quantity: 1, total: item.price }; // Set the initial total price
            setCart([...cart, newProduct]);
            localStorage.setItem('cart', JSON.stringify([...cart, newProduct]));
        }
    };
    const removeFromCart = () => {
        const updatedCart = cart.filter((item) => item._id !== item._id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };


    return (
        <Layout title={"Wishlist - Ecom"}>
            <div className="container mt-5">
                <h1>My Wishlist</h1>
                <div className="row">
                    {wishlist.map((item, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card mb-3">
                                <img src={item.image} className="card-img-top" alt={item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text">${item.price}</p>
                                    <button className="btn btn-danger" onClick={() => removeFromWishlist(item.id)}>
                                        Remove from Wishlist
                                    </button>
                                    <div className="d-flex">
                                        {cart.find(item => item._id === item._id) ? (
                                            // Render the "Remove" button if the condition is false

                                            <button style={{ fontSize: "85%", overflow: 'hidden' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(item)}>Remove From Cart</button>
                                        ) : (
                                            // Render the "Add To Cart" button if the condition is true
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className='btn btn-outline-dark mt-auto'
                                                style={{ fontSize: "85%", overflow: 'hidden' }}
                                            >
                                                {cart.find(item => item._id === item._id)} Add To Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout >
    )
}

export default Wishlist