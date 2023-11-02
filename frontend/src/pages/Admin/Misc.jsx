import React from 'react'
import Layout from '../../components/layout/Layout'
import { useNavigate } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import userProfile from '../user/UserProfile'
const Misc = () => {
    const navigate = useNavigate()

    return (
        <>
            <Layout>
                <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>
                <div className='container-fluid m-3 p-3'>
                    <div className="row">
                        <div className="col-md-2 margin-admin">
                            <AdminMenu />
                        </div>
                    </div>
                    
                </div>
            </Layout>
        </>
    )
}

export default Misc