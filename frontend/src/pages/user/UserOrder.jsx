import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import UserMenu from '../../components/layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();

    const getOrders = async () => {
        try {
            const { data } = await axios.get('http://localhost:8000/api/user/orders');
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    return (
        <Layout title='User-Order' description='Order Page'>
            <button
                style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }}
                className='btn btn-primary'
                onClick={() => navigate(-1)}
            >
                Go Back
            </button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-2'>
                        <UserMenu />
                    </div>
                    <div className='col-md-8'>
                        <h2>All Orders</h2>
                        {orders?.map((order, i) => (
                            <div key={i} className='border shadow'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope='col'>#</th>
                                            <th scope='col'>Status</th>
                                            <th scope='col'>Buyer</th>
                                            <th scope='col'>Order Date</th>
                                            <th scope='col'>Payment Status</th>
                                            <th scope='col'>Total Products</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{order?.status}</td>
                                            <td>{order?.purchaser?.name}</td>
                                            <td>{moment(order?.createdAt).format('MMMM Do YYYY, h:mm a')}</td>
                                            <td>{order?.payment?.success ? 'Success' : 'Failed'}</td>
                                            <td>{order?.products.length}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <h3>Products</h3>
                                {order?.products.map((productItem, j) => (
                                    <div key={j}>
                                        <p>Quantity: {productItem.quantity}</p>
                                        <p>Price:{productItem.total}</p>
                                        {console.log(productItem)}
                                    </div>
                                ))}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Order;
