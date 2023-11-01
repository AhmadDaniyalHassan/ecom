import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import Layout from "../components/layout/Layout"
import axios from 'axios'
import { useCart } from '../context/cart'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
import { useAuth } from '../context/auth'
import moment from 'moment'
import StarRatings from 'react-star-ratings';

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
            setLoading(false)
        }
    };


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
        if (params?.slug) { getAllProduct(); fetchReviews() }
    }, [params?.slug, productId])


    return (
        <Layout title="Product-Single - Ecom" >
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <section className="py-5">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="row gx-4 gx-lg-5 align-items-center">
                        <div className="col-md-5"><img className="card-img-top mb-5 mb-md-0" style={{ borderRadius: "20px" }} src={product?.image} alt={product?.name} /></div>
                        <div className="col-md-6">
                            <h2 className="display-5 fw-bolder mb-1"><span>Name:</span> {product?.name}</h2>
                            <div className="fs-5 mb-1">
                                <span className="text-decoration-line-through"></span>
                                <span>Price: {product?.price}</span>
                                <div className="lead">Category: {product?.category?.name}</div>
                            </div>
                            <p className="lead mb-3">Description: {product?.description}</p>
                            <div className="d-flex">
                                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={() => {
                                    setCart([...cart, pdata]);
                                    localStorage.setItem('cart', JSON.stringify([...cart, pdata]))
                                }}>
                                    <i className="bi-cart-fill me-1" />
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-around'>
                <form >
                    <div className="mb-2">
                        <label htmlFor="rating" className="form-label">Rating</label>
                        <StarRatings
                            rating={rating}
                            starRatedColor="gold"
                            starEmptyColor="lightgray"
                            starDimension="20px"
                            starSpacing="2px"
                            changeRating={setRating}
                        />
                    </div>
                    <div className="mb-2 ">
                        <label htmlFor="comment" className="form-label">Reviews</label>
                        <textarea className="form-control" id="comment" placeholder='Give Review To This Product' value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleSubmitReview}>Submit</button>
                </form>
                {loading || reviews.length === 0 ? (
                    (<p>No Reviews Found</p>)
                ) : (
                    <div className='d-flex col'>
                        {reviews.map((r, i) => (
                            <div className='card m-2 ' style={{ width: '15.0rem', height: '18 rem', padding: '4px', borderRadius: "12px" }} key={i}>
                                <div className='card-body '>
                                    <h5 className='card-title'>{r.comment}</h5>
                                    <StarRatings
                                        rating={r.rating}
                                        starRatedColor="gold"
                                        starEmptyColor="lightgray"
                                        starDimension="20px"
                                        starSpacing="2px"
                                    />
                                    <p className='card-text'>{r.user.name}</p>
                                    <p className='card-text'>{moment(r.createdAt).format('ddd, Do, MMM h:mm A ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            <div className='d-flex justify-content-center'>
                <button className='btn btn-outline-dark mt-auto ' onClick={handleLoadMore}>Load More Reviews</button>
            </div>
            <section className="py-2 bg-light">
                <div className="container px-2 px-lg-5 mt-3">
                    <h2 className="fw-bolder mb-4">Related products</h2>
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 ">
                        {relatedProduct.map((p, i) => (
                            <div className="col mb-3" key={i}>
                                <div className="card h-100 w-auto">
                                    {/* Product image*/}
                                    <img className="card-img-top" src={p?.image} alt={p?.name} />
                                    <div className="card-body p-4">
                                        <div className="text-center">
                                            <b>Category: </b>{p?.category?.name}
                                            {/* Product name*/}
                                            <h5 className="text-center">Name: {p?.name}</h5>
                                            {/* Product price*/}
                                            <b>Price: </b> {p?.price}
                                        </div>
                                    </div>
                                    {/* Product actions*/}
                                    <div className="card-footer p-4 ml-2 pt-0 border-top-0 bg-transparent ">
                                        <div className="text-center"><span onClick={() => {
                                            setCart([...cart, pdata]);
                                            localStorage.setItem('cart', JSON.stringify([...cart, pdata]))
                                        }} className="btn btn-outline-dark mt-auto " >Add To Cart</span>
                                        &nbsp;&nbsp;
                                            <Link to={`/single-product/${p.slug}`} className='btn btn-secondary btn-small-margin' >Details</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </Layout >
    )
}

export default Product