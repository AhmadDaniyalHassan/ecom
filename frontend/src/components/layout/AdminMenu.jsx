import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminMenu = () => {
    return (
        <>
            <div className='text-center'>
                <ul className="list-group">
                    <h4>Admin Panel</h4>
                    <NavLink to="/dashboard/admin/create-category" className="list-group-item list-group-action">
                        Create Category</NavLink>
                    <NavLink to="/dashboard/admin/create-product" className="list-group-item list-group-action">
                        Create Product</NavLink>
                    <NavLink to="/dashboard/admin/products" className="list-group-item list-group-action">
                        Products</NavLink>
                    <NavLink to="/dashboard/admin/orders" className="list-group-item list-group-action">
                        Orders</NavLink>
                    <NavLink to="/dashboard/admin/show-user" className="list-group-item list-group-action">
                        Users</NavLink>
                    <NavLink to="/dashboard/admin/misc" className="list-group-item list-group-action">
                        Misc</NavLink>
                </ul>
            </div>
        </>
    )
}

export default AdminMenu