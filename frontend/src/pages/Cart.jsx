import React, { useState, useEffect } from 'react'
import Layout from "../components/layout/Layout"
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
// import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'

const AddToCart = () => {
  const [auth, setAuth] = useAuth()
  const [cart, setCart] = useCart()
  const [clientToken, setClientToken] = useState('')
  const [instance, setInstance] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  let shipping = 200

  const totalPrice = () => {
    try {
      let total = 0
      cart?.map((item) => { total = total + item.price });
      return total + shipping
    } catch (error) {
      console.log(error)
    }
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

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('http://localhost:8000/api/product/order', {
        cart,
        totalPrice: totalPrice()
      })
      setLoading(false)
      localStorage.removeItem('cart')
      setCart([])
      navigate('/dashboard/orders')



    } catch (error) {
      console.log(error)
    }

  }

  return (
    <Layout title={"Cart - Ecom"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>

            <h4 className='text-center mb-3 mt-2'>
              {cart?.length ? `You have ${cart.length} item in your cart
               ${auth?.token ? "" : "Please Login to CheckOut"}`
                : "Your Cart Is Empty"}
            </h4>
          </div>
          <div className='row'>
            <div className='col-md-7'>
              {cart?.map(prod => (
                <div key={prod._id} className='row mb-2 p-3 card flex-row'>
                  <div className='col-md-3'>
                    <img style={{ padding: '4px', width: '140px', marginTop: '20px' }}
                      src={prod.image[0]}
                      className='card-img-top' alt={prod.name} />
                  </div>
                  <div className='col-md-8'>
                    <p>{prod.name}</p>
                    <p>Description: {prod.description.substring(0, 30)}</p>
                    <p>Price: {prod.price}</p>
                    <button className='btn btn-danger' onClick={() => removeCartItem(prod._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className='col-md-5 text-center'>

              <h3>Cart Summary</h3>
              <p>Total | Checkout </p>

              <hr />
              <h4>Shipping: {shipping}RS </h4>
              <h4>Total: {totalPrice()}RS </h4>
              {auth?.user?.address ? (
                <>
                  <div className='mb-3'>
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button onClick={() => { navigate('/dashboard/user/profile') }} className='btn btn-outline-warning'>Update Address</button>
                    &nbsp;
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      Checout
                    </button>
                    &nbsp;


                  </div>
                </>
              ) : (
                <div className='mb-3'>
                  {auth?.token ? (
                    <button onClick={() => { navigate('/dashboard/user/profile') }} className='btn btn-outline-warning'>Update Address</button>
                  ) : (
                    <button onClick={() => navigate('/login', {
                      state: '/cart'
                    })} className='btn btn-outline-warning'>Please Login To CheckOut</button>
                  )}
                </div>
              )}
              <div>
                <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Order Modal</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmitOrder}>
                          <div className="mb-3">
                            Name
                            <input required value={auth?.user?.name} placeholder='Enter Your Name' type="text" className="form-control" />
                            <div className="form-text"></div>
                          </div>
                          Phone
                          <div className="mb-3">
                            <input required value={auth?.user?.phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder='Enter Your Phone Number' className="form-control" />
                            <div className="form-text"></div>
                          </div>
                          <b>Payment Method</b>
                          <div style={{ textAlign: 'center' }} className="mb-3">
                            <input name='role' value={0} onChange={(e) => { setPaymentMethod(e.target.value) }} type="radio" />Cash On Delivery &nbsp;
                            <input name='role' value={1} onChange={(e) => { setPaymentMethod(e.target.value) }} type="radio" />Credit/Debit Card
                            <div className="form-text"></div>
                          </div>
                          Address
                          <div className="mb-3 ">
                            <textarea required value={auth?.user?.address} placeholder='Enter Your Address' type="text" className="form-control" />
                            <div className="form-text"></div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
                        <button type="button" className="btn btn-primary">Confirm</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  )
}

export default AddToCart
// const getToken = async () => {
//   try {
//     const { data } = await axios.get('http://localhost:8000/api/product/braintree/token')
//     console.log(data)
//     setClientToken(data?.clientToken)

//   } catch (error) {
//     console.log(error)
//   }
// }
// const handlePayment = async () => {
//   try {
//     setLoading(true)

//     const { nonce } = await instance.requestPaymentMethod();
//     const { data } = await axios.post('http://localhost:8000/api/product/braintree/payment', {
//       nonce, cart
//     })

//     setLoading(false)
//     localStorage.removeItem('cart')
//     setCart([])
//     navigate('/dashboard/orders')


// <DropIn options={{
//   authorization: clientToken,
//   paypal: { flow: 'vault' },
// }} onInstance={(instance) => setInstance(instance)} />

//   } catch (error) {
//     console.log(error)
//     setLoading(false)
//   }
// }


// useEffect(() => {
//   getToken()

// }, [auth?.token])