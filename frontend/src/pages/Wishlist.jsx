// import React from 'react'
// import Layout from "../components/layout/Layout"
// import { useWishlist } from '../context/wishlist'
// import { useWishlist } from '../context/wishlist'

// const Wishlist = () => {
//     const [wishlist, setWishlist] = useWishlist()

//     const removeFromWishlist = (id) => {
//         const updatedWishlist = wishlist.filter(item => item.id !== id);
//         setWishlist(updatedWishlist);
//     };

//     const addToCart = (item) => {
//         const updatedCart = [...cart, item];
//         setCart(updatedCart);
//     };
//     return (
//         <Layout title={"Wishlist - Ecom"}>
//             <div className="container mt-5">
//                 <h1>My Wishlist</h1>
//                 <div className="row">
//                     {wishlist.map((item, index) => (
//                         <div className="col-md-4" key={index}>
//                             <div className="card mb-3">
//                                 <img src={item.image} className="card-img-top" alt={item.name} />
//                                 <div className="card-body">
//                                     <h5 className="card-title">{item.name}</h5>
//                                     <p className="card-text">{item.description}</p>
//                                     <p className="card-text">${item.price}</p>
//                                     <button className="btn btn-danger" onClick={() => removeFromWishlist(item.id)}>
//                                         Remove from Wishlist
//                                     </button>
//                                     <button className="btn btn-primary" onClick={() => addToCart(item)}>
//                                         Add to Cart
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </Layout >
//     )
// }

// export default Wishlist