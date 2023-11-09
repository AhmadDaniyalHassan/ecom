import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import { Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";

const { Option } = Select
const CreateProduct = () => {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [inStock, setIn_Stock] = useState(Boolean)
    const [category, setCategory] = useState('')


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
    let timeout
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('description', description)
            formData.append('price', price)
            formData.append('image', image)
            formData.append('category', category)
            formData.append('in_stock', inStock)


            const { data } = axios.post('http://localhost:8000/api/product/create-product', formData)
            if (data?.success) {
                toast.error(data?.message);
            } else {
                toast.success("Product Created Successfully");
                timeout = setTimeout(() => {
                    navigate("/dashboard/admin/products");
                    clearTimeout(timeout)
                }, 1450);
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    }
    return (

        <Layout title='Create Product'>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='container-fluid m-3 p-3'>
                <div className="row">
                    <div className="col-md-2 margin-admin">
                        <AdminMenu />
                    </div>
                    <div className='col-md-8'>
                        <h3 className="text-center">Create Product</h3>
                        <div className='m-1'></div>
                        <form onSubmit={handleSubmit}>
                            <Select bordered={false}
                                placeholder="Select a Category"
                                size='large'
                                showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }} >
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
                                {image && (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(image)} alt="product image" className='img img-responsive' height='150px'></img>
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
                                <Select bordered={false} placeholder="Select Shipping Status" size='large' showSearch className='form-select mb-3' onChange={(value) => { setIn_Stock(value) }} >
                                    <Option value={false}>Not Available</Option>
                                    <Option value={true}>Yes Available</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button type='submit' className='btn btn-primary'>Create Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct