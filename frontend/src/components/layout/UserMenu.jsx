import React from 'react'
import { NavLink } from 'react-router-dom'

const UserMenu = () => {
    return (
        <>
            <div style={{width: "15rem", margin: "auto", marginRight:'20rem' }} className=''>
                <ul className="list-group mt-2 p-2">
                    <h4>Dashboard</h4>
                    <NavLink to="/dashboard/user/profile" className="list-group-item list-group-action">
                        Profile</NavLink>
                    <NavLink to="/dashboard/user/orders" className="list-group-item list-group-action">
                        Orders</NavLink>
                </ul>
            </div>
        </>
    )
}

export default UserMenu