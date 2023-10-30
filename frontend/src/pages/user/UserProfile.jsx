import React, { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import UserMenu from '../../components/layout/UserMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth'
import { useNavigate } from 'react-router-dom'

const UserProfile = () => {
    const navigate = useNavigate()


    const [auth, setAuth] = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("phone", phone);
        formdata.append("address", address);

        try {
            const { data } = await axios.put("http://localhost:8000/api/user/profile",
                { name, email, password, phone, address });
            if (data?.error) {
                console.log(data?.error, "error coming from update function")
            } else {
                setAuth({ ...auth, user: data?.updateUser })

                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data?.updateUser

                localStorage.setItem("auth", JSON.stringify(ls))
                console.log("user updated successfully")

            }
        } catch (error) {
            console.log("Error from signup api", error)
        }

    }

    useEffect(() => {
        const { email, name, phone, address } = auth?.user
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
    }, [auth?.user])

    return (
        <Layout title='User-Profile' description='Profile Page'>
            <button style={{ marginTop: 15, marginLeft: 15, marginBottom: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-2 mt-2'>
                        <UserMenu />
                    </div>
                    <div className='col md-9'>
                        <h2>Update User Profile</h2>
                        <div className='signup'>
                            <div className=' p-2 signup-wrapper'>
                                <h3 className='mb-3 text-center'>Update User Profile</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Your Name' type="text" className="form-control" />
                                        <div className="form-text"></div>
                                    </div>

                                    <div className="mb-3">
                                        <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' type="email" className="form-control" />
                                        <div id="emailHelp" className="form-text"></div>
                                    </div>

                                    <div className="mb-3">
                                        <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' type="password" className="form-control" />
                                    </div>

                                    <div className="mb-3">
                                        <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder='Enter Your Phone Number' className="form-control" />
                                        <div className="form-text"></div>
                                    </div>

                                    <div className="mb-3">
                                        <input required value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter Your Home Address' type="text" className="form-control" />
                                        <div className="form-text"></div>
                                    </div>
                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-primary mb-3">Update Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UserProfile