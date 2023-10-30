import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

const { Option } = Select

const UpdateProduct = () => {
    const navigate = useNavigate()
    const params = useParams()

    const [categories, setCategories] = useState([])
    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [in_stock, setIn_stock] = useState(Boolean)
    const [category, setCategory] = useState('')
    const [previmg, setPrevImg] = useState('')
    // const [review, setReview] = useState('')
    const [id, setId] = useState('')


    const getSingleProduct = async () => {
        try {

            const { data } = await axios.get(`http://localhost:8000/api/product/single-product/${params.slug}`)
            if (data?.success) {
                setName(data?.product.name)
                setDescription(data?.product.description)
                setPrice(data?.product.price)
                // setImage(data?.product.image)
                setCategory(data?.product.category._id)
                setId(data?.product._id)
                setPrevImg(data?.product.image[0])
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSingleProduct()
        //eslint-disable-next-line
    }, [])

    const getAllCategory = async () => {
        try {

            const { data } = await axios.get('http://localhost:8000/api/category/get-category')
            if (data?.success) {
                setCategories(data?.category)
            }

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getAllCategory()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            image && formData.append('image', image)
            formData.append('category', category)
            formData.append('in_stock', in_stock)
            // formData.append('rating', rating)
            // formData.append('review', review)

            const { data } = axios.put(`http://localhost:8000/api/product/update-product/${id}`, formData)
            if (!data) {
                console.log(data)
                console.log('Updated Success')
                // navigate('/dashboard/admin/products')
                // setTimeout(() => {
                // setInterval(() => {
                //     navigate('/dashboard/admin/products')
                // }, 2500);
            }
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <Layout title='Update Product'>
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3 mt-2'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h3>Update Product</h3>
                        <div className='m-1'></div>
                        <form onSubmit={handleSubmit}>
                            <Select bordered={false}
                                placeholder="Select a Category"
                                size='large'
                                showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }} value={category} >
                                {categories?.map((item) => (
                                    <Option value={item._id} key={item._id}>{item.name}</Option>
                                ))}
                            </Select>
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {image ? image.name : "Upload Product Image"}
                                    <input type='file' name='image' accept='images/*' hidden onChange={(e) => setImage(e.target.files[0])} />
                                </label>
                            </div>
                            <div className='mb-3'>
                                {image ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(image)} alt="product image" className='img img-responsive' height={'140px'}></img>
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <img src={previmg}
                                            alt="product image" className='img img-responsive' height={'120px'}></img>
                                    </div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <input type='text' alt='name' className='form-control' placeholder='Enter Product Name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='text' alt='decription' className='form-control' placeholder='Enter Product Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <input type='number' alt='price' className='form-control' placeholder='Enter Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <Select bordered={false} placeholder="Select Shipping Status" size='large' showSearch className='form-select mb-3' onChange={(value) => { setIn_stock(value) }} value={in_stock ? true : false} >
                                    <Option value={true}>Yes Available</Option>
                                    <Option value={false}>Not Available</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button type='submit' className='btn btn-primary'>Update Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct