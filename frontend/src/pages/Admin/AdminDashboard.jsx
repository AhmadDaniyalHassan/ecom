import React from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [auth] = useAuth()
    return (
        <Layout>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom:15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='container-fluid m-3 p-3 '>
                <div className='row'>
                    <div className='col-md-2 margin-admin'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9' style={{ marginTop: '85px' }}>
                        <div className='card w-50 p-2' style={{ backgroundColor: '#E8E8E8' }}>
                            <h3>Name: {auth?.user?.name}</h3>
                            <h3>Email: {auth?.user?.email}</h3>
                            <h3>Address: {auth?.user?.address}</h3>
                            <h3>Role: {auth?.user?.role}</h3>
                        </div>
                    </div>
                </div>

            </div>

        </Layout>
    )
}

export default AdminDashboard