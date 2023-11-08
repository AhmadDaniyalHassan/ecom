import React from 'react'
import Layout from "../../components/layout/Layout"
import UserMenu from '../../components/layout/UserMenu'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const navigate = useNavigate();

    const [auth] = useAuth()
    return (

        <Layout title="Dashboard - User-Panel">
            <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-2'>
                        <UserMenu />
                    </div>
                    <div className='col md-9' style={{ marginTop: '85px' }}>
                        <div className='card w-50 p-2' style={{ backgroundColor: '#E8E8E8' }}>
                            <h4>Name:<span className='h5'> {auth?.user.name}</span></h4>
                            <h4>Email:<span className='h5'> {auth?.user.email}</span></h4>
                            <h4>Address: <span className='h5'>{auth?.user.address}</span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard