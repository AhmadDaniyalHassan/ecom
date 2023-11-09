import React from 'react';
import Layout from "../components/layout/Layout";
import { useWishlist } from '../context/wishlist';
import { useCart } from '../context/cart';

const Wishlist = () => {
    const [wishlist, setWishlist] = useWishlist();
    const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart();

    const removeFromWishlist = (_id) => {
        const updatedWishlist = wishlist.filter(item => item._id !== _id);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    };

    const handleAddToCart = (item) => {
        // Check if the item is already in the cart
        const existingProduct = cart.find((cartItem) => cartItem._id === item._id);

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

    const removeFromCart = (item) => {
        const updatedCart = cart.filter((cartItem) => cartItem._id !== item._id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Filter out duplicate items in the wishlist
    const uniqueWishlist = wishlist.filter((item, index, self) => (
        self.findIndex((otherItem) => otherItem._id === item._id) === index
    ));

    return (
        <Layout title={"Wishlist - Ecom"}>
            <div className="container mt-3">
                <h1>My Wishlist</h1>
                <div className="row">
                    {uniqueWishlist.map((item, index) => (
                        <div key={index} style={{ width: "25%", backgroundColor: '#E8E8E8', borderRadius: "20px" }} className='row mb-2 p-2 card flex-row'>
                            {/* <div className='card m-2' style={{ width: "19rem", height: '24.5rem' }} key={index}> */}
                            <img style={{ height: "11rem", width: "19.0rem", padding: '4px', marginLeft: '6px', borderRadius: 10, objectFit: "cover" }} src={item.image} className="card-img-top" alt={item.name} />
                            <h5 className="card-title text-center m-2">Name: {item.name}</h5>
                            <p className="card-text text-center m-2">Description: {item.description}</p>
                            <p className="card-text text-center m-2">Price: {item.price}</p>
                            <button
                                onClick={() => removeFromWishlist(item._id)}
                                className='btn btn-danger mt-auto '
                                style={{ fontSize: "85%", overflow: 'hidden', marginBottom: '10px' }}
                            >Remove From Wishlist
                            </button>
                            {cart.find(cartItem => cartItem._id === item._id) ? (
                                // Render the "Remove" button if the condition is false
                                <button style={{ fontSize: "85%", overflow: 'hidden' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(item)}>Remove From Cart</button>
                            ) : (
                                // Render the "Add To Cart" button if the condition is true
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className='btn btn-outline-dark mt-auto'
                                    style={{ fontSize: "85%", overflow: 'hidden' }}
                                >
                                    Add To Cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Wishlist;
