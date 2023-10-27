import React, { useState } from 'react'
import Layout from "../../components/layout/Layout"
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [auth, setAuth] = useAuth()


  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8000/api/user/login", { email, password });
      if (response.data) {
        // console.log("response coming from login api okay : ", response.data)
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token
        });
        localStorage.setItem('auth', JSON.stringify(response.data))
        navigate(location.state || "/")
      }
    } catch (error) {
      console.log("Error from login api xD", error)
    }

  }
  const handleNavigation = () => {
    if (auth.user) {
      navigate("/")
    }
  }
  handleNavigation()
  return (
    <>
      <Header />
      <div className='login signup-bg mt-4'>
        <div className='login-wrapper'>
          <h3 className='text-center mb-4'>Login Page</h3>
          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Your Email' type="email" className="form-control" />
              <div className="form-text"></div>
            </div>
            <div className="mb-3">
              <input required value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Your Password' type="password" className="form-control" />
              <div className="form-text"></div>
            </div>
            <div className='text-center'>
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
            <div className='text-center'>
              <button className="forget-password btn btn-secondary mt-2"
                onClick={() => { navigate("/forgetpassword") }}>forgot password</button>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login