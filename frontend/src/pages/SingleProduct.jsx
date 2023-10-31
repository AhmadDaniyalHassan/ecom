import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useParams } from "react-router-dom"
import Layout from "../components/layout/Layout"
import axios from 'axios'
import { useCart } from '../context/cart'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useAuth } from '../context/auth'
import moment from 'moment'

const Product = () => {

    const [product, setProduct] = useState({})
    const [cart, setCart] = useCart()
    const [relatedProduct, setRelatedProduct] = useState([])
    const params = useParams()
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [productId, setProductId] = useState('')

    const navigate = useNavigate()
    const [auth] = useAuth()


    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/review/${productId}/get-reviews`, {
                params: { page },
            });
            setReviews(response?.data?.reviews);
            setLoading(false)
        } catch (error) {
            console.error('Error Coming from reviews get request:', error);
            setloading(false)
        }
    };

    const timeOut = setTimeout(() => {
        fetchReviews()
        clearTimeout(timeOut)
    }, 300);
    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };


    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8000/api/review/${productId}/reviews`, {
                rating,
                comment,
                user: auth.user._id,
            });
            // Add the newly submitted review to the existing reviews array
            setReviews((prevReviews) => [response.data, ...prevReviews]);
            // Clear the input fields
            setRating('');
            setComment('');
            console.log('success')
            navigate(0)
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const getAllProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/single-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProduct(data?.product?._id, data?.product.category._id)
            setProductId(data?.product?._id)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/similar-product/${pid}/${cid}`)
            setRelatedProduct(data?.products)

        } catch (error) {
            console.log(error, 'from similar products')
        }
    }


    useEffect(() => {
        if (params?.slug) { getAllProduct(); }
    }, [params?.slug])


    return (
        <Layout title="Product-Single - Ecom" >
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='row container'>
                <div className='col-md-6'>
                    <img style={{
                        height: "22rem", width: "22rem", padding: '4px', marginTop: '20px', borderRadius: 10,
                        objectFit: "cover"
                    }} src={product.image?.[0]}
                        className='card-img-top' alt={product.name} />
                </div>
                <div className='col-md-6 mt-3'>
                    <h4>Name: {product?.name}</h4>
                    <h4>Description: {product?.description}</h4>
                    <h4>Price: {product?.price}</h4>
                    <h4>Category: {product?.category?.name}</h4>
                    <h4>Quantity: {product?.quantity}</h4>
                    <h4>Shipping: {product?.in_stock ? "Yes Available" : "Not Available"}</h4>
                    <h4>Quantity: {product?.review}</h4>
                    <button className='btn btn-secondary' onClick={() => {
                        setCart([...cart, product]);
                        localStorage.setItem('cart', JSON.stringify({ ...cart, product }))
                    }}>Add to Cart</button>
                </div>
            </div>
            <div>
                <h4>Similar Products</h4>
                {relatedProduct.length < 1 && (<p>No Similar Products Found</p>)}
                <div className='container'>
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="cards-wrapper">
                                    <div className='d-flex flex-wrap gap-2 justify-content-start card-similar'>
                                        {relatedProduct?.map((pdata) => (
                                            <div className='card m-2 ' style={{ width: "15.0rem", height: '18 rem', padding: '4px' }} key={pdata._id}>
                                                <img style={{ height: "12rem", width: "14rem", padding: '4px', borderRadius: 10, objectFit: "cover" }} src={pdata?.image} className='card-img-top' alt={pdata.name} />
                                                <div className='card-body'>
                                                    <h5 className='card-title'>{pdata?.name}</h5>
                                                    <p className='card-text'>{pdata?.description}</p>
                                                    <p className='card-text'>Price: {pdata?.price}</p>
                                                </div>
                                                <div style={{ height: '4.7rem', width: '100%' }} className='card-footer d-flex flex-direction-row gap-2 p-3 justify-content-center'>
                                                    <button className='btn btn-secondary ' onClick={() => {
                                                        setCart([...cart, pdata]);
                                                        localStorage.setItem('cart', JSON.stringify([...cart, pdata]))
                                                    }}>Add to Cart</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true" />
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="rating" className="form-label">Rating</label>
                                <input type="number" className="form-control" id="rating" value={rating} onChange={(e) => setRating(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comment" className="form-label">Comment</label>
                                <textarea className="form-control" id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmitReview}>Submit</button>
                            {loading || reviews.length === 0 ? (
                                <p>Loading...</p>
                            ) : (
                                <div>
                                    {reviews.map((r, i) => (
                                        <div className='card m-2 ' style={{ width: '15.0rem', height: '18 rem', padding: '4px' }} key={i}>
                                            <div className='card-body'>
                                                <h5 className='card-title'>{r.comment}</h5>
                                                <p className='card-text'>{r.rating}</p>
                                                <p className='card-text'>{r.user.name}</p>
                                                <p className='card-text'>{moment(r.createdAt).format('ddd, Do, MMM h:mm A ')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button onClick={handleLoadMore}>Load More</button>
                        </form>
                    </div>
                </div>
            </div>
            <div>
            </div>

        </Layout >
    )
}

export default Product