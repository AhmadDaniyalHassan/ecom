import React, { useState, useEffect } from 'react'
import AdminMenu from '../../components/layout/AdminMenu'
import Layout from '../../components/layout/Layout'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { Select } from 'antd'
import { Option } from 'antd/es/mentions'
import { useNavigate } from 'react-router-dom'

const AdminOrder = () => {
    const navigate = useNavigate()

    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"])
    const [changeStatus, setChangeStatus] = useState("")
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()

    const getOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/user/all-orders')
            setOrders(data)
        } catch (error) { console.log(error) }
    }

    useEffect(() => {
        if (auth?.token) getOrders()

    }, [auth?.token])

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`http://localhost:8000/api/user/order-status/${orderId}`, { status: value })
            getOrders()
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout title={'Admin Orders'}>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className="row">
                    <div className="col-md-2 margin-admin">
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h2 className="text-center">Admin All Orders</h2>
                        {orders?.map((o, i) => (
                            <div key={i} className='border shadow'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Buyer Name</th>
                                            <th scope='col'>Buyer Email</th>
                                            <th scope='col'>Buyer Phone</th>
                                            <th scope='col'>Order Time</th>
                                            <th scope='col'>Payment Status</th>
                                            <th scope='col'>Total Products</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>
                                                <Select defaultValue={o?.status} bordered={false} onChange={(value, orderId) => handleChange(o._id, value)}>
                                                    {status.map((s, i) => (
                                                        <Option key={i} value={s}>{s}</Option>
                                                    ))}
                                                </Select>
                                            </td>
                                            <td>{o?.purchaser?.name}</td>
                                            <td>{o?.purchaser?.email}</td>
                                            <td>{o?.purchaser?.phone}</td>
                                            <td>{moment(o?.createAt).fromNow()}</td>
                                            <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                            <td>{o?.products?.length}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="container">
                                    {o?.products.map((p, i) => (
                                        <div  className='d-flex mb-2 mt-2'>
                                            <img style={{ padding: '1px', width: '10rem', marginTop: '2px', marginRight: '4px', borderRadius: '10px' }}
                                              
                                                className='card-img-top'  />

                                            <div className='mt-3'>
                                                <p className='mb-1'><b>Name:</b> {console.log(p)}</p>
                                                <p className='mb-1'><b>Info:</b> {}...</p>
                                                <p className='mb-1'><b>Price: </b>{}</p>
                                                <p className='mb-1'><b>Quantity: </b>{}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default AdminOrder