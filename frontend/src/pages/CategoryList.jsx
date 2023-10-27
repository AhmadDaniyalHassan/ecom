import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout.jsx'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/cart'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const CategoryList = () => {
    const navigate = useNavigate()

    const params = useParams()
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [cart, setCart] = useCart()

    const getProductsByCat = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8000/api/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (params?.slug)
            getProductsByCat()
    }, [params?.slug])
    return (
        <Layout title={"Each Category"}>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='container mt-3'>
                <h3 className='text-center'><b>Category: </b>{category?.name}</h3>
                <h5 className='text-center'>{products?.length} Result Found</h5>
                <div style={{ justifyContent: 'center' }} className='d-flex flex-wrap'>
                    {products?.map((pdata) => (
                        <div className='card m-2 ' style={{ width: "15.0rem", height: '27rem', }} key={pdata._id}>
                            <img style={{ height: "12rem", width: "15.0rem", padding: '4px', borderRadius: 10, objectFit: "cover" }} src={pdata.image[0]} className='card-img-top' alt={pdata.name} />
                            <div className='card-body'>
                                <h5 className='card-title'>{pdata.name}</h5>
                                <p className='card-text'>{pdata.description.substring(0, 30)}...</p>
                                <p className='card-text'><b>Price :</b> {pdata.price}</p>
                                <p className='card-text'><b>Category :</b> {pdata?.category?.name}</p>
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
            </div>
        </Layout>
    )
}

export default CategoryList