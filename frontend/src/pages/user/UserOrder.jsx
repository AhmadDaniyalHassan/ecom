import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import UserMenu from '../../components/layout/UserMenu'
import axios from "axios"
import { useAuth } from '../../context/auth'
const Order = () => {
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()
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
            <div className='container-fluid p-3 m-3'>
                <div className='row'>
                    <div className='col md-3'>
                        <UserMenu />
                    </div>
                    <div className='col md-9'>
                        <h2>All Orders</h2>
                        <p>{JSON.stringify(orders,null,4)}</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Order