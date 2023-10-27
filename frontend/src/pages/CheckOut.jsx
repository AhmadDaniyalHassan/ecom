import React from 'react'
import Layout from '../components/layout/Layout'
// import axios from 'axios'
// import { useAuth } from '../context/auth'
// import { useCart } from '../context/cart'
// import { useNavigate } from 'react-router-dom'
// import { useParams } from 'react-router-dom'
const CheckOut = () => {

  return (
    <Layout title='User-Profile' description='Profile Page'>
      
    </Layout>
  )
}

export default CheckOut


// const [auth, setAuth] = useAuth()
// const [cart, setCart] = useCart()

// const [name, setName] = useState('')
// const [email, setEmail] = useState('')
// const [phone, setPhone] = useState('')
// const [address, setAddress] = useState('')
// const [country, setCountry] = useState('')
// const [postalCode, setPostalCode] = useState('')

// const handleSubmit = async (e) => {
//   e.preventDefault()

//   const formdata = new FormData();
//   formdata.append("name", name);
//   formdata.append("email", email);
//   formdata.append("phone", phone);
//   formdata.append("address", address);

//   try {
//     const { data } = await axios.put("http://localhost:8000/api/checkout", formdata);
//     { name, email, password, phone, address };
//     if (data?.error) {
//       console.log(data?.error, "error coming from update function")
//     } else {
//       setAuth({ ...auth, user: data?.updateUser })

//       let ls = localStorage.getItem("auth")
//       ls = JSON.parse(ls.stringify())
//       ls.user = data?.updateUser

//       localStorage.setItem("auth", JSON.stringify(ls))
//       console.log("Checkout Created successfully")

//     }
//   } catch (error) {
//     console.log("Error from Checkout api", error)
//   }
// }

// //payment gateway
// const getToken = async () => {
//   try {

//     const { data } = await axios.get('')
//     setClientToken(data?.clientToken)

//   } catch (error) {
//     console.log(error)
//   }
// }

// useEffect(() => {
//   const { name, phone, address } = auth?.user
//   setName(name)
//   setPhone(phone)
//   setAddress(address)
//   setCountry(country)
//   setPostalCode(postalCode)
//   setClientToken()
// }, [auth?.user])
