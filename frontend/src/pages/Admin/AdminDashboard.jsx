import React from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
import { useAuth } from '../../context/auth'

const AdminDashboard = () => {

    const [auth] = useAuth()
    return (
        <Layout>
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 margin-admin'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9 mt-5'>
                        <div className='card w-75 p-2'>
                            <h3>User Id: {auth?.user?._id}</h3>
                            <h3>Name: {auth?.user?.name}</h3>
                            <h3>Email: {auth?.user?.email}</h3>
                            <h3>Address: {auth?.user?.address}</h3>
                            <h3>Role: {auth?.user?.role === 1 ? 'Admin' : 'User'}</h3>
                        </div>
                    </div>
                </div>

            </div>

        </Layout>
    )
}

export default AdminDashboard