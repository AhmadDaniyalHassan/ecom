import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from "antd"
import { useNavigate } from 'react-router-dom'

const CreateCategory = () => {
    const navigate = useNavigate()


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
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className="row">
                    <div className="col-md-2 margin-admin">
                        <AdminMenu />
                    </div>
                    <div className='col-md-8 '>
                        <h3 className="text-center mb-0 mt-3 mx--5 ">Manage Category</h3>
                        <div className='p-2 w-50 mt-3'>
                            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
                        </div>
                        <div className='w-50 '>
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
                                            <td style={{ display: 'flex', textAlign: "center" }}>
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