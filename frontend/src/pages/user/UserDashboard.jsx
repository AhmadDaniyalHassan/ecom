import React from 'react'
import Layout from "../../components/layout/Layout"
import UserMenu from '../../components/layout/UserMenu'
import { useAuth } from '../../context/auth'

const Dashboard = () => {
    const [auth] = useAuth()
    return (

        <Layout title="Dashboard - User-Panel">
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-2'>
                        <UserMenu />
                    </div>
                    <div className='col md-9'>
                        <div className='card w-75 p-3'>
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