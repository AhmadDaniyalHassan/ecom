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
                                        <tr className='text-center'>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Buyer</th>
                                            <th scope='col'>Email</th>
                                            <th scope='col'>Address</th>
                                            <th scope='col'>Phone</th>
                                            <th scope='col'>Order Date</th>
                                            <th scope='col'>Payment Status</th>
                                            <th scope='col'>Payment Method</th>
                                            <th scope='col'>Total Products</th>
                                            <th scope='col'>Grand Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='text-center'>
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
                                            <td>{o?.purchaser?.address}</td>
                                            <td>{o?.purchaser?.phone}</td>
                                            <td>{moment(o?.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                                            <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                            <td>{o?.paymentMethod}</td>
                                            <td>{o?.products?.length}</td>
                                            <td>{o?.total}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="container">
                                    <h3 className='mx-4'>Products</h3>
                                    {o.products.map((prod, k) => (
                                        <div className='flex d-flex' key={k}>
                                            <img style={{ padding: '2px', width: '12.5rem', height: '11.5rem', marginTop: '2px', borderRadius: '10px' }}
                                                src={prod.image} className='card-img-top mx-4 my-2' alt={prod.name} />
                                            <div>
                                                <p className='m-2'><b>Name: </b> {prod.name}</p>
                                                <p className='m-2'><b>Quantity Of Each Order Product: </b> {prod.quantity}</p>
                                                <p className='m-2'><b>Price Without Shipment: </b> {prod.total || (Number(prod.price) * prod.quantity)}</p>
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