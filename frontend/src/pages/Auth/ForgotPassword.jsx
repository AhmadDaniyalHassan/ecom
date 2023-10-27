import React, { useState } from 'react'
import Layout from "../../components/layout/Layout"
// import { useAuth } from "../../context/auth"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [newpassword, setNewPassword] = useState('')
  const [answer, setAnswer] = useState('')



  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8000/api/user/forgot-password",
        { email, newpassword, answer });
      if (response && response.data) {
        // console.log("response coming from forgot password api okay : ", response.data)
        navigate("/login")
      }
    } catch (error) {
      console.log("Error from forgot password api xD", error)
    }

  }

  return (


    <Layout title="Forgot Password -Ecom">
      <button style={{ marginTop: 15, marginLeft: 15 }} className='btn btn-primary' onClick={() => navigate(-1)}>Go Back</button>

      <div className='forgetpassword'>
        <div className='login-wrapper'>
          <h3 className='text-center mb-4'>Forgot Password</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' type="email" className="form-control" />
              <div className="form-text"></div>
            </div>
            <div className="mb-3">
              <input required value={newpassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Enter Your New Password' type="password" className="form-control" />
              <div className="form-text"></div>
            </div>
            <div className="mb-3">
              <input required value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder='Enter Your Secret Answer' type="text" className="form-control" />
              <div className="form-text"></div>
            </div>
            <div className='text-center'>
              <button type="submit" className="btn btn-primary">Reset Password</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword