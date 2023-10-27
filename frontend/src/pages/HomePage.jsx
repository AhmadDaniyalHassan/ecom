import React, { useState, useEffect } from 'react'
import Layout from "../components/layout/Layout"
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Checkbox, Radio } from 'antd'
import { useCart } from '../context/cart'
import { useWishlist } from '../context/wishlist'
import wishlists from '../assets/wishlists.svg'
import { Prices } from '../components/Prices'
// import { add, remove } from '../store/cartSlice'
// import { useDispatch } from 'react-redux'

const HomePage = () => {
    // const dispatch = useDispatch()
    const [product, setProduct] = useState([])
    const [category, setCategory] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [cart, setCart] = useCart()
    const [wishlist, setWishlist] = useWishlist()
    const [loading, setLoading] = useState(false)


    const getAllProduct = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`http://localhost:8000/api/product/product-list/${page}`)
            setLoading(false)
            setProduct(data?.products)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        if (page === 1) return
        loadMore()
    }, [page])

    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`http://localhost:8000/api/product/product-list/${page}`)
            setLoading(false)
            setProduct([...product, ...data?.products])

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    const getTotal = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/product/product-count")
            setTotal(data?.total)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getTotal(); getCategory();
    }, [])

    const getCategory = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/category/get-category')
            if (data?.success) {

                setCategory(data?.category)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleFilter = (value, id) => {

        let allChecked = [...checked]
        if (value) {
            allChecked.push(id)
        } else {
            allChecked = allChecked.filter(item => item !== id)
        }
        setChecked(allChecked)
    }


    useEffect(() => {
        if (!checked.length || !radio.length) getAllProduct();
        //eslint-disable-next-line
    }, [checked.length, radio.length])


    useEffect(() => {
        if (checked.length || radio.length) filterProduct()

    }, [checked, radio])

    const filterProduct = async () => {
        try {
            const { data } = await axios.post('http://localhost:8000/api/product/filter-product', { checked, radio })
            setProduct(data?.product)

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Layout title={"HomePage - Ecom"}>
            <section className="px-5 py-6 py-xxl-10 hcf-bp-center hcf-bs-cover hcf-overlay hcf-transform" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-12 col-md-11 col-lg-9 col-xl-7 col-xxl-6 text-center text-white">
                            <h1 className="display-3 fw-bold mb-3">Elevate Your Style</h1>
                            <p className="lead mb-5">Shop with style and simplicity. Discover our curated collection of must-have products for a sophisticated shopping experience.</p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <button type="button" className="btn btn-light btn-lg px-4 gap-3">Shop Now</button>
                                <button type="button" className="btn btn-outline-light btn-lg px-4">Know About Us</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className='row mt-3'>
                <div className='col-md-2'>
                    <h4 className='text-center'>Filters By Category</h4>
                    <div className='d-flex flex-column ms-3 p-1 gap-2 m-2 mt-4'>
                        {category.map(cat => (
                            <Checkbox key={cat._id} name='category' onChange={(e) => handleFilter(e.target.checked, cat._id)}>
                                <h6 >{cat.name}</h6>
                            </Checkbox>
                        ))}
                    </div>
                    {/* <button className='btn btn-danger m-2 ms-3' onClick={() => { window.location.reload() }}>Reset Filters</button> */}
                    {/* price filter */}
                    <h4 className='text-center'>Filters By Price</h4>
                    <div className='d-flex flex-column ms-3 p-1 gap-2 m-2 mt-4'>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}</Radio.Group>
                    </div>
                    <button className='btn btn-danger m-2 ms-3' onClick={() => { window.location.reload() }}>Reset Filters</button>

                </div>

                <div className='col-md-10'>
                    <h4 className='text-center'>Home</h4>
                    <div style={{ justifyContent: 'center' }} className='d-flex flex-wrap'>
                        {product?.map((pdata) => (
                            <div className='card m-2 ' style={{ width: "15.0rem", height: '27rem', }} key={pdata._id}>
                                <img style={{ height: "11rem", width: "15.0rem", padding: '4px', borderRadius: 10, objectFit: "cover" }} src={pdata.image} className='card-img-top' alt={pdata.name} />
                                <div className='card-body p-0'>
                                    <h5 className='card-title p-0'><b>Name: </b>{pdata?.name}</h5>
                                    <p className='card-text p-0'><b>Info: </b>{pdata?.description.substring(0, 25)}...</p>
                                    <p className='card-text'><b>Price: </b> {pdata?.price}</p>
                                    <p className='card-text'><b>Category: </b> {pdata?.category?.name}</p>
                                    <img style={{ cursor: 'pointer' }} onClick={() => {
                                        setWishlist([...wishlist, pdata]);
                                        localStorage.setItem('wishlist', JSON.stringify([...wishlist, pdata]))
                                    }} src={wishlists} alt="wishlist" width="20px" height="20px" />

                                </div>
                                <div style={{ height: '4.5rem', width: '100%' }} className='card-footer d-flex flex-direction-row gap-2 p-3'>
                                    <button onClick={() => {
                                        setCart([...cart, pdata]);
                                        localStorage.setItem('cart', JSON.stringify([...cart, pdata]))
                                    }} className='btn btn-secondary' >Add to Cart</button>
                                    <Link to={`/single-product/${pdata.slug}`} className='btn btn-primary'>Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='m-2 p-2'>
                        {product && product.length < total && (
                            <button className='btn text-light bg-success
                            loadmore' onClick={(e) => {
                                    e.preventDefault()
                                    setPage(page + 1)
                                }}>
                                {loading ? "Loading.." : "Load-More.."}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage