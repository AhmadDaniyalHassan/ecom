import React, { useState, useEffect } from 'react'
import Layout from "../components/layout/Layout"
import axios from 'axios'
import { useParams } from "react-router-dom"
import { useCart } from '../context/cart'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom"
const Product = () => {

    const [product, setProduct] = useState({})
    const [cart, setCart] = useCart()
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [dataR, setDataR] = useState([]);
    const [relatedProduct, setRelatedProduct] = useState([])
    const params = useParams()

    const navigate = useNavigate()

    const handleRatingChange = (value) => {
        setRating(value);
    };

    const handleCommentChange = (event) => {
        setReview(event.target.value);
    };

    const getAllProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/single-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProduct(data?.product?._id, data?.product.category._id)
        }
        catch (error) {
            console.log(error)
        }
    }

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/similar-product/${pid}/${cid}`)
            setRelatedProduct(data?.products)
            console.log(data?.products, 'success similar product')

        } catch (error) {
            console.log(error, 'from similar products')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(`http://localhost:8000/api/review/create-review`, { rating, review, p_id: product._id })
            setRating(data?.rating)
            setReview(data?.review)
            console.log(data, 'success review')
        }
        catch (error) {
            console.log(error, 'from review')
        }

        // Perform your desired action with the rating and ResetReview data
        console.log('Rating:', rating);
        console.log('Comment:', review);

        // Reset the form
        setRating(0);
        setReview('');
    };


    const getReview = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/review/get-review/`)
            setDataR(data?.reviews)
            console.log(data?.reviews, 'success fetched review')

        }
        catch (error) {
            console.log(error, 'cant fetch review')
        }
    }

    useEffect(() => {
        if (params?.slug) { getAllProduct() }
    }, [])

    useEffect(() => {
        getReview()
    }, [])


    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <label
                    key={i}
                    className={`star ${rating >= i ? 'filled' : ''}`}

                    onClick={() => handleRatingChange(i)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="star-icon"
                    >
                        <path d="M12 17.27l-5.92 3.2L7 11.62 2.25 7.07l6.88-.95L12 1.5l2.87 4.62 6.88.95L17 11.62l1.92 8.85L12 17.27z" />
                    </svg>
                </label>
            );
        }
        return stars;
    };

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
                        </div >
                    </div >
                </div>
            </div >
            <div>
                <h2 className='ms-5'>Reviews</h2>

                {dataR?.map((data) => <div key={data?.p_id}>
                    {data?.p_id}
                    <h4>Rating: {data.rating}</h4>
                    <h4>Comment: {data.review}</h4>
                </div>)}
            </div>
            <div className="container mt-5">
                <h2>Leave a Review</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="rating">Rating:</label>
                        <div className="star-rating">{renderStars()}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Comment:</label>
                        <textarea
                            className="form-control"
                            id="comment"
                            value={review}
                            onChange={handleCommentChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>

        </Layout >
    )
}

export default Product