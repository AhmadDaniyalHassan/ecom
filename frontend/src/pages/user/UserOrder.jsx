import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import UserMenu from '../../components/layout/UserMenu'
import axios from "axios"
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const Order = () => {
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()

    const getOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/user/orders')
            setOrders(data)
        } catch (error) { console.log(error) }
    }

    useEffect(() => {
        if (auth?.token) getOrders()

    }, [auth?.token])



    return (
        <Layout title='User-Order' description='Order Page'>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-2'>
                        <UserMenu />
                    </div>
                    <div className='col-md-8'>
                        <h2>All Orders</h2>
                        {orders?.map((o, i) => (
                            <div key={i} className='border shadow'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Buyer</th>
                                            <th scope='col'>Orders</th>
                                            <th scope='col'>Payment</th>
                                            <th scope='col'>Total Products</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{o?.status}</td>
                                            <td>{o?.purchaser?.name}</td>
                                            <td>{moment(o?.createAt).fromNow()}</td>
                                            <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                                            <td>{o?.products?.length}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="container">
                                    {o?.products.map((p, i) => (
                                        <div key={i} className='row mb-2 p-2 card flex-row'>
                                            <img style={{ padding: '2px', width: '7rem', marginTop: '10px', borderRadius: '10px' }}
                                                src={p.image}
                                                className='card-img-top' alt={p.name} />

                                            <div className='row-md-8'>
                                                <p className='mb-2'><b>Name:</b> {p.name}</p>
                                                <p className='mb-2'><b>Info:</b> {p.description.substring(0, 10)}...</p>
                                                <p className='mb-2'><b>Price: </b>{p.price}</p>
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

export default Order