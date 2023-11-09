import React, { useState } from 'react'
import Layout from "../../components/layout/Layout"
// import { useAuth } from "../../context/auth"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'


const RestPassword = () => {
    const [email, setEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [loading, setLoading] = useState(false); // Add a loading state

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/user/reset-code-password",
                { email, resetCode, newPassword });
            if (response && response.data) {
                navigate("/login")
            }
        } catch (error) {
            console.log("Error from resetting password api", error)
        }

    }

    return (
        <>
            <Header />
            <button style={{ marginTop: 10, marginLeft: 15 }} className='btn btn-primary mb-2' onClick={() => navigate(-1)}>Go Back</button>
            <div className='forgetpassword signup-bg'>
                <div className='login-wrapper'>
                    <h3 className='text-center mb-4'>Reset Password</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' type="email" className="form-control" />
                            <div className="form-text"></div>
                        </div>
                        <div className="mb-3">
                            <input required value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder='Enter Your Reset Code' type="name" className="form-control" />
                            <div className="form-text"></div>
                        </div>
                        <div className="mb-3">
                            <input required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Enter Your New Password' type="password" className="form-control" />
                            <div className="form-text"></div>
                        </div>
                        <div className='text-center'>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Loading...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default RestPassword