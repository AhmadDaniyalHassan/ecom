import React, { useState, useEffect } from 'react'
import Layout from "../components/layout/Layout"
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { useNavigate } from 'react-router-dom'
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios'
const AddToCart = () => {
  const [auth, setAuth] = useAuth()
  const [cart, increaseQuantity, decreaseQuantity, setCart] = useCart()
  const [clientToken, setClientToken] = useState('')
  const [instance, setInstance] = useState('')
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Initialize with Braintree

  const navigate = useNavigate()
  let shipping = 300

  const totalPrice = () => {
    try {
      let total = 0
      cart?.map((item) => { total = total + (item.price * item.quantity) });
      return total + shipping
    } catch (error) {
      console.log(error)
    }
  }
  const inQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    const updatedCart = cart.map((prod) => {
      if (prod._id === id) {
        // Calculate the new total price based on the updated quantity
        const newTotal = prod.price * newQuantity;
        return { ...prod, quantity: newQuantity, total: newTotal };
      }
      return prod;
    });

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  const deQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    const updatedCart = cart.map((prod) => {
      if (prod._id === id) {
        // Calculate the new total price based on the updated quantity
        const newTotal = prod.price * newQuantity;
        return { ...prod, quantity: newQuantity, total: newTotal };
      }
      return prod;
    });

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }

    const updatedCart = cart.map(prod => {
      if (prod._id === id) {
        return { ...prod, quantity: newQuantity };
      }
      return prod;
    });

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

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
      setLoading(true);
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery (COD) payment logic
        const { data } = await axios.post('http://localhost:8000/api/product/braintree/payment', {
          cart,
          quantity,
          paymentMethod,
        });
        localStorage.removeItem('cart');
        setCart([]);
        navigate('/dashboard/user/orders');
      } else if (paymentMethod === 'braintree' && instance) {
        const { nonce } = instance.requestPaymentMethod();
        const { data } = await axios.post('http://localhost:8000/api/product/braintree/payment', {
          nonce,
          cart,
          quantity,
          paymentMethod,
        });
        localStorage.removeItem('cart');
        setCart([]);
        navigate('/dashboard/user/orders');
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getToken()
  }, [auth?.token])

  return (
    <Layout title={"Cart - Ecom"}>
      <div className='container'>
        <div className='row'>
          <div className='col-md-11'>
            <h5 className='text-center mb-3 mt-2'>
              {cart?.length ? `You have ${cart.length} item(s) in your cart${auth?.token ? "" : "Please Login to CheckOut"}`
                : "Your Cart Is Empty"}
            </h5>
          </div>
          <div className='row'>
            <div className='col-md-7'>
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <ul>
                  {cart.map((prod) => (
                    <div key={prod._id} style={{ width: "70%", backgroundColor: '#b8b9ba', borderRadius: "20px" }} className='row mb-2 p-2 card flex-row'>
                      <img style={{ padding: '2px', width: '14rem', marginTop: '2px', borderRadius: '10px' }}
                        src={prod.image}
                        className='card-img-top' alt={prod.name} />
                      <p className='mb-2'><b>Name:</b> {prod.name}</p>
                      <p className='mb-2'><b>Info:</b> {prod.description.substring(0, 10)}...</p>
                      <p className='mb-2'><b>Price: </b>{prod.total || Number(prod.price * prod.quantity)}</p>
                      <button onClick={() => inQuantity(prod._id, prod.quantity + 1)}>+</button>
                      <span>{prod.quantity}</span>
                      <button onClick={() => deQuantity(prod._id, prod.quantity - 1)}>−</button>
                      <button onClick={() => removeFromCart(prod._id)}>Remove</button>
                    </div>
                  ))}
                </ul>
              )}
            </div>
            <div className='col-md-5 text-center'>
              <h4>Cart Summary</h4>
              <p>Total | Checkout | Payment </p>
              <hr />
              <h5>Shipping: <span className='h6'>{shipping}RS</span></h5>
              <h5>Total: <span className='h6'>{totalPrice()}RS</span></h5>
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
              <div className='mt-2'>
                {!clientToken || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <div className='mb-1'>
                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        Pay with Cash on Delivery (COD)
                      </label>
                    </div>
                    <div className='mb-1'>
                      <label>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="braintree"
                          checked={paymentMethod === 'braintree'}
                          onChange={() => setPaymentMethod('braintree')}
                        />
                        Pay with Braintree
                      </label>

                    </div>
                    {paymentMethod === 'braintree' && clientToken ? (
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
                    ) : paymentMethod === 'cod' ? (
                      <button disabled={loading || !auth?.user?.address} onClick={handlePayment} className='btn btn-success'>{loading ? "Processing..." : "Make Payment (COD)"}</button>
                    ) : null}
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