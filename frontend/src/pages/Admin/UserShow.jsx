import React from 'react'
import Layout from '../../components/layout/Layout'
import AdminMenu from '../../components/layout/AdminMenu'
const UserShow = () => {
  return (
    <Layout title='Show Users'>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-2 mt-2'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h3>Show Users</h3>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UserShow