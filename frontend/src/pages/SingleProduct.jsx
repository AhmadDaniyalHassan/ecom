import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import axios from 'axios';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import moment from 'moment';
import StarRatings from 'react-star-ratings';

const Product = () => {
    const [api, setApi] = useState([]);
    const [product, setProduct] = useState([]);
    const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart();
    const [relatedProduct, setRelatedProduct] = useState([]);
    const params = useParams();
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [productId, setProductId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [answerValues, setAnswerValues] = useState({});
    const [currentQuestionId, setCurrentQuestionId] = useState('');
    const [question, setQuestion] = useState('');
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [auth] = useAuth();

    // Fetch reviews and questions on component mount
    useEffect(() => {
        if (params?.slug) {
            getAllProduct();
            fetchReviews();
        }
    }, [params?.slug, productId]);

    // Fetch questions when productId is available
    useEffect(() => {
        if (productId) {
            fetchQuestions();
        }
    }, [productId]);

    // Function to fetch reviews
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/review/${productId}/get-reviews`, {
                params: { page },
            });
            setReviews(response?.data?.reviews);
            setLoading(false);
        } catch (error) {
            console.error('Error coming from reviews get request:', error);
            setLoading(false);
        }
    };

    // Function to fetch questions
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/review/get-questions/${productId}`);
            setQuestions(response?.data?.question);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    // Function to handle form submission for posting a question
    const handleSubmitQuestion = async (e) => {
        e.preventDefault();

        if (!question || !title) {
            setError('Please provide both a question and a title.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8000/api/review/${productId}/post-questions`, {
                question,
                title,
                userId: auth?.user._id,
            });
            setQuestion('');
            setTitle('');
            fetchQuestions();
        } catch (error) {
            console.error('Error posting the question. Please try again later', error);
        }
    };

    // Function to update the answer for a question
    const updateAnswer = async (questionId, answer) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/review/${productId}/ans-questions/${questionId}`,
                { answer }
            );
            setQuestions((prevQuestions) => {
                return prevQuestions.map((question) => {
                    if (question._id === questionId) {
                        return { ...question, answer };
                    }
                    return question;
                });
            });
        } catch (error) {
            console.error('Error updating answer:', error);
        }
    };

    const deleteQuestion = async (questionId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/review/${productId}/delete-questions/${questionId}`);
            if (response.data.success) {
                // Filter out the deleted question from the local state
                setQuestions((prevQuestions) => prevQuestions.filter((question) => question._id !== questionId));
            } else {
                console.error('Error deleting question:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    // Handle the "Load More Reviews" button click
    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // Function to remove a product from the cart
    const removeFromCart = () => {
        const updatedCart = cart.filter((item) => item._id !== product._id);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Function to handle form submission for posting a review
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8000/api/review/${productId}/reviews`, {
                rating,
                comment,
                user: auth.user._id,
            });
            setReviews((prevReviews) => [response.data, ...prevReviews]);
            setRating(0);
            setComment('');
            navigate(0)
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    // Function to calculate the average rating of reviews
    const calculateAverageRating = () => {
        if (reviews.length === 0) {
            return 0;
        }

        let totalRating = 0;
        for (const review of reviews) {
            totalRating += review.rating;
        }
        return totalRating / reviews.length;
    };
    const averageRating = calculateAverageRating();

    // Function to fetch the product and related products
    const getAllProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/single-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product?._id, data?.product.category._id);
            setProductId(data?.product?._id);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to add a product to the cart
    const handleAddToCart = (product) => {
        const existingProduct = cart.find((item) => item._id === product._id);

        if (existingProduct) {
            updateQuantity(existingProduct._id, existingProduct.quantity + 1);
        } else {
            const newProduct = { ...product, quantity: 1, total: product.price };
            setCart([...cart, newProduct]);
            localStorage.setItem('cart', JSON.stringify([...cart, newProduct]));
        }
    };

    // Function to get similar products
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/similar-product/${pid}/${cid}`);
            setRelatedProduct(data?.products);
        } catch (error) {
            console.log(error, 'from similar products');
        }
    };
    return (
        <Layout title="Product-Single - Ecom" >
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <section className="py-2">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="row gx-4 gx-lg-5 align-items-start">
                        <div className="col-md-5"><img className="card-img-top mb-5 mb-md-0" style={{ borderRadius: "20px" }} src={product?.image} alt={product?.name} /></div>
                        <div className="col-md-6">
                            <h2 className="display-8 fw-bolder mb-1"><span className='text-muted h3'>Name:</span> {product?.name}</h2>
                            <div className="lead mb-1">Category: {product?.category?.name}</div>
                            <p className="lead mb-1">Description: {product?.description}</p>
                            <StarRatings
                                rating={averageRating}
                                starRatedColor="gold"
                                starEmptyColor="lightgray"
                                starDimension="20px"
                                starSpacing="2px"
                            />
                            <div className="fs-5 mb-1">
                                <span>Price: {product?.price}&nbsp;&nbsp;</span>
                            </div>
                            <div className="d-flex">
                                {cart.find(item => item._id === product._id) ? (
                                    // Render the "Remove" button if the condition is false

                                    <button style={{ fontSize: "85%", overflow: 'hidden' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(product)}>Remove From Cart</button>
                                ) : (
                                    // Render the "Add To Cart" button if the condition is true
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className='btn btn-outline-dark mt-auto'
                                        style={{ fontSize: "85%", overflow: 'hidden' }}
                                    >
                                        {cart.find(item => item._id === product._id)} Add To Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center'>
                <div>
                    <form className='d-flex row' >
                        <h4 className='text-center mb-2'>Leave A Reviews</h4>
                        <div className="mb-0 mb-3">
                            <label htmlFor="rating" className="form-label">Rating&nbsp;</label>
                            <StarRatings
                                rating={rating}
                                starRatedColor="gold"
                                starEmptyColor="lightgray"
                                starDimension="20px"
                                starSpacing="2px"
                                changeRating={setRating}
                            />
                        </div>
                        <div className="mb-2 justify-content-center">
                            <textarea className="form-control" id="comment" placeholder='Give Review To This Product' value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary justify-content-center mt-2 " onClick={handleSubmitReview}>Submit</button>
                    </form>
                </div>
                <div className='flex d-flex flex-column justify-content-center '>
                    <h4>Post a Question</h4>
                    <div>
                        <input className='form-control mb-2'
                            type="text"
                            id="title"
                            placeholder='Add Title of your Question'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea className='form-control mb-1'
                            type="text"
                            id="question"
                            placeholder='Enter your question'
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>
                    <button className='btn btn-primary mt-2' onClick={handleSubmitQuestion}>Submit Question</button>
                </div>
            </div>
            <h4 className='text-center mt-2 mb-1'>Our Users Reviews</h4>
            {loading || reviews.length === 0 ? (
                (<p className='text-center h5'>No Reviews Found</p>)
            ) : (
                <div className='d-flex flex-row flex-wrap justify-content-center'>
                    {reviews.map((r, i) => (
                        <div className='card m-2 ' style={{ width: '20.0rem', height: '12rem', alignItems: 'center', padding: '4px', borderRadius: "12px" }} key={i}>
                            <div className='card-body '>
                                <h5 className='card-title mb-1'><b>Review: </b>{r.comment}</h5>
                                <StarRatings
                                    rating={r.rating}
                                    starRatedColor="gold"
                                    starEmptyColor="lightgray"
                                    starDimension="20px"
                                    starSpacing="2px"
                                />
                                <p className='card-text mb-1'><b>User:</b> {r.user.name}</p>
                                <p className='card-text'><b>Created At:</b> {moment(r.createdAt).format('ddd, Do, MMM h:mm A ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className='d-flex justify-content-center mt-2'>
                <button className='btn btn-outline-dark mt-auto ' onClick={handleLoadMore}>Load More Reviews</button>
            </div>
            {loading || questions.length === 0 ? (
                <p className='text-center h5'>No Questions Found</p>
            ) : (
                <div className='d-flex flex-row flex-wrap justify-content-center'>
                    {questions.map((question) => (
                        <div className='card m-2' style={{ width: '24.0rem', height: '13rem', alignItems: 'center', padding: '4px', borderRadius: "12px" }} key={question._id}>
                            <div className='card-body'>
                                <h5 className='card-title mb-1'><b>Title: </b>{question.title}</h5>
                                <p className='card-text mb-1'><b>Question: </b>{question.question}</p>
                                <p className='card-text mb-1'><b>Created At:</b> {moment(question.createdAt).format('ddd, Do, MMM h:mm A ')}</p>
                                <p className='card-text mb-1'><b>User: </b>{question.userId.name}</p>
                                {question.answer ? (
                                    <div>
                                        <p className='card-text'><b>Answer: </b>{question.answer}</p>
                                        {auth?.user?.role === 1 && (
                                            <button
                                                className='btn btn-danger'
                                                onClick={() => deleteQuestion(question._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    // Only show the "answer" input field for admins
                                    auth?.user?.role === 1 && (
                                        <div className='flex d-flex'>
                                            <input
                                                className='form-control'
                                                type="text"
                                                placeholder="Your Answer"
                                                value={answerValues[question._id] || ''}
                                                onChange={(e) => setAnswerValues({ ...answerValues, [question._id]: e.target.value })}
                                            />
                                            <button
                                                className='btn btn-primary'
                                                onClick={() => updateAnswer(question._id, answerValues[question._id])}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            <section className="py-2 bg-light">
                <div className="container px-2 px-lg-5 mt-3">
                    <h2 className="fw-bolder mb-4">Related products</h2>
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 " >
                        {relatedProduct.map((p, i) => (
                            <div className="col mb-3 flex d-flex justify-content-center" key={i}>
                                <div className="card w-auto"  >
                                    {/* Product image*/}
                                    <img style={{ height: "10rem", width: "13.0rem", padding: '4px', marginLeft: '6px', borderRadius: 10, objectFit: "cover", }} src={p?.image} alt={p?.name} />
                                    <div className="card-body p-3">
                                        <div className="text-center">
                                            <b>Name: </b>{p?.name}<br></br>
                                            <b>Category: </b>{p?.category?.name}<br></br>
                                            {/* Product name*/}
                                            {/* Product price*/}
                                            <b>Price: </b> {p?.price}<br></br>
                                        </div>
                                    </div>
                                    {/* Product actions*/}
                                    <div className="card-footer p-4 ml-2 pt-0 mx-3 border-top-0 bg-transparent ">
                                        <div className="text-center">
                                            {cart.find(item => item._id === product._id) ? (
                                                // Render the "Add To Cart" button if the condition is true

                                                <button style={{ fontSize: "85%", overflow: 'hidden', marginRight: '6px' }} className='btn btn-outline-dark mt-auto' onClick={() => removeFromCart(product)}>Remove From Cart</button>
                                            ) : (
                                                // Render the "Remove" button if the condition is false
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className='btn btn-outline-dark mt-auto'
                                                    style={{ fontSize: "85%", overflow: 'hidden', marginRight: '8px' }}
                                                >
                                                    {cart.find(item => item._id === product._id)} Add To Cart
                                                </button>
                                            )}
                                            <Link to={`/single-product/${p.slug}`} className='btn btn-primary mt-auto ' style={{ fontSize: "85%", overflow: 'hidden', display: 'inline-block' }}>Details</Link>
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