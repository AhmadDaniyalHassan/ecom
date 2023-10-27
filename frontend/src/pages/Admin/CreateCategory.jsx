import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from "antd"

const CreateCategory = () => {

    const [category, setCategory] = useState([])
    const [name, setName] = useState('')
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)
    const [updatedName, setUpdatedName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const { data } = await axios.post('http://localhost:8000/api/category/create-category', { name })
            if (data?.success) {
                getAllCategory()
                // setName('')

            }
        } catch (error) {
            console.log(error)

        }
    }

    const getAllCategory = async () => {
        try {

            const { data } = await axios.get('http://localhost:8000/api/category/get-category')
            if (data?.success) {
                setCategory(data?.category)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllCategory()

    }, [])

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(`http://localhost:8000/api/category/update-category/${selected._id}`, { name: updatedName })
            if (data.success) {
                setSelected(null)
                setUpdatedName('')
                setVisible(false)
                getAllCategory()
            }

        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteSubmit = async (pid) => {
        try {
            const { data } = await axios.delete(`http://localhost:8000/api/category/delete-category/${pid}`)
            if (data.success) {
                getAllCategory()
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout title='Create Category'>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-2'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h3>Manage Category</h3>
                        <div className='p-3 w-50'>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                        <div className='w-75'>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {category?.map((item, index) => (

                                        <tr key={index}>
                                            <td >{item.name}</td>
                                            <td style={{ display: 'flex', textAlign:"center" }}>
                                                <button className='btn btn-primary ms-2'
                                                    onClick={() => {
                                                        setVisible(true);
                                                        setUpdatedName(item.name);
                                                        setSelected(item)
                                                    }}> Edit</button>
                                                <button className='btn btn-danger ms-2'
                                                    onClick={() => { handleDeleteSubmit(item._id) }}
                                                >Delete</button>
                                            </td>
                                        </tr >

                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Modal onCancel={() => setVisible(false)}
                            footer={null} open={visible}><CategoryForm value={updatedName} handleSubmit={handleUpdateSubmit} setValue={setUpdatedName} /></Modal>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CreateCategory