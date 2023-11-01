import React, { useState, useEffect } from 'react'
import Layout from "../components/layout/Layout"
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'

const AddToCart = () => {
  const [auth, setAuth] = useAuth()
  const [cart, setCart] = useCart()
  const [clientToken, setClientToken] = useState('')
  const [instance, setInstance] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  let shipping = 350

  const totalPrice = () => {
    try {
      let total = 0
      cart?.map((item) => { total = total + (item.price * item.quantity) });
      return total + shipping
    } catch (error) {
      console.log(error)
    }
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    const updatedCart = cart.map(prod => {
      if (prod._id === id) {
        return { ...prod, quantity: newQuantity }
      }
      return prod
    })
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeCartItem = (id) => {
    try {

      let myCart = [...cart]
      let index = myCart.findIndex(prod => prod._id === id)
      myCart.splice(index, 1)
      setCart(myCart)
      localStorage.setItem('cart', JSON.stringify(myCart))

    } catch (error) {
      console.log(error)
    }
  }

  const getToken = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/product/braintree/token')
      setClientToken(data?.clientToken)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePayment = async () => {
    try {
      setLoading(true)
      const { nonce } = instance.requestPaymentMethod()
      const { data } = await axios.post('http://localhost:8000/api/product/braintree/payment', { nonce, cart })
      setLoading(false)
      localStorage.removeItem('cart')
      setCart([])
      navigate('/dashboard/user/orders')
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }
  useEffect(() => {
    getToken()
  }, [auth?.token])

  return (
    <Layout title={"Cart - Ecom"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-11'>

            <h5 className='text-center mb-3 mt-2'>
              {cart?.length ? `You have ${cart.length} item in your cart
               ${auth?.token ? "" : "Please Login to CheckOut"}`
                : "Your Cart Is Empty"}
            </h5>
          </div>
          <div className='row '>
            <div className='col-md-7'>
              {cart?.map(prod => (
                <div key={prod._id} style={{ width: "70%", backgroundColor: '#b8b9ba', borderRadius: "20px" }} className='row mb-2 p-2 card flex-row'>

                  <img style={{ padding: '2px', width: '14rem', marginTop: '2px', borderRadius: '10px' }}
                    src={prod.image}
                    className='card-img-top' alt={prod.name} />
                  <div className='col-md-6'>
                    <p className='mb-2'><b>Name:</b> {prod.name}</p>
                    <p className='mb-2'><b>Info:</b> {prod.description.substring(0, 10)}...</p>
                    <p className='mb-2'><b>Price: </b>{prod.price}</p>
                    <div className='d-flex mb-2 mt-2 ' style={{ height: '40%', alignItems: 'center' }}>
                      <button onClick={() => updateQuantity(prod._id, prod.quantity - 1)} className='btn btn btn-warning'>-</button>
                      <p className='mx-2' style={{ marginTop: '10px' }}>{prod.quantity}</p>
                      <button onClick={() => updateQuantity(prod._id, prod.quantity + 1)} className='btn btn btn-warning'>+</button>
                      &nbsp;&nbsp;
                      <button className='btn btn-danger' onClick={() => removeCartItem(prod._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className='col-md-5 text-center'>
              <h4>Cart Summary</h4>
              <p>Total | Checkout | Payment </p>
              <hr />
              <h5>Shipping: <span className='h6'>{shipping}RS</span> </h5>
              <h5>Total: <span className='h6'>{totalPrice()}RS</span> </h5>
              {auth?.user?.address ? (
                <>
                  <div className='mb-4'>
                    <h5>Current Address: <span className='h6'>{auth?.user?.address}</span></h5>
                  </div>
                  <div>
                    <button onClick={() => { navigate('/dashboard/user/profile') }} className='btn btn-warning'>Update Address</button>
                  </div>
                </>
              ) : (
                <div className='mb-3'>
                  {auth?.token ? (
                    <button onClick={() => { navigate('/dashboard/user/profile') }} className='btn btn-warning'>Update Address</button>
                  ) : (
                    <button onClick={() => navigate('/login', {
                      state: '/cart'
                    })} className='btn btn-warning'>Please Login To CheckOut</button>
                  )}
                </div>
              )}
              <div className='mt-2 '>
                {!clientToken || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: 'vault'
                        }
                      }}
                      onInstance={(instance) => setInstance(instance)} />
                    <button disabled={loading || !instance || !auth?.user?.address} onClick={handlePayment} className='btn btn-success'>{loading ? "Processing..." : "Make Payment"}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  )
}

export default AddToCart